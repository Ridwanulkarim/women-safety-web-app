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
    <div className="min-h-screen flex bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <ScrollToTop />

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#121215] border-r border-zinc-200 dark:border-zinc-800 p-5 sticky top-0 h-screen z-30">
        <Link to="/" className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold">
            <FiShield className="w-4 h-4" />
          </div>
          <span className="text-base font-bold font-heading text-zinc-900 dark:text-white">
            SafeHaven
          </span>
        </Link>

        {/* SOS Quick Button */}
        <button
          onClick={openSOSModal}
          className="w-full btn-danger mb-6 font-mono text-xs"
        >
          <FiAlertCircle className="w-4 h-4" /> SOS DISPATCH
        </button>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                  active
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-mono font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={user?.fullName}
              className="w-8 h-8 rounded-lg object-cover"
            />
            <div className="text-left max-w-[100px] truncate">
              <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{user?.fullName}</p>
              <p className="text-[10px] text-zinc-500 truncate font-mono">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logoutUser();
              navigate('/login');
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-500/10 transition"
            title="Logout"
          >
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile / Header Bar */}
        <header className="bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg lg:hidden bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
            >
              {sidebarOpen ? <FiX className="w-4 h-4" /> : <FiMenu className="w-4 h-4" />}
            </button>
            <h1 className="text-sm font-bold font-heading text-zinc-900 dark:text-white">User Control Panel</h1>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <button
              onClick={openSOSModal}
              className="btn-danger !py-1.5 !px-3 font-mono text-[11px]"
            >
              <FiAlertCircle /> SOS DISPATCH
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {sidebarOpen && (
          <div className="lg:hidden bg-white dark:bg-[#09090b] border-b border-zinc-200 dark:border-zinc-800 p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-medium ${
                  isActive(item.path)
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold'
                    : 'text-zinc-700 dark:text-zinc-300'
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
