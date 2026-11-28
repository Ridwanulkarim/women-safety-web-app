import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiAlertCircle, FiPhoneCall, FiMapPin, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import SOSButton from '../../components/sos/SOSButton';
import LiveMap from '../../components/map/LiveMap';
import { EMERGENCY_NUMBERS } from '../../utils/constants';
import { useLanguage } from '../../context/LanguageContext';
import { toBengaliDigits, localizeNum } from '../../utils/helpers';
import { useGeolocation } from '../../hooks/useGeolocation';

const Home = () => {
  const { t, language } = useLanguage();
  const isBn = language === 'bn';
  const location = useGeolocation(true);

  const hotlineNames = {
    'National Emergency Service': isBn ? 'জাতীয় জরুরি সেবা' : 'National Emergency Service',
    'Police Emergency Helpline': isBn ? 'পুলিশ জরুরি হেল্পলাইন' : 'Police Emergency Helpline',
    'National Women Helpline': isBn ? 'জাতীয় নারী হেল্পলাইন' : 'National Women Helpline',
    'Child Helpline Bangladesh': isBn ? 'চাইল্ড হেল্পলাইন বাংলাদেশ' : 'Child Helpline Bangladesh',
    'Shasthyo Batayon': isBn ? 'স্বাস্থ্য বাতায়ন' : 'Shasthyo Batayon'
  };

  const hotlineCategories = {
    'National Hotline': isBn ? 'জাতীয় হটলাইন' : 'National hotline',
    'Law Enforcement': isBn ? 'আইন শৃঙ্খলা' : 'Law enforcement',
    'Specialized Hotline': isBn ? 'বিশেষ হটলাইন' : 'Specialized line',
    'Child Protection': isBn ? 'শিশু সুরক্ষা' : 'Child protection',
    'Medical Advice': isBn ? 'স্বাস্থ্য পরামর্শ' : 'Medical advice'
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Operational Status Strip */}
      <div className="bg-[#f9f8ff] dark:bg-[#0f0f10] border-b border-zinc-900/[0.08] dark:border-white/[0.08] py-2.5 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-6 overflow-x-auto whitespace-nowrap text-[#525252] dark:text-[#a1a1a6]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 font-medium text-[#171717] dark:text-[#ededed]">
              <span className="w-2 h-2 rounded-full bg-[#16a34a] dark:bg-[#4cc38a]"></span>
              {t('common.systemOperational')}
            </span>
            <span className="text-[#737373] dark:text-[#85858b]">·</span>
            <span>{t('common.gpsAccuracy')}</span>
            <span className="text-[#737373] dark:text-[#85858b] hidden sm:inline">·</span>
            <span className="hidden sm:inline">{t('common.encryption')}</span>
          </div>
          <div className="flex items-center gap-4 font-mono tabular-nums text-[#737373] dark:text-[#85858b]">
            <span>{t('common.nationalDispatch')}</span>
          </div>
        </div>
      </div>

      {/* Asymmetric Dispatch Hero */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left: Core Message & Actions (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-xs font-mono text-[#737373] dark:text-[#85858b]">
              {isBn ? 'জাতীয় জরুরি নেটওয়ার্ক · বাংলাদেশ' : 'National emergency network · Bangladesh'}
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-medium tracking-[-0.025em] leading-[1.08] text-[#171717] dark:text-[#ededed]">
              {t('home.heroTitlePrefix')} {t('home.heroTitleSuffix')}
            </h1>

            <p className="text-base sm:text-lg text-[#525252] dark:text-[#a1a1a6] max-w-[36rem] leading-[1.6] font-normal">
              {t('home.heroSub')}
            </p>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link to="/register" className="btn-solid h-11 px-5 text-sm">
                {t('home.createAccount')} <FiArrowRight className="w-4 h-4 dispatch-icon" />
              </Link>
              <Link to="/emergency-help" className="btn-outline h-11 px-5 text-sm">
                {t('home.emergencyDirectory')}
              </Link>
            </div>

            {/* Aligned Spec Strip */}
            <div className="pt-6 mt-2 border-t border-zinc-900/[0.08] dark:border-white/[0.08] grid grid-cols-3 gap-4 max-w-xl">
              <div>
                <span className="block text-xs text-[#737373] dark:text-[#85858b]">{t('home.responseTime')}</span>
                <span className="font-mono tabular-nums text-base font-medium text-[#171717] dark:text-[#ededed] mt-0.5 block">
                  {t('home.responseVal')}
                </span>
              </div>
              <div>
                <span className="block text-xs text-[#737373] dark:text-[#85858b]">{t('home.priorityContactsSpec')}</span>
                <span className="font-mono tabular-nums text-base font-medium text-[#171717] dark:text-[#ededed] mt-0.5 block">
                  {t('home.priorityContactsVal')}
                </span>
              </div>
              <div>
                <span className="block text-xs text-[#737373] dark:text-[#85858b]">{t('home.dispatchProtocol')}</span>
                <span className="font-mono text-base font-medium text-[#171717] dark:text-[#ededed] mt-0.5 block">
                  {t('home.dispatchVal')}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Distress Instrument Panel (5 Cols) */}
          <div className="lg:col-span-5 surface-panel p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-900/[0.08] dark:border-white/[0.08] pb-4">
              <div>
                <span className="text-xs text-[#737373] dark:text-[#85858b] block">{t('home.panicBeacon')}</span>
                <h2 className="text-sm font-medium text-[#171717] dark:text-[#ededed] mt-0.5">
                  {t('home.sosDistressTrigger')}
                </h2>
              </div>
              <span className="status-tag mono-tag-emerald">
                {t('common.active')}
              </span>
            </div>

            {/* Instrument Reticle Around Physical Trigger */}
            <div className="py-6 relative flex items-center justify-center rounded-xl bg-[#f9f8ff] dark:bg-[#141415] border border-zinc-900/[0.08] dark:border-white/[0.08]">
              <div className="w-60 h-60 rounded-full border border-dashed border-zinc-900/[0.08] dark:border-white/[0.08] flex items-center justify-center">
                <SOSButton size="large" />
              </div>
            </div>

            {/* Live Tabular Coordinates Bar */}
            <div className="px-3.5 py-2.5 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] border border-zinc-900/[0.08] dark:border-white/[0.08] text-xs font-mono tabular-nums flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-[#525252] dark:text-[#a1a1a6]">
                <FiMapPin className="w-4 h-4 text-[#e11d48] dispatch-icon shrink-0" />
                <span>{t('home.gpsTelemetry')}</span>
              </span>
              <span className="text-[#171717] dark:text-[#ededed] font-medium truncate">
                {location.latitude
                  ? isBn
                    ? `${toBengaliDigits(location.latitude.toFixed(4))}° উত্তর · ${toBengaliDigits(location.longitude.toFixed(4))}° পূর্ব`
                    : `${location.latitude.toFixed(4)}° N · ${location.longitude.toFixed(4)}° E`
                  : isBn
                    ? 'অবস্থান নির্ণয় হচ্ছে'
                    : 'Acquiring GPS'}
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Emergency Speed Dial Directory Bar */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-900/[0.08] dark:border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <FiPhoneCall className="w-4 h-4 text-[#737373] dark:text-[#85858b] dispatch-icon" />
            <h2 className="text-lg font-medium text-[#171717] dark:text-[#ededed]">
              {t('home.speedDialTitle')}
            </h2>
          </div>
          <Link
            to="/emergency-help"
            className="text-xs font-medium text-[#e11d48] dark:text-[#fb7185] hover:underline inline-flex items-center gap-1.5"
          >
            {t('home.viewAllHotlines')} <FiArrowRight className="w-3.5 h-3.5 dispatch-icon" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {EMERGENCY_NUMBERS.map((num) => (
            <a
              key={num.id}
              href={`tel:${num.number}`}
              className="surface-card product-card-hover p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <span className="block text-xs text-[#737373] dark:text-[#85858b]">
                  {hotlineCategories[num.category] || num.category}
                </span>
                <h3 className="text-sm font-medium text-[#171717] dark:text-[#ededed] line-clamp-1">
                  {hotlineNames[num.name] || num.name}
                </h3>
              </div>
              <span className="block text-xl font-medium font-mono tabular-nums text-[#e11d48] dark:text-[#fb7185]">
                {localizeNum(num.number, isBn)}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Live Geolocation Radar Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <FiMapPin className="w-4 h-4 text-[#737373] dark:text-[#85858b] dispatch-icon" />
            <h2 className="text-lg font-medium text-[#171717] dark:text-[#ededed]">
              {t('home.monitoringRadar')}
            </h2>
            <span className={`status-tag ${location.isApproximate ? '' : 'mono-tag-emerald'}`}>
              {location.isApproximate
                ? (isBn ? 'আনুমানিক নেটওয়ার্ক পয়েন্ট' : 'Approximate network point')
                : (isBn ? 'লাইভ জিপিএস নির্ধারিত' : 'GPS position locked')}
            </span>
          </div>
          <span className="text-xs font-mono text-[#737373] dark:text-[#85858b] hidden sm:inline">
            Leaflet · OpenStreetMap
          </span>
        </div>

        <LiveMap
          latitude={location.latitude}
          longitude={location.longitude}
          accuracy={location.accuracy}
          source={location.source}
          isApproximate={location.isApproximate}
          permissionDenied={location.permissionDenied}
          title={isBn ? 'সেফহ্যাভেন লাইভ লোকেশন' : 'SafeHaven live location'}
          onLocationChange={(lat, lng, acc, addr) => {
            location.setManualLocation(lat, lng, addr);
          }}
          onRefreshGPS={location.refreshLocation}
        />
      </section>

      {/* Core Capabilities */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="pb-4 border-b border-zinc-900/[0.08] dark:border-white/[0.08]">
          <h2 className="text-xl font-medium text-[#171717] dark:text-[#ededed]">
            {t('home.systemCapabilities')}
          </h2>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6] mt-1">
            {t('home.capabilitiesSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="surface-card p-6 space-y-3">
            <FiAlertCircle className="w-5 h-5 text-[#e11d48] dispatch-icon" />
            <h3 className="text-base font-medium text-[#171717] dark:text-[#ededed]">
              {t('home.cap1Title')}
            </h3>
            <p className="text-sm text-[#525252] dark:text-[#a1a1a6] leading-relaxed">
              {t('home.cap1Desc')}
            </p>
          </div>

          <div className="surface-card p-6 space-y-3">
            <FiCheckCircle className="w-5 h-5 text-[#525252] dark:text-[#a1a1a6] dispatch-icon" />
            <h3 className="text-base font-medium text-[#171717] dark:text-[#ededed]">
              {t('home.cap2Title')}
            </h3>
            <p className="text-sm text-[#525252] dark:text-[#a1a1a6] leading-relaxed">
              {t('home.cap2Desc')}
            </p>
          </div>

          <div className="surface-card p-6 space-y-3">
            <FiShield className="w-5 h-5 text-[#525252] dark:text-[#a1a1a6] dispatch-icon" />
            <h3 className="text-base font-medium text-[#171717] dark:text-[#ededed]">
              {t('home.cap3Title')}
            </h3>
            <p className="text-sm text-[#525252] dark:text-[#a1a1a6] leading-relaxed">
              {t('home.cap3Desc')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
