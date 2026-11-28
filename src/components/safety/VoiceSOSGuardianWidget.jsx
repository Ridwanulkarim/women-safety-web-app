import React from 'react';
import { FiMic, FiMicOff, FiShield, FiPlayCircle, FiGlobe, FiAlertCircle } from 'react-icons/fi';
import { useVoiceSOS } from '../../context/VoiceSOSContext';
import { useLanguage } from '../../context/LanguageContext';

const VoiceSOSGuardianWidget = () => {
  const {
    isGuardianActive,
    liveTranscript,
    toggleGuardian,
    guardianLanguage,
    setGuardianLanguage,
    isSpeechSupported,
    triggerDistressSequence
  } = useVoiceSOS();

  const { language } = useLanguage();
  const isBn = language === 'bn';

  const supportedKeywords = [
    { text: 'বাঁচাও' },
    { text: 'Help' },
    { text: 'Emergency' },
    { text: 'আমাকে সাহায্য করুন' },
    { text: 'Danger' },
    { text: 'পুলিশ ডাকুন' },
    { text: 'Save Me' }
  ];

  return (
    <div
      className={`surface-panel p-6 space-y-5 ${
        isGuardianActive ? 'border-[#16a34a]/35 dark:border-[#4cc38a]/35' : ''
      }`}
    >
      {/* Header & Master Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900/[0.08] dark:border-white/[0.08] pb-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
              isGuardianActive
                ? 'bg-[#16a34a]/10 dark:bg-[#4cc38a]/15 text-[#16a34a] dark:text-[#4cc38a] border-[#16a34a]/25 dark:border-[#4cc38a]/30'
                : 'bg-[#f4f4f5] dark:bg-[#232325] text-[#525252] dark:text-[#a1a1a6] border-zinc-900/[0.08] dark:border-white/[0.08]'
            }`}
          >
            {isGuardianActive ? <FiMic className="w-4 h-4 dispatch-icon" /> : <FiMicOff className="w-4 h-4 dispatch-icon" />}
          </div>

          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">
                {isBn ? 'ভয়েস-অ্যাক্টিভেটেড হ্যান্ডস-ফ্রি এসওএস' : 'Hands-free voice SOS guardian'}
              </h2>
              <span className={`status-tag ${isGuardianActive ? 'mono-tag-emerald' : ''}`}>
                {isGuardianActive ? (isBn ? 'সক্রিয়' : 'Listening') : (isBn ? 'স্ট্যান্ডবাই' : 'Standby')}
              </span>
            </div>
            <p className="text-xs text-[#525252] dark:text-[#a1a1a6]">
              {isBn
                ? 'ফোন আনলক না করেই "Help" বা "বাঁচাও" বললে স্বয়ংক্রিয়ভাবে এসওএস কাউন্টডাউন শুরু হবে।'
                : 'Say "Help" or "বাঁচাও" while walking to start the SOS alarm and GPS dispatch automatically.'}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs font-mono text-[#737373] dark:text-[#85858b]">
            {isGuardianActive ? (isBn ? 'চালু' : 'Enabled') : (isBn ? 'বন্ধ' : 'Disabled')}
          </span>
          <button
            type="button"
            onClick={toggleGuardian}
            role="switch"
            aria-checked={isGuardianActive}
            aria-label="Toggle hands-free voice SOS guardian"
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-150 ${
              isGuardianActive ? 'bg-[#16a34a] dark:bg-[#4cc38a]' : 'bg-zinc-300 dark:bg-[#232325]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow transition-transform duration-150 ${
                isGuardianActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Unsupported Browser Notice */}
      {!isSpeechSupported && (
        <div className="p-3.5 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] border border-zinc-900/[0.08] dark:border-white/[0.08] text-[#525252] dark:text-[#a1a1a6] text-xs flex items-center gap-2.5">
          <FiAlertCircle className="w-4 h-4 text-[#e11d48] shrink-0 dispatch-icon" />
          <span>
            {isBn
              ? 'এই ব্রাউজারে Web Speech API সমর্থিত নয়। ভয়েস লিসেনার ব্যবহারের জন্য Google Chrome, Edge বা Safari ব্যবহার করুন।'
              : 'Web Speech Recognition API is unavailable in this browser. Use Chrome, Edge, or Safari for hands-free voice detection.'}
          </span>
        </div>
      )}

      {/* Active Listening Monitor */}
      {isGuardianActive && (
        <div className="surface-raised p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-medium text-[#16a34a] dark:text-[#4cc38a]">
              <span className="w-2 h-2 rounded-full bg-[#16a34a] dark:bg-[#4cc38a]"></span>
              <span>
                {isBn ? 'মাইক্রোফোন সক্রিয়: অডিও শুনছে' : 'Microphone active: Continuous speech monitor'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <FiGlobe className="w-3.5 h-3.5 text-[#737373] dark:text-[#85858b] dispatch-icon" />
              <button
                type="button"
                onClick={() => setGuardianLanguage('bn-BD')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  guardianLanguage === 'bn-BD'
                    ? 'bg-[#171717] dark:bg-[#ededed] text-[#ffffff] dark:text-[#141415]'
                    : 'text-[#525252] dark:text-[#a1a1a6] hover:text-[#171717] dark:hover:text-[#ededed]'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setGuardianLanguage('en-US')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  guardianLanguage === 'en-US'
                    ? 'bg-[#171717] dark:bg-[#ededed] text-[#ffffff] dark:text-[#141415]'
                    : 'text-[#525252] dark:text-[#a1a1a6] hover:text-[#171717] dark:hover:text-[#ededed]'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs border-t border-zinc-900/[0.08] dark:border-white/[0.08] pt-2.5 font-mono">
            <span className="text-[#737373] dark:text-[#85858b]">
              {isBn ? 'সর্বশেষ অডিও টেক্সট' : 'Transcript'}
            </span>
            <span className="text-[#171717] dark:text-[#ededed] truncate max-w-sm">
              {liveTranscript ? `"${liveTranscript}"` : (isBn ? 'বক্তব্য শোনার অপেক্ষায়' : 'Awaiting speech input')}
            </span>
          </div>
        </div>
      )}

      {/* Trigger Phrase Reference */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-[#737373] dark:text-[#85858b] block">
          {isBn ? 'শনাক্তযোগ্য বিপদ সংকেত শব্দসমূহ' : 'Supported distress trigger phrases'}
        </span>
        <div className="flex flex-wrap gap-2">
          {supportedKeywords.map((item, idx) => (
            <span
              key={idx}
              className="status-tag text-[#171717] dark:text-[#ededed]"
            >
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* Cancel buffer & Demo Triggers */}
      <div className="pt-3 border-t border-zinc-900/[0.08] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-[#737373] dark:text-[#85858b] flex items-center gap-1.5">
          <FiShield className="w-4 h-4 text-[#16a34a] dark:text-[#4cc38a] dispatch-icon" />
          <span>{isBn ? '৫ সেকেন্ডের বাতিলযোগ্য নিরাপত্তা বাফার সক্রিয়' : '5-second false-alarm cancel window enabled'}</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => triggerDistressSequence('বাঁচাও')}
            className="flex-1 sm:flex-initial btn-outline h-9 px-3 text-xs"
            title="Test speaking 'বাঁচাও'"
          >
            <FiPlayCircle className="w-4 h-4 text-[#e11d48] dispatch-icon" /> {isBn ? 'টেস্ট: "বাঁচাও"' : 'Test: "বাঁচাও"'}
          </button>

          <button
            type="button"
            onClick={() => triggerDistressSequence('Help')}
            className="flex-1 sm:flex-initial btn-outline h-9 px-3 text-xs"
            title="Test speaking 'Help'"
          >
            <FiPlayCircle className="w-4 h-4 dispatch-icon" /> Test: "Help"
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceSOSGuardianWidget;
