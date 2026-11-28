import React, { useState, useEffect } from 'react';
import { FiPhoneCall, FiPhoneOff, FiX, FiUser, FiVolume2 } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { toBengaliDigits, localizeNum } from '../../utils/helpers';

const FakeCallModal = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [callerName, setCallerName] = useState(isBn ? 'আম্মু (Mom)' : 'Mom');
  const [callerNumber, setCallerNumber] = useState('+880 1711-000000');
  const [delaySeconds, setDelaySeconds] = useState(5);
  const [callState, setCallState] = useState('IDLE');
  const [countdown, setCountdown] = useState(0);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let timer;
    if (callState === 'COUNTDOWN' && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (callState === 'COUNTDOWN' && countdown === 0) {
      setCallState('RINGING');
    }
    return () => clearInterval(timer);
  }, [callState, countdown]);

  useEffect(() => {
    let timer;
    if (callState === 'CONNECTED') {
      timer = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
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

  const handleAnswer = () => setCallState('CONNECTED');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
      {callState === 'IDLE' && (
        <div className="relative max-w-md w-full surface-panel p-6 sm:p-8 space-y-6 shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#737373] dark:text-[#85858b] hover:text-[#171717] dark:hover:text-[#ededed] flex items-center justify-center cursor-pointer"
            title={t('common.close')}
          >
            <FiX className="w-4 h-4 dispatch-icon" />
          </button>

          <div className="space-y-1.5">
            <span className="status-tag">{isBn ? 'নিরাপদ প্রস্থান টুল' : 'Escape simulator'}</span>
            <h2 className="text-xl font-medium text-[#171717] dark:text-[#ededed]">
              {t('safetyTools.fakeCallTitle')}
            </h2>
            <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
              {t('safetyTools.fakeCallDesc')}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="human-label">{t('safetyTools.callerName')}</label>
              <div className="relative">
                <FiUser className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
                <input
                  type="text"
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  className="human-input human-input-has-icon"
                  placeholder={isBn ? 'আম্মু' : 'Mom'}
                />
              </div>
            </div>

            <div>
              <label className="human-label">{t('safetyTools.callerNumber')}</label>
              <input
                type="text"
                value={callerNumber}
                onChange={(e) => setCallerNumber(e.target.value)}
                className="human-input font-mono tabular-nums"
                placeholder="+880 1700-000000"
              />
            </div>

            <div>
              <label className="human-label">{t('safetyTools.callDelay')}</label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 30].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setDelaySeconds(s)}
                    className={`h-9 rounded-lg text-xs font-mono tabular-nums font-medium border transition-colors cursor-pointer ${
                      delaySeconds === s
                        ? 'bg-[#171717] dark:bg-[#ededed] text-[#ffffff] dark:text-[#141415] border-transparent'
                        : 'bg-[#f4f4f5] dark:bg-[#232325] text-[#525252] dark:text-[#a1a1a6] border-zinc-900/[0.08] dark:border-white/[0.08]'
                    }`}
                  >
                    {localizeNum(s, isBn)} {isBn ? 'সেকেন্ড' : 's'}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={startFakeCall} className="w-full btn-solid h-11 text-sm">
              <FiPhoneCall className="w-4 h-4 dispatch-icon" />
              {isBn ? `কল শুরু করুন (${toBengaliDigits(delaySeconds)} সে.)` : `Schedule call (${delaySeconds}s)`}
            </button>
          </div>
        </div>
      )}

      {callState === 'COUNTDOWN' && (
        <div className="max-w-sm w-full surface-panel p-8 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#f4f4f5] dark:bg-[#232325] border border-zinc-900/[0.08] dark:border-white/[0.08] text-[#171717] dark:text-[#ededed] flex items-center justify-center text-2xl font-mono tabular-nums font-medium">
            {isBn ? `${toBengaliDigits(countdown)} সে.` : `${countdown}s`}
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-[#171717] dark:text-[#ededed]">
              {t('safetyTools.incomingCallScheduled')}
            </h2>
            <p className="text-xs text-[#525252] dark:text-[#a1a1a6]">
              {isBn
                ? `${toBengaliDigits(countdown)} সেকেন্ডের মধ্যে ইনকামিং কল শুরু হবে।`
                : `Incoming call screen activates in ${countdown} seconds.`}
            </p>
          </div>
          <button onClick={() => setCallState('IDLE')} className="w-full btn-outline h-10 text-xs">
            {t('safetyTools.cancelCall')}
          </button>
        </div>
      )}

      {callState === 'RINGING' && (
        <div className="fixed inset-0 z-50 bg-[#0f0f10] text-[#ededed] flex flex-col justify-between p-8 sm:p-12">
          <div className="text-center space-y-3 pt-12">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#232325] border border-white/10 flex items-center justify-center text-2xl font-medium">
              {callerName.charAt(0)}
            </div>
            <h2 className="text-3xl font-medium text-[#ededed]">{callerName}</h2>
            <p className="text-sm font-mono tabular-nums text-[#a1a1a6]">{callerNumber}</p>
            <span className="status-tag">{t('safetyTools.incomingCall')}</span>
          </div>

          <div className="flex items-center justify-center gap-16 pb-12">
            <div className="text-center space-y-2">
              <button
                onClick={handleEndCall}
                className="w-16 h-16 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <FiPhoneOff className="w-6 h-6 dispatch-icon" />
              </button>
              <span className="block text-xs text-[#a1a1a6]">{t('safetyTools.decline')}</span>
            </div>

            <div className="text-center space-y-2">
              <button
                onClick={handleAnswer}
                className="w-16 h-16 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <FiPhoneCall className="w-6 h-6 dispatch-icon" />
              </button>
              <span className="block text-xs text-[#a1a1a6]">{t('safetyTools.answer')}</span>
            </div>
          </div>
        </div>
      )}

      {callState === 'CONNECTED' && (
        <div className="fixed inset-0 z-50 bg-[#0f0f10] text-[#ededed] flex flex-col justify-between p-8 sm:p-12">
          <div className="text-center space-y-2.5 pt-12">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#4cc38a]/15 border border-[#4cc38a]/40 flex items-center justify-center text-2xl font-medium text-[#4cc38a]">
              {callerName.charAt(0)}
            </div>
            <h2 className="text-3xl font-medium text-[#ededed]">{callerName}</h2>
            <p className="text-sm font-mono tabular-nums text-[#4cc38a]">
              {localizeNum(formatTime(callDuration), isBn)}
            </p>
            <p className="text-xs text-[#a1a1a6]">{t('safetyTools.callConnected')}</p>
          </div>

          <div className="max-w-xs mx-auto p-4 rounded-xl bg-[#19191b] border border-white/[0.08] text-center space-y-1.5">
            <FiVolume2 className="w-4 h-4 mx-auto text-[#4cc38a] dispatch-icon" />
            <p className="text-xs font-medium text-[#ededed]">
              {isBn ? 'ভয়েস কথোপকথন চালু' : 'Call audio prompt'}
            </p>
            <p className="text-xs text-[#a1a1a6]">
              {isBn ? '"তুমি কোথায়? আমি নিচে দাঁড়িয়ে আছি, চলে আসো।"' : '"Where are you right now? I am waiting right outside."'}
            </p>
          </div>

          <div className="flex justify-center pb-12">
            <button
              onClick={handleEndCall}
              className="w-16 h-16 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <FiPhoneOff className="w-6 h-6 dispatch-icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FakeCallModal;
