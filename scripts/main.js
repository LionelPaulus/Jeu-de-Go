
var Rows = 9;
var player = 1; // 1 = black, 2 = white
var tour = 1;
var waitingPlayer = 2;

var group = new Array();
for (var i=0; i<Rows; i++)
{
    group[i]=new Array ();
}

var prisoner1 = 0; // Prisoners of player 1 (black)
var prisoner2 = 0; // Prisoners of player 2 (white)

var game = new Array();
for (var i=0; i<Rows; i++)
{
    game[i]=new Array ();
    for (var j=0; j<Rows; j++)
    {
        game[i][j]=new Array();
        game[i][j][0]=2;
        game[i][j][0]=0;
    }
}

backgroundBoard();
displayCellState();



function displayCellState()
{
    var grid='';

    document.getElementById("goban").innerHTML = "";

    for (var i=0;i<Rows; i++)
    {
        grid+="<div class='lines'>";

        for (var j=0;j<Rows; j++){

            grid+= '<div id="' + (i+"_"+j) +'" class="empty" onclick="toggle(id);"></div>';

        }

        grid=grid+'</div>';

    }

    document.getElementById("goban").innerHTML = grid;

}

function backgroundBoard(){
    var bg='';
    document.getElementById("background").innerHTML = "";

    for (var i=0;i<(Rows-1); i++)
    {
        bg+="<div class='bgLines'>";

        for (var j=0;j<(Rows-1); j++){

            bg+= '<div class="bgIntersection"></div>';

        }

        bg=bg+'</div>';

    }

    document.getElementById("background").innerHTML = bg;


}


function toggle(cellid)
{
    console.log("case: " + cellid);
    var indexTiret = cellid.indexOf("_");
    var x = parseInt(cellid.substring(0, indexTiret));
    var y = parseInt(cellid.substring(indexTiret+1));


    if (game[x][y][0]!=0 || suicide(x,y)==true || ko(x,y)==true)
    {
        console.log("Impossible de jouer ici");
        return;
    }
    else
    {
        game[x][y][0]=player;
        game[x][y][tour]=player;

        actualisationGroups();
        capture(x,y);
        graphisme();
        tour++;
        playerTurn();
    }

}



function suicide (x,y)
{
    game[x][y][0]=player;

    // OPTIMISER CETTE MERDE !!!!!!!! (Mais ca marche)
    var suicide = true;
    actualisationGroups();
    var groupeNum = group[x][y];
    for (var i=0; i<Rows; i++)
    {
        for (var j=0; j<Rows; j++)
        {
            if (group[i][j]==groupeNum && groupeNum!=0)
            {
                if ( ((j-1)>=0 && game[i][j-1][0]==0)  || ((i+1)<Rows && game[i+1][j][0]==0) || ((j+1)<Rows && game[i][j+1][0]==0) || ((i-1)>=0 && game[i-1][j][0]==0) )
                {
                    suicide = false;
                }
            }
        }
    }

    if (suicide==true)
    {
        game[x][y][0]=0;
        console.log("suicide");
        return true;
    }
    return false;
}



function ko (x,y)
{
    return false;
}



function capture (x,y)
{
    if ( (y-1)>=0 && game[x][y-1][0]==waitingPlayer)
    {
        libertiesGroup(x, y-1);
    }
    if ((x+1)<Rows && game[x+1][y][0]==waitingPlayer)
    {
        libertiesGroup(x+1, y);
    }
    if ((y+1)<Rows && game[x][y+1][0]==waitingPlayer)
    {
        libertiesGroup(x, y+1);
    }
    if ((x-1)>=0 && game[x-1][y][0]==waitingPlayer)
    {
        libertiesGroup(x-1, y);
    }
}


function actualisationGroups ()
{

    var Num_Groupe = 1;

    for (i=0; i<Rows; i++)
    {
        for (j=0; j<Rows; j++)
        {
            if ( game[i][j][0]==0)
            {
                group[i][j]=0;
            }
            else
            {
                group[i][j] = Num_Groupe;
                Num_Groupe++;
            }
        }
    }


     for (i=0; i<Rows; i++)
    {
        for (j=0; j<Rows; j++)
        {

            if ( (j-1)>=0 && game[i][j][0] == game[i][j-1][0])
            {
                var ancienG = group[i][j-1];
                for (var k=0; k<Rows; k++)
                {
                    for (var l=0; l<Rows; l++)
                    {
                        if (group[k][l] == ancienG)
                        {
                            group[k][l] = group[i][j];
                        }
                    }
                }
            }
            if ( (i+1)>Rows && game[i][j][0] == game[i+1][j][0])
            {
                var ancienG = group[i+1][j];
                for (k=0; k<Rows; k++)
                {
                    for (l=0; l<Rows; l++)
                    {
                        if (group[k][l] == ancienG)
                        {
                            group[k][l] = group[i][j];
                        }
                    }
                }
            }
            if ( (j+1)<Rows && game[i][j][0] == game[i][j+1][0] )
            {
                var ancienG = group[i][j+1];
                for (var k=0; k<Rows; k++)
                {
                    for (var l=0; l<Rows; l++)
                    {
                        if (group[k][l] == ancienG)
                        {
                            group[k][l] = group[i][j];
                        }
                    }
                }
            }
            if ( (i-1)>=0 && game[i][j][0] == game[i-1][j][0])
            {
                var ancienG = group[i-1][j];
                for (var k=0; k<Rows; k++)
                {
                    for (var l=0; l<Rows; l++)
                    {
                        if (group[k][l] == ancienG)
                        {
                            group[k][l] = group[i][j];
                        }
                    }
                }
            }
            // OPTIMISER CETTE MERDE !!!!!!!! (Mais ca marche)
        }
    }

}



function libertiesGroup (x,y)
{
    actualisationGroups();
    var groupeNum = group[x][y];
    for (var i=0; i<Rows; i++)
    {
        for (var j=0; j<Rows; j++)
        {
            if (group[i][j]==groupeNum && groupeNum!=0)
            {
                if ( ((j-1)>=0 && game[i][j-1][0]==0)  || ((i+1)<Rows && game[i+1][j][0]==0) || ((j+1)<Rows && game[i][j+1][0]==0) || ((i-1)>=0 && game[i-1][j][0]==0) )
                {
                    return;
                    // Si un pion du groupe à une libertés, il n'y a pas capture
                }
            }
        }
    }


    // Si on arrive la, c'est que le groupe n'avait aucune libertés
    for (var i=0; i<Rows; i++)
    {
        for (var j=0; j<Rows; j++)
        {
            if (group[i][j]==groupeNum)
            {
                game[i][j][0] = 0;
                //prisonniersJoueur ++;
                // Donc on remet à 0 les pions capturés du groupe et on increment la variable de
            }
        }
    }
}



function playerTurn ()
{
    if (player == 1)
    {
        waitingPlayer = 1;
        player = 2;
    }
    else
    {
        waitingPlayer = 2;
        player = 1;
    }
}



function graphisme ()
{
    for (var i=0; i<Rows; i++)
    {
        for (var j=0; j<Rows; j++)
        {
            if (game[i][j][0]==0)
            {
                var element = document.getElementById(i+"_"+j);
                element.setAttribute("class", "empty");
            }
            if (game[i][j][0]==1)
            {
                var element = document.getElementById(i+"_"+j);
                element.setAttribute("class", "black");
            }
            else if (game[i][j][0]==2)
            {
                var element = document.getElementById(i+"_"+j);
                element.setAttribute("class", "white");
            }
        }
    }
}
