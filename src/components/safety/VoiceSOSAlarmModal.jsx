import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiVolume2, FiVolumeX, FiXCircle, FiSend, FiMapPin, FiShield } from 'react-icons/fi';
import { useVoiceSOS } from '../../context/VoiceSOSContext';
import { useGeolocation } from '../../hooks/useGeolocation';

const VoiceSOSAlarmModal = () => {
  const {
    isEmergencyTriggered,
    countdown,
    lastDetectedPhrase,
    cancelEmergencyCountdown,
    triggerImmediateSOS,
    isSirenPlaying,
    stopSirenAudio
  } = useVoiceSOS();

  const location = useGeolocation(false);

  if (!isEmergencyTriggered) return null;

  const isCountdownActive = countdown > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto animate-fade-in font-sans">
        
        {/* Pulsing red alarm ambient backlight */}
        <div className="absolute inset-0 bg-rose-600/20 animate-pulse pointer-events-none"></div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-lg w-full bg-[#0e0e14] border-2 border-rose-500 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl shadow-rose-900/50 text-white z-10"
        >
          {/* Header Siren Badge */}
          <div className="space-y-3">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-rose-500/20 animate-ping absolute"></div>
              <div className="w-20 h-20 rounded-full bg-rose-600 text-white flex items-center justify-center text-3xl shadow-xl shadow-rose-600/50 relative z-10">
                <FiAlertTriangle className="animate-bounce" />
              </div>
            </div>

            <div>
              <span className="mono-tag mono-tag-rose text-xs px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                AI VOICE DISTRESS DETECTED
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight mt-2">
                ভয়েস এসওএস এলার্ট সক্রিয়!
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-sm mx-auto mt-1">
                আপনার মুখে উচ্চারিত বিপদ সংকেত শনাক্ত করা হয়েছে।
              </p>
            </div>
          </div>

          {/* Detected Keyword Highlight Box */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-left space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">শনাক্তকৃত কীওয়ার্ড (Keyword):</span>
              <span className="text-rose-400 font-bold uppercase tracking-wider">
                MATCHED 100%
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-500 font-heading">
              "{lastDetectedPhrase || 'Help / বাঁচাও'}"
            </div>
            {location && location.latitude && (
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono pt-1 border-t border-zinc-800/80">
                <FiMapPin className="text-rose-500 shrink-0" />
                <span className="truncate">{location.address || `${location.latitude.toFixed(4)}° N, ${location.longitude.toFixed(4)}° E`}</span>
              </div>
            )}
          </div>

          {/* Dynamic Countdown Circle or Dispatched Status */}
          {isCountdownActive ? (
            <div className="space-y-3">
              <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-4 border-rose-500/30 flex items-center justify-center">
                  <span className="text-5xl font-black font-heading text-rose-500 animate-pulse">
                    {countdown}
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                স্বয়ংক্রিয়ভাবে জিপিএস ব্রডকাস্ট হতে <span className="text-rose-400 font-bold">{countdown} সেকেন্ড</span> বাকি
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center justify-center gap-2">
              <FiShield className="text-base shrink-0" />
              <span>লাইভ জিপিএস লোকেশন ও এসওএস ব্রডকাস্ট সফলভাবে পাঠানো হয়েছে!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {isCountdownActive ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={cancelEmergencyCountdown}
                  className="w-full py-3.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-2 border border-zinc-700 transition active:scale-95 cursor-pointer"
                >
                  <FiXCircle className="text-base text-zinc-400" />
                  বাতিল করুন (FALSE ALARM)
                </button>

                <button
                  type="button"
                  onClick={() => triggerImmediateSOS(lastDetectedPhrase)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-600/40 transition active:scale-95 cursor-pointer"
                >
                  <FiSend className="text-base" />
                  এখনই পাঠান (SEND SOS NOW)
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                {isSirenPlaying && (
                  <button
                    type="button"
                    onClick={stopSirenAudio}
                    className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs font-mono uppercase flex items-center justify-center gap-2 border border-zinc-700"
                  >
                    <FiVolumeX /> সাইরেন বন্ধ করুন (Mute Siren)
                  </button>
                )}
                <button
                  type="button"
                  onClick={cancelEmergencyCountdown}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <FiShield /> উইন্ডো বন্ধ করুন (Dismiss)
                </button>
              </div>
            )}
          </div>

          <p className="text-[10px] text-zinc-500 font-mono">
            ভুলবশত এই মোড ট্রিগার হয়ে থাকলে 'বাতিল করুন' চাপুন। ৫ সেকেন্ডের মধ্যে কোনো বাটন না চাপলে এটি স্বয়ংক্রিয়ভাবে জরুরি সাহায্যকারীদের কল ও এসএমএস পাঠাবে।
          </p>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VoiceSOSAlarmModal;
