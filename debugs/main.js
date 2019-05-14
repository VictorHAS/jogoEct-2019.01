var pulo = false; 
var disparo = false; 
var yp = 0;
var xdo, ydo; 
var xd, yd;
let angle1 = 0.0,
  segLength = 50;
var contFrames = 0; 
function setup() {
	createCanvas(720, 480);
	xdo = 50;
	ydo = 380; 
    yd = ydo; 
}
function draw() {
    background(110)
    text("debug coords:",30,80)
    text("bloco coords x: "+xdo,50,100)
    text("bloco coords y: "+ydo,180,100)
    text("coord pulo y: "+yp,180,120)
    text("Mouse x:"+mouseX,350,100)
    text("Mouse y:"+mouseY,450,100)
    if (keyIsDown(CONTROL) && (! disparo) ){ 
      disparo = true; 
      xd = xdo;
      yd = ydo;     
    }
   if (disparo) {
    // movimenta o disparo / tiro 
      xd = xd +5;
    // se o disparo sumir na tela 
      if (xd > width) {
        // habilida a ocorrência de um novo disparo 
        disparo = false; 
      }
    }
	if (keyIsDown(RIGHT_ARROW) ){ 
		xdo = xdo + 5; 
		if ( xdo > width )
			xdo = 0; 
		
	}
    if (keyIsDown(LEFT_ARROW) ){ 
		xdo = xdo - 5; 
		if ( xdo <0 )
			xdo = width; 
		
	}
	if (keyIsDown(UP_ARROW) && (! pulo) ){ 
		pulo = true; 
		contFrames = 0; 
		
	}
	if (pulo) {
		contFrames++; 
		yp = 0.5*(contFrames)*(contFrames - 30);
		if (yp > 0) {
			pulo = false;
			yp = 0; 
		}
	}
  dx = mouseX - xdo;
  dy = mouseY - ydo;
  angle1 = atan2(dy, dx);
  rect(110,200,500,40)
  rect(40,400,640,200)
  square(xdo, ydo+yp, 20, 50);
  segment(xdo+10, ydo+yp+13, angle1);
  if (disparo) {
    // desenha a elipse / disparo 
    ellipse(xd,yd+yp,8,8);
    
  }
}
function segment(x, y, a) {
  push();
  translate(x, y);
  rotate(a);
  line(0,0, segLength, 0);
  pop();
}
