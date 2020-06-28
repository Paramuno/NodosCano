let px, py, r, degree;
let minWeight = 0;
let maxWeight = 3.5;
let currWeight;
let spacing = maxWeight + 3;
let goldenRatio;
let iter = 0
let pix;

let explode = false;

let chord = []
let root = 30
let major = [4, 5, 6]
let minor = [10, 12, 15]
let n = true; // oscillator type

let dotArray = [];
let lens = 80;
let rindexArray = [];
let artistArray = [];
let lastElmt;

let tags = []; // tags are element to element array
let labels = []; // label are element to dot array
let names = []; // image of text name
let t = []; // text name
let textballradius = 35;

let textString = 'nombre proyecto';
let textBox;
let json;

var mass = [];
var positionX = [];
var positionY = [];
var velocityX = [];
var velocityY = [];for (var particleA = 0; particleA < mass.length; particleA++) {
		var accelerationX = 0, accelerationY = 0;

		for (var particleB = 0; particleB < mass.length; particleB++) {
			if (particleA != particleB) {
				var distanceX = positionX[particleB] - positionX[particleA];
				var distanceY = positionY[particleB] - positionY[particleA];

				var distance = sqrt(distanceX * distanceX + distanceY * distanceY);
				if (distance < 1) distance = 1;

				var force = (distance - 320) * mass[particleB] / distance;
				accelerationX += force * distanceX;
				accelerationY += force * distanceY;
			}
		}

		velocityX[particleA] = velocityX[particleA] * 0.99 + accelerationX * mass[particleA];
		velocityY[particleA] = velocityY[particleA] * 0.99 + accelerationY * mass[particleA];
	}

	for (var particle = 0; particle < mass.length; particle++) {
		positionX[particle] += velocityX[particle];
		positionY[particle] += velocityY[particle];

		ellipse(positionX[particle], positionY[particle], mass[particle] * 1000, mass[particle] * 1000);
	}

function preload() { // load images
  img = loadImage("data/0.png");
  bg = loadImage("data/bg.jpg");
  font = loadFont("data/RobotoMono-Bold.ttf");
  json = loadJSON("data/laboratorio.json");
}

function setup() { // create all the objects and oscillators //families: 1=dot 2=elementartist 3=elementinterviews 4=elementvideos 5= elementscans
  console.log(json.projects[2].name); // OK ready to load data
  noStroke();
  createCanvas(1000, 500);
  background(255);
  //n++;
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
        labels[i] = []; // holding only 1 label
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
    } // start in random pos replace first two values below
    artistArray.push(new Dot(width/2, height/2, currWeight, 1, tags[i], i));
    t[i] = new wrappedText(textString, textballradius, textballradius, textballradius - 10); // new wtextarray(string,x,y,drawradius);
    names[i] = t[i].toImage(textballradius * 2, -1.5); //new wtextimagearray(diameter,initangle)
  }
  getrindexArray();

  if (n) { // oscillators
    for (let i = 0; i < 3; i++)
      chord[i] = new p5.TriOsc()
  } else {
    for (let i = 0; i < 3; i++)
      chord[i] = new p5.SinOsc()
  }

  for (let i = 0; i < chord.length; i++) { //chord intervals
    chord[i].freq(major[i] * root)
    chord[i].amp(0.0)
    chord[i].stop()
  }
}

function draw() {
  console.log(frameCount);
  image(bg, 0, 0);
  for (let i = 0; i < dotArray.length; i++) { // display dotArray (interactive mouth)
    dotArray[i].calcMouse();
    dotArray[i].display();
    if (explode){
    dotArray[i].animate();
  }
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
    artistArray[i].animate();
    artistArray[i].borders();
  }
  warpOsc();

  for (var particleA = 0; particleA < mass.length; particleA++) {
  		var accelerationX = 0, accelerationY = 0;

  		for (var particleB = 0; particleB < mass.length; particleB++) {
  			if (particleA != particleB) {
  				var distanceX = positionX[particleB] - positionX[particleA];
  				var distanceY = positionY[particleB] - positionY[particleA];

  				var distance = sqrt(distanceX * distanceX + distanceY * distanceY);
  				if (distance < 1) distance = 1;

  				var force = (distance - 320) * mass[particleB] / distance;
  				accelerationX += force * distanceX;
  				accelerationY += force * distanceY;
  			}
  		}

  		velocityX[particleA] = velocityX[particleA] * 0.99 + accelerationX * mass[particleA];
  		velocityY[particleA] = velocityY[particleA] * 0.99 + accelerationY * mass[particleA];
  	}

  	for (var particle = 0; particle < mass.length; particle++) {
  		positionX[particle] += velocityX[particle];
  		positionY[particle] += velocityY[particle];

  		ellipse(positionX[particle], positionY[particle], mass[particle] * 1000, mass[particle] * 1000);
  	}

}

function addNewParticle() {
  mass.push(random(0.003, 0.03));
  	positionX.push(mouseX);
  	positionY.push(mouseY);
  	velocityX.push(0);
  	velocityY.push(0);
}

function calcPointPos(x, y, r, graden) {
  px = x + cos(radians(graden)) * (r / 2);
  py = y + sin(radians(graden)) * (r / 2);
}

function drawLink(obj1, obj2) { // first object is the active object
  if (obj1.active) {
    if (obj2.family == 0 && obj1.isConnected(obj2)) {
      stroke(255, 100, 0, 75);
      line(obj1.location.x, obj1.location.y, obj2.location.x, obj2.location.y);
      fill(255, 0, 0);
      ellipse(obj2.location.x, obj2.location.y, obj2.weight + (this.addsize / 1.5), obj2.weight + (this.addsize / 1.5));
    } else if (obj2.family == 1 && obj1.isConnected(obj2)) {
      stroke(0, 100, 255, 75);
      line(obj1.location.x, obj1.location.y, obj2.location.x, obj2.location.y);
    }
  }
}

function Dot(x, y, weight, family, tags, id) { //recieve pos, weight, family and tags
  this.tags = tags;
  this.family = family;
  this.location = createVector(x,y);
  this.weight = weight;
  this.addsize = 0;
  this.clickable;
  this.active;
  this.rotation = random(-2, 1);
  this.id = id;
  this.velocity = createVector(random(-2.5,2.5),random(-1.5,1.5));
  this.acceleration = createVector(random(0,3),random(0,3));

  this.drag = function() {
    if (this.active) {
      this.location.x = mouseX;
      this.location.y = mouseY;
    }
  }
  this.animate=function(){
    if (this.acceleration > 0){
      this.acceleration -=0.1;
      this.velocity.add(this.acceleration);
    }
    if (frameCount > 100){
    this.velocity.x += random(-0.05,0.05);
    this.velocity.y += random(-0.05,0.05);
      this.velocity.x = this.velocity.x*0.99;
      this.velocity.y = this.velocity.y*0.99;
    }
    //this.velocity.add(this.deacceleration);
    this.location.add(this.velocity);
    //this.velocity=this.velocity*0.999;
  }
  this.borders = function() {
  if (this.location.x < -20) this.location.x = width + 20;
  if (this.location.y < -20) this.location.y = height + 20;
  if (this.location.x > width + 20) this.location.x = -20;
  if (this.location.y > height + 20) this.location.y = -20;
  }
  this.display = function() {
    noStroke();
    if (this.family === 0) {
      fill(50);
      ellipse(this.location.x, this.location.y, this.weight + (this.addsize / 1.5), this.weight + (this.addsize / 1.5));
    } else if (this.family === 1) {
      if (this.active) {












        
        fill(0, 100 + map(this.distance, 0, 150, 100, 0), 255); //changing color based on distance
        ellipse(this.location.x, this.location.y, 40, 40);
        fill(0);

        // textBox = font.textBounds(textString, this.px, this.py + 30); // LINEAR CENTERED FONT
        // text(textString, this.px - (textBox.w / 2), this.py + 30);
        this.rotation += map(this.distance, 0, 150, 0, 0.01);
        push()
        translate(this.location.x, this.location.y); // center and rotate
        rotate(this.rotation);
        image(names[this.id], -textballradius, -textballradius); //draw at the right pos
        //image(names[this.id], int(this.px-textballradius), int(this.py-textballradius));  int for sharp drawing when not rotating
        pop();
        // stroke(0, 50);  // BOX with 1px padding
        // fill(0, 0);
        // rect(this.px - (textBox.w / 2) - 1, textBox.y - 1, textBox.w + 2, textBox.h + 2);
      } else {
        fill(255, 180, 150);
        ellipse(this.location.x, this.location.y, 10 + (this.addsize * 4), 10 + (this.addsize * 4));
      }
    }
    this.addsize = 0;
  };
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
  this.activate = function() {
    if (this.clickable) {
      this.active=!this.active; // invert active state
      lastElmt = this; // deposit in last element bucket
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
  this.toImage = function(size, rotation) { // createGraphics to that we have an img file to display and not a text object, so that we gain 15+fps
    this.image = createGraphics(size, size);
    this.image.textFont(font);
    this.image.textSize(12);
    this.image.push();
    this.image.translate(this.x, this.y);
    this.image.rotate(rotation);
    for (let i = 0; i < this.string.length; i++) {
      this.image.push();
      this.image.translate(-this.radius, 0);
      this.image.rotate(-HALF_PI + 0.1);
      this.image.text(this.string.charAt(i), 0, 0);
      this.image.pop();
      this.image.rotate(this.spacing);
    }
    this.image.pop();
    return this.image;
  };
}

function getrindexArray() { // function to get a random index from artistArray length
  for (let i = 0; i < 5; i++) {
    rindexArray.push(int(random(0, artistArray.length)));
  }
}

function warpOsc() { // uses max dist to determine the frequency distortion
  let bias = 0
  for (let i = 0; i < n; i++)
    bias = max(bias, dist(mouseX, mouseY, width / 2, height / 2))
  for (let i = 0; i < chord.length; i++)
    chord[i].freq(map(bias, 500, 0, major[i], minor[i]) * root)
}

function mouseDragged() {
  if (typeof lastElmt != "undefined") {
  lastElmt.drag();
}
  return false;// prevent default
}

function keyPressed() {
  if (keyCode === 90) { //z
    explode = true;
 }
 if(keyCode === 88){// x
 addNewParticle();
}
}

function mousePressed() {
  getrindexArray();
  for (let i = 0; i < artistArray.length; i++) { //activate elemartist array
    artistArray[i].activate();
  }
  for (let i = 0; i < chord.length; i++) { // toggle synth on
    chord[i].start()
    chord[i].amp(0.3, 0.5)
  }

}

function mouseReleased() {
  for (let i = 0; i < chord.length; i++) { // toggle synths off
    chord[i].amp(0.0, 0.05)
    chord[i].stop()
  }
}
