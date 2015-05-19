var goban = new Array;
var id = 0;
var player = "j1";


function initialisation() {
    for (var a = 0; a < 9; a++) {
        goban[a] = new Array(9);
        document.write('<tr>');

        for (var b = 0; b < 9; b++) {

            goban[a][b] = 0;
            document.write('<td onclick="ajoutPion(this);" id="' + id + '" class="cell-empty"></td>');

            id += 1;

        }

        document.write('</tr>');

    }
}

function ajoutPion(cell) {

    if (cell.className == "cell-empty") {
        if (player == "j1") {
            cell.className = "j1";
            cell = 1 ;
            player = "j2";
        } else if (player == "j2") {
            cell.className = "j2";
            cell = 2;
            player = "j1";
        }

    }
    
    verifCellules();
}

/*function verifCellules(cell) {
    for (a = 0; a < 9; a++) {
        for (b = 0; b < 9; b++) {



            var droite = parseInt(cell.id) + 1;
            var gauche = parseInt(cell.id) - 1;
            var haut = parseInt(cell.id) - 9;
            var bas = parseInt(cell.id) + 9;
            window["liberte" + this.id] = 0;

            if (document.getElementById(droite) == null) {
                window["liberte" + this.id] = window["liberte" + this.id];
            } else if (document.getElementById(droite).className == "cell-empty" ) {
                window["liberte" + this.id] += 1;
            }

            if (document.getElementById(haut) == null) {
                window["liberte" + this.id] = window["liberte" + this.id];
            } else if (document.getElementById(haut).className == "cell-empty") {
                window["liberte" + this.id] += 1;
            }

            if (document.getElementById(gauche) == null) {
                window["liberte" + this.id] = window["liberte" + this.id];
            } else if (document.getElementById(gauche).className == "cell-empty") {
                window["liberte" + this.id] += 1;
            }

            if (document.getElementById(bas) == null) {
                window["liberte" + this.id] = window["liberte" + this.id];
            } else if (document.getElementById(bas).className == "cell-empty") {
                window["liberte" + this.id] += 1;
            }

            console.log(window["liberte" + this.id]);

        }
    }
} */


function verifCellules (){
 for (a = 0; a < 9; a++) {
                for (b = 0; b < 9; b++) {
                    
                    window["liberte" + this.goban[a][b]]=0;
                        
                        // Cellule de gauche
                        if (typeof (this.goban[a] && this.goban[a][b - 1]) != 'undefined') {
                            if (goban[a][b - 1]  == 0) {
                                window["liberte" + this.goban[a][b] += 1;
                            } else if (goban[a][b - 1] == this) {
                                window["liberte" + this.goban[a][b].id] = window["liberte" + this.goban[a][b].id]+ window["liberte" + goban[a][b - 1].id] ;
                            }
                        }

                        // Cellule de droite
                        if (typeof (this.goban[a] && this.goban[a][b + 1]) != 'undefined') {
                            if (goban[a][b + 1].className == "cell-empty") {
                                window["liberte" + this.id] += 1;
                            } else if (goban[a][b + 1].className == this.className) {
                                window["liberte" + this.goban[a][b].id] = window["liberte" + this.goban[a][b].id]+ window["liberte" + goban[a][b + 1].id] ;
                            }
                        }

                        // Cellule du haut
                        if (typeof (this.goban[a - 1] && this.goban[a - 1][b]) != 'undefined') {
                            if (goban[a - 1][b].className == "cell-empty") {
                                window["liberte" + this.id] += 1;
                            } else if (goban[a - 1][b].className == this.className) {
                                window["liberte" + this.goban[a][b].id] = window["liberte" + this.goban[a][b].id]+ window["liberte" + goban[a-1][b].id] ;
                            }
                        }

                        // Cellule du bas
                        if (typeof (this.goban[a + 1] && this.goban[a + 1][b]) != 'undefined') {
                            if (goban[a + 1][b].className == "cell-empty") {
                                window["liberte" + this.id] += 1;
                            } else if (goban[a + 1][b].className == this.className) {
                                window["liberte" + this.goban[a][b].id] = window["liberte" + this.goban[a][b].id]+ window["liberte" + goban[a+1][b].id];
                            }
                        }
                    
                    
                        /*// Attribution du nouvel état
                        var compteur = compteur_1 + compteur_3;
                        // Attribution du nouvel état
                        if (compteur == 3) {
                            if (goban[a][b] == 1) {
                                if (compteur_3 > (compteur_1 + 1)) {
                                    goban_temp[a][b] = "3";
                                } else {
                                    goban_temp[a][b] = "1";
                                }
                            } else if (goban[a][b] == 3) {
                                if ((compteur_3 + 1) > compteur_1) {
                                    goban_temp[a][b] = "3";
                                } else {
                                    goban_temp[a][b] = "1";
                                }
                            } else if (compteur_1 > compteur_3) {
                                goban_temp[a][b] = "1";
                            } else if (compteur_3 > compteur_1) {
                                goban_temp[a][b] = "3";
                            }

                        }
                    */
                    
                    }
                }
                
                console.log(window["liberte" + this.id]);
            }
            
            
            
            
    