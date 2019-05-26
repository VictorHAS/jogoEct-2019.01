//-----Booleans-----
var canJump = false;
//-------------------
//-----Variaveis-----
var dx, dy, targetX, targetY;
var balas;
var font;
var xa, xy;
var bg;
var tela = 1;
var angle1 = 0.0,
  segLength = 90;
var contFrames = 0;
//-------------------
//-----Cenario-----
var plataformB;
//-------------------
//---Inimigo Info---
var inimigos;
var qnt = 3;
//-------------------
//---Jogador Info---
var arma;
var direcao;
var posXI = 390;
var posYI = 300;
var lifes = 3;
var pontos = 0;
var jogador, arma;
var GRAVITY = 0.5;
var JUMP = 20;
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
  plataformImg = loadImage("../assets/PlataformaBaixo.png");
  idle_anim = loadImage("../assets/player_idle.png");
  gameover_anim = loadAnimation(
    "../assets/gameover/gameover01.png",
    "../assets/gameover/gameover99.png"
  );
  jump_anim = loadImage("../assets/player_jump.png");
  run_anim = loadAnimation(
    "../assets/player_walk1.png",
    "../assets/player_walk2.png"
  );
  bala_anim = loadImage("../assets/Bullet.png");
  bg = loadImage("../assets/background0.png");
  font = loadFont("../assets/True2D.ttf");
}
function setup() {
  angleMode(RADIANS);
  createCanvas(1280, 500);
  frameRate(60);
  jogador = createSprite(posXI, posYI, 50, 100);
  jogador.setDefaultCollider();
  //jogador.debug = true;
  jogador.shapeColor = color(25, 84);
  jogador.friction = 0.05;
  jogador.addAnimation("normal", idle_anim);
  jogador.addAnimation("jump", jump_anim);
  jogador.addAnimation("walk", run_anim);
  jogador.scale = 1;
  qnt = 3;
  balas = new Group();
  inimigos = new Group();
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
    text("Pressione Enter para Começar", width / 2 + 1, height / 2 + 1);
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
    textFont(font);
    textSize(40);
    fill(100);
    text("Vidas: " + lifes, 30, 30);
    text("Pontos: " + pontos, 30, 60);
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
      console.log(direcao);
      jogador.mirrorX(1);
      if (jogador.position.x > width) jogador.position.x = 0;
    } else if (keyIsDown(LEFT_ARROW)) {
      if (canJump) {
        jogador.changeAnimation("walk");
      }
      direcao = jogador.getDirection() + 90;
      console.log(direcao);
      jogador.position.x -= 5;
      jogador.mirrorX(-1);
      if (jogador.position.x < 0) jogador.position.x = width;
    } else {
      if (canJump) {
        jogador.changeAnimation("normal");
      }
    }
    if (keyWentDown(CONTROL)) {
      atirar();
    }
    balas.overlap(inimigos, collect);
    while (jogador.collide(plataformB)) {
      canJump = true;
      jogador.velocity.y = 0;
    }
    if (keyIsDown(UP_ARROW)) {
      if (canJump) {
        if (keyIsDown(RIGHT_ARROW)) {
          direcao = jogador.getDirection() - 90;
        }
        if (keyIsDown(LEFT_ARROW)) {
          direcao = jogador.getDirection() + 90;
        }
        jogador.changeAnimation("jump");
        jogador.velocity.y = -JUMP;
        canJump = false;
      }
    }
    if (pontos <= 150) {
      qnt = 5;
      for (var i = 0; i < inimigos.length; i++) {
        var s = inimigos[i];
        s.setSpeed(2, 180);
      }
    } else if (pontos >= 250) {
      qnt = 7;
      for (var i = 0; i < inimigos.length; i++) {
        var s = inimigos[i];
        s.setSpeed(4, 180);
      }
    }
    if (inimigos.length <= qnt) {
      desenharInimigos();
    }
    drawSprites();
  }
  if (tela == 3) {
    animation(gameover_anim, width / 2, height / 2);
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
  line(0, 0, segLength, 0);
  pop();
}
function atirar() {
  let a = atan2(
    (jogador.position.y - mouseY) * -1,
    (jogador.position.x - mouseX) * -1
  );
  var bala = createSprite(jogador.position.x, jogador.position.y);
  console.log(cos(a) + " " + sin(a));
  bala.velocity.x = cos(a);
  bala.velocity.y = sin(a);
  bala.setSpeed(5);
  //bala.setSpeed(10, a);
  bala.addImage(bala_anim);
  bala.scale = 0.1;
  //bala.life = 200;
  balas.add(bala);
}
function desenharInimigos() {
  var inmg = createSprite(1400, random(200, 350), 30, 30);
  inmg.setDefaultCollider();
  inmg.setSpeed(1, 180);
  inimigos.add(inmg);
}
function collect(collector, collected) {
  pontos += random(2, 20);
  collector.remove();
  collected.remove();
}
