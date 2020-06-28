let px, py, r, degree;
let minWeight = 0;
let maxWeight = 3.5;
let currWeight;
let spacing = maxWeight+3;
let goldenRatio;
let iter = 0
//let imgNum;
let smallChaos = false;
let img;

function preload(){
  // imgNum = int(random(4));
  img = loadImage("1.png");
}
function setup() {

  goldenRatio = ((sqrt(5) + 1 ) / 2);
  createCanvas(1000, 500);
  background(255);
  px = width/2; py = height/2;
}

function draw() {
  for(let i = 0; i < 12; i++){ // for more speed
    degree = (iter * goldenRatio) * 360;
    r = sqrt(iter++) * spacing;
    calcPointPos(width/2, height/2, r, (degree % 360));
    let pix = img.get(int(px), int(py));
    currWeight = map(brightness(pix), 150, 0, minWeight, maxWeight);
    strokeWeight(currWeight);
    stroke(map(currWeight, minWeight,maxWeight, 100,0)); // stroke(pix);
    point(px, py);
  //   if (px-40 <= 0 || px+40 >= width || py-40 <= 0 || py+40 >= height ) { noLoop(); }
  // }
}
}

function calcPointPos(x,y,r,graden) {
  px = x + cos(radians(graden))*(r/2);
  py = y + sin(radians(graden))*(r/2);
}

// function mousePressed(){
// 	  // if (mouseButton == LEFT){
// 		//   ++imgNum;
// 		//   imgNum %= 4;
// 		//   preload();
// 	  // }
//   frameCount = iter = 0;
//   background(242, 247, 244);
//   loop();  redraw();
// }
