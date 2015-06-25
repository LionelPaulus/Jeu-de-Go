function ia() {
  do {
    var x = Math.floor(Math.random() * (rows - 1));
    var y = Math.floor(Math.random() * (rows - 1));
  } while(possible(x, y) != true);
  return x + "_" + y;
}

function possible(x, y) {
  if (grid[x][y] == 0) {
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
