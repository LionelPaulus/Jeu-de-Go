//// Variables
var tour = 0;
var rows = 9;
var player = 1;
var game_history = [];

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
    if (once_but_not_two(x, y) == false) {
      identify_groups();
      capture(x, y);
      update_html();
      tour += 1;
      // Player alternation
      if (player == 1) {
        player = 2;
      } else {
        player = 1;
      }
      atari(x, y);
      if (x + 1 <= 8) {
        atari(x + 1, y);
      }
      if (x - 1 >= 0) {
        atari(x - 1, y);
      }
      if (y + 1 <= 8) {
        atari(x, y + 1);
      }
      if (y - 1 >= 0) {
        atari(x, y - 1);
      }
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
    else if ((grid[x + 1][y + 1] == player) && (grid[x][y + 2] == player) && (grid[x - 1][y + 1] == player)) {
      suicide = false;
    }
    // Up ATARI
    else if ((grid[x - 1][y - 1] == player) && (grid[x - 2][y] == player) && (grid[x - 1][y + 1] == player)) {
      suicide = false;
    }
    // Down ATARI
    else if ((grid[x + 1][y + 1] == player) && (grid[x + 2][y] == player) && (grid[x + 1][y - 1] == player)) {
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
    count_liberties(x, (y - 1));
  }
  // Down
  if ((x + 1) < rows && grid[x + 1][y] != player) {
    count_liberties((x + 1), y);
  }
  // Right
  if ((y + 1) < rows && grid[x][y + 1] != player) {
    count_liberties(x, (y + 1));
  }
  // Up
  if ((x - 1) >= 0 && grid[x - 1][y] != player) {
    count_liberties((x - 1), y);
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

//// Made changes visible on the DOM
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

function liberties(x, y) {
  var groupName = group[x][y];

  if (groupName == 0) {
    return "Aucun pion à cet endroit.";
  }

  var liberte = 0;
  var liberties_already_counted = [];

  for (x = 0; x < group.length; x++) {
    for (y = 0; y < group.length; y++) {
      if (group[x][y] == groupName) {
        //// We check each side
        if ((typeof(grid[x + 1]) != "undefined" && grid[x + 1][y] == 0) && (!inArray(liberties_already_counted, (x + 1) + "_" + y))) {
          liberties_already_counted[liberties_already_counted.length] = (x + 1) + "_" + y;
          liberte += 1;
        }

        if ((typeof(grid[x - 1]) != "undefined" && grid[x - 1][y] == 0) && (!inArray(liberties_already_counted, (x - 1) + "_" + y))) {
          liberties_already_counted[liberties_already_counted.length] = (x - 1) + "_" + y;
          liberte += 1;
        }

        if ((typeof(grid[x][y + 1]) != "undefined" && grid[x][y + 1] == 0) && (!inArray(liberties_already_counted, x + "_" + (y + 1)))) {
          liberties_already_counted[liberties_already_counted.length] = x + "_" + (y + 1);
          liberte += 1;
        }

        if ((typeof(grid[x][y - 1]) != "undefined" && grid[x][y - 1] == 0) && (!inArray(liberties_already_counted, x + "_" + (y - 1)))) {
          liberties_already_counted[liberties_already_counted.length] = x + "_" + (y - 1);
          liberte += 1;
        }
      }
    }
  }
  return liberte;
}

function inArray(tableau, element) {
  for (var i = 0; i < tableau.length; i++) {
    if (tableau[i] == element) {
      return true;
    }
  }
  return false;
}

function atari(x, y) {
  if (liberties(x, y) == 1) {
    window.alert("ATARI en " + x + "/" + y);
  }
}

function once_but_not_two(x, y) {
  game_history[tour] = [];
  game_history[tour]["state"] = JSON.stringify(grid);
  grid[x][y] = player; // Add player pawn to array
  if ((tour > 1) && (game_history[tour - 1]["state"] == JSON.stringify(grid))) {
    console.log("Une fois mais pas deux !");
    grid[x][y] = 0;
    return true;
  }
  return false;
}
