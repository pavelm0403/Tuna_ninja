var cnv;
var score,
  points = 0;
var lives,
  x = 0;
var isPlay = false;
var gravity = 0.1;
var sword;
var sushi = [];
var sushiList = ["calif", "fila", "frett", "sushi", "oth", "boom"];
var sushiImgs = [],
  slicedsushiImgs = [];
var livesImgs = [],
  livesImgs2 = [];
var boom, spliced, missed, over, start; // музыка
// var button, startButton;
// var timer;
// var counter = 60;
// var seconds, minutes;
// var timerValue = 60;

function preload() {
  // Подгрузка музыки
  boom = loadSound("sounds/boom.mp3");
  spliced = loadSound("sounds/splatter.mp3");
  missed = loadSound("sounds/missed.mp3");
  start = loadSound("sounds/start.mp3");
  over = loadSound("sounds/over.mp3");

  // Подгрузка изображений
  for (var i = 0; i < sushiList.length - 1; i++) {
    slicedsushiImgs[2 * i] = loadImage("images/" + sushiList[i] + "-1.png");
    slicedsushiImgs[2 * i + 1] = loadImage("images/" + sushiList[i] + "-2.png");
  }
  for (var i = 0; i < sushiList.length; i++) {
    sushiImgs[i] = loadImage("images/" + sushiList[i] + ".png");
  }
  for (var i = 0; i < 3; i++) {
    livesImgs[i] = loadImage("images/x" + (i + 1) + ".png");
  }
  for (var i = 0; i < 3; i++) {
    livesImgs2[i] = loadImage("images/xx" + (i + 1) + ".png");
  }
  bg = loadImage("images/background.jpg");
  foregroundImg = loadImage("images/home-mask.png");
  rollLogo = loadImage("images/tunec.png");
  ninjaLogo = loadImage("images/ninja.png");
  scoreImg = loadImage("images/score.png");
  newGameImg = loadImage("images/new-game.png");
  rollImg = loadImage("images/rollMode.png");
  gameOverImg = loadImage("images/game-over.png");
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  sword = new Sword(color("#FFFFFF"));
  frameRate(60);
  score = 0;
  lives = 3;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  clear();
  background(bg);

  if (isPlay) {
    game();
  } else {
    // Отображение стартового экрана
    image(this.foregroundImg, 0, 0, width, height * 0.55);
    image(this.rollLogo, width * 0.05, height * 0.03, width * 0.45, height * 0.3);
    image(this.ninjaLogo, width * 0.45, height * 0.15, width * 0.5, height * 0.3);
    image(this.newGameImg, width * 0.3, height * 0.5, width * 0.25, height * 0.3);
    image(this.rollImg, width * 0.45, height * 0.65, width * 0.25, height * 0.3);
  }

  if (touches.length > 0) {
    sword.swipe(touches[0].x, touches[0].y);
  }
}

function touchStarted() {
  // Проверка начала игры при касании экрана
  if (!isPlay && touches.length > 0) {
    let touch = touches[0];
    if (touch.x > width * 0.4 && touch.x < width * 0.65 && touch.y > height * 0.55 && touch.y < height * 0.85) {
      start.play();
      isPlay = true;
    }
  }
}

function game() {
  clear();
  background(bg);
  if (mouseIsPressed) {
    // Draw sword
    sword.swipe(mouseX, mouseY);
  }
  if (frameCount % 5 === 0) {
    if (noise(frameCount) > 0.69) {
      sushi.push(randomSushi());
    }
  }
  points = 0;
  for (var i = sushi.length - 1; i >= 0; i--) {
    sushi[i].update();
    sushi[i].draw();
    if (!sushi[i].visible) {
      if (!sushi[i].sliced && sushi[i].name != "boom") {
        image(this.livesImgs2[0], sushi[i].x, sushi[i].y - 120, 50, 50);
        missed.play();
        lives--;
        x++;
      }
      if (lives < 1) {
        // Check for lives
        gameOver();
      }
      sushi.splice(i, 1);
    } else {
      if (sushi[i].sliced && sushi[i].name == "boom") {
        boom.play();
        gameOver();
      }
      if (sword.checkSlice(sushi[i]) && sushi[i].name != "boom") {
        spliced.play();
        points++;
        sushi[i].update();
        sushi[i].draw();
      }
    }
  }
  if (frameCount % 2 === 0) {
    sword.update();
  }
  sword.draw();
  score += points;
  drawScore();
  drawLives();
}

function drawLives() {
  image(
    this.livesImgs[0],
    width - 110,
    20,
    livesImgs[0].width,
    livesImgs[0].height
  );
  image(
    this.livesImgs[1],
    width - 88,
    20,
    livesImgs[1].width,
    livesImgs[1].height
  );
  image(
    this.livesImgs[2],
    width - 60,
    20,
    livesImgs[2].width,
    livesImgs[2].height
  );
  if (lives <= 2) {
    image(
      this.livesImgs2[0],
      width - 110,
      20,
      livesImgs2[0].width,
      livesImgs2[0].height
    );
  }
  if (lives <= 1) {
    image(
      this.livesImgs2[1],
      width - 88,
      20,
      livesImgs2[1].width,
      livesImgs2[1].height
    );
  }
  if (lives === 0) {
    image(
      this.livesImgs2[2],
      width - 60,
      20,
      livesImgs2[2].width,
      livesImgs2[2].height
    );
  }
}

function drawScore() {
  image(this.scoreImg, 10, 10, 40 * (width / 800), 40 * (height / 635));
  textAlign(LEFT);
  noStroke();
  fill(255, 147, 21);
  textSize(50 * (width / 800));
  text(score, 50, 50);
}


function gameOver() {
  noLoop();
  over.play();
  clear();
  background(bg);
  image(this.gameOverImg, width * 0.2, height * 0.4, width * 0.6, height * 0.15);
  lives = 0;

  // Создаем кнопку "Главное меню" с адаптацией под мобильные устройства
  let resetButton = createButton("Главное меню");
  resetButton.position(width * 0.8, height * 0.55);
  resetButton.class('reset-button');
  resetButton.style('font-size', '24px');
  resetButton.style('padding', '10px 20px');
  resetButton.mousePressed(resetGame);
}

function resetGame() {
  // Сбросить очки, жизни и состояние игры
  score = 0;
  lives = 3;
  sushi = [];
  isPlay = false;
  loop(); // Перезапустить draw()

  // Удаляем кнопку после нажатия
  this.remove();
}

// timer = createP("timer");
// setInterval(timeIt, 1000);

// textAlign(CENTER);
// setInterval(timeIt, 1000);

//   if (timerValue == 0) {
//     text('game over', width / 2, height / 2 + 15);
//   }
// sushi.push(new Sushi(random(width),height,3,"#FF00FF",random()));
// function resetSketch(){
//     clear();
//     background(bg);
//     game();
// }
// function timeIt() {
//     console.log("time");
//     if (timerValue > 0) {
//         console.log(timerValue);
//         timerValue--;
//         textAlign(CENTER);
//         noStroke();
//         fill(255,147,21);
//         textSize(50);
//         text(timerValue, 200, 250);
//     }
//   }
