let px, py, r, degree;
let minWeight = 0;
let maxWeight = 4;
let currWeight;
let spacing = maxWeight + 3;
let goldenRatio;
let iter = 0
let img;
let a = 100;

let pix;
let dotArray = [];
let lens = 80;

let randomindex;
let rindexArray = [];

function preload() {
  img = loadImage("0.png");
}

function setup() {
  noStroke();
  createCanvas(1000, 500);
  background(255);
  goldenRatio = ((sqrt(5) + 1) / 2);
  px = width / 2;
  py = height / 2;
  fill(0);
  push();
  translate(width / 2, height / 2);
  for (let i = 0; i < 3500; i++) { // for more speed
    let count;
    let chance = random(1);
    degree = (iter * goldenRatio) * 360;
    r = sqrt(iter++) * spacing;
    calcPointPos(width / 2, height / 2, r, (degree % 360));
    if (px < width && py < height && px > 0 && py > 0) {
      pix = img.get(int(px-250), int(py));
      currWeight = map(brightness(pix), 150, 0, minWeight, maxWeight);
      //  fill(map(currWeight, minWeight, maxWeight, 150, 0)); // stroke(pix);
      if (currWeight > 1.4) { // inside mouth
        dotArray.push(new Dot(px, py, currWeight, 0));
      }
    }
  }
  pop();
  for (let i = 0; i < 19; i++) {
    let rr = random(1);
    let rx;
    let ry = random(50, 450);
    if (rr < 0.5) {
      rx = random(0, (width / 2) - 200);
    } else {
      rx = random((width / 2) + 200, width);
    }
    dotArray.push(new Dot(rx, ry, currWeight, 1));
  }
  getrindexArray();
}

function draw() {
  background(255);
  for (let i = 0; i < dotArray.length; i++) {
    dotArray[i].calcMouse();
    dotArray[i].display();
  }
  for (let i = dotArray.length - 19; i < dotArray.length; i++) {
    for (let j = 0; j < rindexArray.length; j++) {
      dotArray[i].connect(dotArray[rindexArray[j]]);
    }
  }
}

function calcPointPos(x, y, r, graden) {
  px = x + cos(radians(graden)) * (r / 2);
  py = y + sin(radians(graden)) * (r / 2);
}

function Dot(x, y, weight, insidemouth, other) {
  this.insidemouth = insidemouth;
  this.px = x;
  this.py = y;
  this.weight = weight;
  this.addsize = 0;
  this.clickable;
  this.clicked;
  this.display = function() {
    noStroke();
    if (this.insidemouth === 0) {
      fill(50);
      ellipse(this.px, this.py, this.weight + this.addsize, this.weight + this.addsize);
    } else if (this.insidemouth === 1) {
      if (this.clicked) {
        fill(0, 100, 255);
        ellipse(this.px, this.py, 40, 40);
      } else {
        let r = random(255);
        let g = random(255);
        let b = random(255);
        fill(int(r), int(g), int(b));
        ellipse(this.px, this.py, 10 + (this.addsize * 4), 10 + (this.addsize * 4));
      }
    }
  };
  this.calcMouse = function() {
    this.distance = dist(mouseX, mouseY, this.px, this.py);
    if (this.distance < lens) {
      this.addsize = map(this.distance, 0, 80, 5, 0);
      if (this.distance < 10) {
        this.clickable = true;
      } else {
        this.clickable = false;
      }
    } else {
      this.addsize = 0;
    }
  };
  this.activate = function() {
    if (this.clickable) {
      this.clicked = true;
    } else {
      this.clicked = false;
    }
  };
  this.connect = function(other) {
    if (this.clicked) {
      stroke(0, 100, 255, 50);
      strokeWeight(1);
      line(this.px, this.py, other.px, other.py);
      noStroke();
    }
  };
}


function mousePressed() {
  getrindexArray();
  for (let i = dotArray.length - 19; i < dotArray.length; i++) {
    dotArray[i].activate();
  }
}

function getrindexArray() {
  for (let i = 0; i < 5; i++) {
    rindexArray.push(int(random(dotArray.length - 19, dotArray.length)));
  }
}
