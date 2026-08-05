import React from 'react';
import { FiPhoneCall, FiShield, FiAlertTriangle, FiHeart, FiActivity } from 'react-icons/fi';
import { EMERGENCY_NUMBERS } from '../../utils/constants';

const EmergencyHelp = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest bg-pink-500/10 px-4 py-1.5 rounded-full">
          Emergency Hotlines
        </span>
        <h1 className="text-4xl font-extrabold font-heading">One-Touch Emergency Speed Dial</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Tap any card on your mobile device to immediately call national emergency dispatch centers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {EMERGENCY_NUMBERS.map((num) => (
          <div key={num.id} className="glass-card p-8 rounded-3xl space-y-6 text-center hover:border-pink-500/40 transition">
            <div className={`w-16 h-16 mx-auto rounded-3xl text-white flex items-center justify-center text-3xl shadow-xl ${num.color}`}>
              <FiPhoneCall />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{num.category}</span>
              <h3 className="text-xl font-bold font-heading text-slate-800 dark:text-slate-100">{num.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{num.description}</p>
            </div>

            <a
              href={`tel:${num.number}`}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-extrabold text-lg flex items-center justify-center gap-3 shadow-lg shadow-pink-600/30 transition hover:scale-105"
            >
              <FiPhoneCall /> Call {num.number}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyHelp;
