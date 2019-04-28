let x =200;
let y =350;
let xi =200
function setup() { 
createCanvas(400, 400); 
}

function draw() { 
background(210);

  if (keyIsDown(LEFT_ARROW)) {
    x -= 5;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    x += 5;
  }

  if (keyIsDown(UP_ARROW)) {
    y -= 5;
  }

  if (keyIsDown(DOWN_ARROW)) {
    y += 5;
  }
  
ellipse(x, y, 50, 50) 
rect(xi, 50, 60, 60)
  xi = xi + 5
  
  if (xi>400){
    xi = 0
  }
}
