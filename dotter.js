let px, py, r, degree, currWeight, pix, goldenRatio;
let minWeight = 0;
let maxWeight = 4;
let spacing = maxWeight + 3;
let iter = 0


let dotArray = [];
let lens = 80; // distance

function preload() { // load images
  img = loadImage("data/0.jpg");
  img1 = loadImage("data/1.jpg");
  img2 = loadImage("data/2.jpg");
  img3 = loadImage("data/3.jpg");
  bg = loadImage("data/bg.jpg");
  font = loadFont("data/RobotoMono-Bold.ttf");
  json = loadJSON("data/laboratorio.json");
  imgdots0 = loadJSON("data/typewriter.json");
  imgdots1 = loadJSON("data/mouth.json");
  imgdots2 = loadJSON("data/tree.json");
  imgdots3 = loadJSON("data/carbon.json");
}

function setup() { // create all the objects and oscillators //families: 1=dot 2=elementartist 3=elementinterviews 4=elementvideos 5= elementscans
  noStroke();
  createCanvas(1000,1000); //windowHeight, windowHeight
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
    if (px < (width / 2) + 100 && py < (height / 2) + 200 && px > (width / 2) - 100 && py > (height / 2) - 200) { // cutting off time by not checking outside of mouth
      pix = img.get(int(px - (width / 2) + 250), int(py - (width / 2) + 250)); // fixed 250, variable dimensions center of 0.png
      currWeight = map(brightness(pix), 150, 0, minWeight, maxWeight);
      if (currWeight > 1.4) { // inside mouth
        dotArray.push(new Dot(px, py, currWeight, 0, []));
        tdotArray.push(new tempDot(px, py, currWeight));
      }
    }
  }
  for (let i = 0; i < dotArray.length; i++) { // asigning id for each dot
    dotArray[i].id = i;
  }
  pop();

  //dotArray.sort((a, b) => a.weight - b.weight); // sorting dotArray by weight
}

function draw() {
  background(255);
  noStroke();
  for (let i = 0; i < dotArray.length; i++) { // display dotArray (interactive mouth)
    dotArray[i].calcMouse();
    dotArray[i].displaydot();
  }
}

let tdotArray = [];
let sexyjson;

function updatedotArray(imgjson) {
  for (i = 0; i < dotArray.length; i++) {
    dotArray[i].location.x = imgjson[i].x;
    dotArray[i].location.y = imgjson[i].y;
    dotArray[i].weight = imgjson[i].weight;
  }
}

function createdotArray(image) { //sort for brightess then assign dots
  let weightmap;
  // let pixel = [];
  iter = 0;
  //goldenRatio = ((sqrt(5) + 1) / 2);
  px = width / 2;
  py = height / 2;
  push();
  translate(width / 2, height / 2);
  for (let i = 0; i < 1676; i++) { // creating mouth dots
    let count;
    let chance = random(1);
    degree = (iter * goldenRatio) * 360;
    r = sqrt(iter++) * spacing;
    calcPointPos(width / 2, height / 2, r, (degree % 360));
    if (px < width && py < height && px > 0 && py > 0) {
      pix = brightness(image.get(int(px - (width / 2) + 250), int(py - (width / 2) + 250)));
      weightmap = map(pix, 80, 0, minWeight, maxWeight);
      tdotArray[i] = new tempDot(px, py, weightmap);
    }
  }
  pop();
  sexyjson = JSON.stringify(tdotArray);
}

function tempDot(x, y, weight) {
  this.x = x;
  this.y = y;
  this.weight = weight;
}

function calcPointPos(x, y, r, graden) {
  px = x + cos(radians(graden)) * (r / 2);
  py = y + sin(radians(graden)) * (r / 2);
}

function Dot(x, y, weight, family, tags, id, name) { //recieve pos, weight, family and tags
  this.name = name;
  this.tags = tags;
  this.family = family;
  this.location = createVector(x, y);
  this.weight = weight;
  this.addsize = 0;
  this.clickable;
  this.active;
  this.rotation = random(-2, 1);
  this.id = id;
  this.velocity = createVector(0, 0);
  this.acceleration = createVector(random(0, 3), random(0, 3));
  this.dotBrothers = [];

  this.repel = function(savedframe) {
    if (frameCount < savedframe + 50) {}
  }
  this.drag = function() {
    if (this.active) {
      this.location.x = mouseX;
      this.location.y = mouseY;
    }
  }
  this.explode = function() {
    if (this.acceleration > 0) {
      this.acceleration -= 0.1;
      this.velocity.add(this.acceleration);
    }
    //if (frameCount > 100) {
    this.velocity.x += random(-0.05, 0.05);
    this.velocity.y += random(-0.05, 0.05);
    this.velocity.x = this.velocity.x * 0.99;
    this.velocity.y = this.velocity.y * 0.99;
    //}
    this.location.add(this.velocity);
  }
  this.borders = function() {
    if (this.location.x < -10) this.location.x = width + 10;
    if (this.location.y < -10) this.location.y = height + 10;
    if (this.location.x > width + 10) this.location.x = -10;
    if (this.location.y > height + 10) this.location.y = -10;
  }
  this.webforce = function() {
    positionX[this.id] = this.location.x;
    positionY[this.id] = this.location.y;
    for (let particleA = 0; particleA < 4; particleA++) { // more cycles more srength
      let accelerationX = 0,
        accelerationY = 0;

      for (let particleB = 0; particleB < artistArray.length; particleB++) {
        if (this.id != particleB) {
          let distanceX = positionX[particleB] - positionX[this.id];
          let distanceY = positionY[particleB] - positionY[this.id];

          let distance = sqrt(distanceX * distanceX + distanceY * distanceY);
          if (distance < 1) distance = 1;

          let force = (distance - (webforceSize.value())) * mass[particleB] / distance;
          accelerationX += force * distanceX;
          accelerationY += force * distanceY;
        }
      }

      this.velocity.x = this.velocity.x * 0.99 + accelerationX * mass[this.id];
      this.velocity.y = this.velocity.y * 0.99 + accelerationY * mass[this.id];
    }

    this.location.add(this.velocity);
    this.velocity.x += random(-0.1, 0.1);
    this.velocity.y += random(-0.1, 0.1);
  }
  this.displaydot = function() {
    if (this.active) {
      fill(0, 100, 255);
      this.addsize += 5;
      if (this.weight < 0.1) this.addsize += 5; //bigger if dot is 0
    } else {
      fill(100);
    }
    ellipse(this.location.x, this.location.y, this.weight + (this.addsize / 1.5), this.weight + (this.addsize / 1.5));
    this.addsize = 0;
  }
  this.displayartist = function() {
    this.webforce();
    if (this.active) {
      fill(0, 100 + map(this.distance, 0, 150, 100, 0), 255); //changing color based on distance
      ellipse(this.location.x, this.location.y, 40, 40);
      //fill(0);
      // textBox = font.textBounds(textString, this.px, this.py + 30); // LINEAR CENTERED FONT
      // text(textString, this.px - (textBox.w / 2), this.py + 30);
      this.rotation += map(this.distance, 0, 150, 0, 0.01);
      push()
      translate(this.location.x, this.location.y); // center and rotate
      rotate(this.rotation);
      image(nameImg[this.id], -textballradius, -textballradius); //draw at the right pos
      //image(nameImg[this.id], int(this.px-textballradius), int(this.py-textballradius));  int for sharp drawing when not rotating
      pop();
      // stroke(0, 50);  // BOX with 1px padding
      // fill(0, 0);
      // rect(this.px - (textBox.w / 2) - 1, textBox.y - 1, textBox.w + 2, textBox.h + 2);
    } else if (this.distance < 40) {
      fill(255, 88, 30);
      ellipse(this.location.x, this.location.y, 10 + (this.addsize * 4), 10 + (this.addsize * 4));
      push()
      translate(this.location.x, this.location.y); // center and rotate
      rotate(this.rotation);
      image(nameImg[this.id], -textballradius, -textballradius);
      pop();
    } else {
      fill(255, 88, 30);
      ellipse(this.location.x, this.location.y, 10 + (this.addsize * 4), 10 + (this.addsize * 4));
    }
    this.addsize = 0;
  }
  this.calcMouse = function() {
    if (mouseX > this.location.x - 150 && mouseX < this.location.x + 150 && mouseY > this.location.y - 150 && mouseY < this.location.y + 150) { //gaining 4-5 fps
      this.distance = dist(mouseX, mouseY, this.location.x, this.location.y); // calc distance betwwen mouse and this pos
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
  this.activate = function() { // Ocurrs only on mousepressed
    this.active = !this.active; // invert active state
    lastElmt = this; // deposit in last element bucket
    if (this.active) {
      this.waveAnimation();
      activeArtists.push(this.id);
    } else {
      activeArtists.splice(activeArtists.findIndex(id => id === this.id)); // remove this id from activeArtists array
    }
  };
  this.isConnected = function({
    tags
  }, min) { // this works!! checks if connected with other dot
    let sharedTags = [];
    for (const tag of tags) {
      if (this.tags.includes(tag)) sharedTags.push(tag);
    }
    if (sharedTags.length >= min) return true;
    return false;
  }
  this.waveAnimation = function() { // defines repelAngle
    repelAngle = calcAnglefromCenter(this.location);
    //console.log(repelAngle);
  }
}

function keyPressed() {
  if (keyCode === 90) { //z
    createdotArray(img2);
  }
  if (keyCode === 88) { // x
    updatedotArray(imgdots3);
    //createdotArray(img1);
  }
  if (keyCode === 67) { // x
    updatedotArray(imgdots1);
    //createdotArray(img1);
  }
  if (keyCode === 86) { // x
    updatedotArray(imgdots2);
    //createdotArray(img1);
  }
}


(function(console) {

  console.save = function(data, filename) {

    if (!data) {
      console.error('Console.save: No data')
      return;
    }

    if (!filename) filename = 'console.json'

    if (typeof data === "object") {
      data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {
        type: 'text/json'
      }),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
  }
})(console)
