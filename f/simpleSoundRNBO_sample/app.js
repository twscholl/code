/*
  p5.js _ RNBO Max Tutorial
  https://www.youtube.com/watch?v=fzfGYsIsAKg

  fred & tim @massart 01/12/2024
*/

// audio variables
//let AudioContext;
let context;
//let device;
let x;     // rnbo expects this for synth
let xVal;  // helper variable to scale and send to rnbo

// graphics variables
var xPos;
var radius = 120;
var speed = 1.0;
var direction = 1;
var myColor; 

function setup() {
  canvas = createCanvas(1000, 400);
  ellipseMode(RADIUS);
  
  xPos = width / 2;   // Start in the center

  //audioContext = new (window.AudioContext || window.webkitAudioContext)();

  //loadRNBO();
  
  rnboSetup();

  canvas.mouseClicked(startAudioContext);
}

async function loadRNBO() { 

  const {createDevice} = RNBO;

  await audioContext.resume();

  const rawPatcher = await fetch('export/patch.export.json');
  const patcher = await rawPatcher.json();

  device = await createDevice({ context: audioContext, patcher});
  device.node.connect(audioContext.destination);
  
  x = device.parametersById.get('x');
  y = device.parametersById.get('y');
}

function startAudioContext () {
  
 // if (audioContext.state === 'suspended') { 
 if (context.state === 'suspended') { 
   // audioContext.resume();
   context.resume();
  }
}

function draw() {

  background(0);
  
  if (direction == 1) {
    myColor = color(random(256), random(256), random(256));
	  fill(myColor);
    arc(xPos, 200, radius, radius, 0.52, 5.76);   // Face right
	  fill(20);
	  ellipse(xPos+30, 130, 20, 15);
    fill(random(256), random(256), random(256));
  } else {
    fill(myColor);
    arc(xPos, 200, radius, radius, 3.67, 8.9);    // Face left
	  fill(20);
	  ellipse(xPos-30, 130, 20, 15);
  }

  xPos += speed * direction;
  xVal = map(xPos, radius, width-radius, 0., 1.);

  if ((xPos > width-radius) || (xPos < radius)) {
    direction = -direction;   // Flip direction
  }

  if (x) {
    x.normalizedValue = xVal;
  }

  textSize(24);
  fill(255);
  text("xPos", 20, height - 30);
  text(xPos, 100, height - 30);
  text("xVal", 200, height - 30);
  text(xVal, 280, height - 30);
}

async function rnboSetup() {
  const patchExportURL = "export/patch.export.json";

  // Create AudioContext
  const WAContext = window.AudioContext || window.webkitAudioContext;
  context = new WAContext();

  // Create gain node and connect it to audio output
  const outputNode = context.createGain();
  outputNode.connect(context.destination);
  
  // Fetch the exported patcher
  let response, patcher;
  try {
    response = await fetch(patchExportURL);
    patcher = await response.json();
  } catch (err) {}
  
  // (Optional) Fetch the dependencies
  let dependencies = [];
  try {
    const dependenciesResponse = await fetch("export/dependencies.json");
    dependencies = await dependenciesResponse.json();

  // Prepend "export" to any file dependenciies
    dependencies = dependencies.map(d => d.file ? Object.assign({}, d, { file: "export/" + d.file }) : d);
  } catch (err) {}

  // Create the device
  let device;
  try {
     device = await RNBO.createDevice({ context, patcher });
  } catch (err) {}

  // (Optional) Load the samples
  if (dependencies.length)
    await device.loadDataBufferDependencies(dependencies);

  // Connect the device to the web audio graph
  device.node.connect(outputNode);

  x = device.parametersById.get('x');
  y = device.parametersById.get('y');
}