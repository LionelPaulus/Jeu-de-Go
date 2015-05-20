// Variables
var rows = 9;
var player = 1; // 1 = black, 2 = blue
var adversary = 2;
var round = 1;

var group = new Array();
for (var i = 0; i < rows; i++) {
  group[i] = new Array();
}

var game = new Array();
for (var i = 0; i < rows; i++) {
  game[i] = new Array();
  for (var j = 0; j < rows; j++) {
    game[i][j] = new Array();
    game[i][j] = 0;
  }
}

generate_background();
generate_cells();

function generate_cells() {
  var grid = '';

  document.getElementById("game").innerHTML = "";

  for (var i = 0; i < rows; i++) {
    grid += "<div class='lines'>";

    for (var j = 0; j < rows; j++) {

      grid += '<div id="' + (i + "_" + j) + '" class="empty" onclick="toggle(id);"></div>';

    }

    grid = grid + '</div>';

  }

  document.getElementById("game").innerHTML = grid;

}

function generate_background() {
  var bg = '';
  document.getElementById("grid").innerHTML = "";

  for (var i = 0; i < (rows - 1); i++) {
    bg += "<div class='bgLines'>";

    for (var j = 0; j < (rows - 1); j++) {

      bg += '<div class="bgIntersection"></div>';

    }

    bg = bg + '</div>';

  }

  document.getElementById("grid").innerHTML = bg;


}


function toggle(id) {
  var x_y = id.indexOf("_");
  var x = parseInt(id.substring(0, x_y));
  var y = parseInt(id.substring(x_y + 1));


  if (game[x][y] != 0 || suicide(x, y) == true || ko(x, y) == true) {
    console.log("Impossible de jouer ici !");
    return;
  } else {
    game[x][y] = player;

    identify_groups();
    capture(x, y);
    graphisme();
    round++;
    switch_player_turn();
  }

}



function suicide(x, y) {
  game[x][y] = player;

  // A optimiser
  var suicide = true;
  identify_groups();
  var groupeNum = group[x][y];
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < rows; j++) {
      if (group[i][j] == groupeNum && groupeNum != 0) {
        if (((j - 1) >= 0 && game[i][j - 1] == 0) || ((i + 1) < rows && game[i + 1][j] == 0) || ((j + 1) < rows && game[i][j + 1] == 0) || ((i - 1) >= 0 && game[i - 1][j] == 0)) {
          suicide = false;
        }
      }
    }
  }

  if (suicide == true) {
    game[x][y] = 0;
    console.log("Suicide");
    return true;
  }
  return false;
}



function ko(x, y) {
  return false;
}



function capture(x, y) {
  if ((y - 1) >= 0 && game[x][y - 1] == adversary) {
    libertiesGroup(x, y - 1);
  }
  if ((x + 1) < rows && game[x + 1][y] == adversary) {
    libertiesGroup(x + 1, y);
  }
  if ((y + 1) < rows && game[x][y + 1] == adversary) {
    libertiesGroup(x, y + 1);
  }
  if ((x - 1) >= 0 && game[x - 1][y] == adversary) {
    libertiesGroup(x - 1, y);
  }
}


function identify_groups() {

  var group_id = 1;

  for (i = 0; i < rows; i++) {
    for (j = 0; j < rows; j++) {
      if (game[i][j] == 0) {
        group[i][j] = 0;
      } else {
        group[i][j] = group_id;
        group_id++;
      }
    }
  }


  for (i = 0; i < rows; i++) {
    for (j = 0; j < rows; j++) {
      if ((j - 1) >= 0 && game[i][j] == game[i][j - 1]) {
        var old_group = group[i][j - 1];
        for (var k = 0; k < rows; k++) {
          for (var l = 0; l < rows; l++) {
            if (group[k][l] == old_group) {
              group[k][l] = group[i][j];
            }
          }
        }
      }
      if ((i + 1) > rows && game[i][j] == game[i + 1][j]) {
        var old_group = group[i + 1][j];
        for (k = 0; k < rows; k++) {
          for (l = 0; l < rows; l++) {
            if (group[k][l] == old_group) {
              group[k][l] = group[i][j];
            }
          }
        }
      }
      if ((j + 1) < rows && game[i][j] == game[i][j + 1]) {
        var old_group = group[i][j + 1];
        for (var k = 0; k < rows; k++) {
          for (var l = 0; l < rows; l++) {
            if (group[k][l] == old_group) {
              group[k][l] = group[i][j];
            }
          }
        }
      }
      if ((i - 1) >= 0 && game[i][j] == game[i - 1][j]) {
        var old_group = group[i - 1][j];
        for (var k = 0; k < rows; k++) {
          for (var l = 0; l < rows; l++) {
            if (group[k][l] == old_group) {
              group[k][l] = group[i][j];
            }
          }
        }
      }
    }
  }
}



function libertiesGroup(x, y) {
  identify_groups();
  var groupeNum = group[x][y];
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < rows; j++) {
      if (group[i][j] == groupeNum && groupeNum != 0) {
        if (((j - 1) >= 0 && game[i][j - 1] == 0) || ((i + 1) < rows && game[i + 1][j] == 0) || ((j + 1) < rows && game[i][j + 1] == 0) || ((i - 1) >= 0 && game[i - 1][j] == 0)) {
          return;
          // Si un pion du groupe à une libertés, il n'y a pas capture
        }
      }
    }
  }

  // No more liberty
  var lost_cells = 0;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < rows; j++) {
      if (group[i][j] == groupeNum) {
        game[i][j] = 0;
        lost_cells += 1;
      }
    }
  }
  console.log("Le joueur " + player + " a mangé " + lost_cells + " cases à l'ennemi !");
  $lost_cells = 0;
}



function switch_player_turn() {
  if (player == 1) {
    adversary = 1;
    player = 2;
  } else {
    adversary = 2;
    player = 1;
  }
}



function graphisme() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < rows; j++) {
      if (game[i][j] == 0) {
        var element = document.getElementById(i + "_" + j);
        element.setAttribute("class", "empty");
      }
      if (game[i][j] == 1) {
        var element = document.getElementById(i + "_" + j);
        element.setAttribute("class", "player1");
      } else if (game[i][j] == 2) {
        var element = document.getElementById(i + "_" + j);
        element.setAttribute("class", "player2");
      }
    }
  }
}
