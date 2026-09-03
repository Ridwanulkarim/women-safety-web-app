import React from 'react';
import { FiAlertCircle, FiPhoneCall, FiMapPin, FiShield, FiBell, FiPieChart } from 'react-icons/fi';

const Features = () => {
  const featureList = [
    { title: 'One-Tap SOS Panic Button', desc: 'Instant distress trigger with 3s cancel window and real-time location transmission to linked guardians.', icon: FiAlertCircle, tag: 'CRITICAL DISPATCH' },
    { title: '5 Priority Emergency Contacts', desc: 'Customizable guardian list with 1-tap speed dial and automated emergency SMS triggers.', icon: FiPhoneCall, tag: 'COMMUNICATION' },
    { title: 'Dual-Engine Geolocation Radar', desc: 'Ultra-accurate GPS positioning with Leaflet and OpenStreetMap rendering requiring zero paid external keys.', icon: FiMapPin, tag: 'TELEMETRY' },
    { title: 'National 999 Integration', desc: 'Speed-dial gateway to Bangladesh National Emergency Service, Police, Fire Dispatch, and Women Helpline.', icon: FiShield, tag: 'CIVIL DISPATCH' },
    { title: 'Evidence Vault Locker', desc: 'Encrypted camera capture and ambient audio recording locker with timestamped legal chain-of-custody export.', icon: FiBell, tag: 'DIGITAL EVIDENCE' },
    { title: 'Admin Command Telemetry', desc: 'Real-time incident response dashboard, live alert resolution, user directory, and safety analytics.', icon: FiPieChart, tag: 'INCIDENT OPS' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="text-center max-w-3xl mx-auto space-y-3 relative z-10">
        <span className="mono-tag mono-tag-rose">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 telemetry-dot"></span> System Architecture & Capabilities
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
          Comprehensive Platform <span className="gradient-text-rose">Safety Features</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          Everything engineered for immediate emergency deterrence, rapid response, and digital evidence protection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {featureList.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="product-card product-card-hover p-7 sm:p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center text-xl shadow-lg shadow-rose-600/25">
                    <Icon />
                  </div>
                  <span className="mono-tag mono-tag-zinc text-[10px]">{f.tag}</span>
                </div>
                <h3 className="text-base font-extrabold text-zinc-900 dark:text-white font-heading">{f.title}</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Features;
