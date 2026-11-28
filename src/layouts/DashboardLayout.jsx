import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiLayout,
  FiUser,
  FiSettings,
  FiPhoneCall,
  FiClock,
  FiMapPin,
  FiBell,
  FiShield,
  FiLogOut,
  FiMenu,
  FiX,
  FiAlertCircle,
  FiCamera,
  FiMic
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useSOS } from '../context/SOSContext';
import ThemeToggle from '../components/common/ThemeToggle';
import LanguageToggle from '../components/common/LanguageToggle';
import BrandMark from '../components/common/BrandMark';
import SOSModal from '../components/sos/SOSModal';
import VoiceSOSAlarmModal from '../components/safety/VoiceSOSAlarmModal';
import { useVoiceSOS } from '../context/VoiceSOSContext';
import { useLanguage } from '../context/LanguageContext';
import { localizeNum } from '../utils/helpers';
import ScrollToTop from '../components/common/ScrollToTop';

const DashboardLayout = () => {
  const { user, logoutUser, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const { openSOSModal } = useSOS();
  const { isGuardianActive } = useVoiceSOS();
  const { language, t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isBn = language === 'bn';

  const baseMenuItems = [
    { name: isBn ? 'ড্যাশবোর্ড' : 'Dashboard', path: '/dashboard', icon: FiLayout },
    { name: isBn ? 'প্রমাণ সংরক্ষণাগার' : 'Evidence vault', path: '/dashboard/evidence', icon: FiCamera },
    { name: isBn ? 'প্রোফাইল' : 'Profile', path: '/dashboard/profile', icon: FiUser },
    { name: isBn ? 'জরুরি পরিচিতি' : 'Emergency contacts', path: '/dashboard/contacts', icon: FiPhoneCall },
    { name: isBn ? 'এসওএস ইতিহাস' : 'SOS history', path: '/dashboard/sos-history', icon: FiClock },
    { name: isBn ? 'লাইভ লোকেশন' : 'Live location', path: '/dashboard/live-location', icon: FiMapPin },
    { name: isBn ? 'নোটিফিকেশন' : 'Notifications', path: '/dashboard/notifications', icon: FiBell, badge: unreadCount },
    { name: isBn ? 'সেটিংস' : 'Settings', path: '/dashboard/settings', icon: FiSettings }
  ];

  const menuItems = isAdmin
    ? [
        baseMenuItems[0],
        { name: isBn ? 'অ্যাডমিন কনসোল' : 'Admin console', path: '/admin', icon: FiShield },
        ...baseMenuItems.slice(1)
      ]
    : baseMenuItems;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#141415] text-[#171717] dark:text-[#ededed]">
      <ScrollToTop />

      {/* Sidebar Desktop (256px Graphite Deep Surface) */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#ffffff] dark:bg-[#0f0f10] border-r border-zinc-900/[0.08] dark:border-white/[0.08] p-4 sticky top-0 h-screen z-30">
        <Link to="/" className="mb-5 px-1">
          <BrandMark
            name={t('nav.brandName')}
            subtitle={isBn ? 'সুরক্ষা সক্রিয়' : 'Protection console'}
          />
        </Link>

        {/* Primary SOS Dispatch Button */}
        <button
          onClick={openSOSModal}
          className="w-full btn-danger mb-5 text-sm"
        >
          <FiAlertCircle className="w-4 h-4 dispatch-icon" /> {t('nav.sosDispatch')}
        </button>

        <div className="px-2 mb-2 mt-1">
          <span className="text-xs font-medium text-[#737373] dark:text-[#85858b]">
            {isBn ? 'নেভিগেশন' : 'Workspace'}
          </span>
        </div>

        {/* Navigation List (Uniform 36px height, 4px vertical gap, 18px aligned icon column) */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`h-9 flex items-center justify-between px-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                  active
                    ? 'bg-[#fff1f2] dark:bg-[#232325] text-[#be123c] dark:text-[#ededed] border border-[#e11d48]/20 dark:border-white/[0.1]'
                    : 'text-[#525252] dark:text-[#a1a1a6] hover:text-[#171717] dark:hover:text-[#ededed] hover:bg-[#f4f4f5]/60 dark:hover:bg-[#19191b]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-4 flex items-center justify-center shrink-0">
                    <Icon
                      className={`w-4 h-4 dispatch-icon ${
                        active
                          ? 'text-[#e11d48]'
                          : 'text-[#737373] dark:text-[#85858b]'
                      }`}
                    />
                  </span>
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge > 0 && (
                  <span className="text-xs font-mono tabular-nums text-[#737373] dark:text-[#85858b]">
                    {localizeNum(item.badge, isBn)}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="pt-4 mt-4 border-t border-zinc-900/[0.08] dark:border-white/[0.08] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {user?.profilePictureUrl || user?.profileImage ? (
              <img
                src={user.profilePictureUrl || user.profileImage}
                alt={user?.fullName}
                className="w-8 h-8 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#232325] dark:bg-[#232325] text-[#ededed] font-medium flex items-center justify-center text-xs shrink-0 border border-white/10">
                {(user?.fullName || user?.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#171717] dark:text-[#ededed] truncate">{user?.fullName}</p>
              <p className="text-[11px] text-[#737373] dark:text-[#85858b] truncate font-mono">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logoutUser();
              navigate('/login');
            }}
            className="h-8 w-8 rounded-lg text-[#737373] dark:text-[#85858b] hover:text-[#dc2626] dark:hover:text-[#e5484d] hover:bg-[#f4f4f5] dark:hover:bg-[#19191b] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            title={t('nav.logout')}
          >
            <FiLogOut className="w-4 h-4 dispatch-icon" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#ffffff] dark:bg-[#141415] border-b border-zinc-900/[0.08] dark:border-white/[0.08] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-9 w-9 rounded-lg lg:hidden bg-[#f4f4f5] dark:bg-[#232325] text-[#171717] dark:text-[#ededed] border border-zinc-900/10 dark:border-white/10 flex items-center justify-center"
            >
              {sidebarOpen ? <FiX className="w-4 h-4 dispatch-icon" /> : <FiMenu className="w-4 h-4 dispatch-icon" />}
            </button>
            <h1 className="text-sm font-medium text-[#171717] dark:text-[#ededed] truncate">
              {isBn ? 'ব্যক্তিগত নিরাপত্তা পোর্টাল' : 'Safety portal'}
            </h1>
            {isGuardianActive && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[#16a34a] dark:text-[#4cc38a] text-xs font-medium">
                <FiMic className="w-3.5 h-3.5 dispatch-icon" />
                <span>{isBn ? 'ভয়েস গার্ডিয়ান সক্রিয়' : 'Voice guardian listening'}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                className="btn-outline h-9 px-3 text-xs hidden sm:inline-flex"
              >
                <FiShield className="w-4 h-4 text-[#e11d48] dispatch-icon" />
                <span>{t('nav.adminPanel')}</span>
              </Link>
            )}

            <LanguageToggle />
            <ThemeToggle />

            <Link
              to="/dashboard/notifications"
              className="relative h-9 w-9 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#525252] dark:text-[#a1a1a6] hover:text-[#171717] dark:hover:text-[#ededed] border border-zinc-900/10 dark:border-white/10 flex items-center justify-center transition-colors"
              title={t('nav.notifications')}
            >
              <FiBell className="w-4 h-4 dispatch-icon" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#dc2626] text-white text-[10px] font-mono tabular-nums rounded-full flex items-center justify-center">
                  {localizeNum(unreadCount, isBn)}
                </span>
              )}
            </Link>

            <button
              onClick={() => {
                logoutUser();
                navigate('/login');
              }}
              className="btn-ghost h-9 px-2.5 text-xs text-[#dc2626] dark:text-[#e5484d] hidden sm:inline-flex"
              title={t('nav.logout')}
            >
              <FiLogOut className="w-4 h-4 dispatch-icon" />
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {sidebarOpen && (
          <div className="lg:hidden bg-[#ffffff] dark:bg-[#0f0f10] border-b border-zinc-900/[0.08] dark:border-white/[0.08] p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(item.path)
                    ? 'bg-[#f4f4f5] dark:bg-[#232325] text-[#171717] dark:text-[#ededed]'
                    : 'text-[#525252] dark:text-[#a1a1a6]'
                }`}
              >
                <span>{item.name}</span>
                {item.badge > 0 && (
                  <span className="text-xs font-mono tabular-nums">{localizeNum(item.badge, isBn)}</span>
                )}
              </Link>
            ))}

            <button
              onClick={() => {
                setSidebarOpen(false);
                logoutUser();
                navigate('/login');
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#dc2626] dark:text-[#e5484d] hover:bg-[#f4f4f5] dark:hover:bg-[#19191b] mt-2 cursor-pointer"
            >
              <FiLogOut className="w-4 h-4 dispatch-icon" /> {t('nav.logout')}
            </button>
          </div>
        )}

        {/* Fluid Main Viewport (capped at 1440px, 24-32px padding) */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 w-full max-w-[1440px] mx-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <SOSModal />
      <VoiceSOSAlarmModal />
    </div>
  );
};

export default DashboardLayout;
