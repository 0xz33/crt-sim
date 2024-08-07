// Default values
const defaultValues = {
  freq1: 2222,
  freq2: 11,
  speed1: 55,
  speed2: 1,
  waveColor: "#DCD7F4",
  boxColor: "#DCD7F4",
  shadowIntensity: 5,
  bgColor: "#DCD7F4",
  textBlur: 2,
};

const canvas = document.getElementById("waveCanvas");
const gl = canvas.getContext("webgl");

// ... (rest of the existing JavaScript)

// Move the shader sources to separate variables
const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_freq1;
  uniform float u_freq2;
  uniform float u_speed1;
  uniform float u_speed2;
  uniform vec3 u_color;
  uniform vec3 u_bgColor;

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    float wave1 = sin(st.x * u_freq1 + u_time * u_speed1) * 0.5 + 0.5;
    float wave2 = sin(st.y * u_freq2 + u_time * u_speed2) * 0.5 + 0.5;
    float interference = (wave1 + wave2) / 2.0;
    vec3 waveColor = u_color * interference;
    gl_FragColor = vec4(mix(u_bgColor, waveColor, interference), 1.0);
  }
`;

// ... (rest of the existing JavaScript)

// Make sure to call createTiledLogo() initially and on window resize
window.addEventListener("resize", createTiledLogo);
createTiledLogo();

requestAnimationFrame(render);
