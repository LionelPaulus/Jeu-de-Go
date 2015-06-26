//// Variables
var tour = 0;
var rows = 9;
var player = 1;
var game_history = [];
var game_finished = false;
var last_skip = 0; // Used for the end of the game
if(window.location.search == "?mode=duo"){
  var ia_mode = true;
}else {
  var ia_mode = false;
}

//// We declare the array's
// score array
var score = [];
score[1] = [];
score[2] = [];
score[1]["territory"] = 0;
score[1]["present_paws"] = 0;
score[2]["territory"] = 0;
score[2]["present_paws"] = 7.5;

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
//generate_background();
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
  if (game_finished == false) {
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
      swal({
        title: "Impossible de jouer ici !",
        text: "Essayez de placer votre pion ailleurs.",
        type: "error"
      });
      return;
    } else {
      if (ko(x, y) == false) {
        grid[x][y] = player;
        identify_groups();
        scores();
        capture(x, y);
        update_html();
        tour += 1;
        auto_backup();

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

        // Player alternation and score + 1
        if (player == 1) {
          player = 2;
        } else {
          player = 1;
        }

        // IA turn
        if (player == 2 && ia_mode == true) {
          //setTimeout(function() {
          var ia_data = ia();
          console.log("Position IA: " + ia_data);
          next_step(ia_data);
          //}, 4000);
        }
      }
    }
  }
}

// Detect if player is trying to commit suicide or not
function suicide(x, y) {
  grid[x][y] = player;
  console.log("player: "+ player);
  var dead = false;

  /*if (liberties(x, y) == 0 && (liberties(x + 1, y) != 0 && liberties(x - 1, y) != 0 && liberties(x, y + 1) != 0 && liberties(x, y - 1) != 0)) {
    grid[x][y] = 0;
    return true;
  }*/

  if (liberties(x, y) == 0) {
    dead = true;
    if ((y - 1) >= 0 && liberties(x, y - 1) == 0 && grid[x][y - 1] != player) {
      dead = false;
    } else if ((x + 1) < rows && liberties(x + 1, y) == 0 && grid[x + 1][y] != player) {
      dead = false;
    } else if ((y + 1) < rows && liberties(x, y + 1) == 0 && grid[x][y + 1] != player) {
      dead = false;
    } else if ((x - 1) >= 0 && liberties(x - 1, y) == 0 && grid[x - 1][y] != player) {
      dead = false;
    }
  }

  if (dead == true) {
    grid[x][y] = 0;
    return true; // Suicide interdit
  }
  return false; // Suicide autorisé ou pas de suicide
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
  var group_id = group[x][y];
  // Detect if surrounded or not
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < rows; j++) {
      if (group_id != 0 && group[i][j] == group_id) {
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
      if (group[i][j] == group_id) {
        if ((group_id > 0) && (grid[i][j] != player) && (grid[i][j] != 0)) {
          captured_cells += 1;
        }
        grid[i][j] = 0;
      }
    }
  }
  if (captured_cells > 0) {
    console.log("Le joueur " + player + " a capturé " + captured_cells + " cases à l'ennemi !");
    if (player == 1) {
      score[2]["present_paws"] -= captured_cells;
    } else {
      score[1]["present_paws"] -= captured_cells;
    }
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

function auto_backup() {
  if (localStorage.getItem('game_state') != null && tour == 0) {
    swal({
        title: "Hé on se connaît non ?",
        text: "Vous n'aviez pas terminé votre dernière partie, souhaitez-vous la reprendre ?",
        imageUrl: "images/backup.png",
        confirmButtonText: "Reprendre la partie",
        showCancelButton: true,
        cancelButtonText: "Nouvelle partie"
      },
      function() {
        grid = JSON.parse(localStorage.getItem('game_state'));
        score[1]["present_paws"] = localStorage.getItem('score_1_present_paws');
        score[1]["territory"] = localStorage.getItem('score_1_territory');
        score[2]["present_paws"] = localStorage.getItem('score_2_present_paws');
        score[2]["territory"] = localStorage.getItem('score_2_territory');
        document.getElementById("score_one").innerHTML = score[1]["present_paws"] + score[1]["territory"];
        document.getElementById("score_two").innerHTML = score[2]["present_paws"] + score[2]["territory"];
        update_html();
      });
  }
  if (tour != 0) {
    var game_state = JSON.stringify(grid);
    localStorage.setItem('game_state', game_state);
    localStorage.setItem('score_1_present_paws', score[1]["present_paws"]);
    localStorage.setItem('score_1_territory', score[1]["territory"]);
    localStorage.setItem('score_2_present_paws', score[2]["present_paws"]);
    localStorage.setItem('score_2_territory', score[2]["territory"]);
  }
}

function liberties(x, y) {
  identify_groups();
  var group_id = group[x][y];
  var liberte = 0;
  var liberties_already_counted = [];

  for (x = 0; x < group.length; x++) {
    for (y = 0; y < group.length; y++) {
      if (group[x][y] == group_id) {
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
    console.log(("ATARI en " + x + "/" + y));
    return true;
  } else {
    return false;
  }
}

function ko(x, y) {
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
    grid[x][y] = 0;
    return false;
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
      ko();

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

function scores() {
  if (tour > 1) {
    var scores_by_group = [];
    score[1]["territory"] = 0;
    score[2]["territory"] = 0;
    for (x = 0; x < rows; x++) {
      for (y = 0; y < rows; y++) {
        var group_id = group[x][y];
        // If the group_id is not already in the array
        if ((grid[x][y] == 0) && (scores_by_group[group_id] == null)) {
          scores_by_group[group_id] = [];
          scores_by_group[group_id]["points"] = 0;
          scores_by_group[group_id]["player"] = 0;
          scores_by_group[group_id]["neutral"] = false;
        }
        if ((grid[x][y] == 0) && (scores_by_group[group_id]["neutral"] == false)) {
          // Left
          if ((y - 1) >= 0 && grid[x][y - 1] > 0) {
            if (scores_by_group[group_id]["player"] == 0) {
              scores_by_group[group_id]["player"] = grid[x][y - 1];
            } else if (grid[x][y - 1] != scores_by_group[group_id]["player"]) {
              scores_by_group[group_id]["neutral"] = true;
            }
          }
          // Down
          if ((x + 1) < rows && grid[x + 1][y] > 0) {
            if (scores_by_group[group_id]["player"] == 0) {
              scores_by_group[group_id]["player"] = grid[x + 1][y];
            } else if (grid[x + 1][y] != scores_by_group[group_id]["player"]) {
              scores_by_group[group_id]["neutral"] = true;
            }
          }
          // Right
          if ((y + 1) < rows && grid[x][y + 1] > 0) {
            if (scores_by_group[group_id]["player"] == 0) {
              scores_by_group[group_id]["player"] = grid[x][y + 1];
            } else if (grid[x][y + 1] != scores_by_group[group_id]["player"]) {
              scores_by_group[group_id]["neutral"] = true;
            }
          }
          // Up
          if ((x - 1) >= 0 && grid[x - 1][y] > 0) {
            if (scores_by_group[group_id]["player"] == 0) {
              scores_by_group[group_id]["player"] = grid[x - 1][y];
            } else if (grid[x - 1][y] != scores_by_group[group_id]["player"]) {
              scores_by_group[group_id]["neutral"] = true;
            }
          }
          scores_by_group[group_id]["points"] += 1;
        }
      }
    }

    // Calculate the totals
    for (var i = 0; i < scores_by_group.length; i++) {
      if ((typeof(scores_by_group[i]) != "undefined") && (scores_by_group[i]["neutral"] == false)) {
        if (scores_by_group[i]["player"] == 1) {
          score[1]["territory"] += scores_by_group[i]["points"];
        } else {
          score[2]["territory"] += scores_by_group[i]["points"];
        }
      }
    }
  }

  // Player score + 1
  if (player == 1) {
    score[1]["present_paws"] += 1;
  } else {
    score[2]["present_paws"] += 1;
  }


  document.getElementById("score_one").innerHTML = (score[1]["territory"] + score[1]["present_paws"]);
  document.getElementById("score_two").innerHTML = (score[2]["territory"] + score[2]["present_paws"]);


  if (tour > 15 && ia_mode == true) {
    game_finished = true;
    for (var k = 0; k < scores_by_group.length; k++) {
      if ((typeof(scores_by_group[k]) != "undefined") && (scores_by_group[k]["neutral"] == true)) {
        game_finished = false;
      }
    }
  }
}


/// Start elementary fonctions
//auto_backup();
