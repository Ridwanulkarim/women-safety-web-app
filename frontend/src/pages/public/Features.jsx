import React from 'react';
import { FiAlertCircle, FiPhoneCall, FiMapPin, FiShield, FiBell, FiPieChart } from 'react-icons/fi';

const Features = () => {
  const featureList = [
    { title: 'One-Tap SOS Panic Button', desc: 'Instant distress trigger with 3s cancel window and location transmission.', icon: FiAlertCircle },
    { title: '5 Emergency Contacts', desc: 'Priority speed-dial list with direct phone integration.', icon: FiPhoneCall },
    { title: 'Dual Map Geolocation', desc: 'Automatic Leaflet OpenStreetMap fallback requiring no paid API key.', icon: FiMapPin },
    { title: 'National Emergency Hotlines', desc: 'Pre-configured Bangladesh speed dial for 999, Police, Fire, and Helpline.', icon: FiShield },
    { title: 'Real-Time Notifications', desc: 'Unread badge notifications for distress alerts and announcements.', icon: FiBell },
    { title: 'Admin Command Center', desc: 'Incident heatmaps, user status management, and Chart.js analytics.', icon: FiPieChart }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold font-heading">Comprehensive Platform Features</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Everything designed for immediate safety and long-term protection.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureList.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="glass-card p-8 rounded-3xl space-y-4 hover:border-pink-500/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 text-white flex items-center justify-center text-xl shadow-md">
                <Icon />
              </div>
              <h3 className="text-lg font-bold font-heading">{f.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Features;
