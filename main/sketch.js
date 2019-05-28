//-----Booleans-----
var canJump = false;
//-------------------
//-----Variaveis-----
var dx, dy, targetX, targetY;
var balas;
var font;
var xa, xy;
var bg;
var t1 = 0;
var t2 = 5;
var tela = 1;
var angle1 = 0.0,
  segLength = 90;
var contFrames = 0;
//-------------------
//-----KeyCodes------
var cima = 87;
var esquerda = 65;
var direita = 68;
//-------------------
//-----Cenario-----
var plataformB;
//-------------------
//---Inimigo Info---
var inimigosEsquerda, inimigosCima, inimigosDireita;
var qnt = 3;
//-------------------
//---Jogador Info---
var arma;
var randomnumber;
var tiros = 7;
var speedBala = 10;
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

  balas = new Group();
  inimigosEsquerda = new Group();
  inimigosCima = new Group();
  inimigosDireita = new Group();

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
    if (keyIsDown(direita)) {
      if (canJump) {
        jogador.changeAnimation("walk");
      }
      jogador.position.x += 5;
      jogador.mirrorX(1);
      if (jogador.position.x > width) jogador.position.x = 0;
    } else if (keyIsDown(esquerda)) {
      if (canJump) {
        jogador.changeAnimation("walk");
      }
      jogador.position.x -= 5;
      jogador.mirrorX(-1);
      if (jogador.position.x < 0) jogador.position.x = width;
    } else {
      if (canJump) {
        jogador.changeAnimation("normal");
      }
    }
    balas.overlap(inimigosEsquerda, collect);
    balas.overlap(inimigosCima, collect);
    balas.overlap(inimigosDireita, collect);
    while (jogador.collide(plataformB)) {
      canJump = true;
      jogador.velocity.y = 0;
    }
    if (keyIsDown(cima)) {
      if (canJump) {
        jogador.changeAnimation("jump");
        jogador.velocity.y = -JUMP;
        canJump = false;
      }
    }
    if (pontos <= 150) {
      qnt = 5;
      for (var i = 0; i < inimigosDireita.length; i++) {
        var s = inimigosDireita[i];
        s.setSpeed(2, 180);
      }
    } else if (pontos >= 250) {
      qnt = 7;
      for (var i = 0; i < inimigosDireita.length; i++) {
        var s = inimigosDireita[i];
        s.setSpeed(4, 180);
      }
    }
    desenharInimigos();
    checkInimigoPositions();
    atirar();
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
  if (mouseIsPressed) {
    if (balas.length < 2) {
      let a = atan2(
        (jogador.position.y - mouseY) * -1,
        (jogador.position.x - mouseX) * -1
      );
      var bala = createSprite(jogador.position.x, jogador.position.y);
      bala.velocity.x = cos(a) * speedBala;
      bala.velocity.y = sin(a) * speedBala;
      bala.addImage(bala_anim);
      bala.scale = 0.1;
      bala.life = 50;
      balas.add(bala);
    }
  }
}
function desenharInimigos() {
  if (
    inimigosEsquerda.length + inimigosCima.length + inimigosDireita.length <=
    qnt
  ) {
    randomnumber = getRndInteger(0, 3);
    if (randomnumber === 0) {
      var inmg = createSprite(0, random(200, 350), 30, 30);
      inmg.setDefaultCollider();
      inmg.setSpeed(1, 0);
      inimigosEsquerda.add(inmg);
    }
    if (randomnumber === 1) {
      var inmg = createSprite(1400, random(200, 350), 30, 30);
      inmg.setDefaultCollider();
      inmg.setSpeed(1, 180);
      inimigosDireita.add(inmg);
    }
    if (randomnumber === 2) {
      var inmg = createSprite(random(600, 700), 0, 30, 30);
      inmg.setDefaultCollider();
      inmg.setSpeed(1, 90);
      inimigosCima.add(inmg);
    }
  }
}
function collect(collector, collected) {
  pontos += 40;
  collector.remove();
  collected.remove();
  qnt -= 1;
}
function checkInimigoPositions() {
  for (var i = 0; i < inimigosEsquerda.length; i++) {
    var s = inimigosEsquerda[i];
    if (s.position.x > 1300) {
      s.remove();
    }
  }
  for (var i = 0; i < inimigosCima.length; i++) {
    var s = inimigosCima[i];
    if (s.position.y > 500) {
      s.remove();
    }
  }
  for (var i = 0; i < inimigosDireita.length; i++) {
    var s = inimigosDireita[i];
    if (s.position.x < -5) {
      s.remove();
    }
  }
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
