import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShield, FiBell, FiUser, FiMenu, FiX, FiLogOut, FiLayout, FiAlertCircle, FiPhone, FiClock, FiMapPin, FiSettings } from 'react-icons/fi';
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
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-sm border-b border-zinc-200/90 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link to={user ? "/" : "/login"} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold transition">
                <FiShield className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white font-heading">
                  SafeHaven
                </span>
                {user && (
                  <span className="hidden md:inline-flex mono-tag mono-tag-emerald py-0 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 telemetry-dot"></span> Online
                  </span>
                )}
              </div>
            </Link>

            {/* Nav Links AFTER LOGIN ONLY */}
            {user && (
              <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-zinc-200 dark:border-zinc-800">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      isActive(link.path)
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* Right Controls */}
          {user ? (
            /* AFTER LOGIN NAVBAR CONTROLS */
            <div className="hidden sm:flex items-center gap-2.5">
              
              {/* SOS Dispatch Button */}
              <button
                onClick={openSOSModal}
                className="btn-danger !py-1.5 !px-3 font-mono text-[11px]"
              >
                <FiAlertCircle className="w-3.5 h-3.5" />
                <span>SOS DISPATCH</span>
              </button>

              {/* Dark Mode Toggle */}
              <ThemeToggle />

              {/* Notifications Button */}
              <Link
                to="/dashboard/notifications"
                className="relative p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition border border-zinc-200 dark:border-zinc-700"
              >
                <FiBell className="w-3.5 h-3.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition border border-zinc-200 dark:border-zinc-700"
                >
                  <img
                    src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={user.fullName}
                    className="w-6 h-6 rounded-md object-cover"
                  />
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
                      <FiLayout /> Dashboard
                    </Link>

                    <Link
                      to="/dashboard/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                    >
                      <FiUser /> Profile
                    </Link>

                    <Link
                      to="/dashboard/contacts"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                    >
                      <FiPhone /> Emergency Contacts
                    </Link>

                    <Link
                      to="/dashboard/sos-history"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                    >
                      <FiClock /> SOS History
                    </Link>

                    <Link
                      to="/dashboard/live-location"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                    >
                      <FiMapPin /> Live Location
                    </Link>

                    <Link
                      to="/dashboard/notifications"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                    >
                      <FiBell /> Notifications
                    </Link>

                    <Link
                      to="/dashboard/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                    >
                      <FiSettings /> Settings
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
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
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md text-rose-600 hover:bg-rose-500/10 transition"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* BEFORE LOGIN NAVBAR: DISPLAY ONLY LOGO, SIGN IN, AND GET STARTED */
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-solid"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger (Only if logged in) */}
          {user && (
            <div className="flex items-center gap-2 sm:hidden">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
              >
                {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu AFTER LOGIN ONLY */}
      {user && mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#09090b] border-t border-zinc-200 dark:border-zinc-800 px-4 pt-2 pb-5 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-medium ${
                  isActive(link.path)
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openSOSModal();
              }}
              className="w-full btn-danger font-mono text-xs"
            >
              <FiAlertCircle /> SOS DISPATCH
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
