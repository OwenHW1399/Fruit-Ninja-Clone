class knifeTrace {
  circleArray = [];
  constructor(radius = 10, transparency = 24, thisColor = color(100, 100, 100)) {
    this.radius = radius;
    this.transparency = transparency;
    this.thisColor = thisColor;
  }
  draw() {
    for (let traceCircle of this.circleArray) {
      fill(this.thisColor.r, this.thisColor.g, this.thisColor.b, this.transparency);
      ellipse(traceCircle[0], traceCircle[1], this.radius, this.radius);
    }
  }

  addTracing(x, y) {
    if (this.circleArray.length >= 10) {
      this.circleArray.pop();
    }
    this.circleArray.unshift([x, y]);
  }
}
class fruit {
  kind; // 0: apple, 1:pear, 2:grapes, 3:watermelon
  constructor(x, y, kind, xSpeed, ySpeed, side = 50) {
    this.kind = kind;
    this.x = x;
    this.y = y;
    this.side = side;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
  }
  draw() {
    if (this.y <= fruitSide && this.ySpeed < 0) {
      this.ySpeed = (-1) * this.ySpeed;
    }
    this.ySpeed = this.ySpeed + gravityConstant / frameRate();
    this.y += this.ySpeed
    this.x += this.xSpeed
    image(imageArray[this.kind], this.x, this.y, this.side, this.side);
  }
  touchedByknife(x, y) {
    if (x > this.x && x < this.x + this.side && y > this.y && y < this.y + this.side) {
      return true
    }
    else {
      return false;
    }
  }
}

let gravityConstant;
let imageArray = [];
let fruitObjectArray = [];
let tempfruitObjectArray = [];
let canvasWidth = 600;
let canvasHeight = 400;
let fruitSide = 50;  // the side length of every Image object icon (which is a rectangle object in p5.js)
let level = 0;
let fruitNumLimit = 3;
let gameOn = false; // A boolean value that indicates whether the game is ongoing or not.
let gameOver = false; // A boolean value that indicates whether the game is lost or not.
let hp, score;
let HPMAX = 30;
let sliceSound;
function preload() {
  imageArray.push(loadImage('../images/apple.png'));      // index: 0
  imageArray.push(loadImage('../images/banana.png'));     // index: 1
  imageArray.push(loadImage('../images/cherries.png'));   // index: 2
  imageArray.push(loadImage('../images/grapes.png'));     // index: 3
  imageArray.push(loadImage('../images/mango.png'));      // index: 4
  imageArray.push(loadImage('../images/orange.png'));     // index: 5
  imageArray.push(loadImage('../images/peach.png'));      // index: 6
  imageArray.push(loadImage('../images/pear.png'));       // index: 7
  imageArray.push(loadImage('../images/watermelon.png')); // index: 8
}
function setup() {
  //use jquery to register click event for the button 
  $("#startResetButton").click(function () {
    hp = HPMAX;
    score = 0;
    fruitObjectArray = [];
    tempfruitObjectArray = [];
    gameOn = !gameOn;
    if (gameOver) {
      gameOn = false;
      gameOver = false;
      $(this).text("Start Game");
    }
    else if (gameOn) {
      $(this).text("Restart Game");
    }
    else {
      $(this).text("Start Game");
    }
  })
  //see here: https://p5js.org/examples/sound-sound-effect.html
  soundFormats('mp3', 'ogg');
  sliceSound = loadSound('../audio/sliceFruit.mp3');
  let mainGameSection = createCanvas(canvasWidth, canvasHeight);
  mainGameSection.parent('GameSection');
  hp = HPMAX;
  score = 0;
  fruitObjectArray = [];
  tempfruitObjectArray = [];
  gravityConstant = 9.8 * 0.25;
  knife = new knifeTrace();
}
function draw() {
  background(164, 116, 73);  // Apparently this is the color of wood brown, according to the internet...
  if (gameOn && !gameOver) {
    console.log(fruitObjectArray);
    generateFruitsWrapper();
    canvasUpdate();
  }
  if (hp <= 0) {
    gameOver = true;
  }
  $("#hpBar").text(`HP: ${hp}`);
  $('#scoreBar').text(`Score: ${score}`);
  if (gameOver) {
    gameOverFunc();
  }
}

function gameOverFunc() {
  textSize(32);
  text('Game Over!', 250, 200);
  text(`Score: ${score}`, 250, 250);
  $("#startResetButton").text("Try Again");
}
function generateFruitsWrapper() {
  if (score <= 0) {
    score = 0; // This gating is unnecessary actually

    // Gating to only allow up to fruitNumLimit fruit in a frame at once.
    if (fruitObjectArray.length < fruitNumLimit) {
      generateFruits(1);
    }
  }
  else {
    let ideaNumber = (score + 3 < fruitNumLimit) ? (score + 3) : fruitNumLimit;
    if (fruitObjectArray.length < fruitNumLimit) {
      let actualNumber = 0;
      if (fruitObjectArray.length < ideaNumber) {
        actualNumber = ideaNumber - fruitObjectArray.length;
      }
      generateFruits(actualNumber);
    }
  }
}
function generateFruits(num) {
  for (let i = 0; i < num; i++) {
    if (frameRate()) {
      let xPos, yPos, kind, xVel, yVel;

      kind = Math.round(Math.random() * 8);

      // if sideOrBottom is -1, the new fruit got thrown from the side (left or right) of the canvas frame, 
      // else the new fruit always get thrown from the bottom of the frame.
      let sideOrBottom = Math.random() < 0.5 ? -1 : 1; //Nice trick: https://stackoverflow.com/a/8611855

      if (sideOrBottom == -1) {

        // When the new fruit is thrown from the side, the velocity directions of both x-axis and y-axis are customizable. 
        let directionX = Math.random() < 0.5 ? -1 : 1;
        let directionY = Math.random() < 0.5 ? -1 : 1;
        if (directionX == -1) {
          xPos = canvasWidth - fruitSide;
        }
        else {
          xPos = 0;
        }
        // we use canvasHeight*0.6 as the upper limit of the yPos because we don't the yPos to be near bottom when the new fruit is thrown into the frame from the side.
        yPos = Math.random() * (canvasHeight * 0.6);
        // xVel = ((Math.random() * 10 + 100) / frameRate() * directionX)*gravityConstant/9.8;
        // yVel = ((Math.random()*10 + 100) / frameRate() * directionY)*gravityConstant/9.8;  
        // The initial y-axis velocity is always negative since it always starts by getting thrown upwards from the end of the frame.
        // The setup above turns out to be too difficult to play :( 

        // Easier setup,yVel direction always -1 at the beginning, hence buying more time for the player, also increase x-axis speed 
        // so that the side-thrown can get to the ceneter quicker for player to slice.
        xVel = ((Math.random() * 100 + 500) / frameRate() * directionX) * gravityConstant / 9.8;
        yVel = ((Math.random() * 625 + 500) / frameRate() * -1) * gravityConstant / 9.8;

        fruitObjectArray.push(new fruit(xPos, yPos, kind, xVel, yVel, fruitSide));
      }
      else {
        xPos = Math.random() * (canvasWidth * 0.8) + canvasWidth * 0.1;  // we set the xPos range to (canvasWidth*0.1, canvasWidth*0.9)
        yPos = canvasHeight - fruitSide;
        // if the new fruit is thrown from the bottom of the frame, we always set the xVel to 0 and set yVel's direction to -1 (i.e. upwards).
        xVel = 0;
        yVel = ((Math.random() * 625 + 1000) / frameRate() * (-1)) * gravityConstant / 9.8;
        fruitObjectArray.push(new fruit(xPos, yPos, kind, xVel, yVel, fruitSide));
      }
    }

  }
}
function mouseDragged() {
  knife.addTracing(mouseX, mouseY);
  knife.draw();
  tempfruitObjectArray = [];
  for (let obj of fruitObjectArray) {
    if (obj.touchedByknife(mouseX, mouseY)) {
      score += 1;
      console.log(score);
    }
    else {
      tempfruitObjectArray.push(obj);
    }
  }
  fruitObjectArray = tempfruitObjectArray;
}
function mousePressed() {
  if (mouseX > 0 && mouseY > 0 && mouseX < canvasWidth && mouseY < canvasHeight && !gameOver && gameOn) {
    sliceSound.play()
  }
}
function canvasUpdate() {
  tempfruitObjectArray = [];
  for (let obj of fruitObjectArray) {
    if (obj.x < 0 || obj.y < 0 || obj.x > canvasWidth || obj.y > canvasHeight) {
      hp -= 1;
    }
    else {
      tempfruitObjectArray.push(obj);
    }
  }
  fruitObjectArray = tempfruitObjectArray;
  for (let obj of fruitObjectArray) {
    obj.draw();
  }
}