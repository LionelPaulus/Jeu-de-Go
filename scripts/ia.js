function ia() {
  var count = 0;
  var strategy = Math.floor(Math.random() * (2));
  for (x = 0; x < rows; x++) {
    for (y = 0; y < rows; y++) {
      if (atari(x, y) == true) {
        if (attributePos(x, y) != "nope") {
          return attributePos(x, y);
        }
      }
    }
  }

  if(strategy == 1){
    for (x = 0; x < rows; x++) {
      for (y = 0; y < rows; y++) {
        if (grid[x][y] == player && liberties(x,y) >= 1) {
          if (attributePos(x, y) != "nope") {
            return attributePos(x, y);
          }
        }
      }
    }
  }
  else if (strategy == 2) {
    for (x = 0; x < rows; x++) {
      for (y = 0; y < rows; y++) {
        if (grid[x][y] != player && grid[x][y] != 0) {
          if (attributePos(x, y) != "nope"){
            return attributePos(x, y);
          }
        }
      }
    }
  }

  do {
    var x = (Math.floor(Math.random() * rows));
    var y = (Math.floor(Math.random() * rows));
  } while(possible(x, y) == false && count < 42);
  if(count == 41){
    game_finished = true;
  }
  return (x + "_" + y);

}

function possible(x, y){
  if ((x < rows) && (x >= 0) && (y < rows) && (y >= 0)) {
    if (grid[x][y] == 0) {
      if ((suicide(x, y) == false) && (ko(x, y) == false)) {
        return true;
      }
    }
  }
  return false;
}

function attributePos(x, y) {
  if ((x + 1) < rows && possible(x + 1, y) == true) {
    return ((x + 1) + "_" + y);
  } else if ((x - 1) >= 0 && possible(x - 1, y) == true) {
    return ((x - 1) + "_" + y);
  } else if ((y + 1) < rows && possible(x, y + 1) == true) {
    return (x + "_" + (y + 1));
  } else if ((y - 1) >= 0 && possible(x, y - 1) == true) {
    return (x + "_" + (y - 1));
  } else {
    return ("nope");
  }
}
