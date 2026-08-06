import React, { useState, useRef } from 'react';
import { FiVolume2, FiVolumeX, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SirenAlarmButton = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);

  const startSiren = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        toast.error('Web Audio API not supported in this browser');
        return;
      }

      audioCtxRef.current = new AudioContext();
      oscRef.current = audioCtxRef.current.createOscillator();
      gainRef.current = audioCtxRef.current.createGain();

      oscRef.current.type = 'sawtooth';
      
      // Frequency Modulation for Siren Sweep (800Hz to 1600Hz)
      const now = audioCtxRef.current.currentTime;
      oscRef.current.frequency.setValueAtTime(800, now);
      
      // Continuous frequency sweep
      let freq = 800;
      let goingUp = true;
      const interval = setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          clearInterval(interval);
          return;
        }
        if (goingUp) {
          freq += 80;
          if (freq >= 1500) goingUp = false;
        } else {
          freq -= 80;
          if (freq <= 700) goingUp = true;
        }
        if (oscRef.current && oscRef.current.frequency) {
          oscRef.current.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
        }
      }, 50);

      gainRef.current.gain.setValueAtTime(0.8, now);

      oscRef.current.connect(gainRef.current);
      gainRef.current.connect(audioCtxRef.current.destination);

      oscRef.current.start();
      setIsPlaying(true);
      toast.error('🚨 Loud Emergency Siren Alarm Activated!');
    } catch (e) {
      console.warn('Audio Siren Error:', e.message);
      toast.error('Could not activate siren');
    }
  };

  const stopSiren = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
    }
    setIsPlaying(false);
    toast.success('Emergency siren deactivated');
  };

  const toggleSiren = () => {
    if (isPlaying) {
      stopSiren();
    } else {
      startSiren();
    }
  };

  return (
    <button
      onClick={toggleSiren}
      className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition active:scale-95 shadow-sm ${
        isPlaying
          ? 'bg-rose-600 text-white animate-bounce ring-4 ring-rose-500/30'
          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:bg-rose-500/10 hover:text-rose-600'
      }`}
    >
      {isPlaying ? <FiVolumeX className="w-4 h-4" /> : <FiVolume2 className="w-4 h-4" />}
      <span>{isPlaying ? 'STOP SIREN (100dB)' : 'LOUD SIREN ALARM'}</span>
    </button>
  );
};

export default SirenAlarmButton;
