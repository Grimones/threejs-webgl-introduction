const shader = `
precision lowp float;
precision lowp int;
uniform float time;
uniform float delta;
uniform vec2 mouse;

void main()	{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec4 positions = texture2D(texturePosition, uv);
	vec2 initPosition = positions.zw;
	vec2 position = positions.xy;
	vec2 velocity = texture2D( textureVelocity, uv).xy;

	gl_FragColor = vec4(position + velocity * delta * 20.0, initPosition);
}

`

export default shader;