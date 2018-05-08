precision highp float;

uniform float time;
uniform sampler2D texture;

varying float vHeight;
varying vec2 vUv;
varying float vDistort;

void main() {
    
    float t = time * 0.01;
    vec4 color = texture2D(texture, vUv + vec2( sin( t ), cos( t ) )).rgba + vec4(vDistort, 0, 0, vHeight * 2.);
    
    gl_FragColor = color;

}