const setup = async () => {

  // create WebAudio AudioContext
  const WAContext = window.AudioContext;
  const context = new WAContext();
  
  // get exported RNBO patcher file (file name must match whatever is used during target export)
  const rawPatcher = await fetch("export/patch.export.json");
  const patcher = await rawPatcher.json();

  // fetch dependencies (if applicable, dependencies.json is created during target export)
  const dependencies = [];
  try {
      const dependenciesResponse = await fetch("export/dependencies.json");
      dependencies = await dependenciesResponse.json();
      dependencies = dependencies.map(d => d.file ? Object.assign({}, d, { file: "export/" + d.file }) : d);
  } catch (e) {}

  // create RNBO device
  const device = await RNBO.createDevice({ context, patcher });

  // load samples (if applicable, check "Copy Sample Dependencies" during target export)
  if (dependencies.length)
      await device.loadDataBufferDependencies(dependencies);

  // connect device to AudioContext audio output
  device.node.connect(context.destination);
  
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
  
};

setup();
