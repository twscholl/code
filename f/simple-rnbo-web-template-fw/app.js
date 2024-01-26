async function setup() {
  const patchExportURL = "export/patch.export.json";

  // Create AudioContext
  const WAContext = window.AudioContext || window.webkitAudioContext;
  const context = new WAContext();

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

  //
  // interface objects
  //

  // start audio with a button
  document.getElementById("start-button").onpointerdown = (e) => { 
    context.resume();
    e.target.disabled = true;
  };

  // attach HTML UI elements to RNBO device parameters 
  document.getElementById("vol-slider").oninput = (e) => {               // name in index.html
    device.parametersById.get("master-volume").value = e.target.value;   // name in rnbo
  };

  document.getElementById("freq-slider").oninput = (e) => {
    device.parametersById.get("freq-slider").value = e.target.value;
  };
}

setup();
