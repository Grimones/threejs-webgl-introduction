const shader = `

precision lowp float;
precision lowp int;

uniform vec2 resolution;
uniform sampler2D particlesTexture;
uniform float show;
varying vec2 vUv;

void main(void)
{
	vec2 uv = gl_FragCoord.xy / resolution;
  vec4 color = texture2D(particlesTexture, vUv);
  float alpha = mix(0.0, color.a, show);
  if (alpha < 0.1) discard;
  gl_FragColor = vec4(color.rgb, alpha);
}
`;

export default shader