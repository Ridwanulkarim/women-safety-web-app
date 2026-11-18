import React from 'react';
import { motion } from 'framer-motion';
import { FiMic, FiMicOff, FiShield, FiAlertTriangle, FiVolume2, FiRadio, FiCheckCircle, FiPlayCircle, FiGlobe } from 'react-icons/fi';
import { useVoiceSOS } from '../../context/VoiceSOSContext';

const VoiceSOSGuardianWidget = () => {
  const {
    isGuardianActive,
    isListening,
    liveTranscript,
    lastDetectedPhrase,
    toggleGuardian,
    guardianLanguage,
    setGuardianLanguage,
    isSpeechSupported,
    triggerDistressSequence
  } = useVoiceSOS();

  const supportedKeywords = [
    { text: 'বাঁচাও', lang: 'bn' },
    { text: 'Help', lang: 'en' },
    { text: 'Emergency', lang: 'en' },
    { text: 'আমাকে সাহায্য করুন', lang: 'bn' },
    { text: 'Danger', lang: 'en' },
    { text: 'পুলিশ ডাকুন', lang: 'bn' },
    { text: 'Save Me', lang: 'en' }
  ];

  return (
    <div className={`glass-card-xl p-6 sm:p-7 rounded-3xl space-y-5 transition-all duration-300 relative overflow-hidden ${
      isGuardianActive
        ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-xl shadow-emerald-900/10'
        : 'border-zinc-200/80 dark:border-zinc-800/80'
    }`}>
      {/* Background ambient radar glow when active */}
      {isGuardianActive && (
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      )}

      {/* Header & Toggle Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-all ${
            isGuardianActive
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
          }`}>
            {isGuardianActive ? <FiMic className="animate-pulse" /> : <FiMicOff />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
                AI Voice-Activated Hands-Free SOS
              </h3>
              <span className={`mono-tag text-[9px] ${
                isGuardianActive ? 'mono-tag-emerald' : 'mono-tag-zinc'
              }`}>
                {isGuardianActive ? 'GUARDIAN ACTIVE' : 'STANDBY'}
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              রাস্তায় চলার সময় বা বিপদে পড়লে ফোন আনলক না করেই মুখে <strong>"Help"</strong> বা <strong>"বাঁচাও"</strong> বললেই স্বয়ংক্রিয় SOS ব্রডকাস্ট হবে।
            </p>
          </div>
        </div>

        {/* Master ON/OFF Switch */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right sm:block hidden">
            <span className="block text-[10px] font-mono font-bold uppercase text-zinc-400">
              হ্যান্ডস-ফ্রি গার্ডিয়ান
            </span>
            <span className={`text-xs font-bold font-mono ${
              isGuardianActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500'
            }`}>
              {isGuardianActive ? '🟢 অন রয়েছে' : '⚪ বন্ধ রয়েছে'}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleGuardian}
            className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isGuardianActive ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
            title="Toggle Hands-Free Voice SOS Guardian"
          >
            <span
              className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                isGuardianActive ? 'translate-x-8' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Unsupported Browser Alert (if non-Chromium) */}
      {!isSpeechSupported && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-medium">
          ⚠️ আপনার বর্তমান ব্রাউজারে Web Speech Recognition API সাপোর্ট করে না। সর্বোত্তম অভিজ্ঞতার জন্য <strong>Google Chrome, Microsoft Edge অথবা Safari</strong> ব্যবহার করুন। নিচের "টেস্ট সিমুলেশন" বাটনে ক্লিক করে আপনি যে কোনো ব্রাউজারে এটি পরীক্ষা করতে পারেন।
        </div>
      )}

      {/* Active State Details & Audio Waveform */}
      {isGuardianActive && (
        <div className="space-y-4 p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-emerald-500/20 shadow-sm relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-bold">মাইক্রোফোন সক্রিয়: কথা শুনছে... (Continuous Ambient Listening)</span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <FiGlobe className="text-zinc-500" />
              <button
                type="button"
                onClick={() => setGuardianLanguage('bn-BD')}
                className={`px-2 py-0.5 rounded-lg transition ${
                  guardianLanguage === 'bn-BD'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                বাংলা (bn)
              </button>
              <button
                type="button"
                onClick={() => setGuardianLanguage('en-US')}
                className={`px-2 py-0.5 rounded-lg transition ${
                  guardianLanguage === 'en-US'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                English (en)
              </button>
            </div>
          </div>

          {/* Soundwave Animation Bars */}
          <div className="h-8 flex items-center justify-center gap-1.5 px-4 bg-emerald-500/5 dark:bg-emerald-950/20 rounded-xl border border-emerald-500/10 overflow-hidden">
            {[40, 70, 30, 90, 60, 20, 80, 50, 100, 45, 85, 35, 95, 65, 40].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: [`${Math.max(15, h * 0.2)}%`, `${h}%`, `${Math.max(15, h * 0.2)}%`] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8 + (i % 5) * 0.2,
                  ease: 'easeInOut'
                }}
                className="w-1.5 rounded-full bg-emerald-500/70"
              />
            ))}
          </div>

          {/* Live Transcript Stream */}
          <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 pt-1 font-mono">
            <span className="text-[11px] text-zinc-500">সর্বশেষ শোনা অডিও:</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-xs">
              {liveTranscript ? `"${liveTranscript}"` : 'কোনো শব্দ শোনা যায়নি...'}
            </span>
          </div>
        </div>
      )}

      {/* Trigger Keywords Chips */}
      <div className="space-y-2 relative z-10">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 block">
          শনাক্তযোগ্য বিপদ শব্দসমূহ (Distress Trigger Keywords):
        </span>
        <div className="flex flex-wrap gap-2">
          {supportedKeywords.map((item, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60 flex items-center gap-1.5 shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Demonstration & Testing Buttons */}
      <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5">
          <FiShield className="text-emerald-500" />
          <span>৫ সেকেন্ডের ফলস-অ্যালার্ম ক্যান্সেল বাফার সহ সুরক্ষিত</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => triggerDistressSequence('বাঁচাও')}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            title="Simulate speaking 'বাঁচাও' (Bengali Trigger)"
          >
            <FiPlayCircle className="text-sm" /> টেস্ট: "বাঁচাও"
          </button>

          <button
            type="button"
            onClick={() => triggerDistressSequence('Help')}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            title="Simulate speaking 'Help' (English Trigger)"
          >
            <FiPlayCircle className="text-sm" /> Test: "Help"
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceSOSGuardianWidget;
