function ia() {

  for(x = 0 ; x < rows ; x++){
    for(y = 0; y < rows ; y++){
      if(atari(x,y) == true){
        if(attributePos(x,y) != "nope"){
          return attributePos(x,y);
        }
        }
      }
    }

  var stratégie = Math.floor
  x = Math.floor((Math.random() * rows));
  y = Math.floor((Math.random() * rows));
  if(possible(x,y) == true){
      return (x + "_" + y);
  }
  else {
    ia();
  }
}

function possible(x,y) {
  if((suicide(x,y) == false) && (ko(x,y) == false) && (grid[x][y] == 0)){
    console.log(grid[x][y]);
      return true;
  }
  else {
    return false;
  }
}

function attributePos(x,y){
  if(possible(x+1, y) == true){
    return(x+1 + "_" + y);
  }
  else if (possible(x-1, y) == true) {
    return(x-1+ "_" + y);
  }
  else if (possible(x, y + 1) == true) {
    return(x + "_" + y+1);
  }
  else if (possible(x, y-1) == true) {
    return(x+ "_" + y -1);
  }
  else {
    return("nope");
  }
}
