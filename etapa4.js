var pulo = false; 
var yp = 0;
var xdo, ydo; 

var contFrames = 0; 
function setup() {
	createCanvas(400, 480);
	xdo = 50;
	
	ydo = 400;  
}

function draw() {

	if (keyIsDown(RIGHT_ARROW) ){ 
		xdo = xdo + 5; 
		if ( xdo > width )
			xdo = 0; 
		
	}
    if (keyIsDown(LEFT_ARROW) ){ 
		xdo = xdo - 5; 
		if ( xdo <0 )
			xdo = 0; 
		
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

	clear();
	square(xdo, ydo+yp, 20, 50);
	
}
