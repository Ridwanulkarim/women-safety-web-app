import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiAlertTriangle,
  FiX,
  FiCheckCircle,
  FiMapPin,
  FiPhone,
  FiCamera,
  FiUserCheck,
  FiPlus,
  FiSend,
  FiMessageSquare
} from 'react-icons/fi';
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
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [countdown, setCountdown] = useState(3);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (sosModalOpen && countdown > 0 && !isSOSActive && isBroadcasting) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
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

  const phoneNumbers = savedContacts.filter((c) => c.phone).map((c) => c.phone).join(',');
  const mapsUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
  const nativeSmsText = isBn
    ? `জরুরি এসওএস সতর্কতা। আমার সাহায্য প্রয়োজন। অবস্থান: ${location.address}। ম্যাপস: ${mapsUrl}`
    : `EMERGENCY SOS ALERT. Need urgent assistance. Location: ${location.address}. Maps: ${mapsUrl}`;
  const nativeSmsUrl = phoneNumbers
    ? `sms:${phoneNumbers}?body=${encodeURIComponent(nativeSmsText)}`
    : `sms:?body=${encodeURIComponent(nativeSmsText)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-lg w-full surface-panel p-6 sm:p-8 border-[#dc2626]/40 text-center space-y-6 my-8 shadow-xl"
        >
          <button
            onClick={closeSOSModal}
            className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#737373] dark:text-[#85858b] hover:text-[#171717] dark:hover:text-[#ededed] flex items-center justify-center cursor-pointer"
            title={t('common.close')}
          >
            <FiX className="w-4 h-4 dispatch-icon" />
          </button>

          {isSOSActive ? (
            <div className="space-y-5">
              <div className="w-12 h-12 mx-auto bg-[#dc2626] text-white rounded-xl flex items-center justify-center">
                <FiAlertTriangle className="w-6 h-6 dispatch-icon" />
              </div>
              <div className="space-y-1.5">
                <span className="status-tag mono-tag-rose">
                  {isBn ? 'লাইভ ডিসপ্যাচ সক্রিয়' : 'Live dispatch active'}
                </span>
                <h2 className="text-xl font-medium text-[#171717] dark:text-[#ededed]">
                  {t('sos.sosActive')}
                </h2>
                <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
                  {t('sos.sosActiveSub')}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#fafafa] dark:bg-[#141415] text-left space-y-1 text-xs border border-zinc-900/[0.08] dark:border-white/[0.08]">
                <div className="flex items-center gap-1.5 text-[#e11d48] font-medium">
                  <FiMapPin className="w-4 h-4 dispatch-icon" /> {t('sos.gpsCaptured')}
                </div>
                <p className="text-[#171717] dark:text-[#ededed]">{location.address || (isBn ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh')}</p>
                <p className="text-[#737373] dark:text-[#85858b] font-mono tabular-nums">
                  {isBn
                    ? `অক্ষাংশ ${toBengaliDigits(location.latitude.toFixed(4))}° · দ্রাঘিমাংশ ${toBengaliDigits(location.longitude.toFixed(4))}°`
                    : `${location.latitude.toFixed(4)}° N · ${location.longitude.toFixed(4)}° E`}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#fafafa] dark:bg-[#141415] text-left space-y-2.5 border border-zinc-900/[0.08] dark:border-white/[0.08]">
                <span className="text-xs font-medium text-[#16a34a] dark:text-[#4cc38a] flex items-center gap-1.5">
                  <FiSend className="w-3.5 h-3.5 dispatch-icon" />
                  {isBn
                    ? `সতর্কীকৃত জরুরি পরিচিতি (${toBengaliDigits(savedContacts.length)})`
                    : `Alerted contacts (${savedContacts.length})`}
                </span>

                {savedContacts.length === 0 ? (
                  <p className="text-xs text-[#737373] dark:text-[#85858b]">
                    {isBn ? 'প্রোফাইলে কোনো জরুরি পরিচিতি সংরক্ষিত ছিল না।' : 'No saved guardians found in your profile.'}
                  </p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {savedContacts.map((contact, idx) => (
                      <div key={contact.id || idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#ffffff] dark:bg-[#19191b] border border-zinc-900/[0.08] dark:border-white/[0.08] text-xs">
                        <div>
                          <p className="font-medium text-[#171717] dark:text-[#ededed] flex items-center gap-1.5">
                            <FiUserCheck className="w-3.5 h-3.5 text-[#16a34a] dark:text-[#4cc38a] dispatch-icon" />
                            <span>{contact.name}</span>
                          </p>
                          <p className="text-[#737373] dark:text-[#85858b] font-mono tabular-nums">{contact.phone || contact.email || '—'}</p>
                        </div>
                        <span className="status-tag mono-tag-emerald">
                          {isBn ? 'প্রেরিত' : 'Sent'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {phoneNumbers && (
                <a href={nativeSmsUrl} className="w-full btn-outline h-10 text-xs">
                  <FiMessageSquare className="w-4 h-4 dispatch-icon" />
                  {isBn ? 'মোবাইল সিম দিয়ে এসএমএস পাঠান' : 'Send carrier SMS'}
                </a>
              )}

              <button
                onClick={() => {
                  closeSOSModal();
                  navigate('/dashboard/evidence');
                }}
                className="w-full btn-solid h-10 text-xs"
              >
                <FiCamera className="w-4 h-4 dispatch-icon" /> {t('sos.openVault')}
              </button>

              <div className="flex flex-col gap-2">
                <a href="tel:999" className="w-full btn-danger h-10 text-xs">
                  <FiPhone className="w-4 h-4 dispatch-icon" /> {t('sos.call999')}
                </a>
                <button
                  onClick={() => {
                    resolveSOS(activeSOSData?.id);
                    closeSOSModal();
                  }}
                  className="w-full btn-outline h-10 text-xs text-[#16a34a] dark:text-[#4cc38a]"
                >
                  <FiCheckCircle className="w-4 h-4 dispatch-icon" /> {t('sos.markSafe')}
                </button>
              </div>
            </div>
          ) : isBroadcasting ? (
            <div className="space-y-6 py-2">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#dc2626] text-white flex items-center justify-center text-4xl font-mono tabular-nums font-medium">
                {localizeNum(countdown, isBn)}
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-medium text-[#171717] dark:text-[#ededed]">
                  {isBn ? `${toBengaliDigits(countdown)} সেকেন্ডে এসওএস পাঠানো হচ্ছে` : `Broadcasting SOS in ${countdown}s`}
                </h2>
                <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
                  {isBn
                    ? `আপনার সংরক্ষিত ${toBengaliDigits(savedContacts.length)} জন জরুরি পরিচিতিকে সতর্ক করা হচ্ছে।`
                    : `Notifying ${savedContacts.length} saved emergency guardian(s).`}
                </p>
              </div>

              <button onClick={handleCancelCountdown} className="w-full btn-outline h-11 text-xs">
                {t('sos.cancelBroadcast')}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#dc2626]/10 text-[#dc2626] dark:text-[#e5484d] flex items-center justify-center">
                <FiAlertTriangle className="w-6 h-6 dispatch-icon" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-medium text-[#171717] dark:text-[#ededed]">
                  {t('sos.confirmSOS')}
                </h2>
                <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
                  {t('sos.confirmSub')}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#fafafa] dark:bg-[#141415] text-left space-y-2.5 border border-zinc-900/[0.08] dark:border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#171717] dark:text-[#ededed] flex items-center gap-1.5">
                    <FiSend className="w-3.5 h-3.5 text-[#e11d48] dispatch-icon" />
                    {isBn
                      ? `এসওএস প্রাপক (${toBengaliDigits(savedContacts.length)})`
                      : `Dispatch targets (${savedContacts.length})`}
                  </span>
                  <button
                    onClick={() => {
                      closeSOSModal();
                      navigate('/dashboard/contacts');
                    }}
                    className="text-xs font-medium text-[#e11d48] dark:text-[#fb7185] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FiPlus className="w-3.5 h-3.5 dispatch-icon" /> {t('dashboard.manage')}
                  </button>
                </div>

                {loadingContacts ? (
                  <p className="text-xs text-[#737373] dark:text-[#85858b]">{t('common.loading')}</p>
                ) : savedContacts.length === 0 ? (
                  <div className="p-3 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] space-y-2 text-xs">
                    <p className="font-medium text-[#171717] dark:text-[#ededed]">
                      {isBn ? 'কোনো জরুরি পরিচিতি সংরক্ষিত নেই' : 'No emergency contacts linked'}
                    </p>
                    <p className="text-[#525252] dark:text-[#a1a1a6]">
                      {isBn
                        ? 'সর্বোচ্চ ৫ জন পরিচিতি যোগ করলে তারা এসএমএস ও ইমেইল সতর্কতা পাবেন।'
                        : 'Add up to 5 priority contacts to send alerts during emergencies.'}
                    </p>
                    <button
                      onClick={() => {
                        closeSOSModal();
                        navigate('/dashboard/contacts');
                      }}
                      className="btn-solid h-8 px-3 text-xs"
                    >
                      <FiPlus className="w-3.5 h-3.5 dispatch-icon" /> {isBn ? 'পরিচিতি যোগ করুন' : 'Add contacts'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {savedContacts.map((contact, idx) => (
                      <div key={contact.id || idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#ffffff] dark:bg-[#19191b] border border-zinc-900/[0.08] dark:border-white/[0.08] text-xs">
                        <div>
                          <p className="font-medium text-[#171717] dark:text-[#ededed]">
                            {contact.name}
                            {contact.relationship && (
                              <span className="text-[#737373] dark:text-[#85858b] ml-1.5">· {contact.relationship}</span>
                            )}
                          </p>
                          <p className="text-[#737373] dark:text-[#85858b] font-mono tabular-nums">{contact.phone || contact.email || '—'}</p>
                        </div>
                        {contact.isPrimary && <span className="status-tag mono-tag-rose">{t('common.primary')}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#fafafa] dark:bg-[#141415] text-left text-xs font-mono border border-zinc-900/[0.08] dark:border-white/[0.08] space-y-1">
                <p className="font-medium text-[#e11d48] flex items-center gap-1.5">
                  <FiMapPin className="w-3.5 h-3.5 dispatch-icon" /> {t('home.gpsTelemetry')}
                </p>
                <p className="text-[#525252] dark:text-[#a1a1a6]">{location.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={closeSOSModal} className="btn-outline h-11 text-xs">
                  {t('common.cancel')}
                </button>
                <button onClick={handleStartBroadcast} className="btn-danger h-11 text-xs">
                  {t('sos.triggerSOS')}
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
