let px, py, r, degree;
let minWeight = 0;
let maxWeight = 4;
let currWeight;
let spacing = maxWeight + 4;
let goldenRatio;
let iter = 0
let img;
let a=100;

let pix;
let dotArray = [];

function preload() {
  img = loadImage("data/0.png");
}
function setup() {
  noStroke();
  createCanvas(500, 500);
  background(255);
  goldenRatio = ((sqrt(5) + 1) / 2);
  px = width / 2;
  py = height / 2;

  for (let i = 0; i < 2500; i++) { // for more speed
    degree = (iter * goldenRatio) * 360;
    r = sqrt(iter++) * spacing;
    calcPointPos(width / 2, height / 2, r, (degree % 360));
    pix = img.get(int(px), int(py));
    currWeight = map(brightness(pix), 150, 0, minWeight, maxWeight);
    //fill(map(currWeight, minWeight, maxWeight, 150, 0)); // stroke(pix);
    dotArray.push(new Dot(px, py,currWeight,currWeight));
    //ellipse(px, py,currWeight,currWeight);
  }
}

function draw() {
  for (let i =0;i<dotArray.length;i++){
    dotArray[i].display();
  }
}
function calcPointPos(x, y, r, graden) {
  px = x + cos(radians(graden)) * (r / 2);
  py = y + sin(radians(graden)) * (r / 2);
}

function Dot(px,py,weight) {
    this.px = px;
    this.py = py;
    this.weight = weight;
    this.degree;
    this.pix;
  this.display=function() {
    ellipse(this.px, this.py,this.weight,this.weight);
    // while (px - 40 > 0) {
    // for (let i = 0; i < 12; i++) { // for more speed
    //   this.degree = (iter * goldenRatio) * 360;
    //   r = sqrt(iter++) * spacing;
    //   this.calcPointPos(width / 2, height / 2, r, (this.degree % 360));
    //   this.pix = img.get(int(px), int(py));
    //   currWeight = map(brightness(this.pix), 255, 0, minWeight, maxWeight);
    //   fill(map(currWeight, minWeight, maxWeight, 100, 0)); // stroke(pix);
    //   ellipse(px, py,currWeight,currWeight);
    // }
      // if (px - 40 <= 0 || px + 40 >= width || py - 40 <= 0 || py + 40 >= height) {
      //   noLoop();
      // }
  };
}
