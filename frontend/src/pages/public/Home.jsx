import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiAlertCircle, FiPhoneCall, FiMapPin, FiArrowRight, FiActivity, FiCheckCircle, FiLock, FiRadio, FiCpu } from 'react-icons/fi';
import SOSButton from '../../components/sos/SOSButton';
import LiveMap from '../../components/map/LiveMap';
import { EMERGENCY_NUMBERS } from '../../utils/constants';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../../components/common/LanguageToggle';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-12 pb-20">
      
      {/* Real-Time Security Telemetry Marquee Bar */}
      <div className="bg-zinc-100 text-zinc-700 dark:bg-[#121215] dark:text-zinc-400 py-2 px-4 border-b border-zinc-200 dark:border-zinc-800 text-xs font-mono transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-6 whitespace-nowrap">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 telemetry-dot"></span> {t('common.systemOperational')}
            </span>
            <span className="text-zinc-400 dark:text-zinc-600">|</span>
            <span>{t('common.gpsAccuracy')}</span>
            <span className="text-zinc-400 dark:text-zinc-600">|</span>
            <span>{t('common.encryption')}</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400">
            <LanguageToggle />
            <span>{t('common.nationalDispatch')}</span>
            <span className="text-zinc-400 dark:text-zinc-600">|</span>
            <span>LATENCY: &lt;15ms</span>
          </div>
        </div>
      </div>

      {/* Main Bento Hero Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Hero Bento Card (8 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-8 product-card p-6 sm:p-10 flex flex-col justify-between space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="mono-tag mono-tag-zinc">
                  <FiCpu className="w-3 h-3 text-zinc-500" /> Platform v2.4
                </span>
                <span className="mono-tag mono-tag-emerald">
                  24/7 Protection
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-heading leading-tight">
                {t('home.heroTitlePrefix')} <br className="hidden sm:block" />
                <span className="text-rose-600 dark:text-rose-500">{t('home.heroTitleSuffix')}</span>.
              </h1>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl font-normal leading-relaxed">
                {t('home.heroSub')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/register" className="btn-solid text-xs py-2.5 px-5">
                {t('home.createAccount')} <FiArrowRight />
              </Link>
              <Link to="/emergency-help" className="btn-outline text-xs py-2.5 px-5">
                {t('home.emergencyDirectory')}
              </Link>
            </div>

            {/* Technical Specs Footer */}
            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-3 gap-4 font-mono text-xs">
              <div>
                <span className="block text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-semibold">{t('home.responseTime')}</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{t('home.responseVal')}</span>
              </div>
              <div>
                <span className="block text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-semibold">{t('home.priorityContactsSpec')}</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{t('home.priorityContactsVal')}</span>
              </div>
              <div>
                <span className="block text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-semibold">{t('home.dispatchProtocol')}</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{t('home.dispatchVal')}</span>
              </div>
            </div>
          </motion.div>

          {/* Distress Control Bento Card (4 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-4 product-card p-6 sm:p-8 flex flex-col justify-between text-center space-y-6 bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 text-left">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold">{t('home.panicBeacon')}</span>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">{t('home.sosDistressTrigger')}</h3>
              </div>
              <span className="mono-tag mono-tag-emerald py-0.5 text-[10px]">
                {t('common.active')}
              </span>
            </div>

            <div className="py-2">
              <SOSButton size="large" />
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 flex items-center justify-between text-left">
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                <FiMapPin /> {t('home.gpsTelemetry')}
              </span>
              <span className="text-zinc-800 dark:text-zinc-300 font-semibold">23.8103° N, 90.4125° E</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Emergency Hotline Directory Bento Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="product-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <FiPhoneCall className="text-rose-600 dark:text-rose-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white font-heading">
                {t('home.speedDialTitle')}
              </h2>
            </div>
            <Link to="/emergency-help" className="text-xs font-mono font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1">
              {t('home.viewAllHotlines')} <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {EMERGENCY_NUMBERS.map((num) => (
              <a
                key={num.id}
                href={`tel:${num.number}`}
                className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 hover:bg-rose-500/10 border border-zinc-200 dark:border-zinc-800 transition group text-center space-y-1"
              >
                <span className="block text-[10px] uppercase font-mono text-zinc-400">{num.category}</span>
                <h4 className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 truncate">{num.name}</h4>
                <span className="block text-sm font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                  {num.number}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Geolocation Telemetry Radar Bento Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiRadio className="text-emerald-500" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-white font-heading">{t('home.monitoringRadar')}</h2>
          </div>
          <span className="mono-tag mono-tag-zinc hidden sm:inline-flex">
            Leaflet / OpenStreetMap Dual Engine
          </span>
        </div>

        <LiveMap title="SafeHaven Geolocation Radar" />
      </section>

      {/* Product Architecture Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white font-heading">{t('home.systemCapabilities')}</h2>
          <p className="text-xs text-zinc-500">{t('home.capabilitiesSub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="product-card p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg font-bold">
              <FiAlertCircle />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{t('home.cap1Title')}</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              {t('home.cap1Desc')}
            </p>
          </div>

          <div className="product-card p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg font-bold">
              <FiCheckCircle />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{t('home.cap2Title')}</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              {t('home.cap2Desc')}
            </p>
          </div>

          <div className="product-card p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 flex items-center justify-center text-lg font-bold">
              <FiShield />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{t('home.cap3Title')}</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              {t('home.cap3Desc')}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
