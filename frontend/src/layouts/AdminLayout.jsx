import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiShield, FiUsers, FiPieChart, FiAlertTriangle, FiRadio,
  FiFileText, FiSettings, FiLogOut, FiMenu, FiX, FiArrowLeft
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';
import ScrollToTop from '../components/common/ScrollToTop';

const AdminLayout = () => {
  const { user, logoutUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const adminMenu = [
    { name: 'Admin Overview', path: '/admin', icon: FiPieChart },
    { name: 'User Management', path: '/admin/users', icon: FiUsers },
    { name: 'Analytics', path: '/admin/analytics', icon: FiPieChart },
    { name: 'Emergency Alerts', path: '/admin/alerts', icon: FiAlertTriangle },
    { name: 'Announcements', path: '/admin/announcements', icon: FiRadio },
    { name: 'SOS Reports', path: '/admin/sos-reports', icon: FiFileText },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <ScrollToTop />

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-5 sticky top-0 h-screen z-30">
        <div className="flex items-center justify-between mb-8">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-600/30">
              <FiShield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black font-heading bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                SafeHaven
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-purple-400 font-bold">
                Admin Command
              </span>
            </div>
          </Link>
        </div>

        <Link
          to="/dashboard"
          className="mb-4 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2 transition"
        >
          <FiArrowLeft /> Return to User Portal
        </Link>

        {/* Admin Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {adminMenu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                  active
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-purple-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-left">
            <p className="text-xs font-bold text-slate-200">{user?.fullName || 'Admin User'}</p>
            <p className="text-[10px] text-purple-400 uppercase font-bold">Administrator</p>
          </div>
          <button
            onClick={() => {
              logoutUser();
              navigate('/login');
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 transition"
          >
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl lg:hidden bg-slate-800 text-slate-200"
            >
              {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
            <h1 className="text-base font-bold font-heading text-purple-400">Admin Control Center</h1>
          </div>

          <ThemeToggle />
        </header>

        {sidebarOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-1">
            {adminMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive(item.path) ? 'bg-purple-600 text-white' : 'text-slate-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}

        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
