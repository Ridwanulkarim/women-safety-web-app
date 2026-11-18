import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useSOS } from './SOSContext';
import { useGeolocation } from '../hooks/useGeolocation';

const VoiceSOSContext = createContext();

// Regular expressions for distress keywords in Bangla and English
const BENGALI_DISTRESS_REGEX = /(বাঁচাও|বাচাও|বাঁচান|বাচান|আমাকে বাঁচাও|আমাকে বাঁচান|আমাকে সাহায্য করুন|সাহায্য করুন|সাহায্য চাই|বিপদ|হেল্প|ইমার্জেন্সি|আমাকে হেল্প করুন|পুলিশ ডাকুন|রক্ষা করো)/i;
const ENGLISH_DISTRESS_REGEX = /\b(help|emergency|danger|save me|police|distress|attack|attacked|help me|call 999|call police|sos)\b/i;
const PHONETIC_DISTRESS_REGEX = /\b(bachao|banchao|bachan|sahajjo|sahajjo korun|bipad|bachao bachao)\b/i;

export const VoiceSOSProvider = ({ children }) => {
  const { sendSOSAlert, isSOSActive, resolveSOS } = useSOS();
  const location = useGeolocation(true);

  // Guardian Mode State
  const [isGuardianActive, setIsGuardianActive] = useState(() => {
    try {
      const stored = localStorage.getItem('safehaven_voice_guardian_active');
      return stored ? JSON.parse(stored) : false;
    } catch (e) {
      return false;
    }
  });

  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [lastDetectedPhrase, setLastDetectedPhrase] = useState('');
  const [isEmergencyTriggered, setIsEmergencyTriggered] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [guardianLanguage, setGuardianLanguage] = useState('bn-BD'); // 'bn-BD', 'en-US', or 'auto'
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  // Refs for audio oscillator & recognition instance
  const recognitionRef = useRef(null);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);
  const sirenIntervalRef = useRef(null);
  const countdownTimerRef = useRef(null);

  // Sync ref with states for event handlers
  const isGuardianActiveRef = useRef(isGuardianActive);
  isGuardianActiveRef.current = isGuardianActive;

  const isEmergencyTriggeredRef = useRef(isEmergencyTriggered);
  isEmergencyTriggeredRef.current = isEmergencyTriggered;

  // Check Web Speech API support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
    }
  }, []);

  // Web Audio API Siren Generator (Self-contained, guaranteed loud sweep)
  const startSirenAudio = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContext();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Stop previous instance if any
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch (e) {}
      }

      oscRef.current = ctx.createOscillator();
      gainRef.current = ctx.createGain();

      oscRef.current.type = 'sawtooth';
      const now = ctx.currentTime;
      oscRef.current.frequency.setValueAtTime(850, now);

      // Pitch sweep simulation (800Hz to 1600Hz)
      let freq = 850;
      let goingUp = true;
      if (sirenIntervalRef.current) clearInterval(sirenIntervalRef.current);
      sirenIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          clearInterval(sirenIntervalRef.current);
          return;
        }
        if (goingUp) {
          freq += 90;
          if (freq >= 1650) goingUp = false;
        } else {
          freq -= 90;
          if (freq <= 750) goingUp = true;
        }
        if (oscRef.current && oscRef.current.frequency) {
          try {
            oscRef.current.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
          } catch (e) {}
        }
      }, 50);

      gainRef.current.gain.setValueAtTime(0.85, now);
      oscRef.current.connect(gainRef.current);
      gainRef.current.connect(ctx.destination);

      oscRef.current.start();
      setIsSirenPlaying(true);
    } catch (err) {
      console.warn('Web Audio Siren warning:', err.message);
    }
  }, []);

  const stopSirenAudio = useCallback(() => {
    if (sirenIntervalRef.current) {
      clearInterval(sirenIntervalRef.current);
      sirenIntervalRef.current = null;
    }
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    setIsSirenPlaying(false);
  }, []);

  // Text-To-Speech Audible confirmation
  const speakVoiceNotice = useCallback((text, lang = 'bn-BD') => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 1.05;
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {}
  }, []);

  // Execute actual SOS Dispatch
  const executeSOSDispatch = useCallback(async (phrase) => {
    const triggerSource = `VOICE_COMMAND: "${phrase || 'Distress Keyword'}"`;
    toast.error(`🚨 AI VOICE SOS ACTIVATED: "${phrase || 'Emergency'}" detected!`, { duration: 6000 });

    try {
      await sendSOSAlert({
        latitude: location?.latitude || 23.8103,
        longitude: location?.longitude || 90.4125,
        address: location?.address ? `[Voice SOS] ${location.address}` : 'Live GPS Geolocation',
        accuracy: location?.accuracy || 50,
        triggerPhrase: phrase,
        category: 'Voice-Activated Distress Alert'
      });
      speakVoiceNotice('জরুরি বিপদ সংকেত পাঠানো হয়েছে এবং লাইভ লোকেশন শেয়ার করা হয়েছে।', 'bn-BD');
    } catch (e) {
      console.error('Failed to dispatch Voice SOS alert:', e);
    }
  }, [sendSOSAlert, location, speakVoiceNotice]);

  // Trigger Distress Sequence (5-second cancel countdown + siren)
  const triggerDistressSequence = useCallback((detectedWord) => {
    if (isEmergencyTriggeredRef.current) return;

    setLastDetectedPhrase(detectedWord);
    setIsEmergencyTriggered(true);
    setCountdown(5);

    // Haptic vibration feedback
    if (navigator.vibrate) {
      navigator.vibrate([300, 100, 300, 100, 500]);
    }

    // Start siren immediately
    startSirenAudio();

    // Spoken alarm announcement
    speakVoiceNotice('বিপদ সংকেত শনাক্ত হয়েছে! লাইভ জিপিএস লোকেশন সহ জরুরি এসওএস পাঠানো হচ্ছে।', 'bn-BD');

    // Start 5-second countdown timer
    let count = 5;
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
        executeSOSDispatch(detectedWord);
      }
    }, 1000);
  }, [startSirenAudio, speakVoiceNotice, executeSOSDispatch]);

  // Cancel Emergency Countdown (False Alarm Abort)
  const cancelEmergencyCountdown = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    stopSirenAudio();
    setIsEmergencyTriggered(false);
    setCountdown(5);
    setLastDetectedPhrase('');

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    toast.success('ভয়েস এলার্ট বাতিল করা হয়েছে (False Alarm Cancelled).');

    // Resume listening if Guardian mode is still on
    if (isGuardianActiveRef.current) {
      setTimeout(() => {
        try {
          if (recognitionRef.current) {
            recognitionRef.current.start();
          }
        } catch (e) {}
      }, 500);
    }
  }, [stopSirenAudio]);

  // Send Immediately (skip countdown)
  const triggerImmediateSOS = useCallback((phrase = 'Manual Trigger') => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCountdown(0);
    startSirenAudio();
    executeSOSDispatch(phrase);
  }, [startSirenAudio, executeSOSDispatch]);

  // Check speech transcript for distress keywords
  const evaluateSpeechTranscript = useCallback((transcript) => {
    if (!transcript || isEmergencyTriggeredRef.current) return;
    const cleanText = transcript.trim().toLowerCase();
    setLiveTranscript(cleanText);

    // 1. Check Bengali distress words
    const bnMatch = cleanText.match(BENGALI_DISTRESS_REGEX);
    if (bnMatch) {
      triggerDistressSequence(bnMatch[0]);
      return;
    }

    // 2. Check English distress words
    const enMatch = cleanText.match(ENGLISH_DISTRESS_REGEX);
    if (enMatch) {
      triggerDistressSequence(enMatch[0]);
      return;
    }

    // 3. Check phonetic spellings
    const phoneticMatch = cleanText.match(PHONETIC_DISTRESS_REGEX);
    if (phoneticMatch) {
      triggerDistressSequence(phoneticMatch[0]);
      return;
    }
  }, [triggerDistressSequence]);

  // Start Speech Recognition Engine
  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('ভয়েস ডিটেকশনের জন্য Google Chrome, Edge অথবা Safari ব্রাউজার ব্যবহার করুন।');
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;
      recognition.lang = guardianLanguage;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let fullTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i][0];
          if (item && item.transcript) {
            fullTranscript += ' ' + item.transcript;
          }
        }
        evaluateSpeechTranscript(fullTranscript);
      };

      recognition.onerror = (event) => {
        if (event.error === 'no-speech') {
          // Normal silence, ignore
          return;
        }
        if (event.error === 'not-allowed') {
          toast.error('মাইক্রোফোন পারমিশন প্রয়োজন! ব্রাউজার সেটিংসে গিয়ে পারমিশন দিন।');
          setIsGuardianActive(false);
          setIsListening(false);
          return;
        }
        console.warn('Speech Recognition notice:', event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Automatically restart speech engine if Guardian is still ON and not in emergency
        if (isGuardianActiveRef.current && !isEmergencyTriggeredRef.current) {
          setTimeout(() => {
            if (isGuardianActiveRef.current && !isEmergencyTriggeredRef.current) {
              try {
                recognition.start();
              } catch (e) {
                // ignore re-start race condition
              }
            }
          }, 250);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('SpeechRecognition start error:', err.message);
    }
  }, [guardianLanguage, evaluateSpeechTranscript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Guardian Toggle Handler
  const toggleGuardian = useCallback(() => {
    const nextState = !isGuardianActive;
    setIsGuardianActive(nextState);
    localStorage.setItem('safehaven_voice_guardian_active', JSON.stringify(nextState));

    if (nextState) {
      startListening();
      toast.success('🎙️ হ্যান্ডস-ফ্রি এআই ভয়েস এসওএস গার্ডিয়ান সক্রিয় হয়েছে! বিপদে "Help" বা "বাঁচাও" বলুন।', {
        duration: 5000,
        icon: '🛡️'
      });
    } else {
      stopListening();
      stopSirenAudio();
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      setIsEmergencyTriggered(false);
      toast('হ্যান্ডস-ফ্রি গার্ডিয়ান মোড বন্ধ করা হয়েছে।', { icon: 'ℹ️' });
    }
  }, [isGuardianActive, startListening, stopListening, stopSirenAudio]);

  // Restart listening if language changes while active
  useEffect(() => {
    if (isGuardianActive) {
      stopListening();
      startListening();
    }
  }, [guardianLanguage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
      stopSirenAudio();
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [stopListening, stopSirenAudio]);

  return (
    <VoiceSOSContext.Provider
      value={{
        isGuardianActive,
        isListening,
        liveTranscript,
        lastDetectedPhrase,
        isEmergencyTriggered,
        countdown,
        isSirenPlaying,
        guardianLanguage,
        setGuardianLanguage,
        isSpeechSupported,
        toggleGuardian,
        cancelEmergencyCountdown,
        triggerImmediateSOS,
        triggerDistressSequence, // Available for instant simulated testing
        stopSirenAudio
      }}
    >
      {children}
    </VoiceSOSContext.Provider>
  );
};

export const useVoiceSOS = () => useContext(VoiceSOSContext);
