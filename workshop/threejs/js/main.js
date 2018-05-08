/**
 * FIRST SHADER WORKSHOP DERIVCO ESTONIA
 * Daniel Priori 18/04/19
 * 
 * This first shader we will use inside ThreeJS environment.
 * For more information: http://threejs.org/
 * 
 * If have problems with CORS, install a local server to use
 * Or use Firefox, or Chrome with the accept local files flag
 * If you prefer local server, I suggest to use a simple server like:
 * npm install -g http-server
 * and use the cmd: http-server inside the folder project
 * But you can use whatever you prefer. The point here is to use on local without CORS problems
 */


let game = {
  objects: {},
  clock: null,
  scene: null,
  camera: null,
  renderer: null,
  container: null,
  materials: [],
  backgroundTexture: null
}

let mouse = {
  x: 0,
  y: 0
};

let planeProperties = {
  width: 15,
  segments: 38,
  height: 15,
  uniforms: {
    texture:   { value: null },
    time:      { value: 1.0 }
  },
  attributes: {
    distort: []
  },
  vertexShaderScript: null,
  fragmentShaderScript: null
}

/**
 * All files to load. It's a weak way to load files but for this purpose it's enough. 
 * If you want to load more files, update the amount and check inside function loadFiles()
 * 
 */
let files = {};
files.waterTexture = "assets/images/water_texture3.png";
files.waveShaderFrag = "shaders/waveShader.frag";
files.waveShaderVert = "shaders/waveShader.vert";
files.backgroundTexture = "assets/images/Background_Beach_Sand.jpg";
files.amount = 4;

loadFiles(files);

/**
 * It's a weak way to load files but for this purpose it's enough. 
 * If you want to load more files, update the files Array and update inside this function
 * 
 */
function loadFiles(files){
  let amount = 0;
  THREE.Cache.enabled = true;

  // for texture we use texture loader on ThreeJS
  let loadTexture = new THREE.TextureLoader();
  loadTexture.load(files.waterTexture, (data) => { planeProperties.uniforms.texture.value = data; checkLoaded(++amount); });

  // for texture we use texture loader on ThreeJS
  let loadBackground = new THREE.TextureLoader();
  loadBackground.load(files.backgroundTexture, (data) => { game.backgroundTexture = data; checkLoaded(++amount); });

  // for other types of files, we use a standard file loader
  let loadFragmentShader = new THREE.FileLoader();
  loadFragmentShader.load(files.waveShaderFrag, (data) => { planeProperties.fragmentShaderScript = data; checkLoaded(++amount); });

  // for other types of files, we use a standard file loader
  let loadVertexShader = new THREE.FileLoader();
  loadVertexShader.load(files.waveShaderVert, (data) => { planeProperties.vertexShaderScript = data; checkLoaded(++amount); });
}

// check if all are loaded to start creating the environment
function checkLoaded(amount){
  console.log('check if all files are loaded... ', amount ,' of ', files.length);
  if (amount>=files.amount){
    console.log('loaded... building scene');
    createScene();
    console.log('init scene');
    initScene();
    console.log('animate scene');
    animateScene();
  }
}

// create the scene elements after assets loaded
function createScene(){

  // create the scene
  game.scene = new THREE.Scene();

  game.clock = new THREE.Clock(); // clock for delta and other stuffs for time. In this case we will use just the delta

  // create the camera
  game.camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
  // position a little far away from the center of the world space
  game.camera.position.z = 30;

  // create the background object (only to see our objects better instead with a black background)
  game.objects.background = backgroundScene({radius: 30, widthSegments: 30, heightSegments: 30});

  // create the light (we can use it sending the light properties on shader using uniforms)
  game.objects.light1 = light({x: 50, y: 50, z: 50}, {color: 0xff0000, intensity: 1, distance: 100 });

  // create the plane object (we will insert our shader in this object)
  game.objects.plane = objectPlane({x:0,Y:0,z:0},planeProperties);

  // add objects to scene  
  game.scene.add( game.objects.background );
  game.scene.add( game.objects.light1 );
  game.scene.add( game.objects.plane.mesh );

}

// init scene with renderer, mouse control and container
function initScene() {
  
  // add controls using mouse
  game.controls = new THREE.OrbitControls( game.camera );
  game.controls.addEventListener( 'change', renderScene ); // if change the mouse, trigger renderScene again

  // create the webgl renderer
  game.renderer = new THREE.WebGLRenderer();
  // set the aspect ratio from window
  game.renderer.setPixelRatio( window.devicePixelRatio );
  // set size using the window inner size
  game.renderer.setSize( window.innerWidth, window.innerHeight );

  // get the DOM element container
  game.container = document.getElementById( 'container' );

  // add canvas element from renderer into the container
  game.container.appendChild( game.renderer.domElement );

  // add resize event triggering
  window.addEventListener( 'resize', onWindowResize, false );
  
  document.addEventListener('mousemove', onMouseMove, false);
}
// if we want to use the mouse position
function onMouseMove(event) {

  // Update the mouse variable
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
// update size and projection matrix when resizing
function onWindowResize() {

  game.camera.aspect = window.innerWidth / window.innerHeight;
  game.camera.updateProjectionMatrix();
  game.renderer.setSize( window.innerWidth, window.innerHeight );
}

// animate-update the scene and update the control from mouse
function animateScene() {
  
  requestAnimationFrame( animateScene );

  renderScene();

  game.controls.update();
}

// rendering the scene. We will insert here our uniforms and attributes that we want to change over the time
// and it will be updated inside the shader program
function renderScene() {

  // ---- properties to update on render
  game.objects.plane.properties.uniforms.time.value += 1.0 * game.clock.getDelta(); // delta value from ThreeJS
  
  // vertex distortion to see that we can change attributes outside and update inside the shader
  for ( let i = 0; i < game.objects.plane.geometry.attributes.distort.count; i++ ) {
    // switch between this two types of distortion to see some differences inside the shader effect
    //game.objects.plane.geometry.attributes.distort.array[ i ] = - Math.sin(game.objects.plane.properties.uniforms.time.value);
    game.objects.plane.geometry.attributes.distort.array[ i ] = - Math.random() * 1.1;
    
  }
  game.objects.plane.geometry.attributes.distort.needsUpdate = true;
  // ------

  // render
  game.renderer.render( game.scene, game.camera );
}

/*
* CREATE SCENE ELEMENTS
*/

// Background sphere
function backgroundScene(properties){

  // create a background panorama only to see our objects better on the scene instead a black background
  let geometry = new THREE.SphereGeometry( properties.radius, properties.widthSegments , properties.heightSegments  );
  geometry.scale( - 1, 1, 1 );
  let material = new THREE.MeshBasicMaterial( { map: game.backgroundTexture } );
  let mesh = new THREE.Mesh( geometry, material );

  return mesh;
}

// Our main object that we will put the shader programs to override their properties
function objectPlane(position, properties){
  let object = {};
  
  // first we create the geometry of the plane. This one we use a plane buffer geometry in order to add attributes inside vertex shader
  object.geometry = new THREE.PlaneBufferGeometry( properties.width, properties.height , properties.segments, properties.segments);
  object.properties = properties;
  
  // Create shader step. This ShaderMaterial Class is a way to create custom shaders in ThreeJS. 
  // We can use also the RawShaderMaterial that means ThreeJS will dont provide us some information about the object and scene that can help us inside shader program.
  // So, for this workshop purpose, we will use the standard ShaderMaterial Class to use such properties provided by ThreeJS. 
  // But you can test RawShaderMaterial if you want.
  object.material = new THREE.RawShaderMaterial( {
    uniforms: object.properties.uniforms, // add our uniforms
    vertexShader: planeProperties.vertexShaderScript,
    fragmentShader: planeProperties.fragmentShaderScript,
    transparent: true
  });
  
  {
    // a trick way to repeat the texture side by side on the mesh in both directions ( wrap the texture )
    planeUniforms = object.properties.uniforms;
    // S and T coordinates is the same like X and Y (remember on the presentation that we can use XYZW, STPQ, or RGBA)
    planeUniforms.texture.value.wrapS = planeUniforms.texture.value.wrapT = THREE.RepeatWrapping;
  }

  // get some informations from geometry like position count and insert into the displacement attribute
  object.properties.attributes.distort = new Float32Array( object.geometry.attributes.position.count );

  // insert the displacement attribute into the buffer. This way we can get the displacement from vertex shader with the information got before.
  object.geometry.addAttribute( 'distort', new THREE.BufferAttribute( object.properties.attributes.distort, 1 ) );

  // create the mesh with the geometry and material (shader material)
  object.mesh = new THREE.Mesh( object.geometry, object.material );

  return object;
}

// Create some light. Might be useful
function light(position, properties){
  
  // create light
  let light;
  light = new THREE.PointLight( properties.color, properties.intensity, properties.distance );
  // positioning the light
  light.position.set( position.x, position.y, position.z );

  return light;

}


