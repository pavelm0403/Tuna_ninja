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
  cnv = createCanvas(800, 635);
  sword = new Sword(color("#FFFFFF"));
  frameRate(60);
  score = 0;
  lives = 3;
}

function draw() {
  clear();
  background(bg);

  if (isPlay) {
    game();
  } else {
    // Отображение стартового экрана
    image(this.foregroundImg, 0, 0, 800, 350);
    image(this.rollLogo, 40, 20, 358, 195);
    image(this.ninjaLogo, 360, 90, 400, 195);
    image(this.newGameImg, 210, 310, 200, 200);
    image(this.rollImg, 340, 400, 200, 200);

    cnv.mouseClicked(check);
  }
  //     if (timerValue >= 60) {
  //         text("0:" + timerValue, width / 2, height / 2);
  //     }
  //     if (timerValue < 60) {
  //         text('0:0' + timerValue, width / 2, height / 2);
  //     }
}

function check() {
  // Check for game start
  if (!isPlay && mouseX > 300 && mouseX < 520 && mouseY > 350 && mouseY < 550) {
    start.play();
    isPlay = true;
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
  image(this.scoreImg, 10, 10, 40, 40);
  textAlign(LEFT);
  noStroke();
  fill(255, 147, 21);
  textSize(50);
  text(score, 50, 50);
}

function gameOver() {
  noLoop();
  over.play();
  clear();
  background(bg);
  image(this.gameOverImg, 155, 260, 490, 85);
  lives = 0;

  // Создаем кнопку "Перезапустить"
  let resetButton = createButton("Главное меню");
  resetButton.position(650, 350);
  resetButton.class('reset-button');
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
