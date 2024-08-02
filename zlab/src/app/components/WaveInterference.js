"use client";

import { useEffect, useRef } from "react";

export default function WaveInterference({ waveParams }) {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const uniformLocationsRef = useRef({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    glRef.current = gl;

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;

      // Uniforms
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

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(
          "An error occurred compiling the shaders: " +
            gl.getShaderInfoLog(shader)
        );
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    programRef.current = program;

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(
        "Unable to initialize the shader program: " +
          gl.getProgramInfoLog(program)
      );
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );
    uniformLocationsRef.current = {
      resolution: gl.getUniformLocation(program, "u_resolution"),
      time: gl.getUniformLocation(program, "u_time"),
      freq1: gl.getUniformLocation(program, "u_freq1"),
      freq2: gl.getUniformLocation(program, "u_freq2"),
      speed1: gl.getUniformLocation(program, "u_speed1"),
      speed2: gl.getUniformLocation(program, "u_speed2"),
      color: gl.getUniformLocation(program, "u_color"),
      bgColor: gl.getUniformLocation(program, "u_bgColor"),
    };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    function render(time) {
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(
        uniformLocationsRef.current.resolution,
        canvas.width,
        canvas.height
      );
      gl.uniform1f(uniformLocationsRef.current.time, time * 0.001);
      gl.uniform1f(uniformLocationsRef.current.freq1, waveParams.freq1);
      gl.uniform1f(uniformLocationsRef.current.freq2, waveParams.freq2);
      gl.uniform1f(uniformLocationsRef.current.speed1, waveParams.speed1);
      gl.uniform1f(uniformLocationsRef.current.speed2, waveParams.speed2);
      gl.uniform3fv(
        uniformLocationsRef.current.color,
        hexToRgb(waveParams.waveColor)
      );
      gl.uniform3fv(
        uniformLocationsRef.current.bgColor,
        hexToRgb(waveParams.bgColor)
      );

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      gl.deleteProgram(program);
    };
  }, []);

  useEffect(() => {
    if (glRef.current && programRef.current) {
      glRef.current.useProgram(programRef.current);
      glRef.current.uniform1f(
        uniformLocationsRef.current.freq1,
        waveParams.freq1
      );
      glRef.current.uniform1f(
        uniformLocationsRef.current.freq2,
        waveParams.freq2
      );
      glRef.current.uniform1f(
        uniformLocationsRef.current.speed1,
        waveParams.speed1
      );
      glRef.current.uniform1f(
        uniformLocationsRef.current.speed2,
        waveParams.speed2
      );
      glRef.current.uniform3fv(
        uniformLocationsRef.current.color,
        hexToRgb(waveParams.waveColor)
      );
      glRef.current.uniform3fv(
        uniformLocationsRef.current.bgColor,
        hexToRgb(waveParams.bgColor)
      );
    }
  }, [waveParams]);

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  }

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}
