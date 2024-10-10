"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

const WaveShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(),
    uFreq1: 0,
    uFreq2: 0,
    uSpeed1: 0,
    uSpeed2: 0,
    uColor: new THREE.Color(),
    uBgColor: new THREE.Color(),
  },
  // Vertex shader
  `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uFreq1;
    uniform float uFreq2;
    uniform float uSpeed1;
    uniform float uSpeed2;
    uniform vec3 uColor;
    uniform vec3 uBgColor;

    void main() {
      vec2 st = gl_FragCoord.xy / uResolution;
      float wave1 = sin(st.x * uFreq1 + uTime * uSpeed1) * 0.5 + 0.5;
      float wave2 = sin(st.y * uFreq2 + uTime * uSpeed2) * 0.5 + 0.5;
      float interference = (wave1 + wave2) / 2.0;
      vec3 waveColor = uColor * interference;
      gl_FragColor = vec4(mix(uBgColor, waveColor, interference), 1.0);
    }
  `
);

// Extend Three.js with our custom shader material
extend({ WaveShaderMaterial });

export function ShaderBackground({ waveParams }) {
  const shaderRef = useRef();

  const uniforms = useMemo(
    () => ({
      uResolution: { value: new THREE.Vector2() },
      uFreq1: { value: waveParams.freq1 },
      uFreq2: { value: waveParams.freq2 },
      uSpeed1: { value: waveParams.speed1 },
      uSpeed2: { value: waveParams.speed2 },
      uColor: { value: new THREE.Color(waveParams.waveColor) },
      uBgColor: { value: new THREE.Color(waveParams.bgColor) },
    }),
    [waveParams]
  );

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uTime = state.clock.elapsedTime;
      shaderRef.current.uResolution.set(state.size.width, state.size.height);
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <waveShaderMaterial ref={shaderRef} {...uniforms} />
    </mesh>
  );
}

// Remove this line as it's not necessary
// export const WaveShaderMaterialImpl = new WaveShaderMaterial();
