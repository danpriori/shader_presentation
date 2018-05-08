/**
 * TEST SHADER WITH PIXI - WORKSHOP DERIVCO ESTONIA
 * Daniel Priori 18/04/19
 * 
 * If have problems with CORS, install a local server to use
 * Or use Firefox, or Chrome with the accept local files flag
 * If you prefer local server, I suggest to use a simple server like:
 * npm install -g http-server
 * and use the cmd: http-server inside the folder project
 * But you can use whatever you prefer. The point here is to use on local without CORS problems
 */


let app = new PIXI.Application();
document.body.appendChild(app.view);

app.stage.interactive = false; // only if you want to use interative stuffs inside

// Stop application wait for load to finish
app.stop();

PIXI.loader
    .add('shaderFragLight', 'shader.frag')
    .add('shaderVertexLight', 'shader.vert')
    .add('dark_forest', 'assets/images/dark_forest.jpeg' )
    .add('overlay', 'assets/images/overlay.png' )
    .load(onLoaded);

let filterLight;

let uniformsLight = {
    rayAngleSpread      : { type: 'f',      value: -5.0 },
    rayDistanceSpread   : { type: 'f',      value: 14.0},
    rayBrightness       : { type: 'f',      value: 20.0},
    rayColor            : { type: 'vec3',   value: [0.4,0.4,0.3]},
    time                : { type: 'f',      value: 0.0 }
}


// Handle the load completed
function onLoaded (loader,res) {

    // Create background image
    let background = new PIXI.Sprite(res.dark_forest.texture);
    background.width = app.screen.width;
    background.height = app.screen.height;
    background.name = 'background';
    app.stage.addChild(background);

    // Add the filter Light
    filterLight = new PIXI.Filter(res.shaderVertexLight.data, res.shaderFragLight.data, uniformsLight);
    filterLight.autoFit = false;
    
    let effectLight = new PIXI.Sprite(res.overlay.texture);
    effectLight.width = app.screen.width;
    effectLight.height = app.screen.height;
    effectLight.name = 'light';
    app.stage.addChild(effectLight);
    effectLight.filters = [filterLight];

    // Resume application update
    app.start();
}

// Animate the filter
app.ticker.add(function(delta) {
    filterLight.uniforms.time += 0.005 * delta;
});