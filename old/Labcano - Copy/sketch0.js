let px, py, r, degree;
let minWeight = 0.0;
let maxWeight = 3;
let currWeight;
let spacing = maxWeight + 3;
let goldenRatio;
let iter = 0
let img;
let a=100;

function preload() {
  img = loadImage("0.png");
}
function setup() {
  noStroke();
  createCanvas(500, 500);
  background(255);
  dot = new Dot();
  goldenRatio = ((sqrt(5) + 1) / 2);
  px = width / 2;
  py = height / 2;
}

function draw() {
  dot.calcPointPos();
  dot.display();
  a+=0.5
  fill(0);
  //rect(a,a,100,100)
}

class Dot {
  constructor() {
    this.degree;
    this.pix;
    console.log(px,py);
  }
  display() {
    for (let i = 0; i < 12; i++) { // for more speed
      this.degree = (iter * goldenRatio) * 360;
      r = sqrt(iter++) * spacing;
      this.calcPointPos(width / 2, height / 2, r, (this.degree % 360));
      this.pix = img.get(int(px), int(py));
      currWeight = map(brightness(this.pix), 255, 0, minWeight, maxWeight);
      fill(map(currWeight, minWeight, maxWeight, 100, 0)); // stroke(pix);
      ellipse(px, py,currWeight,currWeight);
    }
      if (px - 40 <= 0 || px + 40 >= width || py - 40 <= 0 || py + 40 >= height) {
        noLoop();
      }
  }
  calcPointPos(x, y, r, graden) {
    px = x + cos(radians(graden)) * (r / 2);
    py = y + sin(radians(graden)) * (r / 2);
  }
}
