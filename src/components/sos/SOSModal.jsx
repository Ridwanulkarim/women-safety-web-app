import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX, FiCheckCircle, FiMapPin, FiPhone, FiCamera, FiUserCheck, FiPlus, FiSend, FiBell, FiMessageSquare } from 'react-icons/fi';
import { useSOS } from '../../context/SOSContext';
import { useNotifications } from '../../context/NotificationContext';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useLanguage } from '../../context/LanguageContext';
import { toBengaliDigits, localizeNum } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

const SOSModal = () => {
  const {
    sosModalOpen,
    closeSOSModal,
    sendSOSAlert,
    isSOSActive,
    resolveSOS,
    activeSOSData,
    savedContacts,
    loadingContacts
  } = useSOS();

  const { refreshNotifications } = useNotifications();
  const location = useGeolocation(true);
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [countdown, setCountdown] = useState(3);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (sosModalOpen && countdown > 0 && !isSOSActive && isBroadcasting) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0 && isBroadcasting && !isSOSActive) {
      sendSOSAlert(location).then(() => {
        if (refreshNotifications) refreshNotifications();
      });
      setIsBroadcasting(false);
    }
    return () => clearInterval(timer);
  }, [sosModalOpen, countdown, isBroadcasting, isSOSActive, location, sendSOSAlert, refreshNotifications]);

  const handleStartBroadcast = () => {
    setCountdown(3);
    setIsBroadcasting(true);
  };

  const handleCancelCountdown = () => {
    setIsBroadcasting(false);
    setCountdown(3);
  };

  if (!sosModalOpen) return null;

  // Build native cellular SMS link for zero-cost mobile carrier messaging
  const phoneNumbers = savedContacts.filter(c => c.phone).map(c => c.phone).join(',');
  const mapsUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
  const nativeSmsText = isBn
    ? `🚨 জরুরি এসওএস সতর্কতা! আমার জরুরি সাহায্য প্রয়োজন! বর্তমান স্থান: ${location.address}। গুগল ম্যাপস লিঙ্ক: ${mapsUrl}`
    : `🚨 EMERGENCY SOS ALERT! I need urgent help! Location: ${location.address}. Google Maps: ${mapsUrl}`;
  const nativeSmsUrl = phoneNumbers ? `sms:${phoneNumbers}?body=${encodeURIComponent(nativeSmsText)}` : `sms:?body=${encodeURIComponent(nativeSmsText)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative max-w-lg w-full product-card p-6 sm:p-8 border-2 border-rose-500/30 text-center shadow-2xl space-y-6 my-8"
        >
          {/* Close Button */}
          <button
            onClick={closeSOSModal}
            className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg bg-zinc-100 dark:bg-zinc-800"
            title={isBn ? 'বন্ধ করুন' : 'Close'}
          >
            <FiX className="w-4 h-4" />
          </button>

          {isSOSActive ? (
            /* Active SOS Status State */
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center text-3xl animate-pulse ring-8 ring-rose-500/20">
                <FiAlertTriangle />
              </div>
              <div className="space-y-1">
                <span className="mono-tag mono-tag-rose">
                  {isBn ? 'জরুরি টেলিমেট্রি লাইভ' : 'Emergency Telemetry Live'}
                </span>
                <h3 className="text-xl font-extrabold text-rose-600 dark:text-rose-500 font-heading">
                  {isBn ? '🚨 এসওএস ব্রডকাস্ট সক্রিয়' : '🚨 SOS BROADCAST ACTIVE'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {isBn
                    ? 'বিপদবার্তা পাঠানো হয়েছে! আপনার জরুরি পরিচিতি ও কমান্ড সেন্টারে লাইভ লোকেশন লিঙ্ক পৌঁছে গেছে।'
                    : 'Distress signal dispatched! Emergency contacts and command center have received your live location link.'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-left space-y-1 text-xs text-zinc-700 dark:text-zinc-300 font-mono border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                  <FiMapPin /> {isBn ? 'লাইভ জিপিএস লোকেশন শনাক্ত হয়েছে' : 'Live GPS Location Captured'}
                </div>
                <p className="text-zinc-800 dark:text-zinc-200">{location.address || (isBn ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh')}</p>
                <p className="text-[10px] text-zinc-400 font-mono">
                  {isBn ? `অক্ষাংশ: ${toBengaliDigits(location.latitude.toFixed(4))}, দ্রাঘিমাংশ: ${toBengaliDigits(location.longitude.toFixed(4))}` : `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`}
                </p>
              </div>

              {/* Direct Emergency Contacts Alerted Status Box */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-left space-y-2 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <FiSend /> {isBn ? `সতর্কবার্তা পাঠানো পরিচিতি (${toBengaliDigits(savedContacts.length)} জন)` : `Alerted Emergency Contacts (${savedContacts.length})`}
                </span>

                {savedContacts.length === 0 ? (
                  <p className="text-xs text-amber-500 font-medium">
                    {isBn ? '⚠️ আপনার প্রোফাইলে কোনো জরুরি পরিচিতি সংরক্ষিত ছিল না।' : '⚠️ No emergency contacts were saved in your profile.'}
                  </p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {savedContacts.map((contact, idx) => (
                      <div key={contact.id || idx} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs">
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                            <FiUserCheck className="text-emerald-500" /> {contact.name}
                            {contact.relationship && <span className="text-[10px] text-zinc-400 font-mono">({contact.relationship})</span>}
                          </p>
                          <p className="text-[11px] text-zinc-500 font-mono">{contact.phone || contact.email || (isBn ? 'নম্বর নেই' : 'No Phone/Email')}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          {isBn ? 'বার্তা প্রেরিত' : 'ALERT DISPATCHED'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Free Zero-Cost Native SMS Dispatch Button */}
              {phoneNumbers && (
                <a
                  href={nativeSmsUrl}
                  className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs font-mono inline-flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <FiMessageSquare /> {isBn ? '📱 মোবাইল সিমের মাধ্যমে বিনামূল্যে এসএমএস পাঠান' : '📱 SEND FREE SMS VIA MOBILE CARRIER APP'}
                </a>
              )}

              {/* Emergency Evidence Action */}
              <button
                onClick={() => {
                  closeSOSModal();
                  navigate('/dashboard/evidence');
                }}
                className="w-full btn-solid py-2.5 text-xs font-mono flex items-center justify-center gap-2"
              >
                <FiCamera /> {isBn ? '📷 এভিডেন্স লকারে যান (অডিও/ভিডিও রেকর্ড)' : 'OPEN EVIDENCE VAULT (RECORD AUDIO/VIDEO)'}
              </button>

              <div className="flex flex-col gap-2 pt-2">
                <a
                  href="tel:999"
                  className="w-full btn-danger py-3 text-xs uppercase font-mono font-bold"
                >
                  <FiPhone /> {isBn ? '📞 ৯৯৯ পুলিশ হেল্পলাইনে কল করুন' : 'Call 999 Police Dispatch'}
                </a>
                <button
                  onClick={() => {
                    resolveSOS(activeSOSData?.id);
                    closeSOSModal();
                  }}
                  className="w-full btn-outline py-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                >
                  <FiCheckCircle /> {isBn ? '✅ আমি নিরাপদ আছি ও এসওএস সমাপ্ত করুন' : 'Mark Myself Safe & Resolve'}
                </button>
              </div>
            </div>
          ) : isBroadcasting ? (
            /* Countdown Confirmation State */
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-rose-600 text-white flex items-center justify-center text-4xl font-black font-mono animate-bounce">
                {localizeNum(countdown, isBn)}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-heading">
                  {isBn ? `${toBengaliDigits(countdown)} সেকেন্ডে এসওএস পাঠানো হচ্ছে...` : `Broadcasting SOS in ${countdown}s`}
                </h3>
                <p className="text-xs text-zinc-500">
                  {isBn
                    ? `আপনার সংরক্ষিত ${toBengaliDigits(savedContacts.length)} জন জরুরি পরিচিতির কাছে এসএমএস ও ইমেইল বিপদবার্তা পাঠানো হচ্ছে।`
                    : `Sending SMS & Email distress alerts to ${savedContacts.length} saved emergency contact(s).`}
                </p>
              </div>

              <button
                onClick={handleCancelCountdown}
                className="w-full btn-outline py-3 text-xs font-mono font-bold uppercase tracking-wider"
              >
                {isBn ? 'বাতিল করুন' : 'Cancel Broadcast'}
              </button>
            </div>
          ) : (
            /* Initial Trigger State */
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center text-3xl">
                <FiAlertTriangle />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-heading">
                  {isBn ? 'জরুরি এসওএস নিশ্চিত করুন' : 'Confirm Emergency SOS'}
                </h3>
                <p className="text-xs text-zinc-500">
                  {isBn
                    ? 'আপনার লাইভ জিপিএস লোকেশন সরাসরি আপনার সংরক্ষিত জরুরি পরিচিতিদের কাছে এসএমএস ও ইমেইলের মাধ্যমে পাঠিয়ে দেওয়া হবে।'
                    : 'Transmits live GPS location telemetry and triggers emergency outbound SMS & Email alerts directly to your saved emergency contacts.'}
                </p>
              </div>

              {/* Saved Emergency Contacts List (Direct SOS Targets) */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-left space-y-2 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <FiSend /> {isBn ? `এসওএস প্রাপক (${toBengaliDigits(savedContacts.length)} জন সংরক্ষিত পরিচিতি)` : `SOS Dispatch Target (${savedContacts.length} Saved Contacts)`}
                  </span>
                  <button
                    onClick={() => {
                      closeSOSModal();
                      navigate('/dashboard/contacts');
                    }}
                    className="text-[11px] font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1"
                  >
                    <FiPlus /> {isBn ? 'ব্যবস্থাপনা' : 'Manage'}
                  </button>
                </div>

                {loadingContacts ? (
                  <p className="text-xs text-zinc-400">{isBn ? 'সংরক্ষিত পরিচিতি লোড হচ্ছে...' : 'Loading saved contacts...'}</p>
                ) : savedContacts.length === 0 ? (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 space-y-2 text-xs">
                    <p className="font-bold">{isBn ? '⚠️ এখনও কোনো জরুরি পরিচিতি সংরক্ষিত নেই!' : '⚠️ No emergency contacts saved yet!'}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {isBn
                        ? 'সর্বোচ্চ ৫ জন বিশ্বস্ত পরিচিতির নম্বর যোগ করুন যাতে বিপদের মুহূর্তে তাদের কাছে তাৎক্ষণিক বার্তা পৌঁছায়।'
                        : 'Add up to 5 priority contacts (family/friends) so they receive instant SMS & Email notifications during emergencies.'}
                    </p>
                    <button
                      onClick={() => {
                        closeSOSModal();
                        navigate('/dashboard/contacts');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-pink-600 text-white font-bold text-[11px] inline-flex items-center gap-1"
                    >
                      <FiPlus /> {isBn ? 'এখনই পরিচিতি যোগ করুন' : 'Add Emergency Contacts Now'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {savedContacts.map((contact, idx) => (
                      <div key={contact.id || idx} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs">
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                            <FiUserCheck className="text-pink-500" /> {contact.name}
                            {contact.relationship && <span className="text-[10px] text-zinc-400 font-mono">({contact.relationship})</span>}
                            {contact.isPrimary && <span className="px-1.5 py-0.2 rounded text-[9px] bg-pink-500/10 text-pink-500 font-bold">{isBn ? 'প্রধান' : 'PRIMARY'}</span>}
                          </p>
                          <p className="text-[11px] text-zinc-500 font-mono">{contact.phone || contact.email || (isBn ? 'ফোন/ইমেইল নেই' : 'No Phone/Email')}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          {isBn ? 'প্রাপক' : 'DIRECT TARGET'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-left text-xs font-mono border border-zinc-200 dark:border-zinc-800 space-y-1 text-zinc-600 dark:text-zinc-300">
                <p className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <FiMapPin /> {isBn ? 'জিপিএস লাইভ অবস্থান:' : 'GPS Location:'}
                </p>
                <p>{location.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={closeSOSModal}
                  className="btn-outline text-xs"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  onClick={handleStartBroadcast}
                  className="btn-danger text-xs font-mono font-bold uppercase tracking-wider"
                >
                  {isBn ? '🚨 এখনই এসওএস পাঠান' : 'Trigger SOS'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SOSModal;
