import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShield, FiBell, FiUser, FiMenu, FiX, FiLogOut, FiLayout, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import ThemeToggle from './ThemeToggle';
import { useSOS } from '../../context/SOSContext';

const Navbar = () => {
  const { user, logoutUser, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const { openSOSModal } = useSOS();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Safety Tips', path: '/safety-tips' },
    { name: 'Emergency Help', path: '/emergency-help' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-600/20 group-hover:scale-105 transition duration-200">
              <FiShield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
                SafeHaven
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold -mt-1">
                Personal Protection
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive(link.path)
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* SOS Emergency Button */}
            <button
              onClick={openSOSModal}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm shadow-rose-600/30 transition"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <FiAlertCircle className="w-4 h-4 text-white" />
              <span>SOS Dispatch</span>
            </button>

            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {/* Notifications Button */}
            {user && (
              <Link
                to="/dashboard/notifications"
                className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200/60 dark:border-slate-700/60"
              >
                <FiBell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Dropdown / Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 pr-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition border border-slate-200/60 dark:border-slate-700/60"
                >
                  <img
                    src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                    {user.fullName}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 human-card p-2 shadow-xl z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 uppercase">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                    >
                      <FiLayout /> Dashboard
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                      >
                        <FiShield /> Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logoutUser();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-rose-600 hover:bg-rose-500/10 transition"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-rose-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-xs !py-2"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0b0f19] border-t border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-3 shadow-2xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-rose-500/10 text-rose-600 font-bold'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openSOSModal();
              }}
              className="w-full py-3 rounded-xl bg-rose-600 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-sm"
            >
              <FiAlertCircle /> Trigger SOS Dispatch
            </button>

            {user ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold text-sm text-slate-800 dark:text-slate-200"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutUser();
                  }}
                  className="w-full text-center py-2.5 rounded-xl bg-rose-500/10 text-rose-600 font-semibold text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold text-sm text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
