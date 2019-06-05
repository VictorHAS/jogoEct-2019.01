//-----Booleans-----
var canJump = false;
//-------------------
//-----Variaveis-----
var dx, dy, targetX, targetY;
var balas;
var font;
var xa, xy;
var t1 = 0;
var t2 = 5;
var tela = 1;
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
var qnt = 2;
//-------------------
//---Jogador Info---
var arma;
var jumping = false;
var reloading = false;
var intervaloEntreTiros = 0.5; // em segundos
var randomnumber;
var tirosDisponivel = 0;
var tiros = 5;
var contTiros = 0;
var speedBala = 25;
var posXI = 390;
var posYI = 300;
var lifes = 3;
var life = 1000;
var pontos = 0;
var jogador, arma;
var JUMP = 20;
//-------------------
//-----Cenario-----
var GRAVITY = 0.5;
var idle_anim;
var gameover_anim;
var jump_anim;
var run_anim;
var bala_anim, balaImpact_anim;
var bg1, bg2;
//-------------------
function preload() {
  plataformImg = loadImage("../assets/PlataformaBaixo.png");
  idle_anim = loadAnimation(
    "../assets/idle/Armature_IDLE_00.png",
    "../assets/idle/Armature_IDLE_39.png"
  );
  gameover_anim = loadAnimation(
    "../assets/gameover/gameover01.png",
    "../assets/gameover/gameover99.png"
  );
  jump_anim = loadAnimation(
    "../assets/jump/Armature_JUMP_23.png",
    "../assets/jump/Armature_JUMP_38.png"
  );
  jump_anim.looping = false;
  run_anim = loadAnimation(
    "../assets/walk/Armature_RUN_00.png",
    "../assets/walk/Armature_RUN_15.png"
  );
  bala_anim = loadAnimation(
    "../assets/bullet/balaVoando/Armature_Bullet-Flyng_00.png",
    "../assets/bullet/balaVoando/Armature_Bullet-Flyng_14.png"
  );
  balaImpact_anim = loadAnimation(
    "../assets/bullet/balaColidindo/Armature_Bullet-Impact_00.png",
    "../assets/bullet/balaColidindo/Armature_Bullet-Impact_10.png"
  );
  bg1 = loadImage("../assets/background0.png");
  bg2 = loadImage("../assets/background.jpg");
  font = loadFont("../assets/True2D.ttf");
}
function setup() {
  angleMode(DEGREES);
  createCanvas(1280, 500);

  bala_anim.frameDelay = 1;
  balaImpact_anim.frameDelay = 1;
  idle_anim.frameDelay = 2;
  jump_anim.frameDelay = 4;
  run_anim.frameDelay = 3;
  gameover_anim.frameDelay = 2;

  jogador = createSprite(posXI, posYI, 50, 100);
  jogador.setDefaultCollider();
  jogador.debug = true;
  jogador.shapeColor = color(25, 84);
  jogador.friction = 0.05;
  jogador.addAnimation("normal", idle_anim);
  jogador.addAnimation("jump", jump_anim);
  jogador.addAnimation("walk", run_anim);
  jogador.scale = 0.2;

  balas = new Group();
  inimigosEsquerda = new Group();
  inimigosCima = new Group();
  inimigosDireita = new Group();

  tirosDisponivel = tiros;

  plataformB = createSprite(width / 2, 500, 200, 200);
  plataformB.setDefaultCollider();
  plataformB.addImage(plataformImg);
}
function draw() {
  background(bg1);
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
    fill(255);
    rect(150, 20, 1000, 50, 10, 10);
    fill(255, 0, 0);
    rect(150, 20, 1000, 50, 10, 10);
    fill(0, 255, 0);
    rect(150, 20, life, 50, 10, 10);
    textFont(font);
    textSize(40);
    fill(100);
    text("Vida: " + life, 592, 57);
    text("Pontos: " + pontos, 150, 110);
    text("Tiros: " + tirosDisponivel, 1030, 110);
    //jogador functions
    jogadorChecks();
    movimentoJogador();
    pulo();
    //----------------

    //functions cenario
    colisores();
    desenharInimigos();
    fases();
    checkInimigoPositions();
    drawSprites();
    useQuadTree(true);
    morreu();
    //----------------
  }
  if (tela == 3) {
    gameOver();
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
function fases() {
  if (pontos <= 150) {
    qnt = 3;
    for (var i = 0; i < inimigosDireita.length; i++) {
      var s = inimigosDireita[i];
      s.setSpeed(2, 180);
    }
  } else if (pontos >= 250) {
    qnt = 4;
    for (var i = 0; i < inimigosDireita.length; i++) {
      var s = inimigosDireita[i];
      s.setSpeed(4, 180);
    }
  }
}
function colisores() {
  balas.overlap(inimigosEsquerda, balaCollideEnemy);
  balas.overlap(inimigosCima, balaCollideEnemy);
  balas.overlap(inimigosDireita, balaCollideEnemy);

  jogador.overlap(inimigosEsquerda, enemyCollidePlayer);
  jogador.overlap(inimigosCima, enemyCollidePlayer);
  jogador.overlap(inimigosDireita, enemyCollidePlayer);
}
function balaCollideEnemy(collector, collected) {
  pontos += 40;
  var explosion = createSprite(collector.position.x, collector.position.y);
  explosion.addAnimation("balaExplosao", balaImpact_anim);
  explosion.animation.looping = false;
  explosion.changeAnimation("balaExplosao");
  setTimeout(() => {
    explosion.remove();
  }, 300);
  collector.remove();
  collected.remove();
}
function enemyCollidePlayer(collector, collected) {
  collected.remove();
  var interval = setInterval(perderLife, 100);
  setTimeout(() => {
    window.clearInterval(interval);
  }, 220);
}
function perderLife() {
  life -= 5;
}
function morreu() {
  if (life <= 950) {
    tela = 3;
    gameOver();
  }
}
function gameOver() {
  animation(gameover_anim, width / 2, height / 2);
  jogador.velocity.x = 0;
  jogador.position.x = posXI;
  jogador.position.y = posYI;
  if (keyIsDown(13)) {
    resetarFases();
    life = 1000;
    tela = 2;
  }
}
function resetarFases() {
  tirosDisponivel = tiros;
  pontos = 0;
  balas.removeSprites();
  inimigosEsquerda.removeSprites();
  inimigosCima.removeSprites();
  inimigosDireita.removeSprites();
}
function jogadorChecks() {
  jogador.velocity.y += GRAVITY;
  if (jogador.position.y > height) {
    jogador.position.x = posXI;
    jogador.position.y = posYI;
    lifes--;
  }
  if (jogador.collide(plataformB)) {
    if (jumping) {
      jogador.animation.changeFrame(0);
    }
    canJump = true;
    jumping = false;
    jogador.velocity.y = 0;
  }
}
function reloadGun() {
  reloading = true;
  tirosDisponivel = "Reloading...";
  setTimeout(() => {
    reloading = false;
    contTiros = 0;
    tirosDisponivel = tiros;
  }, 1500);
}
function pulo() {
  if (keyIsDown(cima) && canJump) {
    jogador.changeAnimation("jump");
    jogador.velocity.y = -JUMP;
    jumping = true;
    canJump = false;
  }
}
function getAngloDeDisparo(x, y) {
  return atan2((y - mouseY) * -1, (x - mouseX) * -1);
}
function movimentoJogador() {
  if (keyIsDown(direita)) {
    if (canJump) {
      jogador.changeAnimation("walk");
    }
    jogador.position.x += 5;
    if (jogador.position.x > width) jogador.position.x = 0;
  } else if (keyIsDown(esquerda)) {
    if (canJump) {
      jogador.changeAnimation("walk");
    }
    jogador.position.x -= 5;
    if (jogador.position.x < 0) jogador.position.x = width;
  } else {
    if (canJump) {
      jogador.changeAnimation("normal");
    }
  }
}
function mousePressed() {
  if (tela === 2 && contTiros >= tiros && reloading == false) {
    reloadGun();
  } else if (reloading == false && balas.length < tiros && tela === 2) {
    let a = getAngloDeDisparo(jogador.position.x, jogador.position.y);
    console.log(a);
    var bala = createSprite(jogador.position.x, jogador.position.y);
    bala.rotateToDirection = true;
    bala.velocity.x = cos(a) * speedBala;
    bala.velocity.y = sin(a) * speedBala;
    bala.addAnimation("bala", bala_anim);
    bala.changeAnimation("bala");
    bala.scale = 0.3;
    bala.life = 50;
    balas.add(bala);
    tirosDisponivel--;
    contTiros++;
  }
}
//-----WIP-------
function mouseMoved() {
  let a = getAngloDeDisparo(jogador.position.x, jogador.position.y);
  if (a >= -89 && a <= 89) {
    jogador.mirrorX(1);
    console.log("a");
  } else {
    jogador.mirrorX(1);
    console.log("b");
  }
}
//----------------
