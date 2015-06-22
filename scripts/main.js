//// Variables
var tour = 0;
var rows = 9;
var score_one = 0;
var score_two = 7.5;
var player = 1;
var game_history = [];
var game_finished = false;
var last_skip = 0; // Used for the end of the game
var ia = false;

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

//// Generate the DOM
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

  if ((ia == false)||(player == 1)&&(game_finished == false)){
    if (grid[x][y] != 0 || suicide(x, y) == true) {
      swal({
        title: "Impossible de jouer ici !",
        text: "Essayez de placer votre pion ailleurs.",
        type: "error"
      });
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
        score();
      }
    }
  }
}

// Detect if player is trying to commit suicide or not
function suicide(x, y) {
  grid[x][y] = player;
  if (liberties(x, y) == 0 && (liberties(x + 1, y) != 0 && liberties(x - 1, y) != 0 && liberties(x, y + 1) != 0 && liberties(x, y - 1) != 0)) {
    grid[x][y] = 0;
    return true;
  }
  return false;
}

function identify_groups() {

  var group_id = 1; // First group number

  // We start by assigning a growing number to every pawn
  for (i = 0; i < rows; i++) {
    for (j = 0; j < rows; j++) {
      group[i][j] = group_id;
      group_id++;
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
        if ((groupName > 0) && (grid[i][j] != player) && (grid[i][j] != 0)) {
          captured_cells += 1;
        }
        grid[i][j] = 0;
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
  identify_groups();

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
  if (x != null && y != null) {
    grid[x][y] = player; // Add player pawn to array
    if ((tour > 1) && (game_history[tour - 1]["state"] == JSON.stringify(grid))) {
      swal({
        title: "Règle du KO",
        text: "La règle du ko interdit la reprise immédiate dans une situation de ko. Cette régle permet d'éviter des prises et reprises qui ne s'arrêteraient jamais.",
        type: "error"
      });
      grid[x][y] = 0;
      return true;
    }
    return false;
  }
}

function score() {
  var points = 0;
  identify_groups();
  var points_already_counted = []; // les groupes d'intersections libres déjà comptés
  for (x = 0; x < group.length; x++) {
    for (y = 0; y < group.length; y++) {
      if (grid[x][y] == 0 && !inArray(points_already_counted, group[x][y])) {
        var person = 12;
        var groupNumber = group[x][y];
        points_already_counted[points_already_counted.length] = groupNumber;

        while (person == 12) {
          for (k = 0; k < rows; k++) {
            for (l = 0; l < rows; l++) {

              if (group[k][l] == groupNumber) {

                if ((k + 1 < 9) && grid[k + 1][l] != 0) {
                  person = grid[k + 1][l]; // le groupe libre heurte un joueur, on prend le premier qui arrive comme référent(pour qu'un point soit compté, il faut qu'il soit entièrement entouré par un même joueur)
                } else if ((k - 1 >= 0) && grid[k - 1][l] != 0) {
                  person = grid[k - 1][l];
                } else if ((l + 1 < 9) && grid[k][l + 1] != 0) {
                  person = grid[k][l + 1];
                } else if ((l - 1 >= 0) && grid[k][l - 1] != 0) {
                  person = grid[k][l - 1];
                }
              }
            }
          }
          console.log("PERSON : " + person);
        }
        console.log(person);

        if (person == 1) {
          var adversary = 2; // on détermine l'adversaire
        } else {
          var adversary = 1;
        }
        console.log("ADVERSARY : " + adversary);

        var stop = false;
        while (stop == false) {
          for (m = 0; m < 9; m++) {
            for (n = 0; n < 9; n++) {
              if (group[m][n] == groupNumber) {
                points += 1;
                console.log("itère de 1 " + groupNumber);
              }
              //if ((typeof(grid[m+1]) != "undefined" && grid[m + 1][n] == adversary) || (typeof(grid[m-1]) != "undefined" && grid[m - 1][n] == adversary) || (typeof(grid[m][n+1]) != "undefined" && grid[m][n + 1] == adversary) || (typeof(grid[m][n-1]) != "undefined" && grid[m][n - 1] == adversary)) {
              if ((grid[m + 1] && grid[m + 1][n] == adversary) || (grid[m - 1] && grid[m - 1][n] == adversary) || (grid[m][n + 1] && grid[m][n + 1] == adversary) || (grid[m][n - 1] && grid[m][n - 1] == adversary)) {
                points = 0;
                console.log("remet à zéro les points de " + groupNumber);
                n = 9;
                m = 9;
                stop = true;
              }
            }
          }
          console.log("POINTS : " + points);
          stop = true;
        }
        if (person == 1) {
          score_one += points;
        } else if (person == 2) {
          score_two += points;
        }
        console.log("SCORE ONE : " + score_one);
        console.log("SCORE TWO : " + score_two);

      }
    }
  }

}

function skip(spec) {
  if (spec == "abandonment") {
    if (tour == 0) {
      swal({
        title: "Nop",
        text: "Il faudrait déjà poser un pion avant d'abandonner...",
        type: "error"
      });
    } else {
      game_finished = true;
      swal({
          title: "Et c'est un abandon !",
          text: "Féliciations, vous avez gagné :)",
          imageUrl: "images/cup-128.png",
          confirmButtonText: "Nouvelle partie",
          closeOnConfirm: false,
          showCancelButton: true,
          cancelButtonText: "Voir les scores"
        },
        function() {
          window.location.reload();
        });
    }
  } else {
    if (((last_skip + 1) == tour) && (tour > 1)) {
      game_finished = true;
      swal({
          title: "Le joueur X a gagné !",
          text: "Mais vous avez tous les deux très bien joué :)",
          imageUrl: "images/cup-128.png",
          confirmButtonText: "Nouvelle partie",
          closeOnConfirm: false,
          showCancelButton: true,
          cancelButtonText: "Voir les scores"
        },
        function() {
          window.location.reload();
        });
    } else {
      swal({
        title: "Le joueur " + player + " a passé son tour"
      });
      last_skip = tour;
      once_but_not_two();

      // Player alternation
      if (player == 1) {
        player = 2;
      } else {
        player = 1;
      }
      tour += 1;
    }
  }
}
var tamere = [];

function score_deux() {
  identify_groups(); // A enlenver

  for (x = 0; x < rows; x++) {
    for (y = 0; y < rows; y++) {
      var groupName = group[x][y];
      // If the groupName is not already in the array
      if(typeof(tamere[groupName] == "undefined")){
        tamere[groupName] = [];
        tamere[groupName]["points"] = 0;
        tamere[groupName]["player"] = 0;
        tamere[groupName]["banned"] = false;
      }
      if ((grid[x][y] == 0) && (tamere[groupName]["banned"] == false)) {
        // Left
        if ((y - 1) >= 0 && grid[x][y - 1] > 0) {
          if (tamere[groupName]["player"] == 0) {
            tamere[groupName]["player"] = grid[x][y - 1];
          } else if (grid[x][y - 1] != tamere[groupName]["player"]) {
            tamere[groupName]["banned"] = true;
          }
        }
        // Down
        if ((x + 1) < rows && grid[x + 1][y] > 0) {
          if (tamere[groupName]["player"] == 0) {
            tamere[groupName]["player"] = grid[x + 1][y];
          } else if (grid[x + 1][y] != tamere[groupName]["player"]) {
            tamere[groupName]["banned"] = true;
          }
        }
        // Right
        if ((y + 1) < rows && grid[x][y + 1] > 0) {
          if (tamere[groupName]["player"] == 0) {
            tamere[groupName]["player"] = grid[x][y + 1];
          } else if (grid[x][y + 1] != tamere[groupName]["player"]) {
            tamere[groupName]["banned"] = true;
          }
        }
        // Up
        if ((x - 1) >= 0 && grid[x - 1][y] > 0) {
          if (tamere[groupName]["player"] == 0) {
            tamere[groupName]["player"] = grid[x - 1][y];
          } else if (grid[x - 1][y] != tamere[groupName]["player"]) {
            tamere[groupName]["banned"] = true;
          }
        }
        tamere[groupName]["points"] += 1;
      }
    }
  }
  console.log(tamere);
}
