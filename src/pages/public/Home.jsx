import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiAlertCircle, FiPhoneCall, FiMapPin, FiBookOpen, FiLock, FiArrowRight, FiActivity, FiCheckCircle } from 'react-icons/fi';
import SOSButton from '../../components/sos/SOSButton';
import LiveMap from '../../components/map/LiveMap';
import { EMERGENCY_NUMBERS } from '../../utils/constants';

const Home = () => {
  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-8 lg:pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Active Protection Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading leading-tight">
              Personal Safety & Instant <span className="text-rose-600 dark:text-rose-500">Emergency Dispatch</span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              SafeHaven provides instantaneous SOS distress broadcasting, continuous live location tracking, and direct emergency hotline routing for women everywhere.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                to="/register"
                className="btn-primary"
              >
                Create Account <FiArrowRight />
              </Link>
              <Link
                to="/emergency-help"
                className="btn-secondary"
              >
                Hotline Directory
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Response</span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">&lt; 3 Seconds</p>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Precision</span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">High-Acc GPS</p>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Security</span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">End-to-End</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: SOS Dispatch Hub Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 human-card p-6 sm:p-8 space-y-6 text-center relative"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 text-left">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Distress Beacon</h3>
                <p className="text-xs text-slate-500">Hold button or tap to broadcast</p>
              </div>
              <span className="badge-status badge-active">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Ready
              </span>
            </div>
            
            <div className="py-4">
              <SOSButton size="large" />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <FiMapPin className="text-rose-500" /> Geolocation Active
              </span>
              <span className="font-mono text-[11px] text-slate-500">23.8103° N, 90.4125° E</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Speed Dial Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="human-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">Emergency Direct Hotlines</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">One-tap direct speed dial for national emergency dispatchers.</p>
            </div>
            <Link to="/emergency-help" className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1">
              View All Numbers <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {EMERGENCY_NUMBERS.map((num) => (
              <a
                key={num.id}
                href={`tel:${num.number}`}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-rose-500/10 border border-slate-200 dark:border-slate-800 transition group text-center space-y-2"
              >
                <div className="w-9 h-9 mx-auto rounded-lg bg-rose-600 text-white flex items-center justify-center text-base font-bold shadow-sm">
                  <FiPhoneCall />
                </div>
                <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">{num.name}</h4>
                <span className="block text-sm font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                  {num.number}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Live Map Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">Live Geolocation Monitoring</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive dual-map engine with automatic Leaflet fallback.
            </p>
          </div>
        </div>

        <LiveMap title="SafeHaven Geolocation Radar" />
      </section>

      {/* Product Capability Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">Engineered for Critical Response</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Built with strict security standards, instant response mechanisms, and location privacy controls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="human-card p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl">
              <FiAlertCircle />
            </div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">SOS Distress Signal</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dispatches high-priority alert notifications with real-time GPS coordinates to your primary emergency contacts.
            </p>
          </div>

          <div className="human-card p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl">
              <FiCheckCircle />
            </div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">Emergency Contacts</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Store up to 5 prioritized family members or guardians for automated SMS and emergency speed dialing.
            </p>
          </div>

          <div className="human-card p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl">
              <FiBookOpen />
            </div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">Safety Knowledge Base</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Curated tactical self-defense strategies, travel security rules, legal rights, and digital privacy guides.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
