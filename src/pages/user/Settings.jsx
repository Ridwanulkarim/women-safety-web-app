import React from 'react';
import { FiSettings, FiMoon, FiSun, FiBell, FiLock } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
          <FiSettings />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-heading text-zinc-900 dark:text-white">
            {isBn ? 'অ্যাপ্লিকেশন সেটিংস' : 'App Settings'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isBn ? 'ইউজার ইন্টারফেস, নোটিফিকেশন ও গোপনীয়তা সম্পর্কিত পছন্দসমূহ নির্ধারণ করুন।' : 'Configure interface preferences, notifications, and privacy options.'}
          </p>
        </div>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between py-4 border-b border-slate-200/50 dark:border-slate-800/50">
          <div>
            <h3 className="text-sm font-bold font-heading flex items-center gap-2 text-zinc-900 dark:text-white">
              {darkMode ? <FiMoon className="text-purple-400" /> : <FiSun className="text-amber-500" />} {isBn ? 'ডার্ক মোড থিম' : 'Dark Mode Theme'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBn ? 'লাইট ও ডার্ক গ্লাসফরমিক লেআউট পরিবর্তন করুন।' : 'Toggle dark glassmorphic layout theme.'}
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-300 ${
              darkMode ? 'bg-pink-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-white shadow-md"></div>
          </button>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-slate-200/50 dark:border-slate-800/50">
          <div>
            <h3 className="text-sm font-bold font-heading flex items-center gap-2 text-zinc-900 dark:text-white">
              <FiBell className="text-pink-500" /> {isBn ? 'জরুরি পুশ নোটিফিকেশন' : 'Emergency Push Alerts'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBn ? 'আশেপাশের যেকোনো বিপদকালীন সতর্কবার্তার তাৎক্ষণিক নোটিফিকেশন পান।' : 'Receive instant push notifications for nearby distress signals.'}
            </p>
          </div>
          <button
            onClick={() => toast.success(isBn ? 'পুশ নোটিফিকেশন সক্রিয় রয়েছে!' : 'Push notification preferences saved!')}
            className="px-4 py-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-bold font-mono"
          >
            {isBn ? 'সক্রিয়' : 'Enabled'}
          </button>
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <h3 className="text-sm font-bold font-heading flex items-center gap-2 text-zinc-900 dark:text-white">
              <FiLock className="text-emerald-500" /> {isBn ? 'গোপনীয়তা ও লোকেশন ট্র্যাকিং' : 'Privacy & Location Tracking'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBn ? 'কেবলমাত্র সক্রিয় এসওএস বিপদকালীন সময়ে জিপিএস লোকেশন শেয়ার করার অনুমোদন দিন।' : 'Allow location polling strictly during active SOS distress broadcasts.'}
            </p>
          </div>
          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-mono font-bold">
            {isBn ? 'সুরক্ষিত' : 'SECURE'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
