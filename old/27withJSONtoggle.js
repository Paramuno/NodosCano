let px, py, r, degree, currWeight, pix, goldenRatio;
let minWeight = 0;
let maxWeight = 4;
let spacing = maxWeight + 3;
let iter = 0
let explode = false;

let chord = []
let root = 30
let major = [4, 5, 6]
let minor = [10, 12, 15]
let n = true; // oscillator type

let dotArray = [];
let lens = 80; // distance
let artistArray = [];
let lastElmt;
let chosenDots = [];

let taglist = []; // list of tags
let labels = []; // label are element to dot array
let nameString = [];
let nameImg = []; // image of text name
let t = []; // text name
let textballradius = 35;
let activeArtists = []; // active artists and their ids
let filteredArtists = []; // filteredArtists list

let textBox;
let json;

let mass = [];
let positionX = [];
let positionY = [];
let rotation = 0;
let repelAngle;

let webforceSize; //initial webforce size
let bgalpha = 0; // background alpha
let buttonplus; // minconnections to drawlink + or -
let buttonminus;
let minconnections = 2;

function preload() { // load images
  img = loadImage("data/0.jpg");
  img1 = loadImage("data/1.jpg");
  bg = loadImage("data/bg.jpg");
  font = loadFont("data/RobotoMono-Bold.ttf");
  json = loadJSON("data/laboratorio.json");
  test = loadJSON("data/typewriter.json");
  test1 = loadJSON("data/mouth.json");
}

function setup() { // create all the objects and oscillators //families: 1=dot 2=elementartist 3=elementinterviews 4=elementvideos 5= elementscans
  noStroke();
  createCanvas(1000,1000); //windowHeight, windowHeight
  background(255);
  textFont(font);
  textSize(12);
  goldenRatio = ((sqrt(5) + 1) / 2);
  px = width / 2;
  py = height / 2;
  fill(0);
  webforceSize = createSlider(5, windowHeight / 2 + 300, windowHeight / 2);
  webforceSize.position(150, 5);
  bgalpha = createSlider(0, 255, 255);
  bgalpha.position(150, 25);
  buttonplus = createButton("+");
  buttonplus.position(200, 65);
  buttonplus.mousePressed(() => {
    if (minconnections < 6) minconnections++;
    connectAll()
  }); // change minconnections and reconnect all
  buttonminus = createButton("-");
  buttonminus.position(225, 65);
  buttonminus.mousePressed(() => {
    if (minconnections > 1) minconnections--;
    connectAll()
  }); // change minconnections and reconnect all
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
        tdotArray.push(new tempDot(px,py,currWeight));
      }
    }
  }
  for (let i = 0; i < dotArray.length; i++) { // asigning id for each dot
    dotArray[i].id = i;
  }
  pop();

  for (let i = 0; i < 19; i++) { // creating artist dots
    let rr = random(1);
    let rx;
    let ry = random(30, height - 30);
    if (rr < 0.5) {
      rx = random(30, (width / 2) - 200);
    } else {
      rx = random((width / 2) + 200, width - 30);
    } // start in random pos replace first two values below
    artistArray.push(new Dot(random((width / 2) - 1, (width / 2) + 1), random((height / 2) - 1, (height / 2) + 1), currWeight, 1, json.projects[i].tags, i, json.projects[i].name));
    positionX.push(artistArray[i].location.x);
    positionY.push(artistArray[i].location.y);
    mass.push(random(0.003, 0.03));
    nameString[i] = json.projects[i].name;
    t[i] = new wrappedText(nameString[i], textballradius, textballradius, textballradius - 10); // new wtextarray(string,x,y,drawradius);
    nameImg[i] = t[i].toImage(textballradius * 2, -0.5); //new wtextimagearray(diameter,initangle)
  }

  dotArray.sort((a, b) => a.weight - b.weight); // sorting dotArray by weight

  for (let i = 0; i < json.projects.length; i++) { // inserting artists into random dots
    for (let j = 0; j < json.projects[i].tags.length; j++) {
      let rindex = int(random(0, dotArray.length));
      if (!taglist.includes(json.projects[i].tags[j])) {
        taglist.push(json.projects[i].tags[j]);
        dotArray[rindex].tags[0] = json.projects[i].tags[j]; // inserting chosen dots
        chosenDots.push(rindex); // filling the chosendots array
      }
      artistArray[i].dotBrothers.push(rindex); // inserting dotBrothers into each artist
    }
  }

  //  dotArray.sort(function(a, b){return a.weight - b.weight});

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
  background(255, bgalpha.value());
  noStroke();
  for (let i = 0; i < dotArray.length; i++) { // display dotArray (interactive mouth)
    dotArray[i].calcMouse();
    dotArray[i].displaydot();
    if (explode) {
      dotArray[i].explode();
    }
  }
  drawConnections();
  drawText();
  for (let i = 0; i < artistArray.length; i++) { // display artistArray (tag holders)
    artistArray[i].calcMouse();
    artistArray[i].displayartist();
    artistArray[i].borders();
  }
  warpOsc();
}

let tdotArray = [];
let sexyjson;

function updatedotArray(imgjson){
  for(i=0;i<dotArray.length;i++){
    dotArray[i].location.x = imgjson[i].x;
    dotArray[i].location.y = imgjson[i].y;
    dotArray[i].weight = imgjson[i].weight;
  }
}

function createdotArray(image) { //sort for brightess then assign dots
  let weightmap;
  // let pixel = [];
  iter =0;
  //goldenRatio = ((sqrt(5) + 1) / 2);
  px = width / 2;
  py = height / 2;
  push();
  translate(width/2,height/2);
  for (let i = 0; i < dotArray.length; i++) { // creating mouth dots
    let count;
    let chance = random(1);
    degree = (iter * goldenRatio) * 360;
    r = sqrt(iter++) * spacing;
    calcPointPos(width / 2, height / 2, r, (degree % 360));
    if (px < width && py < height && px > 0 && py > 0) {
      pix= brightness(image.get(int(px - (width / 2) + 250), int(py - (width / 2) + 250)));
      // depending on the brightness of the pixel assign a dot with certain dotsize
       //if (pix < 70){
        weightmap = map(pix, 80, 0, minWeight, maxWeight);
          tdotArray[i] = new tempDot(px,py,weightmap);
        // dotArray[i].location.x = px;
        // dotArray[i].location.y = py;
        // dotArray[i].weight = weightmap;
      //}else{
        // dotArray[i].location.x = px;
        // dotArray[i].location.y = py;
        // dotArray[i].weight = 0;
      //}
    }
  }
  pop();
sexyjson = JSON.stringify(tdotArray);
}

function tempDot(x,y,weight){
  this.x=x;
  this.y=y;
  this.weight=weight;
}

function drawText() {
  noStroke();
  let posY = 5;
  for (i = 0; i < chosenDots.length; i++) { //for each of the tags
    if (dotArray[chosenDots[i]].active) {
      posY += 15;
      text(taglist[i], 15, posY);
    }
  }
  text("Palabras en común:", 150, 60);
  text(minconnections, 160, 80);
}

function connectedWeb() {
  for (let i = 0; i < artistArray.length; i++) {
    artistArray[i]
  }

}

function calcAngle(vector1, vector2) {
  let anglerad = Math.atan2(vector2.y - vector1.y, vector2.x - vector1.x);
  return anglerad;
}

function calcAnglefromCenter(vector) {
  let anglerad = Math.atan2(height / 2 - vector.y, width / 2 - vector.x);
  return anglerad;
}

function addNewParticle() { // keep to add the other elemnts
  // mass.push(random(0.003, 0.03));
  // positionX.push(mouseX);
  // positionY.push(mouseY);
  // velocityX.push(0);
  // velocityY.push(0);
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
      if(this.weight < 0.1)this.addsize +=5; //bigger if dot is 0
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

function drawConnections() { // draw them
  for (i = 0; i < activeArtists.length; i++) {
    for (j = 0; j < filteredArtists.length; j++) {
      stroke(137, 196, 255);
      line(artistArray[activeArtists[i]].location.x, artistArray[activeArtists[i]].location.y, artistArray[filteredArtists[j]].location.x, artistArray[filteredArtists[j]].location.y);
    }
  }
}

function connectAll() { //create an array with all the necessary conencted dots
  filteredArtists.length = 0; // empty previous connections
  for (i = 0; i < artistArray.length; i++) {
    if (checkAll(artistArray[i], minconnections)) { // if all active artists connect to this one at least in 2
      for (j = 0; j < activeArtists.length; j++) {
        filteredArtists.push(artistArray[i].id); // inject its id to filteredArtists
        filteredArtists = filteredArtists.filter((item, pos, self) => self.indexOf(item) == pos); // remove duplicates
      }
    }
  }
  for (i = 0; i < chosenDots.length; i++) {
    dotArray[chosenDots[i]].active = false; // empty all active
    if (activeArtists.length > 0 && checkAll(dotArray[chosenDots[i]], 1)) { // if all active artists connect to this dot at least in 1
      dotArray[chosenDots[i]].active = true; // activate that shit
    }
  }
}

function checkAll(againstthis, min) {
  let counter = 0;
  for (k = 0; k < activeArtists.length; k++) {
    if (artistArray[activeArtists[k]].isConnected(againstthis, min)) {
      counter++;
    }
  }
  if (counter === activeArtists.length) return true;
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

function warpOsc() { // uses max dist to determine the frequency distortion
  let bias = 0
  for (let i = 0; i < n; i++)
    bias = max(bias, dist(mouseX, mouseY, width / 2, height / 2))
  for (let i = 0; i < chord.length; i++)
    chord[i].freq(map(bias, 500, 0, major[i], minor[i]) * root)
}

function mouseDragged() {
  if (typeof lastElmt != "undefined" && lastElmt.clickable) {
    lastElmt.drag();
  }
  return false; // prevent default
}

function keyPressed() {
  if (keyCode === 90) { //z
    explode = !explode;
  }
  if (keyCode === 88) { // x
    updatedotArray(test);
    //createdotArray(img1);
  }
  if (keyCode === 67) { // x
    updatedotArray(test1);
    //createdotArray(img1);
  }
}

function mousePressed() {
  for (let i = 0; i < artistArray.length; i++) { //activate elemartist array
    if (artistArray[i].clickable) {
      artistArray[i].activate();
      connectAll();
    }
  }
  for (let i = 0; i < chord.length; i++) { // toggle synth on
    chord[i].start()
    chord[i].amp(0.3, 0.5)
  }
  // for (let i = 0; i < dotArray.length; i++) { //activate elemartist array
  //   dotArray[i].repel(frameCount);
  // }
}

function mouseReleased() {
  for (let i = 0; i < chord.length; i++) { // toggle synths off
    chord[i].amp(0.0, 0.05)
    chord[i].stop()
  }
}

(function(console){

    console.save = function(data, filename){

        if(!data) {
            console.error('Console.save: No data')
            return;
        }

        if(!filename) filename = 'console.json'

        if(typeof data === "object"){
            data = JSON.stringify(data, undefined, 4)
        }

        var blob = new Blob([data], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }
})(console)
