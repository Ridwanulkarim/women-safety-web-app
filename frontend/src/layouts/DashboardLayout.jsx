import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiLayout, FiUser, FiSettings, FiPhoneCall, FiClock,
  FiMapPin, FiBell, FiShield, FiLogOut, FiMenu, FiX, FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useSOS } from '../context/SOSContext';
import ThemeToggle from '../components/common/ThemeToggle';
import SOSModal from '../components/sos/SOSModal';
import ScrollToTop from '../components/common/ScrollToTop';

const DashboardLayout = () => {
  const { user, logoutUser } = useAuth();
  const { unreadCount } = useNotifications();
  const { openSOSModal } = useSOS();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiLayout },
    { name: 'Profile', path: '/dashboard/profile', icon: FiUser },
    { name: 'Emergency Contacts', path: '/dashboard/contacts', icon: FiPhoneCall },
    { name: 'SOS History', path: '/dashboard/sos-history', icon: FiClock },
    { name: 'Live Location', path: '/dashboard/live-location', icon: FiMapPin },
    { name: 'Notifications', path: '/dashboard/notifications', icon: FiBell, badge: unreadCount },
    { name: 'Settings', path: '/dashboard/settings', icon: FiSettings }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <ScrollToTop />

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-slate-200/50 dark:border-slate-800/50 p-5 sticky top-0 h-screen z-30">
        <Link to="/" className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
            <FiShield className="w-5 h-5" />
          </div>
          <span className="text-xl font-black font-heading bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            SafeHaven
          </span>
        </Link>

        {/* SOS Quick Button */}
        <button
          onClick={openSOSModal}
          className="w-full py-3 mb-6 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 animate-pulse transition"
        >
          <FiAlertCircle className="w-4 h-4" /> Trigger SOS
        </button>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                  active
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-pink-600 dark:hover:text-pink-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-extrabold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={user?.fullName}
              className="w-8 h-8 rounded-xl object-cover"
            />
            <div className="text-left max-w-[100px] truncate">
              <p className="text-xs font-bold truncate">{user?.fullName}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logoutUser();
              navigate('/login');
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 transition"
            title="Logout"
          >
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile / Header Bar */}
        <header className="glass-panel border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl lg:hidden bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
            <h1 className="text-base font-bold font-heading">User Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={openSOSModal}
              className="px-3 py-1.5 rounded-xl bg-pink-600 text-white font-bold text-[11px] uppercase flex items-center gap-1.5 shadow-md shadow-pink-600/30"
            >
              <FiAlertCircle /> SOS
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {sidebarOpen && (
          <div className="lg:hidden glass-panel border-b border-slate-200/50 dark:border-slate-800/50 p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive(item.path)
                    ? 'bg-pink-600 text-white'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <SOSModal />
    </div>
  );
};

export default DashboardLayout;
