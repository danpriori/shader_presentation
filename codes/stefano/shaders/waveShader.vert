// VERTEX SHADER 
// lets create our vertex shader here
// the suggestion can be trying to create some behavior on shader editor to see on-the-fly in an easier way and copy and paste here
// remove this top comment block

// First of all, I suggest to put the float precision
// precision highp|mediump|lowp float;

// lets declare some properties here
// uniforms, attributes, varying, local variables

// we need first of all the main function
// In C\C++ we can use like this:
// void main() { }

// in OpenGL ES 2.0 we use the default gl_Position for output the position of each vertex on space
// We can send other default properties like gl_PointSize (see WebGL1.0 Khronos Card) and varying to fragment shader. 
// However, lets concentrate in this case using only the most used gl_Position

precision highp float;

uniform float time;
// these properties are provided by ThreeJS
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

attribute float distortion; // added in main.js

varying vec2 vUv; // creating a varying to make it accessible in the Fragment Shader
varying float positionHeight;
varying float vDistorion;

vec3 localPosition;

// rotation matrix
//attribute mat2 rotation;

void main () {

    

    localPosition = position; // copy by value

    //vec3 tPos = vec3(position.x, position.y, position.z);
    vec2 tPos = vec2(clamp(position.x * sin(time), -0.5 * 7.5, 0.5 * 7.5), clamp(position.y * sin(time), -0.5 * 7.5, 0.5 * 7.5));

    vDistorion = distortion * 1.0;
    // localPosition.z += sin(15.0 * position.x + time * - 1.0) *
    //                    cos(15.0 * position.y + time * - 1.0) * 
    //                    0.5;
    //localPosition.z += vDistorion;
    localPosition.x =  tPos.x * cos(time) + tPos.y * sin(time);
    localPosition.y = -tPos.x * sin(time) + tPos.y * cos(time);
    localPosition.z += sin(15.0 * localPosition.x + time * - 1.0) *
                       cos(15.0 * localPosition.y + time * - 1.0) * 
                       0.5;
    

    positionHeight = localPosition.z;

    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(localPosition, 1.0); // position is a vec3, we need another value, we put 1 :)
}

