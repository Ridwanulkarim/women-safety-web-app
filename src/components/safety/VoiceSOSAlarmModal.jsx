import React from 'react';
import { FiAlertTriangle, FiVolumeX, FiXCircle, FiSend, FiMapPin, FiShield } from 'react-icons/fi';
import { useVoiceSOS } from '../../context/VoiceSOSContext';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useLanguage } from '../../context/LanguageContext';
import { toBengaliDigits, localizeNum } from '../../utils/helpers';

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
  const { language } = useLanguage();
  const isBn = language === 'bn';

  if (!isEmergencyTriggered) return null;

  const isCountdownActive = countdown > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto">
      <div className="relative max-w-lg w-full bg-[#19191b] border border-[#dc2626] rounded-2xl p-6 sm:p-8 text-center space-y-6 text-[#ededed] shadow-xl">
        <div className="space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[#dc2626] text-white flex items-center justify-center">
            <FiAlertTriangle className="w-6 h-6 dispatch-icon" />
          </div>

          <div className="space-y-1">
            <span className="status-tag mono-tag-rose">
              {isBn ? 'ভয়েস বিপদ সংকেত শনাক্ত' : 'Voice distress detected'}
            </span>
            <h2 className="text-2xl font-medium tracking-[-0.02em] text-[#ededed]">
              {isBn ? 'ভয়েস এসওএস এলার্ট সক্রিয়' : 'Voice SOS alert active'}
            </h2>
            <p className="text-sm text-[#a1a1a6]">
              {isBn ? 'আপনার মুখে উচ্চারিত বিপদ সংকেত শনাক্ত হয়েছে।' : 'A distress phrase was recognized by hands-free listener.'}
            </p>
          </div>
        </div>

        {/* Detected Phrase */}
        <div className="p-4 rounded-xl bg-[#141415] border border-white/[0.08] text-left space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#85858b]">{isBn ? 'শনাক্তকৃত শব্দ' : 'Matched phrase'}</span>
            <span className="text-[#fb7185] font-mono tabular-nums font-medium">
              {isBn ? 'নিশ্চিত' : 'Matched'}
            </span>
          </div>
          <div className="text-xl font-medium text-[#ededed]">
            "{lastDetectedPhrase || (isBn ? 'বাঁচাও' : 'Help')}"
          </div>
          {location && location.latitude && (
            <div className="flex items-center gap-1.5 text-xs text-[#a1a1a6] font-mono tabular-nums pt-2 border-t border-white/[0.08]">
              <FiMapPin className="w-4 h-4 text-[#e11d48] shrink-0 dispatch-icon" />
              <span className="truncate">
                {location.address ||
                  (isBn
                    ? `${toBengaliDigits(location.latitude.toFixed(4))}° উত্তর · ${toBengaliDigits(location.longitude.toFixed(4))}° পূর্ব`
                    : `${location.latitude.toFixed(4)}° N · ${location.longitude.toFixed(4)}° E`)}
              </span>
            </div>
          )}
        </div>

        {/* Countdown or Dispatched Status */}
        {isCountdownActive ? (
          <div className="space-y-2">
            <div className="w-20 h-20 mx-auto rounded-full border-2 border-[#dc2626] bg-[#141415] flex items-center justify-center">
              <span className="text-4xl font-mono tabular-nums font-medium text-[#e5484d]">
                {localizeNum(countdown, isBn)}
              </span>
            </div>
            <p className="text-xs text-[#a1a1a6] font-mono tabular-nums">
              {isBn
                ? `জিপিএস ব্রডকাস্ট হতে ${toBengaliDigits(countdown)} সেকেন্ড বাকি`
                : `Sending GPS SOS in ${countdown}s`}
            </p>
          </div>
        ) : (
          <div className="p-3.5 rounded-lg bg-[#4cc38a]/10 border border-[#4cc38a]/25 text-[#4cc38a] text-xs font-medium flex items-center justify-center gap-2">
            <FiShield className="w-4 h-4 shrink-0 dispatch-icon" />
            <span>{isBn ? 'লাইভ জিপিএস লোকেশন ও এসওএস পাঠানো হয়েছে' : 'Live GPS location and SOS dispatched'}</span>
          </div>
        )}

        {/* Controls */}
        <div className="space-y-3">
          {isCountdownActive ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={cancelEmergencyCountdown}
                className="btn-outline h-11 text-xs"
              >
                <FiXCircle className="w-4 h-4 dispatch-icon" />
                {isBn ? 'বাতিল করুন' : 'Cancel broadcast'}
              </button>

              <button
                type="button"
                onClick={() => triggerImmediateSOS(lastDetectedPhrase)}
                className="btn-danger h-11 text-xs"
              >
                <FiSend className="w-4 h-4 dispatch-icon" />
                {isBn ? 'এখনই পাঠান' : 'Send SOS now'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              {isSirenPlaying && (
                <button
                  type="button"
                  onClick={stopSirenAudio}
                  className="btn-outline flex-1 h-11 text-xs"
                >
                  <FiVolumeX className="w-4 h-4 dispatch-icon" /> {isBn ? 'সাইরেন থামান' : 'Mute siren'}
                </button>
              )}
              <button
                type="button"
                onClick={cancelEmergencyCountdown}
                className="btn-danger flex-1 h-11 text-xs"
              >
                <FiShield className="w-4 h-4 dispatch-icon" /> {isBn ? 'বন্ধ করুন' : 'Dismiss'}
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-[#85858b]">
          {isBn
            ? "ভুলবশত চালু হলে 'বাতিল করুন' চাপুন, অন্যথায় ৫ সেকেন্ড পর স্বয়ংক্রিয়ভাবে বার্তা পাঠানো হবে।"
            : "Tap 'Cancel broadcast' if triggered accidentally, or dispatch runs automatically in 5 seconds."}
        </p>
      </div>
    </div>
  );
};

export default VoiceSOSAlarmModal;
