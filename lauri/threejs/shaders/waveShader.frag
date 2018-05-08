precision highp float;

uniform float time;
uniform sampler2D texture;

varying vec2 v_uv;

void main() {
  gl_FragColor = texture2D(texture, v_uv);
}
