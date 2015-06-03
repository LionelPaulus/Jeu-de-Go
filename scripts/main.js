//// Variables
var tour = 0;
var rows = 9;
var player = 1;

//// We declare the array's
// group array -> contain the ID of the group for each row
var group = new Array();
for (var i = 0; i < rows; i++) {
  group[i] = new Array();
}

// grid array -> contain 1 or 2 based on player pawn for each row
var grid = new Array();
for (var i = 0; i < rows; i++) {
  grid[i] = new Array();
  for (var j = 0; j < rows; j++) {
    grid[i][j] = new Array();
    grid[i][j] = 0;
  }
}

//// Generate HTML
generate_background();
generate_cells();

// HTML table
function generate_background() {
  var background = '<table id="tableau"><tbody>';
  for (var a = 1; a < rows; a++) {

    background += '<tr>';

    for (var b = 1; b < rows; b++) {

      background += '<td class="cellule"></td>';
    }

    background += '</tr>';

  }
  document.getElementById("goban").innerHTML = '</tbody></table>' + background;
}

// Clickable DIV
function generate_cells() {
  var goban = '';

  document.getElementById("grid").innerHTML = "";

  for (a = 0; a < rows; a++) {
    goban += "<div class='lines'>";

    for (b = 0; b < rows; b++) {

      goban += '<div id="' + (a + "_" + b) + '" class="empty" onclick="next_step(id);"></div>';

    }

    goban = goban + '</div>';

  }

  document.getElementById("grid").innerHTML = goban;

}

//// Onclick of the DIV
function next_step(id) {
  var x = parseInt(id.substring(0, id.indexOf("_"))); // Horizontal
  var y = parseInt(id.substring(id.indexOf("_") + 1)); // Vertical

  var former_grid = new Array();
  for (var i = 0; i < rows; i++) {
    former_grid[i] = new Array();
    for (var j = 0; j < rows; j++) {
      former_grid[i][j] = new Array();
    }
  }

  if ((tour % 2) == 0) {
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < rows; j++) {
        former_grid[i][j] = grid[i][j];
      }
    }
  }

  if (grid[x][y] != 0 || suicide(x, y) == true) {
    console.log("Impossible de jouer ici !");
    return;
  } else {
    grid[x][y] = player; // Add player pawn to array
    identify_groups();
    capture(x, y);
    var stock = 0;
    var groupeEnCours = [];
    var liberties_already_counted = [];
    liberties(x, y, stock, groupeEnCours, liberties_already_counted);
    update_html();
    tour += 1;
    // Player alternation
    if (player == 1) {
      player = 2;
    } else {
      player = 1;
    }
  }
}
// Detect if player is trying to commit suicide or not
function suicide(x, y) {
  grid[x][y] = player;
  var suicide = true;
  identify_groups();
  var groupName = group[x][y];

  // Detect if surrounded or not
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < rows; j++) {
      if (group[i][j] == groupName && groupName != 0) {
        if (((j - 1) >= 0 && grid[i][j - 1] == 0) || ((i + 1) < rows && grid[i + 1][j] == 0) || ((j + 1) < rows && grid[i][j + 1] == 0) || ((i - 1) >= 0 && grid[i - 1][j] == 0)) {
          // Not surrounded -> no suicide
          suicide = false;
        }
      }
    }
  }
  // Detect if player is going to capture a pawn in "ATARI"

  if ((x > 0) && (x < rows - 1) && (y > 0) && (y < rows - 1)) {
    // Left ATARI
    if ((grid[x - 1][y - 1] == player) && (grid[x][y - 2] == player) && (grid[x + 1][y - 1] == player)) {
      suicide = false;
    }

    // Right ATARI
    if ((grid[x + 1][y + 1] == player) && (grid[x][y + 2] == player) && (grid[x - 1][y + 1] == player)) {
      suicide = false;
    }

    // Up ATARI
    if ((grid[x - 1][y - 1] == player) && (grid[x - 2][y] == player) && (grid[x - 1][y + 1] == player)) {
      suicide = false;
    }

    // Down ATARI
    if ((grid[x + 1][y + 1] == player) && (grid[x + 2][y] == player) && (grid[x + 1][y - 1] == player)) {
      suicide = false;
    }
  }

  if (suicide == true) {
    grid[x][y] = 0;
    return true;
    // The player is trying a suicide but we won't let him !
  }
}

function identify_groups() {

  var group_id = 1; // First group number

  // We start by assigning a growing number to every pawn
  for (i = 0; i < rows; i++) {
    for (j = 0; j < rows; j++) {
      if (grid[i][j] == 0) {
        // No pawn
        group[i][j] = 0;
      } else {
        group[i][j] = group_id;
        group_id++;
      }
    }
  }

  for (i = 0; i < rows; i++) {
    for (j = 0; j < rows; j++) {
      // Left
      if ((j - 1) >= 0 && grid[i][j] == grid[i][j - 1]) {
        var former_group = group[i][j - 1];
        for (var k = 0; k < rows; k++) {
          for (var l = 0; l < rows; l++) {
            if (group[k][l] == former_group) {
              group[k][l] = group[i][j];
            }
          }
        }
      }
      // Down
      if ((i + 1) > rows && grid[i][j] == grid[i + 1][j]) {
        var former_group = group[i + 1][j];
        for (k = 0; k < rows; k++) {
          for (l = 0; l < rows; l++) {
            if (group[k][l] == former_group) {
              group[k][l] = group[i][j];
            }
          }
        }
      }
      // Right
      if ((j + 1) < rows && grid[i][j] == grid[i][j + 1]) {
        var former_group = group[i][j + 1];
        for (var k = 0; k < rows; k++) {
          for (var l = 0; l < rows; l++) {
            if (group[k][l] == former_group) {
              group[k][l] = group[i][j];
            }
          }
        }
      }
      // Up
      if ((i - 1) >= 0 && grid[i][j] == grid[i - 1][j]) {
        var former_group = group[i - 1][j];
        for (var k = 0; k < rows; k++) {
          for (var l = 0; l < rows; l++) {
            if (group[k][l] == former_group) {
              group[k][l] = group[i][j];
            }
          }
        }
      }
    }
  }
}

function capture(x, y) {
  // Left
  if ((y - 1) >= 0 && grid[x][y - 1] != player) {
    count_liberties(x, y - 1);
  }
  // Down
  if ((x + 1) < rows && grid[x + 1][y] != player) {
    count_liberties(x + 1, y);
  }
  // Right
  if ((y + 1) < rows && grid[x][y + 1] != player) {
    count_liberties(x, y + 1);
  }
  // Up
  if ((x - 1) >= 0 && grid[x - 1][y] != player) {
    count_liberties(x - 1, y);
  }
}



function count_liberties(x, y) {
  identify_groups();
  var groupName = group[x][y];
  // Detect if surrounded or not
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < rows; j++) {
      if (groupName != 0 && group[i][j] == groupName) {
        if (((j - 1) >= 0 && grid[i][j - 1] == 0) || ((i + 1) < rows && grid[i + 1][j] == 0) || ((j + 1) < rows && grid[i][j + 1] == 0) || ((i - 1) >= 0 && grid[i - 1][j] == 0)) {
          // Not surrounded -> we stop here
          return;
        }
      }
    }
  }

  var captured_cells = 0;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < rows; j++) {
      if (group[i][j] == groupName) {
        grid[i][j] = 0;
        if (groupName > 0) {
          captured_cells += 1;
        }
      }
    }
  }
  if (captured_cells > 0) {
    console.log("Le joueur " + player + " a capturé " + captured_cells + " cases à l'ennemi !");
  }
  captured_cells = 0;
}

//// Made changes visible on the HTML
function update_html() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < rows; j++) {
      // Empty
      if (grid[i][j] == 0) {
        var element = document.getElementById(i + "_" + j);
        element.setAttribute("class", "empty");
        // Player 1
      } else if (grid[i][j] == 1) {
        var element = document.getElementById(i + "_" + j);
        element.setAttribute("class", "player1");
        // Player 2
      } else if (grid[i][j] == 2) {
        var element = document.getElementById(i + "_" + j);
        element.setAttribute("class", "player2");
      }
    }
  }
}

function save_game() {
  var game_state = JSON.stringify(grid);
  localStorage.setItem('game_state', game_state);
}

function reload_game() {
  if (localStorage.getItem('game_state') == null) {
    window.alert("Aucun état de jeu sauvegardé !");
  } else {
    grid = JSON.parse(localStorage.getItem('game_state'));
    update_html();
  }
}


function liberties(i, j, liberte_stock, groupeEnCours, liberties_already_counted) {
  identify_groups();
  var groupName = group[i][j];
  groupeEnCours[groupeEnCours.length] = i + "_" + j;
  var liberte = 0; // On compte les libertés individuelles
  if (((j - 1) >= 0 && grid[i][j - 1] == 0) && (!inArray(liberties_already_counted, i + "_" + (j - 1)))) {
    liberte = liberte + 1;
    liberties_already_counted[liberties_already_counted.length] = i + "_" + (j - 1);
  }
  if (((i + 1) < rows && grid[i + 1][j] == 0) && (!inArray(liberties_already_counted, (i + 1) + "_" + j))) {
    liberte = liberte + 1;
    liberties_already_counted[liberties_already_counted.length] = (i + 1) + "_" + j;
  }
  if (((j + 1) < rows && grid[i][j + 1] == 0) && (!inArray(liberties_already_counted, i + "_" + (j + 1)))) {
    liberte = liberte + 1;
    liberties_already_counted[liberties_already_counted.length] = i + "_" + (j + 1);
  }
  if (((i - 1) >= 0 && grid[i - 1][j] == 0) && (!inArray(liberties_already_counted, (i - 1) + "_" + j))) {
    liberte = liberte + 1;
    liberties_already_counted[liberties_already_counted.length] = (i - 1) + "_" + j;
  }

  liberte_stock += liberte; // On additionne les libertés de la case étudiée aux libertés du groupe
  console.log(liberte_stock);

  // On cherche les cellules du même groupe pour chercher leurs libertés

  if (group[i][j - 1] != 0 || group[i][j + 1] != 0 || group[i - 1][j] != 0 || group[i + 1][j] != 0) {
    if (((j - 1) >= 0 && group[i][j - 1] == groupName) && (!inArray(groupeEnCours, i + "_" + (j - 1)))) {
      liberties(i, (j - 1), liberte_stock, groupeEnCours, liberties_already_counted);
      liberte_stock = liberte_stock + liberte;
    }
    if (((j + 1) < rows && group[i][j + 1] == groupName) && !inArray(groupeEnCours, i + "_" + (j + 1))) {
      liberties(i, (j + 1), liberte_stock, groupeEnCours, liberties_already_counted);
      liberte_stock = liberte_stock + liberte;
    }
    if (((i - 1) >= 0 && group[i - 1][j] == groupName) && (!inArray(groupeEnCours, (i - 1) + "_" + j))) {
      liberties((i - 1), j, liberte_stock, groupeEnCours, liberties_already_counted);
      liberte_stock = liberte_stock + liberte;
    }
    if (((i + 1) < rows && group[i + 1][j] == groupName) && (!inArray(groupeEnCours, (i + 1) + "_" + j))) {
      liberties((i + 1), j, liberte_stock, groupeEnCours, liberties_already_counted);
      liberte_stock = liberte_stock + liberte;
    }
  }
}

function inArray(tableau, element) {
  for (var i = 0; i < tableau.length; i++) {
    if (tableau[i] == element) {
      return true;
    }
  }
  return false;
}
