"use client";

import { useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import WaveInterference from "../components/WaveInterference";
import ControlPanel from "../components/ControlPanel";
import { ShaderBackground } from "../components/ShaderBackground";
import styles from "./crt.module.css";

export default function CRTPage() {
  const [waveParams, setWaveParams] = useState({
    freq1: 2222,
    freq2: 11,
    speed1: 55,
    speed2: 1,
    waveColor: "#DCD7F4",
    boxColor: "#DCD7F4",
    bgColor: "#000000",
  });
  const [textParams, setTextParams] = useState({
    shadowIntensity: 22,
    textBlur: 4,
  });

  const updateWaveParams = useCallback((newParams) => {
    setWaveParams((prevParams) => ({ ...prevParams, ...newParams }));
  }, []);

  const updateTextParams = useCallback((newParams) => {
    setTextParams((prevParams) => ({ ...prevParams, ...newParams }));
  }, []);

  const handleWaveParamChange = useCallback((event) => {
    const { name, value } = event.target;
    setWaveParams((prevParams) => ({
      ...prevParams,
      [name]: name.includes("Color") ? value : Number(value),
    }));
  }, []);

  // This effect will log changes to waveParams and textParams
  useEffect(() => {
    console.log("Wave parameters updated:", waveParams);
  }, [waveParams]);

  useEffect(() => {
    console.log("Text parameters updated:", textParams);
  }, [textParams]);

  const resetToDefault = useCallback(() => {
    setWaveParams({
      freq1: 2222,
      freq2: 11,
      speed1: 20,
      speed2: 1,
      waveColor: "#DCD7F4",
      boxColor: "#DCD7F4",
      bgColor: "#000000",
    });
    setTextParams({
      shadowIntensity: 22,
      textBlur: 4,
    });
  }, []);

  return (
    <main className={styles.main}>
      <h1>CRT Experiment</h1>
      <p>Welcome to the Cognitive Reflection Test experiment.</p>
      <ControlPanel
        waveParams={waveParams}
        textParams={textParams}
        updateWaveParams={updateWaveParams}
        updateTextParams={updateTextParams}
        resetToDefault={resetToDefault}
        onWaveParamChange={handleWaveParamChange}
      />
      <div id="text-container" className={styles.textContainer}>
        <div
          id="believe-text"
          className={styles.believeText}
          style={{
            textShadow: `0 0 ${textParams.shadowIntensity}px ${waveParams.waveColor}`,
            filter: `blur(${textParams.textBlur}px)`,
          }}
        >
          BELIEVE
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      >
        <Canvas>
          <ShaderBackground waveParams={waveParams} />
        </Canvas>
      </div>
    </main>
  );
}
