function ia() {
  var x ;
  var y;
  /*for(k = 0 ; k < 9 ; k++){
    for(l = 0; l < 9 ; l++){

    }
  }*/
  var stratégie = Math.floor
  x = Math.floor((Math.random() * 9));
  y = Math.floor((Math.random() * 9));
  if(suicide(x,y) == false && ko(x,y) == false){
      return (x + "_" + y);
  }
  else {
    ia();
  }
}
