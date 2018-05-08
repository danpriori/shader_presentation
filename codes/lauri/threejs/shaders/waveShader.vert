precision highp float;

#define M_PI 3.1415926535897932384626433832795

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying vec2 v_uv;

void main() {
  v_uv = uv;
  //gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, position.z + sin(position.x) + sin(position.y), 1.0);

  //float morph = (sin(time * 1.0) + 1.0) * 0.5;
  float morph = clamp(sin(time * 1.0) + 1.0, 0.0, 1.0);
  //float rmorph = 1.0 - morph;

  float alpha = morph * position.x * 2.0 * M_PI / 15.0;
  float  beta = morph * position.y * 2.0 * M_PI / 15.0;

  vec2 dial = vec2(sin(alpha), cos(alpha));

  vec4  torus = vec4(5.0 * dial + dial * cos(beta), sin(beta), 1.0);
  vec4 square = vec4(1.0 * position.xzy, 1.0);

  gl_Position = projectionMatrix * modelViewMatrix * mix(square, torus, morph);
}
