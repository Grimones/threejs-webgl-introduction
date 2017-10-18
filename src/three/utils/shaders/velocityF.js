const shader = `precision lowp float;
precision lowp int;
uniform float time;
uniform float delta;
uniform float brushSize;
uniform float forceMultiplyer;
uniform float drag;
uniform float ease;
uniform vec2 blobCenter;

float rand2(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec4 positions = texture2D( texturePosition, uv);
	vec2 initPosition = positions.zw;
	vec2 selfPosition = positions.xy;
	vec2 selfVelocity = texture2D( textureVelocity, uv ).xy;

	vec2 velocity = selfVelocity;
	vec2 direction = blobCenter - selfPosition;

	float dist = length(direction);
	float distanceSquared = dist * dist;

	float brushSizeSquared = brushSize * brushSize;

	float force;
	if (dist < brushSize) {
		force = (distanceSquared / brushSizeSquared - 1.0) * delta * forceMultiplyer;
		velocity += normalize(direction) * force* (rand2(selfPosition));
	}
	velocity *= drag;
	velocity += (initPosition - selfPosition) * ease;

	gl_FragColor = vec4(velocity, 0.0, 0.0);
}

`;

export default shader;
