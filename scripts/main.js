//// Variables
var rows = 9;
var player = 1; // 1 = black, 2 = blue

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

  if (grid[x][y] != 0 || suicide(x, y) == true) {
    console.log("Impossible de jouer ici !");
  } else {
    grid[x][y] = player; // Add player pawn to array
    identify_groups();
    capture(x, y);
    update_html();

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
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < rows; j++) {
            if (group[i][j] == groupName && groupName != 0) {
                if (((j - 1) >= 0 && grid[i][j - 1] == 0) || ((i + 1) < rows && grid[i + 1][j] == 0) || ((j + 1) < rows && grid[i][j + 1] == 0) || ((i - 1) >= 0 && grid[i - 1][j] == 0)) {
                    suicide = false;
                }
            }
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
        if(groupName > 0){
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
