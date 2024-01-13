/* 

  if not using Visual Studio Code with p5.js & Live Server
  https://www.youtube.com/watch?v=Pn1g1wjxl_0
  https://github.com/processing/p5.js/wiki/Local-server

  load Chrome Web server extension
  point it to sketch folder with autoload index.html clicked on
  then go to http://127.0.0.1:8887/

*/


let blip;

var radius = 120;
var x = 0;
var speed = 5.0;
var direction = 1;
var myColor; 

function preload() {
  blip = loadSound('media/cluck.wav');
}

function setup() {
  createCanvas(1000, 400);
  ellipseMode(RADIUS);
  
  x = width/2;   // Start in the center
}

function draw() {
  background(0);
  x += speed * direction;
  
  if ((x > width-radius) || (x < radius)) {
    direction = -direction;   // Flip direction
    blip.play();
  }
  
  if (direction == 1) {
    myColor = color(random(256), random(256), random(256));
	  fill(myColor);
    arc(x, 200, radius, radius, 0.52, 5.76);   // Face right
	  fill(20);
	  ellipse(x+30, 130, 20, 15);
    fill(random(256), random(256), random(256));
  } else {
    fill(myColor);
    arc(x, 200, radius, radius, 3.67, 8.9);    // Face left
	  fill(20);
	  ellipse(x-30, 130, 20, 15);
  }
  
}