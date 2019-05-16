//-----Booleans-----
var canJump = false;
//-------------------
//-----Variaveis-----
var balas;
var font;
var xa, xy;
var bg;
var tela = 3;
var angle1 = 0.0,
  segLength = 90;
var contFrames = 0;
//-------------------
//-----Cenario-----
var wall1;
var plataformB;
//-------------------
//---Jogador Info---
var arma;
var direcao;
var posXI = 390;
var posYI = 300;
var lifes = 3;
var jogador, arma;
var GRAVITY = 0.5;
var JUMP = 15;
var armaImg, plataformImg;
//-------------------
//-----Animações-----
var arma_img;
var idle_anim;
var gameover_anim;
var jump_anim;
var run_anim;
var bala_anim;
//-------------------
function preload() {
  arma_img = loadImage("../assets/arma.png");
  plataformImg = loadImage("../assets/plataforma/PlataformaBaixo.png");
  idle_anim = loadAnimation(
    "../assets/idle/Armature_IDLE_00.png",
    "../assets/idle/Armature_IDLE_39.png"
  );
  gameover_anim = loadAnimation("../assets/gameover/gameover01.png", "../assets/gameover/gameover99.png")
  jump_anim = loadAnimation(
    "../assets/jump/Armature_JUMP_16.png",
    "../assets/jump/Armature_JUMP_37.png"
  );
  run_anim = loadAnimation(
    "../assets/walk/Armature_RUN_00.png",
    "../assets/walk/Armature_RUN_15.png"
  );
  bala_anim = loadImage("../assets/Bullet.png")
  bg = loadImage("../assets/background0.png");
  font = loadFont("../assets/True2D.ttf");
}
function setup() {
  createCanvas(720, 480);
  frameRate(60);
  wall1 = createSprite(width / 2, 200, 500, 40);
  wall1.setCollider("rectangle", 0, 0, 500, 40);
  wall1.shapeColor = color(150, 255);

  jogador = createSprite(posXI, posYI, 50, 100);
  jogador.setCollider("rectangle", 0, 0, 350, 400);
  //jogador.debug = true;
  jogador.shapeColor = color(25, 84);
  jogador.friction = 0.05;
  jogador.addAnimation("normal", idle_anim);
  jogador.addAnimation("jump", jump_anim);
  jogador.addAnimation("walk", run_anim);
  jogador.scale = 0.2;

  balas = new Group();

  plataformB = createSprite(width / 2, 500, 200, 200);
  plataformB.setDefaultCollider();
  plataformB.addImage(plataformImg);
}
function draw() {
  background(bg);

  if (tela == 1) {
    textFont(font);
    textSize(40);
    textAlign(CENTER);
    fill(0);
    text(
      "Pressione Enter para Começar",
      (width / 2) + 1,
      (height / 2) + 1
    );
    fill(100);
    text("Pressione Enter para Começar", width / 2, height / 2);
    if (keyIsDown(13)) tela = 2;
  }
  if (tela == 2) {
    if (lifes <= 0) {
      tela = 3;
    }
    if (direcao < 0) {
      direcao *= -1;
    }
    //----------------------DEBUG CODE-----------------------------//
    //jogador.velocity.x = (mouseX - jogador.position.x) / 10;
    //jogador.velocity.y = (mouseY - jogador.position.y) / 10;
    //jogador.position.x = mouseX;
    //jogador.position.y = mouseY;
    textFont(font);
    textSize(40);
    fill(100);
    jogador.collide(wall1);
    text("Vidas: " + lifes, 30, 30);
    jogador.velocity.y += GRAVITY;
    if (jogador.position.y > height) {
      jogador.position.x = posXI;
      jogador.position.y = posYI;
      lifes--;
    }
    //----------------------DEBUG CODE-----------------------------//
    if (keyIsDown(RIGHT_ARROW)) {
      if (canJump) {
        jogador.changeAnimation("walk");
      }
      jogador.position.x += 5;
      direcao = jogador.getDirection() - 90;
      console.log(direcao)
      jogador.mirrorX(1);
      if (jogador.position.x > width) jogador.position.x = 0;
    } else if (keyIsDown(LEFT_ARROW)) {
      if (canJump) {
        jogador.changeAnimation("walk");
      }
      direcao = jogador.getDirection() + 90
      console.log(direcao)
      jogador.position.x -= 5;
      jogador.mirrorX(-1);
      if (jogador.position.x < 0) jogador.position.x = width;
    } else {
      if (canJump) {
        jogador.changeAnimation("normal");
      }
    }
    dx = mouseX - jogador.position.x;
    dy = mouseY - jogador.position.y;
    angle1 = atan2(dy, dx);
    if (keyWentDown(CONTROL)) {
      var bala = createSprite(jogador.position.x, jogador.position.y);
      bala.setSpeed(10, direcao);
      bala.addImage(bala_anim)
      bala.scale = 0.1
      bala.life = 100;
      balas.add(bala);
    }
    if (jogador.collide(plataformB)) {
      jump_anim.goToFrame(0);
      canJump = true;
      jogador.velocity.y = 0;
    }
    if (keyIsDown(UP_ARROW)) {
      if (canJump) {
        if (keyIsDown(RIGHT_ARROW)) {
          direcao = jogador.getDirection() - 90
        }
        if (keyIsDown(LEFT_ARROW)) {
          direcao = jogador.getDirection() + 90
        }
        jogador.changeAnimation("jump");
        jogador.velocity.y = -JUMP;
        canJump = false;
      }
    }
    drawSprites();
    //segment(jogador.position.x + 20, jogador.position.y + 20, angle1);
  }
  if (tela == 3) {
    animation(gameover_anim, width / 2, height / 2)
    /*textFont(font);
    textSize(80);
    textAlign(CENTER);
    fill(0)
    text("GAME OVER\n aperte enter para recomeçar", (width / 2) + 1,
      (height / 2) + 1)
    fill(204, 0, 0);
    text(
      "GAME OVER\n aperte enter para recomeçar",
      width / 2,
      height / 2
    );*/
    lifes = 3;
    jogador.velocity.x = 0;
    jogador.position.x = posXI;
    jogador.position.y = posYI;
    if (keyIsDown(13)) {
      tela = 2;
    }
  }
}
function segment(x, y, a) {
  push();
  translate(x, y);
  rotate(a);
  image(armaImg, 0, 0, 0, 0);
  //line(0, 0, segLength, 0);
  pop();
}
