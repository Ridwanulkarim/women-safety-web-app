import React, { useState, useEffect } from 'react';
import { FiPhoneCall, FiPhoneOff, FiX, FiClock, FiUser, FiVolume2 } from 'react-icons/fi';

const FakeCallModal = ({ isOpen, onClose }) => {
  const [callerName, setCallerName] = useState('Mom');
  const [callerNumber, setCallerNumber] = useState('+880 1711-000000');
  const [delaySeconds, setDelaySeconds] = useState(5);
  const [callState, setCallState] = useState('IDLE'); // IDLE, COUNTDOWN, RINGING, CONNECTED
  const [countdown, setCountdown] = useState(0);
  const [callDuration, setCallDuration] = useState(0);

  // Handle Countdown
  useEffect(() => {
    let timer;
    if (callState === 'COUNTDOWN' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (callState === 'COUNTDOWN' && countdown === 0) {
      setCallState('RINGING');
    }
    return () => clearInterval(timer);
  }, [callState, countdown]);

  // Handle Connected Call Duration
  useEffect(() => {
    let timer;
    if (callState === 'CONNECTED') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  if (!isOpen) return null;

  const startFakeCall = () => {
    setCountdown(delaySeconds);
    setCallState('COUNTDOWN');
  };

  const handleAnswer = () => {
    setCallState('CONNECTED');
  };

  const handleEndCall = () => {
    setCallState('IDLE');
    onClose();
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      
      {/* 1. CONFIGURATION STAGE */}
      {callState === 'IDLE' && (
        <div className="relative max-w-md w-full product-card p-6 space-y-6 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg bg-zinc-100 dark:bg-zinc-800"
          >
            <FiX className="w-4 h-4" />
          </button>

          <div className="space-y-1">
            <span className="mono-tag mono-tag-rose">Tactile Safety Tool</span>
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white font-heading">
              Fake Call Generator
            </h3>
            <p className="text-xs text-zinc-500">
              Simulate a realistic incoming phone call to safely excuse yourself from uncomfortable situations.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="human-label">Caller Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-3 text-zinc-400" />
                <input
                  type="text"
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  className="human-input human-input-has-icon"
                  placeholder="e.g. Mom, Officer Rahman, Boss"
                />
              </div>
            </div>

            <div>
              <label className="human-label">Phone Number Display</label>
              <input
                type="text"
                value={callerNumber}
                onChange={(e) => setCallerNumber(e.target.value)}
                className="human-input"
                placeholder="+880 17xx-xxxxxx"
              />
            </div>

            <div>
              <label className="human-label">Call Delay (Seconds)</label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 30].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setDelaySeconds(s)}
                    className={`py-2 rounded-lg text-xs font-mono font-medium border transition ${
                      delaySeconds === s
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white font-bold'
                        : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {s} Secs
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startFakeCall}
              className="w-full btn-solid py-3 text-xs uppercase font-mono tracking-wider"
            >
              <FiPhoneCall /> Schedule Fake Call ({delaySeconds}s)
            </button>
          </div>
        </div>
      )}

      {/* 2. COUNTDOWN STAGE */}
      {callState === 'COUNTDOWN' && (
        <div className="max-w-sm w-full product-card p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center text-2xl font-bold font-mono animate-pulse">
            {countdown}s
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-heading">Incoming Call Scheduled</h3>
            <p className="text-xs text-zinc-500">Lock your phone screen or keep it facing up. Incoming call will ring in {countdown} seconds.</p>
          </div>
          <button
            onClick={() => setCallState('IDLE')}
            className="w-full btn-outline text-xs"
          >
            Cancel Call
          </button>
        </div>
      )}

      {/* 3. INCOMING RINGING SCREEN (Simulated Real Mobile Call Screen) */}
      {callState === 'RINGING' && (
        <div className="fixed inset-0 z-50 bg-zinc-950 text-white flex flex-col justify-between p-8 sm:p-12 animate-fade-in">
          <div className="text-center space-y-3 pt-12">
            <div className="w-24 h-24 mx-auto rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-3xl font-bold text-zinc-300 shadow-2xl">
              {callerName.charAt(0)}
            </div>
            <h2 className="text-3xl font-extrabold font-heading text-white">{callerName}</h2>
            <p className="text-sm font-mono text-zinc-400">{callerNumber}</p>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs animate-pulse">
              Incoming Call...
            </span>
          </div>

          {/* Action Accept / Reject Controls */}
          <div className="flex items-center justify-around pb-12">
            <div className="text-center space-y-2">
              <button
                onClick={handleEndCall}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-2xl shadow-xl active:scale-95 transition"
              >
                <FiPhoneOff />
              </button>
              <span className="block text-xs font-mono text-zinc-400">Decline</span>
            </div>

            <div className="text-center space-y-2">
              <button
                onClick={handleAnswer}
                className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center text-2xl shadow-xl active:scale-95 transition animate-bounce"
              >
                <FiPhoneCall />
              </button>
              <span className="block text-xs font-mono text-zinc-400">Answer</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. CONNECTED CALL SCREEN */}
      {callState === 'CONNECTED' && (
        <div className="fixed inset-0 z-50 bg-zinc-950 text-white flex flex-col justify-between p-8 sm:p-12">
          <div className="text-center space-y-3 pt-12">
            <div className="w-24 h-24 mx-auto rounded-full bg-emerald-900/40 border-2 border-emerald-500 flex items-center justify-center text-3xl font-bold text-emerald-400 shadow-2xl">
              {callerName.charAt(0)}
            </div>
            <h2 className="text-3xl font-extrabold font-heading text-white">{callerName}</h2>
            <p className="text-sm font-mono text-emerald-400 font-bold">{formatTime(callDuration)}</p>
            <p className="text-xs text-zinc-400">Call Connected • Audio Active</p>
          </div>

          <div className="max-w-xs mx-auto p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
            <FiVolume2 className="w-5 h-5 mx-auto text-emerald-400" />
            <p className="text-xs text-zinc-300">Simulated Conversation Active</p>
            <p className="text-[11px] text-zinc-500">"Hey, where are you right now? I am waiting outside..."</p>
          </div>

          <div className="flex justify-center pb-12">
            <button
              onClick={handleEndCall}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-2xl shadow-xl active:scale-95 transition"
            >
              <FiPhoneOff />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default FakeCallModal;
