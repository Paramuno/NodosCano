let px, py, r, degree;
let minWeight = 0;
let maxWeight = 3.5;
let currWeight;
let spacing = maxWeight + 3;
let goldenRatio;
let iter = 0
let img;
let pix;


let dotArray = [];
let lens = 80;

let rindexArray = [];
let artistArray = [];

let tags = [];

function preload() {
  img = loadImage("0.png");
  bg = loadImage("bg.jpg");
} // load images

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
  for (let i = 0; i < 3500; i++) { // creating mouth dots
    let count;
    let chance = random(1);
    degree = (iter * goldenRatio) * 360;
    r = sqrt(iter++) * spacing;
    calcPointPos(width / 2, height / 2, r, (degree % 360));
    if (px < width && py < height && px > 0 && py > 0) {
      pix = img.get(int(px - 250), int(py));
      currWeight = map(brightness(pix), 150, 0, minWeight, maxWeight);
      //  fill(map(currWeight, minWeight, maxWeight, 150, 0)); // stroke(pix);
      if (currWeight > 1.4) { // inside mouth
        dotArray.push(new Dot(px, py, currWeight, 0));
      }
    }
  }
  pop();

  for (let i = 0; i < 19; i++) { // creating artists dots
    tags[i] = [];
    for (let j = 0; j < 10; j++) { // intialize nested tags array of 10
      let stringval = int(random(50));
      tags[i][j] = stringval.toString(); //choose randomly from 50 tags
    }
    let rr = random(1);
    let rx;
    let ry = random(30, height - 30);
    if (rr < 0.5) {
      rx = random(30, (width / 2) - 200);
    } else {
      rx = random((width / 2) + 200, width - 30);
    }
    // let artist = new Dot(rx, ry, currWeight, 1, tags[i]); // make a variable for artists
    // artistArray.push(artist);
    artistArray.push(new Dot(rx, ry, currWeight, 1, tags[i]));
  }
  getrindexArray();
} // create all the objects //families: 1=dot 2=artists 3=interviews 4=videos 5= scans

function draw() {
  image(bg, 0, 0);
  for (let i = 0; i < dotArray.length; i++) { // display dotArray (interactive mouth)
    dotArray[i].calcMouse();
    dotArray[i].display();
  }
  for (let i = 0; i < artistArray.length; i++) { // display artistArray (tag holders)
    //drawLink(artistArray[i], artistArray[i % rindexArray.length]);
    drawLink(artistArray[i], dotArray[int(random(0, dotArray.length))]);
    artistArray[i].calcMouse();
    artistArray[i].display();
  }
  connected();
}

function calcPointPos(x, y, r, graden) {
  px = x + cos(radians(graden)) * (r / 2);
  py = y + sin(radians(graden)) * (r / 2);
}

function findLinks(obj1) {

}

function connected() {
  for (let artist of artistArray) {
    let conectado = false;
    for (let other of artistArray) {
      if (artist !== other && artist.isConnected(other)) {
        conectado = true;
      }
      if (conectado) {
        line(artist.px, artist.py, other.px, other.py);
      }
    }
  }
}

function drawLink(obj1, obj2) { // first object is the active objext
  if (obj1.active) {
    if (obj2.family == 0) {
      stroke(255, 100, 0);
      line(obj1.px, obj1.py, obj2.px, obj2.py);
    } else if (obj2.family == 1) {
      stroke(0, 100, 255, 100);
      line(obj1.px, obj1.py, obj2.px, obj2.py);
    }
  }
}

function Dot(x, y, weight, family, tags = []) { //recieve pos, weight, family and tags
  this.tags = tags;
  this.family = family;
  this.px = x;
  this.py = y;
  this.weight = weight;
  this.addsize = 0;
  this.clickable;
  this.active;
  this.display = function() {
    noStroke();
    if (this.family === 0) {
      fill(50);
      ellipse(this.px, this.py, this.weight + (this.addsize / 1.5), this.weight + (this.addsize / 1.5));
    } else if (this.family === 1) {
      if (this.active) {
        fill(0, 100, 255);
        ellipse(this.px, this.py, 40, 40);
      } else {
        // let r = random(255);
        // let g = random(255);
        // let b = random(255);
        // fill(int(r), int(g), int(b));
        fill(255, 100, 0);
        ellipse(this.px, this.py, 10 + (this.addsize * 4), 10 + (this.addsize * 4));
      }
    }
  };
  this.calcMouse = function() {
    this.distance = dist(mouseX, mouseY, this.px, this.py); // calc distance betwwen mouse and this pos
    if (this.distance < lens) {

      this.addsize = map(this.distance, 0, 80, 5, 0); // create an aggregator that depends on distance
      if (this.active && this.distance < 25) { // make it clickable depending on the size of the circle
        this.clickable = true;
      } else if (!this.active && this.distance < 15) {
        this.clickable = true;
      } else {
        this.clickable = false;
      }

    } else {
      this.addsize = 0;
      this.clickable = false;
    }
  };
  this.activate = function() {
    if (this.clickable) {
      this.active = !this.active; // invert active state
    }
    // if (this.clickable) { // active state depends on clickable
    //   this.active = true;
    // } else {
    //   this.active = false;
    // }
  };
  this.isConnected = function( {tags}) {
  for (const tag of tags)  if (this.tags.includes(tag))  return true;
  return false;
}
}


function mousePressed() {
  getrindexArray();
  for (let i = 0; i < artistArray.length; i++) {
    artistArray[i].activate();
  }
}

function getrindexArray() { // function to get a random index from artistArray length
  for (let i = 0; i < 5; i++) {
    rindexArray.push(int(random(0, artistArray.length)));
  }
}
