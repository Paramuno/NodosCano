let px, py, r, degree;
let minWeight = 0;
let maxWeight = 3.5;
let currWeight;
let spacing = maxWeight + 3;
let goldenRatio;
let iter = 0
//let img;
let pix;


let dotArray = [];
let lens = 80;

let rindexArray = [];
let artistArray = [];

let tags = [];
let labels = [];
let names = []; // image of text name
let t = []; // text name

let textString = 'nombre proyecto';
let textBox;

function preload() {
  img = loadImage("data/0.png");
  bg = loadImage("data/bg.jpg");
  font = loadFont("data/RobotoMono-Bold.ttf");
} // load images

function setup() {
  noStroke();
  createCanvas(1000, 500);
  background(255);
  textFont(font);
  textSize(12);
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
    if (px < width - 400 && py < height - 50 && px > 400 && py > 50) { // cutting off time by not checking outside square
      pix = img.get(int(px - 250), int(py));
      currWeight = map(brightness(pix), 150, 0, minWeight, maxWeight);
      //  fill(map(currWeight, minWeight, maxWeight, 150, 0)); // stroke(pix);
      if (currWeight > 1.4) { // inside mouth
        labels[i] = []; // holding only 1 tag
        let stringval = int(random(3000));
        labels[i][0] = stringval.toString(); //choose randomly from 3000 tags
        dotArray.push(new Dot(px, py, currWeight, 0, labels[i]));
      }
    }
  }
  pop();

  for (let i = 0; i < 19; i++) { // creating artist dots
    tags[i] = [];
    for (let j = 0; j < 5; j++) { // intialize nested tags array of 10
      let stringval = int(random(100));
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
    artistArray.push(new Dot(rx, ry, currWeight, 1, tags[i], i));
    //names[i] = createGraphics(60,60);
    t[i] = new wrappedText(textString, 35, 35, 25);
    //names[i].background(0);
    //  names[i].t[i].display(-1.5);
    names[i] = t[i].toImage(70, -1.5);
  }
  getrindexArray();
} // create all the objects //families: 1=dot 2=artist 3=interviews 4=videos 5= scans

function draw() {
  image(bg, 0, 0);
  for (let i = 0; i < dotArray.length; i++) { // display dotArray (interactive mouth)
    dotArray[i].calcMouse();
    dotArray[i].display();
  }
  for (let i = 0; i < artistArray.length; i++) { // display artistArray (tag holders)
    for (let j = 0; j < artistArray.length; j++) {
      drawLink(artistArray[i], artistArray[j]); // drawinglinks for all linked artist
    }
    //drawLink(artistArray[i], dotArray[int(random(0, dotArray.length))]); // drawing links for all linked tags
    for (let k = 0; k < dotArray.length; k++) {
      drawLink(artistArray[i], dotArray[k]); // drawingLinks for all linked dots
    }
    artistArray[i].calcMouse();
    artistArray[i].display();
  }
}

function calcPointPos(x, y, r, graden) {
  px = x + cos(radians(graden)) * (r / 2);
  py = y + sin(radians(graden)) * (r / 2);
}

function drawLink(obj1, obj2) { // first object is the active object
  if (obj1.active) {
    if (obj2.family == 0 && obj1.isConnected(obj2)) {
      stroke(255, 100, 0, 75);
      line(obj1.px, obj1.py, obj2.px, obj2.py);
      fill(255, 0, 0);
      ellipse(obj2.px, obj2.py, obj2.weight + (this.addsize / 1.5), obj2.weight + (this.addsize / 1.5));
    } else if (obj2.family == 1 && obj1.isConnected(obj2)) {
      stroke(0, 100, 255, 75);
      line(obj1.px, obj1.py, obj2.px, obj2.py);
    }
  }
}

function Dot(x, y, weight, family, tags, id) { //recieve pos, weight, family and tags
  this.tags = tags;
  this.family = family;
  this.px = x;
  this.py = y;
  this.weight = weight;
  this.addsize = 0;
  this.clickable;
  this.active;
  this.rotation = random(-2, 1);
  this.id = id;
  this.display = function() {
    noStroke();
    if (this.family === 0) {
      fill(50);
      ellipse(this.px, this.py, this.weight + (this.addsize / 1.5), this.weight + (this.addsize / 1.5));
    } else if (this.family === 1) {
      if (this.active) {
        fill(0, 100 + map(this.distance, 0, 150, 100, 0), 255); //changing color based on distance
        ellipse(this.px, this.py, 40, 40);
        fill(0);

        // textBox = font.textBounds(textString, this.px, this.py + 30); // LINEAR CENTERED FONT
        // text(textString, this.px - (textBox.w / 2), this.py + 30);
        this.rotation += map(this.distance, 0, 150, 0, 0.01);
        image(names[this.id], this.px - 35, this.py - 35);
        // stroke(0, 50);  // BOX with 1px padding
        // fill(0, 0);
        // rect(this.px - (textBox.w / 2) - 1, textBox.y - 1, textBox.w + 2, textBox.h + 2);
      } else {
        fill(255, 180, 150);
        ellipse(this.px, this.py, 10 + (this.addsize * 4), 10 + (this.addsize * 4));
      }
    }
    this.addsize = 0;
  };
  this.calcMouse = function() {
    if (mouseX > this.px - 150 && mouseX < this.px + 150 && mouseY > this.py - 150 && mouseY < this.py + 150) { //gaining 4-5 fps
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
  this.isConnected = function({
    tags
  }) { // this works!! checks if connected with other dot
    for (const tag of tags)
      if (this.tags.includes(tag)) return true;
    return false;
  }
}

function wrappedText(string, x, y, radius) {
  this.spacing = radians(15);
  this.string = string
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.toImage = function(size, rotation) {
    this.image = createGraphics(size, size);
    this.image.textFont(font);
    this.image.textSize(12);
    this.image.push();
    this.image.translate(this.x, this.y);
    this.image.rotate(rotation);
    for (let i = 0; i < this.string.length; i++) {
      this.image.push();
      this.image.translate(-this.radius, 0);
      this.image.rotate(-HALF_PI);
      this.image.text(this.string.charAt(i), 0, 0);
      this.image.pop();
      this.image.rotate(this.spacing);
    }
    this.image.pop();
    return this.image;
  };
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
