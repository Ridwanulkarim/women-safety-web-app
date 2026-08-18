import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiAlertCircle, FiPhoneCall, FiCamera, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useSOS } from '../../context/SOSContext';
import { useLanguage } from '../../context/LanguageContext';

const MobileBottomBar = () => {
  const { user } = useAuth();
  const { openSOSModal } = useSOS();
  const { t } = useLanguage();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-mono font-bold transition ${
            isActive('/') ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900'
          }`}
        >
          <FiHome className="w-5 h-5 mb-0.5" />
          <span>{t('nav.home')}</span>
        </Link>

        {/* Helplines */}
        <Link
          to="/emergency-help"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-mono font-bold transition ${
            isActive('/emergency-help') ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900'
          }`}
        >
          <FiPhoneCall className="w-5 h-5 mb-0.5" />
          <span>999 Dial</span>
        </Link>

        {/* Center SOS Panic Button */}
        <button
          onClick={openSOSModal}
          className="flex flex-col items-center justify-center -mt-4 w-12 h-12 rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/40 active:scale-95 transition border-2 border-white dark:border-zinc-900"
          title="Trigger Emergency SOS"
        >
          <FiAlertCircle className="w-6 h-6 animate-pulse" />
        </button>

        {/* Evidence Locker / Guides */}
        <Link
          to={user ? "/dashboard/evidence" : "/safety-tips"}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-mono font-bold transition ${
            isActive('/dashboard/evidence') || isActive('/safety-tips') ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900'
          }`}
        >
          <FiCamera className="w-5 h-5 mb-0.5" />
          <span>{user ? t('nav.evidenceVault') : t('nav.safetyTips')}</span>
        </Link>

        {/* Profile / Account */}
        <Link
          to={user ? "/dashboard" : "/login"}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-mono font-bold transition ${
            isActive('/dashboard') || isActive('/login') ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900'
          }`}
        >
          <FiUser className="w-5 h-5 mb-0.5" />
          <span>{user ? t('nav.profile') : t('nav.signIn')}</span>
        </Link>

      </div>
    </div>
  );
};

export default MobileBottomBar;
