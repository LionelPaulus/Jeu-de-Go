function ia() {
  var x ;
  var y;
  x = Math.floor((Math.random() * 9));
  y = Math.floor((Math.random() * 9));
  if(suicide(x,y) == false && ko(x,y) == false){
      return (x + "_" + y);
  }
  else {
    ia();
  }
}
