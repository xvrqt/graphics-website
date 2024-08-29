export const fragment_shader_source = `#version 300 es 
precision highp float;

#define PI 3.1415926535
#define RGB /255.0 // e.g. 255.0 RGB -> (255.0 / 255.0) -> 1.0

// Time in milliseconds that has elapsed
uniform float time;
// Resolution of the canvas
uniform vec2 resolution;

out vec4 fragColor;
void main() {
  vec2 st = ((gl_FragCoord.xy / resolution.xy) * 2.0) - 1.0;
  vec3 color = vec3(st, 0.0);
  // Output Color
  fragColor = vec4(color, 1);
}
`;

export const stars_fragment_shader = `#version 300 es
precision highp float;

#define iterations 17
#define formuparam 0.53

#define volsteps 20
#define stepsize 0.1

#define zoom   0.800
#define tile   0.850
#define speed  0.000005

#define brightness 0.0015
#define darkmatter 0.300
#define distfading 0.730
#define saturation 0.850

// Time in milliseconds that has elapsed
uniform float time;
// Resolution of the canvas
uniform vec2 resolution;

out vec4 fragColor;
void main() {
    // Setup normalized coordinates, time, and view dierection
	vec2 uv = gl_FragCoord.xy / resolution.xy - 0.5;
	uv.y *= resolution.y / resolution.x;
	vec3 dir = vec3(uv * zoom, 1.0);
	float time = time * speed;

	vec3 from = vec3(1.0, 0.5, 0.5);
	from += vec3(time * 2.0, time, -2.0);
	
	// Volumetric rendering
	float s = 0.1;
    float fade = 1.0;
	vec3 v = vec3(0.0);
	for(int r=0; r<volsteps; r++) {
		vec3 p=from+s*dir*.5;
		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
		float pa,a=pa=0.;
		for (int i=0; i<iterations; i++) { 
			p=abs(p)/dot(p,p)-formuparam; // the magic formula
			a+=abs(length(p)-pa); // absolute sum of average change
			pa=length(p);
		}
		float dm=max(0.,darkmatter-a*a*.001); //dark matter
		a*=a*a; // add contrast
		if (r>6) fade*=1.-dm; // dark matter, don't render near
		//v+=vec3(dm,dm*.5,0.);
		v+=fade;
		v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
		fade*=distfading; // distance fading
		s+=stepsize;
	}
	v=mix(vec3(length(v)),v,saturation); //color adjust
	fragColor = vec4(v*.01,1.);	
}
`;

export const vertex_shader_source = `#version 300 es
in vec4 position;

void main() {
  // Vertices of our lone triangle
  vec2 vertices[3] = vec2[3](vec2(-1,-1), vec2(3,-1), vec2(-1, 3));
  // Pass each vertex with each call, convert to homogeneous vectors
  gl_Position = vec4(vertices[gl_VertexID],0,1);
}
`;
