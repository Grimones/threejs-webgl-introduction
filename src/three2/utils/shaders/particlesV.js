const shader = `

precision lowp float;
precision lowp int;
uniform mat4 modelMatrix; // optional
uniform mat4 viewMatrix; // optional
uniform mat4 projectionMatrix; // optional
attribute vec3 position;
attribute vec4 color;

uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
uniform float delta;
uniform float particleSize;
varying vec2 vUv;

void main()
{
    vec2 pos = texture2D(texturePosition, position.xy).xy;
    vec2 velocity = normalize(texture2D(textureVelocity, position.xy).xy);

    vec3 newPosition = position;
    newPosition = mat3(modelMatrix) * newPosition;

    newPosition = newPosition;
    newPosition += vec3(pos.x, pos.y, 0.0);
    newPosition.z = 0.5;

    gl_Position = projectionMatrix * viewMatrix * vec4(newPosition, 1.0);
    vUv = position.xy;
    gl_PointSize = particleSize;
}

`
export default shader;