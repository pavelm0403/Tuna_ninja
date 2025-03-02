// Sword
function Sword(color) {
  this.swipes = [];
  this.color = color;
}

Sword.prototype.draw = function () {
  var l = this.swipes.length;
  for (var i = 0; i < this.swipes.length; i++) {
    var size = map(i, 0, this.swipes.length, 2, 27);
    noStroke();
    fill(this.color);
    ellipse(this.swipes[i].x, this.swipes[i].y, size);
  }
  if (l < 1) {
    return;
  }
  fill(255);
  textSize(20);
};

Sword.prototype.update = function () {
  if (this.swipes.length > 20) {
    this.swipes.splice(0, 1);
    this.swipes.splice(0, 1);
  }
  if (this.swipes.length > 0) {
    this.swipes.splice(0, 1);
  }
};

Sword.prototype.checkSlice = function (sushi) {
  if (sushi.sliced || this.swipes.length < 2) {
    return false;
  }
  var length = this.swipes.length;
  var stroke1 = this.swipes[length - 1];
  var stroke2 = this.swipes[length - 2];
  var d1 = dist(stroke1.x, stroke1.y, sushi.x, sushi.y);
  var d2 = dist(stroke2.x, stroke2.y, sushi.x, sushi.y);
  var d3 = dist(stroke1.x, stroke1.y, stroke2.x, stroke2.y);
  var sliced = d1 < sushi.size || (d1 < d3 && d2 < d3 && d3 < width / 4);
  sushi.sliced = sliced;
  return sliced;
};

// Стиоль меча катаны

Sword.prototype.draw = function () {
  noFill();

  for (var i = 1; i < this.swipes.length; i++) {
    var p1 = this.swipes[i - 1];
    var p2 = this.swipes[i];

    // Основная линия катаны
    strokeWeight(10);
    stroke(200, 200, 200); // Металлический серый цвет
    line(p1.x, p1.y, p2.x, p2.y);

    // Блик на лезвии катаны
    strokeWeight(4);
    stroke(255, 255, 255, 150); // Полупрозрачный белый
    var offsetX = (p2.y - p1.y) * 0.1; // Смещение для блика
    var offsetY = (p1.x - p2.x) * 0.1;
    line(p1.x + offsetX, p1.y + offsetY, p2.x + offsetX, p2.y + offsetY);

    // Эффект заточки (лёгкая тень на другой стороне)
    strokeWeight(6);
    stroke(100, 100, 100, 100); // Полупрозрачный тёмный оттенок
    line(p1.x - offsetX, p1.y - offsetY, p2.x - offsetX, p2.y - offsetY);
  }
};

Sword.prototype.swipe = function (x, y) {
  this.swipes.push(createVector(x, y));
};
