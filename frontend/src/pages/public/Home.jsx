import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiAlertCircle, FiPhoneCall, FiMapPin, FiBookOpen, FiLock, FiArrowRight, FiHeart } from 'react-icons/fi';
import SOSButton from '../../components/sos/SOSButton';
import LiveMap from '../../components/map/LiveMap';
import { EMERGENCY_NUMBERS } from '../../utils/constants';

const Home = () => {
  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-bold uppercase tracking-wider">
              <FiShield className="text-sm" /> 24/7 Personal Safety Shield
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight">
              Instant Emergency <span className="bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">Distress Protection</span> for Every Woman.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              SafeHaven delivers instant SOS distress broadcasting, live location tracking, direct hotline speed dial, and a emergency response network.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/register"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-sm shadow-xl shadow-pink-600/30 transition hover:scale-105 flex items-center gap-2"
              >
                Create Free Safety Account <FiArrowRight />
              </Link>
              <Link
                to="/emergency-help"
                className="px-8 py-4 rounded-2xl glass-card text-slate-800 dark:text-slate-100 font-bold text-sm hover:border-pink-500/40 transition"
              >
                Quick Emergency Numbers
              </Link>
            </div>
          </motion.div>

          {/* Hero SOS Trigger Unit */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 sm:p-12 rounded-3xl text-center space-y-6 relative border border-pink-500/20"
          >
            <span className="inline-block text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest bg-pink-500/10 px-3 py-1 rounded-full">
              Press to Trigger Distress Alert
            </span>
            
            <SOSButton size="large" />

            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 grid grid-cols-2 gap-4 text-left">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Response Speed</span>
                <p className="text-sm font-bold text-pink-600 dark:text-pink-400">Under 3 Seconds</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Contacts Alerted</span>
                <p className="text-sm font-bold text-purple-600 dark:text-purple-400">Up to 5 Priority</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Emergency Hotlines Quick Bar (Bangladesh Spec) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold font-heading">National Emergency Hotlines</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">One-tap direct speed dial for immediate emergency services.</p>
            </div>
            <Link to="/emergency-help" className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1">
              View All Hotlines <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {EMERGENCY_NUMBERS.map((num) => (
              <a
                key={num.id}
                href={`tel:${num.number}`}
                className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-pink-500/10 border border-slate-200 dark:border-slate-800 transition group text-center space-y-2"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-pink-600 text-white flex items-center justify-center text-lg font-bold shadow-md group-hover:scale-110 transition">
                  <FiPhoneCall />
                </div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">{num.name}</h4>
                <span className="block text-sm font-extrabold text-pink-600 dark:text-pink-400 font-heading">
                  {num.number}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Live Map Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold font-heading">Real-Time Geolocation Shield</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Interactive dual map system automatically falls back to OpenStreetMap when Google Maps key is omitted.
          </p>
        </div>

        <LiveMap title="SafeHaven Live Map Engine" />
      </section>

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold font-heading">Built for Complete Peace of Mind</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Every feature is engineered for speed, privacy, and reliability in critical emergency moments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-3xl space-y-4 hover:border-pink-500/30 transition">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center text-2xl">
              <FiAlertCircle />
            </div>
            <h3 className="text-xl font-bold font-heading">SOS Panic Trigger</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Broadcast high-priority distress alerts with exact GPS coordinates to designated emergency contacts.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl space-y-4 hover:border-purple-500/30 transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl">
              <FiPhoneCall />
            </div>
            <h3 className="text-xl font-bold font-heading">5 Emergency Contacts</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Store up to 5 family members, friends, or trusted guardians with instant one-tap speed dial.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl space-y-4 hover:border-pink-500/30 transition">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center text-2xl">
              <FiBookOpen />
            </div>
            <h3 className="text-xl font-bold font-heading">Safety Tips & Manual</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Comprehensive self-defense guides, travel safety checklists, digital security rules, and legal rights.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
