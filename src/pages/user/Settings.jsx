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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="surface-panel p-6 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#525252] dark:text-[#a1a1a6] flex items-center justify-center shrink-0">
          <FiSettings className="w-5 h-5 dispatch-icon" />
        </div>
        <div>
          <h1 className="text-2xl font-medium text-[#171717] dark:text-[#ededed]">
            {isBn ? 'অ্যাপ্লিকেশন সেটিংস' : 'Settings'}
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
            {isBn
              ? 'ইউজার ইন্টারফেস, নোটিফিকেশন এবং গোপনীয়তার পছন্দ নির্ধারণ করুন'
              : 'Manage appearance, alerts, and location sharing preferences'}
          </p>
        </div>
      </div>

      <div className="surface-panel p-6 divide-y divide-zinc-900/[0.08] dark:divide-white/[0.08]">
        <div className="flex items-center justify-between py-4 first:pt-0">
          <div className="space-y-0.5">
            <h2 className="text-sm font-medium flex items-center gap-2 text-[#171717] dark:text-[#ededed]">
              {darkMode ? <FiMoon className="w-4 h-4 text-[#737373] dark:text-[#a1a1a6] dispatch-icon" /> : <FiSun className="w-4 h-4 text-[#737373] dispatch-icon" />}
              {isBn ? 'ডার্ক মোড থিম' : 'Appearance mode'}
            </h2>
            <p className="text-xs text-[#525252] dark:text-[#a1a1a6]">
              {isBn ? 'লাইট ও ডার্ক গ্রাফাইট থিম পরিবর্তন করুন।' : 'Switch between dark and light Graphite interface themes.'}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleDarkMode}
            role="switch"
            aria-checked={darkMode}
            className={`relative inline-flex h-7 w-12 items-center rounded-full p-0.5 transition-colors duration-150 cursor-pointer ${
              darkMode ? 'bg-[#e11d48]' : 'bg-zinc-300 dark:bg-[#232325]'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow transition-transform duration-150 ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="space-y-0.5">
            <h2 className="text-sm font-medium flex items-center gap-2 text-[#171717] dark:text-[#ededed]">
              <FiBell className="w-4 h-4 text-[#737373] dark:text-[#a1a1a6] dispatch-icon" />
              {isBn ? 'জরুরি পুশ নোটিফিকেশন' : 'Emergency push notifications'}
            </h2>
            <p className="text-xs text-[#525252] dark:text-[#a1a1a6]">
              {isBn ? 'জরুরি সতর্কবার্তার তাৎক্ষণিক নোটিফিকেশন পান।' : 'Receive immediate alerts when distress beacons fire.'}
            </p>
          </div>
          <button
            onClick={() => toast.success(isBn ? 'নোটিফিকেশন সেটিংস সংরক্ষিত' : 'Notification preferences saved')}
            className="btn-outline h-9 px-3 text-xs"
          >
            {isBn ? 'সক্রিয়' : 'Enabled'}
          </button>
        </div>

        <div className="flex items-center justify-between py-4 last:pb-0">
          <div className="space-y-0.5">
            <h2 className="text-sm font-medium flex items-center gap-2 text-[#171717] dark:text-[#ededed]">
              <FiLock className="w-4 h-4 text-[#737373] dark:text-[#a1a1a6] dispatch-icon" />
              {isBn ? 'গোপনীয়তা ও লোকেশন ট্র্যাকিং' : 'Privacy and GPS sharing'}
            </h2>
            <p className="text-xs text-[#525252] dark:text-[#a1a1a6]">
              {isBn
                ? 'কেবল সক্রিয় এসওএস বিপদকালীন সময়ে লোকেশন শেয়ারের অনুমোদন থাকে।'
                : 'Coordinates are shared strictly during active SOS distress broadcasts.'}
            </p>
          </div>
          <span className="status-tag mono-tag-emerald">
            {isBn ? 'সুরক্ষিত' : 'Enforced'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
