//-----Booleans-----
var canJump = false;
var parado = false;
var jumping = false;
var reloading = false;
var running = false;
var shooting = false;
var deslagaessejogoplmds=false
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
var dx;
var qnt = 2;
let theta = 0.0;
let amplitude = 20.0;
let period = 11.0;
let yvalues;
//-------------------
//---Jogador Info---
var arma;
var intervaloEntreTiros = 0.5; // em segundos
var randomnumber;
var tirosDisponivel = 0;
var tiros = 5;
var contTiros = 0;
var speedBala = 25;
var posXI = 390;
var posYI = 300;
var life = 1000;
var pontos = 0;
var nivel = 1;
var jogador, arma;
var JUMP = 20;
//-------------------
//-----Cenario-----
var GRAVITY = 1;
var enemy_fly_anim;
var idle_anim, idle_shot_anim;
var gameover_anim;
var jump_anim;
var run_anim, run_atirando_anim;
var hurt_anim;
var bala_anim, balaImpact_anim;
var bg1, bg2;
//-------------------
function preload() {
  plataformImg = loadImage("../assets/PlataformaBaixo.png");
  enemy_fly_anim = loadAnimation(
    "../assets/enemy/Fly1.png",
    "../assets/enemy/Fly2.png"
  );
  idle_anim = loadAnimation(
    "../assets/idle/Armature_IDLE_00.png",
    "../assets/idle/Armature_IDLE_39.png"
  );
  idle_shot_anim = loadAnimation(
    "../assets/shotIdle/Armature_SHOT_0.png",
    "../assets/shotIdle/Armature_SHOT_7.png"
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
  run_atirando_anim = loadAnimation(
    "../assets/walk/RunShot/Armature_RUN-and-SHOT_00.png",
    "../assets/walk/RunShot/Armature_RUN-and-SHOT_05.png"
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
  angleMode(RADIANS);
  createCanvas(1280, 500);

  bala_anim.frameDelay = 1;
  balaImpact_anim.frameDelay = 1;
  idle_anim.frameDelay = 2;
  jump_anim.frameDelay = 4;
  run_anim.frameDelay = 3;
  gameover_anim.frameDelay = 2;
  run_atirando_anim.frameDelay = 2;
  idle_shot_anim.frameDelay = 2;

  jogador = createSprite(posXI, posYI, 50, 100);
  jogador.setDefaultCollider();
  jogador.friction = 0.05;
  jogador.addAnimation("normal", idle_anim);
  jogador.addAnimation("normalShot", idle_shot_anim);
  jogador.addAnimation("jump", jump_anim);
  jogador.addAnimation("walk", run_anim);
  jogador.addAnimation("walkAtirando", run_atirando_anim);
  jogador.scale = 0.2;

  balas = new Group();
  inimigosEsquerda = new Group();
  inimigosCima = new Group();
  inimigosDireita = new Group();

  tirosDisponivel = tiros;

  plataformB = createSprite(width / 2, 500, 200, 200);
  plataformB.setDefaultCollider();
  plataformB.addImage(plataformImg);
  dxE = (TWO_PI / period) * 16;
  dxD = (PI / period) * 16;
  yvaluesE = new Array(floor((width + 16) / 16));
  yvaluesD = new Array(floor((width + 16) / 16));
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
    text("Nivel: " + nivel, 600, 110);
    //jogador functions
    jogadorChecks();
    movimentoJogador();
    pulo();
    //----------------
    //functions cenario
    calcWave();
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
      var inmg = createSprite(0, random(300, 400), 30, 30);
      if(!	deslagaessejogoplmds){
      inmg.addAnimation("fly", enemy_fly_anim);
      inmg.changeAnimation("fly");
      inmg.scale = 0.2;
      }
      inmg.setDefaultCollider();
      inmg.rotateToDirection = true;
      inimigosEsquerda.add(inmg);
    }
    if (randomnumber === 1) {
      var inmg = createSprite(1300, random(200, 350), 30, 30);
      if(!deslagaessejogoplmds){
      inmg.addAnimation("fly", enemy_fly_anim);
      inmg.changeAnimation("fly");
      inmg.scale = 0.2;
      inmg.mirrorY(-1);
      }
      inmg.setDefaultCollider();
      inmg.rotateToDirection = true;
      inimigosDireita.add(inmg);
    }
    if (randomnumber === 2) {
      var inmg = createSprite(random(450, 900), 0, 30, 30);
      if(!deslagaessejogoplmds){
      inmg.addAnimation("fly", enemy_fly_anim);
      inmg.changeAnimation("fly");
      inmg.scale = 0.2;
      }
      inmg.setDefaultCollider();
      inmg.rotateToDirection = true;
      inmg.setSpeed(5, 90);
      inimigosCima.add(inmg);
    }
  }
}
function checkInimigoPositions() {
  if (nivel == 1) {
    inimigosEsquerdaSpeedWave(1);
    inimigosDireitaSpeedWave(1);
  } else if (nivel == 2) {
    qnt = 5;
    tiros = 8;
    inimigosEsquerdaSpeedWave(3);
    inimigosDireitaSpeedWave(3);
  } else if (nivel == 3) {
    qnt = 6;
    tiros = 9;
    inimigosEsquerdaSpeedWave(5);
    inimigosDireitaSpeedWave(5);
  } else if (nivel == 4) {
    qnt = 7;
    tiros = 10;
    inimigosEsquerdaSpeedWave(7);
    inimigosDireitaSpeedWave(7);
  } else if (nivel == 5) {
    qnt = 8;
    tiros = 11;
    inimigosEsquerdaSpeedWave(9);
    inimigosDireitaSpeedWave(9);
  }
  for (x = 0; x < inimigosEsquerda.length; x++) {
    for (i = 0; i < yvaluesE.length; i++) {
      inimigosEsquerda.get(x).setSpeed(3, yvaluesE[i] / 2);
    }
  }
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
    if (s.position.x < -5 || s.position.x > 1500) {
      s.remove();
    }
  }
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function fases() {
  if (pontos >= 150 && pontos < 300) {
    nivel = 2;
  } else if (pontos >= 300 && pontos < 450) {
    nivel = 3;
  } else if (pontos >= 450 && pontos < 600) {
    nivel = 4;
  } else if (pontos >= 600 && pontos < 750) {
    nivel = 5;
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
    tirosDisponivel = tiros;
    tela = 2;
  }
}
function resetarFases() {
  tirosDisponivel = tiros;
  contTiros = 0;
  nivel = 1;
  qnt=3
  reloading = false;
  pontos = 0;
  balas.clear();
  inimigosEsquerda.removeSprites();
  inimigosCima.removeSprites();
  inimigosDireita.removeSprites();
}
function jogadorChecks() {
  jogador.velocity.y += GRAVITY;
  if (jogador.position.y > height) {
    jogador.position.x = posXI;
    jogador.position.y = posYI;
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
    if (shooting) {
      jogador.changeAnimation("walkAtirando");
    } else {
      jogador.changeAnimation("jump");
    }
    jogador.velocity.y = -JUMP;
    jumping = true;
    running = false;
    canJump = false;
  }
}
function getAnguloDeDisparo(x, y) {
  return atan2((y - mouseY) * -1, (x - mouseX) * -1);
}
function movimentoJogador() {
  if (keyIsDown(direita)) {
    running = true;
    parado = false;
    if (canJump && !shooting) {
      jogador.changeAnimation("walk");
    } else if (canJump && shooting && !parado) {
      jogador.changeAnimation("walkAtirando");
    } else if (canJump && shooting && parado) {
      jogador.changeAnimation("normalShot");
    }
    jogador.position.x += 5;
    if (jogador.position.x > width) jogador.position.x = 0;
  } else if (keyIsDown(esquerda)) {
    running = true;
    parado = false;
    if (canJump && !shooting) {
      jogador.changeAnimation("walk");
    } else if (canJump && shooting && !parado) {
      jogador.changeAnimation("walkAtirando");
    } else if (canJump && shooting && parado) {
      jogador.changeAnimation("normalShot");
    }
    jogador.position.x -= 5;
    if (jogador.position.x < 0) jogador.position.x = width;
  } else {
    if (canJump && !shooting) {
      running = false;
      parado = true;
      jogador.changeAnimation("normal");
    }
  }
}
function mousePressed() {
  if (jogador === undefined) return;
  if (tela === 2 && contTiros >= tiros && reloading == false) {
    reloadGun();
  } else if (reloading == false && balas.length < tiros && tela === 2) {
    let a = getAnguloDeDisparo(jogador.position.x, jogador.position.y);
    var bala = createSprite(jogador.position.x, jogador.position.y);
    bala.rotateToDirection = true;
    bala.velocity.x = cos(a) * speedBala;
    bala.velocity.y = sin(a) * speedBala;
    bala.addAnimation("bala", bala_anim);
    bala.changeAnimation("bala");
    bala.scale = 0.3;
    bala.life = 50;
    balas.add(bala);
    shooting = true;
    if (running) {
      jogador.changeAnimation("walkAtirando");
    } else if (parado) {
      jogador.changeAnimation("normalShot");
    }
    setTimeout(() => {
      shooting = false;
    }, 350);
    tirosDisponivel--;
    contTiros++;
  }
}
function mouseMoved() {
  if (jogador !== undefined) {
    let a = degrees(getAnguloDeDisparo(jogador.position.x, jogador.position.y));
    if (a >= -89 && a <= 89) {
      jogador.mirrorX(1);
    } else {
      jogador.mirrorX(-1);
    }
  }
}
function calcWave() {
  theta += 0.02;
  let x1 = theta;
  let x2 = theta;
  for (let i = 0; i < yvaluesE.length; i++) {
    yvaluesE[i] = sin(x1) * amplitude;
    x1 += dxE;
  }
  for (let i = 0; i < yvaluesD.length; i++) {
    yvaluesD[i] = sin(-x2) * amplitude;
    x2 += dxD;
  }
}
function inimigosEsquerdaSpeedWave(speed) {
  for (x = 0; x < inimigosEsquerda.length; x++) {
    for (i = 0; i < yvaluesE.length; i++) {
      inimigosEsquerda.get(x).setSpeed(speed, yvaluesE[i] / 2);
    }
  }
}
function inimigosDireitaSpeedWave(speed) {
  for (x = 0; x < inimigosDireita.length; x++) {
    for (i = 0; i < yvaluesD.length; i++) {
      inimigosDireita.get(x).setSpeed(speed, yvaluesD[i] / 2);
      inimigosDireita.get(x).velocity.x = -speed;
    }
  }
}
