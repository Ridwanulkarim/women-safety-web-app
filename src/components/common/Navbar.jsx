import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiShield,
  FiBell,
  FiUser,
  FiLogOut,
  FiLayout,
  FiCamera,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import BrandMark from './BrandMark';
import { useLanguage } from '../../context/LanguageContext';
import { localizeNum } from '../../utils/helpers';

const Navbar = () => {
  const { user, logoutUser, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const { t, language } = useLanguage();
  const isBn = language === 'bn';
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 bg-[#ffffff] dark:bg-[#141415] border-b border-zinc-900/[0.08] dark:border-white/[0.08]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Brand & Desktop Links */}
          <div className="flex items-center gap-6">
            <Link to="/" className="shrink-0">
              <BrandMark name={t('nav.brandName')} />
            </Link>

            <nav className="hidden lg:flex items-center gap-1 pl-6 border-l border-zinc-900/[0.08] dark:border-white/[0.08]">
              {publicNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                    isActive(link.path)
                      ? 'bg-[#171717] text-white dark:bg-[#232325] dark:text-[#ededed]'
                      : 'text-[#525252] dark:text-[#a1a1a6] hover:text-[#171717] dark:hover:text-[#ededed] hover:bg-[#f4f4f5]/70 dark:hover:bg-[#232325]/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />

            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="btn-outline h-9 px-3 text-xs hidden sm:inline-flex"
                    title={isBn ? 'অ্যাডমিন কনসোল' : 'Admin console'}
                  >
                    <FiShield className="w-4 h-4 text-[#e11d48] dispatch-icon" />
                    <span>{t('nav.adminPanel')}</span>
                  </Link>
                )}

                <Link
                  to="/dashboard/notifications"
                  className="relative h-9 w-9 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#525252] dark:text-[#a1a1a6] hover:text-[#171717] dark:hover:text-[#ededed] border border-zinc-900/10 dark:border-white/10 flex items-center justify-center transition-colors duration-150"
                  title={t('nav.notifications')}
                >
                  <FiBell className="w-4 h-4 dispatch-icon" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#dc2626] text-white text-[10px] font-mono tabular-nums rounded-full flex items-center justify-center">
                      {localizeNum(unreadCount, isBn)}
                    </span>
                  )}
                </Link>

                <div className="hidden lg:block relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="h-9 flex items-center gap-2 pl-1.5 pr-3 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] border border-zinc-900/10 dark:border-white/10 hover:border-zinc-900/20 dark:hover:border-white/20 transition-colors duration-150 cursor-pointer"
                  >
                    {user.profilePictureUrl || user.profileImage ? (
                      <img
                        src={user.profilePictureUrl || user.profileImage}
                        alt={user.fullName}
                        className="w-6 h-6 rounded object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded bg-[#e11d48] text-white font-medium flex items-center justify-center text-xs">
                        {(user.fullName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-medium text-[#171717] dark:text-[#ededed] max-w-[96px] truncate">
                      {user.fullName}
                    </span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 surface-panel p-1.5 z-50 space-y-0.5 shadow-lg">
                      <div className="px-3 py-2 border-b border-zinc-900/[0.08] dark:border-white/[0.08] mb-1">
                        <p className="text-xs font-medium text-[#171717] dark:text-[#ededed] truncate">{user.fullName}</p>
                        <p className="text-[11px] text-[#737373] dark:text-[#85858b] truncate font-mono">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 text-[11px] font-medium text-[#e11d48]">
                            {isBn ? 'অ্যাডমিনিস্ট্রেটর' : 'Administrator'}
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md hover:bg-[#f4f4f5] dark:hover:bg-[#232325] text-[#171717] dark:text-[#ededed] transition-colors"
                        >
                          <FiShield className="w-4 h-4 text-[#e11d48] dispatch-icon" /> {t('nav.adminPanel')}
                        </Link>
                      )}

                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md hover:bg-[#f4f4f5] dark:hover:bg-[#232325] text-[#525252] dark:text-[#a1a1a6] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors"
                      >
                        <FiLayout className="w-4 h-4 dispatch-icon" /> {t('nav.dashboard')}
                      </Link>

                      <Link
                        to="/dashboard/evidence"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md hover:bg-[#f4f4f5] dark:hover:bg-[#232325] text-[#525252] dark:text-[#a1a1a6] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors"
                      >
                        <FiCamera className="w-4 h-4 dispatch-icon" /> {t('nav.evidenceVault')}
                      </Link>

                      <Link
                        to="/dashboard/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md hover:bg-[#f4f4f5] dark:hover:bg-[#232325] text-[#525252] dark:text-[#a1a1a6] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors"
                      >
                        <FiUser className="w-4 h-4 dispatch-icon" /> {t('nav.profile')}
                      </Link>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logoutUser();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md text-[#dc2626] dark:text-[#e5484d] hover:bg-[#f4f4f5] dark:hover:bg-[#232325] transition-colors cursor-pointer"
                      >
                        <FiLogOut className="w-4 h-4 dispatch-icon" /> {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                {location.pathname !== '/login' && (
                  <Link
                    to="/login"
                    className="btn-ghost text-[13px]"
                  >
                    {t('nav.signIn')}
                  </Link>
                )}
                {location.pathname !== '/register' && (
                  <Link
                    to="/register"
                    className="btn-danger h-9 px-3.5 text-xs"
                  >
                    {t('nav.getStarted')}
                  </Link>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden h-9 w-9 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#171717] dark:text-[#ededed] border border-zinc-900/10 dark:border-white/10 flex items-center justify-center"
            >
              {mobileMenuOpen ? <FiX className="w-4 h-4 dispatch-icon" /> : <FiMenu className="w-4 h-4 dispatch-icon" />}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-900/[0.08] dark:border-white/[0.08] bg-[#ffffff] dark:bg-[#141415] px-4 py-3 space-y-1">
          {publicNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-[#171717] text-white dark:bg-[#232325] dark:text-[#ededed]'
                    : 'text-[#525252] dark:text-[#a1a1a6]'
                }`}
              >
                {link.name}
              </Link>
          ))}
          {!user && (
            <div className="pt-2 mt-2 border-t border-zinc-900/[0.08] dark:border-white/[0.08] flex items-center gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-outline flex-1 h-9 text-xs">
                {t('nav.signIn')}
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-danger flex-1 h-9 text-xs">
                {t('nav.getStarted')}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
