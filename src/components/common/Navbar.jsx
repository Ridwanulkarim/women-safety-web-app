import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShield, FiBell, FiUser, FiLogOut, FiLayout, FiAlertCircle, FiPhone, FiClock, FiMapPin, FiSettings, FiCamera } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useSOS } from '../../context/SOSContext';
import { useLanguage } from '../../context/LanguageContext';

const Navbar = () => {
  const { user, logoutUser, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const { openSOSModal } = useSOS();
  const { t } = useLanguage();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const publicNavLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.features'), path: '/features' },
    { name: t('nav.safetyTips'), path: '/safety-tips' },
    { name: t('nav.emergencyHelp'), path: '/emergency-help' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.blog'), path: '/blog' },
    { name: t('nav.contact'), path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-sm border-b border-zinc-200/90 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo & Desktop Nav Links */}
          <div className="flex items-center gap-3 lg:gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold transition">
                <FiShield className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold tracking-tight text-zinc-900 dark:text-white font-heading">
                  {t('nav.brandName')}
                </span>
                <span className="hidden sm:inline-flex mono-tag mono-tag-emerald py-0 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 telemetry-dot"></span> {t('nav.onlineStatus')}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-zinc-200 dark:border-zinc-800">
              {publicNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Header Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Always Visible Language & Theme Buttons */}
            <LanguageToggle />
            <ThemeToggle />

            {user ? (
              /* LOGGED IN CONTROLS */
              <>
                {/* Notifications Bell Button - Always Visible */}
                <Link
                  to="/dashboard/notifications"
                  className="relative p-1.5 sm:p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition border border-zinc-200 dark:border-zinc-700 min-h-[36px] sm:min-h-[40px] flex items-center justify-center"
                  title="Notifications"
                >
                  <FiBell className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown Badge - Desktop Only */}
                <div className="hidden lg:block relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1.5 p-1 pr-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition border border-zinc-200 dark:border-zinc-700 min-h-[40px]"
                  >
                    {user.profilePictureUrl || user.profileImage ? (
                      <img
                        src={user.profilePictureUrl || user.profileImage}
                        alt={user.fullName}
                        className="w-6 h-6 rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-md bg-rose-600 text-white font-bold flex items-center justify-center text-[10px]">
                        {(user.fullName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 max-w-[80px] truncate">
                      {user.fullName}
                    </span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 product-card p-1.5 shadow-xl z-50 space-y-0.5">
                      <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800">
                        <p className="text-xs font-bold text-zinc-900 dark:text-white">{user.fullName}</p>
                        <p className="text-[11px] text-zinc-500 truncate font-mono">{user.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                      >
                        <FiLayout /> {t('nav.dashboard')}
                      </Link>

                      <Link
                        to="/dashboard/evidence"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                      >
                        <FiCamera /> {t('nav.evidenceVault')}
                      </Link>

                      <Link
                        to="/dashboard/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                      >
                        <FiUser /> {t('nav.profile')}
                      </Link>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logoutUser();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md text-rose-600 hover:bg-rose-500/10 transition"
                      >
                        <FiLogOut /> {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* PUBLIC VISITOR SIGN-IN / REGISTER BUTTONS */
              <div className="flex items-center gap-1">
                <Link
                  to="/login"
                  className="px-2 py-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition"
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/register"
                  className="btn-danger text-xs !py-1 !px-2.5 font-mono"
                >
                  {t('nav.getStarted')}
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
