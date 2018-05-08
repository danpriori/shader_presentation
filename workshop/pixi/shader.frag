precision mediump float;

uniform float time;
uniform float rayAngleSpread;
uniform float rayDistanceSpread;
uniform float rayBrightness;
uniform vec3 rayColor;

varying vec2 vTextureCoord;

vec2 causticDistortFn(vec2 position)
{
    position.x*=(position.y * rayAngleSpread * 0.2 - 2.2);
    return position;
}

float causticEffectFn(vec2 position)
{
    return (sin(position.x*30.+time)
    +pow(sin(-position.x*110.+time),1.)
    +pow(sin(position.x*30.+time),2.)
    +pow(sin(position.x*20.+time),2.)
    +pow(sin(position.x*61.+time),2.)
    +pow(sin(-position.x*12.+time),5.))/1.4;
}           

void main( void ) 
{
    vec2 position = vTextureCoord;
    position.x-=.4;
    vec2  causticDistorted = causticDistortFn(position)-.6;
    float causticShape = clamp(rayDistanceSpread-length(causticDistorted.x*10.),0.,pow(1.-position.y,3.));
    float causticPattern = rayBrightness * causticEffectFn(causticDistorted);
    float caustic = causticShape*causticPattern;
    float final = ((position.y+((position.x/.5))+.05)/3.*caustic)/(position.y*3.3);
    
    
    gl_FragColor = vec4( 0.1*final * rayColor.r, 0.1*final * rayColor.g, 0.1*final * rayColor.b, 0.);

}