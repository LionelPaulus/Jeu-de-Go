// Initialisation tableau

var goban = new Array;
var id = 0;
var player = 1;

initialisation();


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

function ajoutPion(cell){
    if(cell.className == "cell-empty"){
        if(player == 1){
            cell.className = "j1";
        }
        else{
            cell.className ="j2";
        }
        
    }
}