"use client";

import { useState } from "react";
import styles from "../crt/crt.module.css";

export default function ControlPanel({
  waveParams,
  textParams,
  updateWaveParams,
  updateTextParams,
  resetToDefault,
  onWaveParamChange,
}) {
  const [isMinimized, setIsMinimized] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id in waveParams) {
      updateWaveParams({ ...waveParams, [id]: parseFloat(value) });
    } else if (id in textParams) {
      updateTextParams({ ...textParams, [id]: parseFloat(value) });
    }
  };

  const handleColorChange = (e) => {
    const { id, value } = e.target;
    updateWaveParams({ ...waveParams, [id]: value });
  };

  const handleIncrement = (id) => {
    if (id in waveParams) {
      updateWaveParams({
        ...waveParams,
        [id]: parseFloat((waveParams[id] + 0.1).toFixed(1)),
      });
    }
  };

  const handleDecrement = (id) => {
    if (id in waveParams) {
      updateWaveParams({
        ...waveParams,
        [id]: parseFloat((waveParams[id] - 0.1).toFixed(1)),
      });
    }
  };

  return (
    <div
      className={`${styles.controls} ${isMinimized ? styles.minimized : ""}`}
    >
      <button
        className={styles.minimizeBtn}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        {isMinimized ? "+" : "-"}
      </button>
      <div className={styles.controlTitle}>Control Panel</div>
      <div className={styles.controlPanel}>
        <h2>Wave Parameters</h2>
        {Object.entries(waveParams).map(([key, value]) => (
          <div key={key}>
            <label htmlFor={key}>{key}:</label>
            <input
              type={key.includes("Color") ? "color" : "number"}
              id={key}
              name={key}
              value={value}
              onChange={onWaveParamChange}
            />
          </div>
        ))}
        {["freq1", "freq2", "speed1", "speed2"].map((param) => (
          <div key={param} className={styles.inputGroup}>
            <label>{param.charAt(0).toUpperCase() + param.slice(1)}:</label>
            <button
              className={styles.decrement}
              onClick={() => handleDecrement(param)}
            >
              -
            </button>
            <input
              type="number"
              id={param}
              value={waveParams[param]}
              onChange={handleInputChange}
              step="0.1"
            />
            <button
              className={styles.increment}
              onClick={() => handleIncrement(param)}
            >
              +
            </button>
          </div>
        ))}
        {["waveColor", "boxColor", "bgColor"].map((color) => (
          <div key={color} className={styles.colorInputGroup}>
            <label>{color.charAt(0).toUpperCase() + color.slice(1)}:</label>
            <input
              type="color"
              id={color}
              value={waveParams[color]}
              onChange={handleColorChange}
            />
            <input
              type="text"
              id={`${color}Hex`}
              value={waveParams[color]}
              onChange={handleColorChange}
            />
          </div>
        ))}
        {["shadowIntensity", "textBlur"].map((param) => (
          <div key={param} className={styles.inputGroup}>
            <label>{param.charAt(0).toUpperCase() + param.slice(1)}:</label>
            <input
              type="range"
              id={param}
              min="0"
              max={param === "shadowIntensity" ? "20" : "10"}
              value={textParams[param]}
              onChange={handleInputChange}
              step={param === "textBlur" ? "0.1" : "1"}
            />
          </div>
        ))}
        <button onClick={resetToDefault}>Reset to Default</button>
      </div>
    </div>
  );
}
