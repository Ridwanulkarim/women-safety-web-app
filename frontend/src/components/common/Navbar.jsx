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
    <header className="sticky top-0 z-50 glass-panel border-b border-pink-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/25 group-hover:scale-105 transition duration-300">
              <FiShield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight font-heading bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                SafeHaven
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold -mt-1">
                Women Safety Shield
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Quick SOS Panic Button */}
            <button
              onClick={openSOSModal}
              className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-pink-600/30 animate-pulse transition hover:scale-105"
            >
              <FiAlertCircle className="w-4 h-4 text-white" />
              <span>SOS Alert</span>
            </button>

            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {/* Notifications Button */}
            {user && (
              <Link
                to="/dashboard/notifications"
                className="relative p-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-pink-600 transition"
              >
                <FiBell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
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
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-200/60 dark:bg-slate-800/80 hover:bg-slate-300/60 transition"
                >
                  <img
                    src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-pink-500/50"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                    {user.fullName}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 glass-card rounded-2xl p-2 shadow-2xl z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-slate-200/50 dark:border-slate-800/50">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 uppercase">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl hover:bg-pink-500/10 hover:text-pink-600 transition"
                    >
                      <FiLayout /> Dashboard
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl hover:bg-purple-500/10 hover:text-purple-600 transition"
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
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl text-red-500 hover:bg-red-500/10 transition"
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
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-pink-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-pink-500/20 transition hover:scale-105"
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
              className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-slate-200/40 dark:border-slate-800/40 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-pink-500/10 text-pink-600 font-semibold'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openSOSModal();
              }}
              className="w-full py-3 rounded-xl bg-pink-600 text-white font-bold text-sm uppercase flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30"
            >
              <FiAlertCircle /> Trigger SOS
            </button>

            {user ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 font-semibold text-sm"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutUser();
                  }}
                  className="w-full text-center py-2.5 rounded-xl bg-red-500/10 text-red-500 font-semibold text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 font-semibold text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-pink-600 text-white font-semibold text-sm"
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
