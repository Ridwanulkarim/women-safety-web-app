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

  const hiddenPaths = ['/login', '/register', '/signin', '/signup'];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#0c0c10]/95 backdrop-blur-2xl border-t border-zinc-200/80 dark:border-zinc-800/80 px-3 py-2 shadow-2xl safe-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all duration-200 active:scale-90 ${
            isActive('/') ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <FiHome className="w-5 h-5 mb-0.5" />
          <span>{t('nav.home')}</span>
          {isActive('/') && <span className="w-1 h-1 rounded-full bg-rose-600 dark:bg-rose-400 mt-0.5"></span>}
        </Link>

        {/* Helplines */}
        <Link
          to="/emergency-help"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all duration-200 active:scale-90 ${
            isActive('/emergency-help') ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <FiPhoneCall className="w-5 h-5 mb-0.5" />
          <span>999 Dial</span>
          {isActive('/emergency-help') && <span className="w-1 h-1 rounded-full bg-rose-600 dark:bg-rose-400 mt-0.5"></span>}
        </Link>

        {/* Center SOS Panic Button with Radar Pulse Glow */}
        <div className="relative -mt-6">
          <div className="absolute inset-0 rounded-full bg-rose-600/30 blur-md pulse-radar-ring pointer-events-none"></div>
          <button
            onClick={openSOSModal}
            className="relative flex flex-col items-center justify-center w-13 h-13 rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 text-white shadow-xl shadow-rose-600/50 active:scale-90 transition-transform duration-150 border-2 border-white dark:border-[#0c0c10]"
            title="Trigger Emergency SOS"
          >
            <FiAlertCircle className="w-6 h-6 animate-pulse" />
          </button>
        </div>

        {/* Evidence Locker / Guides */}
        <Link
          to={user ? "/dashboard/evidence" : "/safety-tips"}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all duration-200 active:scale-90 ${
            isActive('/dashboard/evidence') || isActive('/safety-tips') ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <FiCamera className="w-5 h-5 mb-0.5" />
          <span>{user ? t('nav.evidenceVault') : t('nav.safetyTips')}</span>
          {(isActive('/dashboard/evidence') || isActive('/safety-tips')) && <span className="w-1 h-1 rounded-full bg-rose-600 dark:bg-rose-400 mt-0.5"></span>}
        </Link>

        {/* Profile / Account */}
        <Link
          to={user ? "/dashboard" : "/login"}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all duration-200 active:scale-90 ${
            isActive('/dashboard') || isActive('/login') ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <FiUser className="w-5 h-5 mb-0.5" />
          <span>{user ? t('nav.profile') : t('nav.signIn')}</span>
          {(isActive('/dashboard') || isActive('/login')) && <span className="w-1 h-1 rounded-full bg-rose-600 dark:bg-rose-400 mt-0.5"></span>}
        </Link>

      </div>
    </div>
  );
};

export default MobileBottomBar;
