import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPhoneCall, FiActivity, FiPlusCircle, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useSOS } from '../../context/SOSContext';
import { useLanguage } from '../../context/LanguageContext';
import { toBengaliDigits } from '../../utils/helpers';
import SOSButton from '../../components/sos/SOSButton';
import SOSHistoryList from '../../components/sos/SOSHistoryList';
import ContactCard from '../../components/contacts/ContactCard';
import FakeCallModal from '../../components/safety/FakeCallModal';
import SirenAlarmButton from '../../components/safety/SirenAlarmButton';
import MedicalIDModal from '../../components/safety/MedicalIDModal';
import VoiceSOSGuardianWidget from '../../components/safety/VoiceSOSGuardianWidget';

const UserDashboard = () => {
  const { user } = useAuth();
  const { sosHistory, savedContacts = [] } = useSOS();
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [fakeCallOpen, setFakeCallOpen] = useState(false);
  const [medicalIdOpen, setMedicalIdOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header & Quick Safety Controls */}
      <div className="surface-panel p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="status-tag mono-tag-emerald">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] dark:bg-[#4cc38a]"></span>
              {t('dashboard.activeProtection')}
            </span>
            <span className="text-xs font-mono text-[#737373] dark:text-[#85858b]">
              {user?.fullName || (isBn ? 'ব্যবহারকারী' : 'Account')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed]">
            {t('dashboard.welcome')}
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
            {isBn ? (
              <>
                জরুরি টেলিমেট্রি সক্রিয়। ৫ জনের মধ্যে <span className="font-mono tabular-nums font-medium text-[#171717] dark:text-[#ededed]">{toBengaliDigits(savedContacts.length)} জন</span> জরুরি পরিচিতি সংযুক্ত রয়েছে।
              </>
            ) : (
              <>
                Emergency dispatch ready with <span className="font-mono tabular-nums font-medium text-[#171717] dark:text-[#ededed]">{savedContacts.length} of 5</span> guardians linked to your SOS trigger.
              </>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <SirenAlarmButton />

          <button
            onClick={() => setFakeCallOpen(true)}
            className="btn-solid h-10 px-4 text-xs"
          >
            <FiPhoneCall className="w-4 h-4 dispatch-icon" /> {t('safetyTools.fakeCall')}
          </button>

          <button
            onClick={() => setMedicalIdOpen(true)}
            className="btn-outline h-10 px-4 text-xs"
          >
            <FiActivity className="w-4 h-4 text-[#e11d48] dispatch-icon" /> {t('safetyTools.medicalID')}
          </button>
        </div>
      </div>

      {/* Hands-Free Voice SOS Control */}
      <VoiceSOSGuardianWidget />

      {/* Main Split Grid: Distress Instrument (4 cols) + Priority Contacts (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 surface-panel p-6 text-center space-y-5 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between border-b border-zinc-900/[0.08] dark:border-white/[0.08] pb-3 text-left">
            <div>
              <span className="text-xs text-[#737373] dark:text-[#85858b] block">{t('dashboard.distressBeacon')}</span>
              <h2 className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
                {isBn ? '১-ট্যাপ জরুরি ট্রিগার' : 'Immediate SOS trigger'}
              </h2>
            </div>
            <span className="status-tag mono-tag-rose">{t('common.active')}</span>
          </div>

          <div className="py-2">
            <SOSButton size="large" />
          </div>

          <p className="text-xs text-[#737373] dark:text-[#85858b] max-w-xs leading-relaxed">
            {isBn
              ? 'যুক্ত পরিচিতিদের কাছে লাইভ জিপিএস অবস্থান পাঠাতে ৩ সেকেন্ডের কাউন্টডাউন শুরু করুন।'
              : 'Starts a 3-second countdown before broadcasting your live coordinates to saved contacts.'}
          </p>
        </div>

        <div className="lg:col-span-8 surface-panel p-6 space-y-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-900/[0.08] dark:border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <FiPhoneCall className="w-4 h-4 text-[#525252] dark:text-[#a1a1a6] dispatch-icon" />
              <div>
                <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">
                  {t('dashboard.priorityContacts')}
                </h2>
                <p className="text-xs text-[#737373] dark:text-[#85858b]">
                  {isBn
                    ? 'জরুরি এসওএস বার্তা প্রাপক অগ্রাধিকার পরিচিতি তালিকা'
                    : 'Trusted recipients notified when an emergency SOS is triggered'}
                </p>
              </div>
            </div>
            <Link
              to="/dashboard/contacts"
              className="text-xs font-medium text-[#e11d48] dark:text-[#fb7185] hover:underline inline-flex items-center gap-1 font-mono tabular-nums"
            >
              {isBn
                ? `ব্যবস্থাপনা (${toBengaliDigits(savedContacts.length)}/৫)`
                : `Manage (${savedContacts.length}/5)`}
              <FiArrowRight className="w-3.5 h-3.5 dispatch-icon" />
            </Link>
          </div>

          {savedContacts.length === 0 ? (
            <div className="p-8 text-center space-y-3 rounded-xl bg-[#fafafa] dark:bg-[#141415] border border-dashed border-zinc-900/[0.14] dark:border-white/[0.14]">
              <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
                {isBn
                  ? 'কোনো জরুরি পরিচিতি সংরক্ষিত নেই। স্বয়ংক্রিয় বার্তা পাঠাতে অন্তত ১ জন পরিচিতি যোগ করুন।'
                  : 'No emergency contacts saved yet. Add at least one guardian to enable automatic dispatch alerts.'}
              </p>
              <Link to="/dashboard/contacts" className="btn-solid h-9 px-4 text-xs inline-flex">
                <FiPlusCircle className="w-4 h-4 dispatch-icon" />
                {isBn ? 'পরিচিতি যোগ করুন' : 'Add emergency contacts'}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {savedContacts.slice(0, 3).map((c) => (
                <ContactCard key={c.id || c._id} contact={c} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent SOS Telemetry Logs */}
      <div className="surface-panel p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-900/[0.08] dark:border-white/[0.08] pb-4">
          <div>
            <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">
              {t('dashboard.recentLogs')}
            </h2>
            <p className="text-xs text-[#737373] dark:text-[#85858b]">
              {isBn ? 'সাম্প্রতিক জরুরি সংকেত সক্রিয়করণের অডিট তালিকা' : 'Audit record of your past and active emergency activations'}
            </p>
          </div>
          <Link
            to="/dashboard/sos-history"
            className="text-xs font-medium text-[#e11d48] dark:text-[#fb7185] hover:underline inline-flex items-center gap-1"
          >
            {t('dashboard.fullHistory')} <FiArrowRight className="w-3.5 h-3.5 dispatch-icon" />
          </Link>
        </div>

        <SOSHistoryList history={sosHistory.slice(0, 5)} />
      </div>

      <FakeCallModal isOpen={fakeCallOpen} onClose={() => setFakeCallOpen(false)} />
      <MedicalIDModal isOpen={medicalIdOpen} onClose={() => setMedicalIdOpen(false)} />
    </div>
  );
};

export default UserDashboard;
