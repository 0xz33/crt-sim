import React, { createContext, useState, useContext } from "react";

const WaveContext = createContext();

export const WaveProvider = ({ children }) => {
  const [waveParams, setWaveParams] = useState({
    freq1: 2222,
    freq2: 11,
    speed1: 55,
    speed2: 1,
    waveColor: "#DCD7F4",
    boxColor: "#DCD7F4",
    bgColor: "#000000",
  });

  return (
    <WaveContext.Provider value={{ waveParams, setWaveParams }}>
      {children}
    </WaveContext.Provider>
  );
};

export const useWave = () => useContext(WaveContext);
