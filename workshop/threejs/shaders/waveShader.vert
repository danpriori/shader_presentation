precision highp float;

uniform float time; // custom uniform

uniform mat4 modelViewMatrix; // provided by ThreeJS
uniform mat4 projectionMatrix; // provided by ThreeJS

attribute float distort; // custom attribute

attribute vec3 position; // provided by ThreeJS
attribute vec3 normal; // provided by ThreeJS
attribute vec2 uv; // provided by ThreeJS

varying vec2 vUv;
varying float vHeight;
varying float vDistort;

void main() {

    vUv = uv;

    vDistort = distort*0.1; // attribute distortion created outside of the shader (see main.js on renderScene function)
    
    vec3 v = position; 
    float t = time;
    
    v.z += (
        // Add some offset to make it slightly less regular
        sin(15.0 * position.x + t * -1.3) *
        cos(15.0 * position.y + t * -0.9) * 0.25
    ) + (
        // Extra waves
        cos(15.0 * 2.0 * position.x + t * -.3) *
        sin(15.0 * 4.0 * position.y + t * -1.9) * 0.005
    );
    v.z += vDistort;
    vHeight = v.z;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(v,1.0);
    
}