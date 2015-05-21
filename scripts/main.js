// Variables
var rows = 9;
var player = 1; // 1 = black, 2 = blue

var group = new Array();
for (var i = 0; i < rows; i++) {
    group[i] = new Array();
}

var grid = new Array();
for (var i = 0; i < rows; i++) {
    grid[i] = new Array();
    for (var j = 0; j < rows; j++) {
        grid[i][j] = new Array();
        grid[i][j] = 0;
    }
}

generate_background();
generate_cells();

function generate_background() {
    var background = '';
    document.getElementById("goban").innerHTML = "";

    for (var i = 0; i < (rows - 1); i++) {
        background += "<div class='bgLines'>";

        for (var j = 0; j < (rows - 1); j++) {

            background += '<div class="bgJunction"></div>';

        }

        background = background + '</div>';

    }

    document.getElementById("goban").innerHTML = background;


}

function generate_cells() { // A clic adds a cell
    var goban = '';

    document.getElementById("grid").innerHTML = "";

    for (var i = 0; i < rows; i++) {
        goban += "<div class='lines'>";

        for (var j = 0; j < rows; j++) {

            goban += '<div id="' + (i + "_" + j) + '" class="empty" onclick="next_step(id);"></div>';

        }

        goban = goban + '</div>';

    }

    document.getElementById("grid").innerHTML = goban;

}

function next_step(id) {
    var x_y = id.indexOf("_");
    var x = parseInt(id.substring(0, x_y));
    var y = parseInt(id.substring(x_y + 1));


    if (grid[x][y] != 0 || suicide(x, y) == true){
        console.log("Impossible de jouer ici !");
        return;
    }
        else {
        grid[x][y] = player;

        identify_groups();
        capture(x, y);
        update_html();
        if (player == 1) {
            player = 2;
        } else {
            player = 1;
        }
    }

}



function suicide(x, y) {
    grid[x][y] = player;

    // A optimiser
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
        console.log("Suicide");
        return true;
    }
    return false;
}


function capture(x, y) {
    if ((y - 1) >= 0 && grid[x][y - 1] != player) {
        count_liberties(x, y - 1);
    }
    if ((x + 1) < rows && grid[x + 1][y] != player) {
        count_liberties(x + 1, y);
    }
    if ((y + 1) < rows && grid[x][y + 1] != player) {
        count_liberties(x, y + 1);
    }
    if ((x - 1) >= 0 && grid[x - 1][y] != player) {
        count_liberties(x - 1, y);
    }
}


function identify_groups() {

    var group_id = 1;

    for (i = 0; i < rows; i++) {
        for (j = 0; j < rows; j++) {
            if (grid[i][j] == 0) {
                group[i][j] = 0;
            } else {
                group[i][j] = group_id;
                group_id++;
            }
        }
    }


    for (i = 0; i < rows; i++) {
        for (j = 0; j < rows; j++) {
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



function count_liberties(x, y) {
    identify_groups();
    var groupName = group[x][y];
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < rows; j++) {
            if (group[i][j] == groupName && groupName != 0) {
                if (((j - 1) >= 0 && grid[i][j - 1] == 0) || ((i + 1) < rows && grid[i + 1][j] == 0) || ((j + 1) < rows && grid[i][j + 1] == 0) || ((i - 1) >= 0 && grid[i - 1][j] == 0)) {
                    return;
                }
            }
        }
    }

    // No more liberty
    var lost_cells = 0;
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < rows; j++) {
            if (group[i][j] == groupName) {
                grid[i][j] = 0;
                lost_cells += 1;
            }
        }
    }
    console.log("Le joueur " + player + " a capturé " + lost_cells + " cases à l'ennemi !");
    $lost_cells = 0;
}


function update_html() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < rows; j++) {
            if (grid[i][j] == 0) {
                var element = document.getElementById(i + "_" + j);
                element.setAttribute("class", "empty");
            }
            if (grid[i][j] == 1) {
                var element = document.getElementById(i + "_" + j);
                element.setAttribute("class", "player1");
            } else if (grid[i][j] == 2) {
                var element = document.getElementById(i + "_" + j);
                element.setAttribute("class", "player2");
            }
        }
    }
}
