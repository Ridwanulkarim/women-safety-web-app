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
    <header className="sticky top-0 z-50 bg-white/85 dark:bg-[#0a0a0e]/85 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo & Desktop Nav Links */}
          <div className="flex items-center gap-3 lg:gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center font-bold shadow-md shadow-rose-600/25 group-hover:scale-105 transition-all duration-200">
                <FiShield className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-zinc-900 dark:text-white font-heading">
                  {t('nav.brandName')}
                </span>
                <span className="hidden sm:inline-flex mono-tag mono-tag-emerald py-0.5 text-[10px]">
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Header Action Controls */}
          <div className="flex items-center gap-2">
            
            {/* Always Visible Language & Theme Buttons */}
            <LanguageToggle />
            <ThemeToggle />

            {user ? (
              /* LOGGED IN CONTROLS */
              <>
                {/* Admin Command Center Quick Link Button */}
                <Link
                  to="/admin"
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/25 transition active:scale-95"
                  title="Admin Command Center"
                >
                  <FiShield className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </Link>

                {/* Notifications Bell Button */}
                <Link
                  to="/dashboard/notifications"
                  className="relative p-2 rounded-xl bg-zinc-100/90 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition border border-zinc-200/80 dark:border-zinc-700/80 min-h-[38px] min-w-[38px] flex items-center justify-center shadow-xs"
                  title="Notifications"
                >
                  <FiBell className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono ring-2 ring-white dark:ring-zinc-900">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown Badge - Desktop Only */}
                <div className="hidden lg:block relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-zinc-100/90 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition border border-zinc-200/80 dark:border-zinc-700/80 min-h-[38px] shadow-xs"
                  >
                    {user.profilePictureUrl || user.profileImage ? (
                      <img
                        src={user.profilePictureUrl || user.profileImage}
                        alt={user.fullName}
                        className="w-6 h-6 rounded-lg object-cover ring-1 ring-rose-500/30"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-600 to-rose-700 text-white font-bold flex items-center justify-center text-[10px]">
                        {(user.fullName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 max-w-[85px] truncate">
                      {user.fullName}
                    </span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 glass-card-xl p-2 shadow-2xl z-50 space-y-1">
                      <div className="px-3 py-2.5 border-b border-zinc-200/80 dark:border-zinc-800/80">
                        <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{user.fullName}</p>
                        <p className="text-[11px] text-zinc-500 truncate font-mono">{user.email}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-400 font-mono text-[9px] font-bold uppercase">
                          Administrator
                        </span>
                      </div>

                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition"
                      >
                        <FiShield /> Admin Command Center
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                      >
                        <FiLayout /> {t('nav.dashboard')}
                      </Link>

                      <Link
                        to="/dashboard/evidence"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                      >
                        <FiCamera /> {t('nav.evidenceVault')}
                      </Link>

                      <Link
                        to="/dashboard/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                      >
                        <FiUser /> {t('nav.profile')}
                      </Link>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logoutUser();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-rose-600 hover:bg-rose-500/10 transition"
                      >
                        <FiLogOut /> {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* PUBLIC VISITOR SIGN-IN / REGISTER BUTTONS */
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl transition border border-purple-500/30 shadow-xs"
                >
                  <FiShield className="w-3.5 h-3.5" /> Admin Portal
                </Link>
                {location.pathname !== '/login' && (
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                  >
                    {t('nav.signIn')}
                  </Link>
                )}
                {location.pathname !== '/register' && (
                  <Link
                    to="/register"
                    className="btn-danger text-xs !py-1.5 !px-3 font-mono"
                  >
                    {t('nav.getStarted')}
                  </Link>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
