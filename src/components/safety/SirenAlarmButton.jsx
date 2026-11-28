import React, { useState, useRef } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

const SirenAlarmButton = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const startSiren = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        toast.error(isBn ? 'আপনার ব্রাউজারে অডিও এপিআই সমর্থিত নয়' : 'Web Audio API unavailable');
        return;
      }

      audioCtxRef.current = new AudioContext();
      oscRef.current = audioCtxRef.current.createOscillator();
      gainRef.current = audioCtxRef.current.createGain();

      oscRef.current.type = 'sawtooth';
      const now = audioCtxRef.current.currentTime;
      oscRef.current.frequency.setValueAtTime(800, now);

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
      toast.error(isBn ? 'বিপদকালীন সাইরেন চালু হয়েছে' : 'Emergency siren activated');
    } catch (e) {
      console.warn('Audio Siren Error:', e.message);
      toast.error(isBn ? 'সাইরেন চালু করা যায়নি' : 'Could not start siren');
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
    toast.success(isBn ? 'সাইরেন বন্ধ করা হয়েছে' : 'Emergency siren stopped');
  };

  return (
    <button
      onClick={() => (isPlaying ? stopSiren() : startSiren())}
      className={isPlaying ? 'btn-danger h-10 px-4 text-xs' : 'btn-outline h-10 px-4 text-xs'}
    >
      {isPlaying ? <FiVolumeX className="w-4 h-4 dispatch-icon" /> : <FiVolume2 className="w-4 h-4 text-[#e11d48] dispatch-icon" />}
      <span>{isPlaying ? t('safetyTools.stopSiren') : t('safetyTools.sirenAlarm')}</span>
    </button>
  );
};

export default SirenAlarmButton;
