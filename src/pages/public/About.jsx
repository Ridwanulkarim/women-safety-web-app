import React from 'react';
import { FiShield, FiHeart, FiLock, FiCheckCircle } from 'react-icons/fi';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest bg-pink-500/10 px-4 py-1.5 rounded-full">
          About SafeHaven
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-heading">
          Empowering Women Through <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Technology & Protection</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          SafeHaven is built to bridge the gap between distress detection and rapid emergency dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-pink-600/30">
            <FiShield />
          </div>
          <h3 className="text-xl font-bold font-heading">Our Mission</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Provide zero-friction emergency panic activation, privacy-first location sharing, and direct hotline connections worldwide.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-purple-600/30">
            <FiHeart />
          </div>
          <h3 className="text-xl font-bold font-heading">Empowerment</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Equip every individual with actionable self-defense strategies, legal rights knowledge, and travel safety protocols.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-emerald-600/30">
            <FiLock />
          </div>
          <h3 className="text-xl font-bold font-heading">Strict Privacy</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Your location data is stored strictly during active distress broadcasts and is never sold or shared for marketing purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
