function ia() {
  var x ;
  var y;
  /*for(k = 0 ; k < 9 ; k++){
    for(l = 0; l < 9 ; l++){
    }
  }
  var stratégie = Math.floor*/
  x = Math.floor(Math.random() * (rows -1));
  y = Math.floor(Math.random() * (rows -1));
  if(grid[x][y] == 0){
    if(suicide(x,y) == false && ko(x,y) == false){
      console.log(x + "_" + y);
        return (x + "_" + y);
    }
  }
  else {
    ia();
  }
}

function possible(x, y) {
  if(grid[x][y] == 0){
    if ((suicide(x, y) == false) && (ko(x, y) == false)) {
      return true;
    } else {
      return false;
    }
  }
}

function attributePos(x, y) {
  if (possible(x + 1, y) == true) {
    return (x + 1 + "_" + y);
  } else if (possible(x - 1, y) == true) {
    return (x - 1 + "_" + y);
  } else if (possible(x, y + 1) == true) {
    return (x + "_" + y + 1);
  } else if (possible(x, y - 1) == true) {
    return (x + "_" + y - 1);
  } else {
    return ("nope");
  }
}
