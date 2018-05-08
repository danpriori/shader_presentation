// FRAGMENT SHADER
// lets create our fragment shader here
// the suggestion can be trying to create some behavior on shader editor to see on-the-fly in an easier way and copy and paste here

// First of all, I suggest to put the float precision
// precision highp|mediump|lowp float;

// lets declare some properties here
// uniforms, varying, local variables

// we need first of all the main function
// In C\C++ we can use like this:
// void main() { }

// in OpenGL ES 2.0 we use the gl_FragColor for output the color of each pixel
// We can send other default properties like gl_FragData[n] but in this case we will just use gl_FragColor (see WebGL1.0 Khronos Card)


precision highp float;

uniform sampler2D texture;

varying vec2 vUv; // created in the Vertex Shader to make it accessible in the Fragment Shader
varying float positionHeight;

void main() {

    gl_FragColor = texture2D(texture, vUv) + vec4(0., 0., 0., positionHeight); // params: texture + coordinates

}