//-----Booleans-----
var disparo = false;
//-------------------
//-----Variaveis-----
var tela = 1;
var xd, yd;
let angle1 = 0.0,
  segLength = 90;
var contFrames = 0;
//-------------------
//-----Cenario-----
var wall1;
var plataformB;
//-------------------
//---Jogador Info---
var posXI = 400;
var posYI = 321;
var lifes = 3;
var jogador;
var gravidade = 0.1;
var jump = 2;
//-------------------
//-----Animações-----
var sprite_sheet_image;
var sprite_sheet;
var explode_animation;
//-------------------
function preload() {
  /*sprite_sheet = loadSpriteSheet(
    "../assets/idlePlayer/idle_ sheets.png",
    400,
    400,
    2
  );
  explode_animation = loadAnimation(sprite_sheet);*/
}
function setup() {
  createCanvas(800, 800);

  wall1 = createSprite(width / 2, 200, 500, 40);
  wall1.setCollider("rectangle", 0, 0, 500, 40);
  jogador = createSprite(posXI, posYI, 50, 100);
  jogador.setCollider("rectangle", 0, 0, 50, 100);
  plataformB = createSprite(width / 2, 500, 600, 200);
  plataformB.setCollider("rectangle", 0, 0, 600, 200);
  plataformB.debug = true;
  jogador.debug = true;
  wall1.debug = true;
  //wall2.debug = true;
  //jogador.addAnimation("normal", explode_animation);
  yd = jogador.position.y;
  jogador.velocity.x = 0;
}
function draw() {
  background(110);
  if (tela == 1) {
    textSize(28);
    fill(200);
    text("Pressione Enter para Começar", 100, 200);
    if (keyIsDown(13)) tela = 2;
  }
  if (tela == 2) {
    if (lifes <= 0) {
      tela = 3;
    }
    //----------------------DEBUG CODE-----------------------------//
    //jogador.velocity.x = (mouseX - jogador.position.x) / 10;
    //jogador.velocity.y = (mouseY - jogador.position.y) / 10;
    //jogador.position.x = mouseX;
    //jogador.position.y = mouseY;
    text("Vidas: " + lifes, 30, 30);
    jogador.collide(wall1);
    jogador.collide(plataformB);
    if (jogador.position.y > height) {
      jogador.position.x = posXI;
      jogador.position.y = posYI;
      lifes--;
    }
    jogador.addSpeed(gravidade, 90);
    text("debug coords:", 30, 80);
    text("bloco coords x: " + jogador.position.x, 50, 100);
    text("bloco coords y: " + jogador.position.y, 180, 100);
    text("Mouse x:" + mouseX, 350, 100);
    text("Mouse y:" + mouseY, 450, 100);
    //----------------------DEBUG CODE-----------------------------//
    jogador.velocity.x = 0;
    if (keyIsDown(CONTROL) && !disparo) {
      disparo = true;
      xd = jogador.position.x;
      yd = jogador.position.y;
    }
    if (disparo) {
      xd = xd * 1.04;
      if (xd > width) {
        disparo = false;
      }
    }
    if (keyIsDown(RIGHT_ARROW)) {
      jogador.velocity.x = +5;
      if (jogador.position.x > width) jogador.position.x = 0;
    }
    if (keyIsDown(LEFT_ARROW)) {
      jogador.velocity.x = -5;
      if (jogador.position.x < 0) jogador.position.x = width;
    }
    if (keyIsDown(UP_ARROW)) {
      jogador.velocity.y = -jump;
    }
    if (jogador.collide(plataformB)) {
      jogador.velocity.y = 0;
    }
    dx = mouseX - jogador.position.x;
    dy = mouseY - jogador.position.y;
    angle1 = atan2(dy, dx);
    if (disparo) {
      ellipse(xd, yd, 8, 8);
    }
    drawSprites();
    segment(jogador.position.x, jogador.position.y, angle1);
  }
  if (tela == 3) {
    textSize(80);
    fill(255, 100, 100);
    text("GAME OVER", 100, 200);
  }
}
function segment(x, y, a) {
  push();
  translate(x, y);
  rotate(a);
  line(0, 0, segLength, 0);
  pop();
}
