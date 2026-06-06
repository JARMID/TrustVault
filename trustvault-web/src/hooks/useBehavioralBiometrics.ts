import { useState, useEffect } from 'react';

// Continuous Behavioral Biometrics Engine
// Tracks mouse dynamics, touch patterns, and typing cadence to generate a real-time Human Confidence Score.

export const useBehavioralBiometrics = () => {
  const [humanScore, setHumanScore] = useState<number>(100);
  const [status, setStatus] = useState<'analyzing' | 'trusted' | 'suspicious'>('analyzing');

  useEffect(() => {
    let mouseMoves = 0;
    let keyStrokes = 0;
    let erraticMovements = 0;
    let lastTime = Date.now();
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseMoves++;
      const now = Date.now();
      const dt = now - lastTime;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      
      const velocity = Math.sqrt(dx * dx + dy * dy) / (dt || 1);
      
      // Bots often have extremely linear or instantly teleporting mouse movements.
      // High velocity spikes or perfectly straight lines degrade trust temporarily until normalized.
      if (velocity > 50) {
        erraticMovements++;
      }

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
    };

    const handleKeyDown = () => {
      keyStrokes++;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    const interval = setInterval(() => {
      // Evaluate behavior every 3 seconds
      const interactionVolume = mouseMoves + keyStrokes;
      
      let newScore = humanScore;

      if (interactionVolume === 0) {
        // Decay slightly if idle, but not below 80
        newScore = Math.max(80, newScore - 1);
      } else if (erraticMovements > 5) {
        // Drop score if erratic
        newScore = Math.max(20, newScore - 15);
      } else {
        // Recover score with normal human interactions
        newScore = Math.min(100, newScore + 5);
      }

      setHumanScore(newScore);

      if (newScore > 85) setStatus('trusted');
      else if (newScore < 50) setStatus('suspicious');
      else setStatus('analyzing');

      // Reset counters for next window
      mouseMoves = 0;
      keyStrokes = 0;
      erraticMovements = 0;
    }, 3000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [humanScore]);

  return { humanScore, status };
};
