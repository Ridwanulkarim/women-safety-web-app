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
    <div className="min-h-screen flex bg-[#08080c] text-zinc-100 font-sans">
      <ScrollToTop />

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0d0d12]/95 backdrop-blur-xl border-r border-zinc-800/80 p-5 sticky top-0 h-screen z-30 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center text-white font-bold shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform duration-200">
              <FiShield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold font-heading text-white tracking-tight block">
                SafeHaven
              </span>
              <span className="text-[10px] font-mono font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 telemetry-dot"></span> Admin Command
              </span>
            </div>
          </Link>
        </div>

        <Link
          to="/dashboard"
          className="mb-4 px-3.5 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800/80 text-xs font-semibold text-zinc-300 flex items-center gap-2 transition"
        >
          <FiArrowLeft className="text-rose-500" /> Return to User Portal
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-600/25 font-bold'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-zinc-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
          <div className="text-left">
            <p className="text-xs font-bold text-zinc-200 truncate max-w-[130px]">{user?.fullName || 'Admin User'}</p>
            <p className="text-[10px] text-rose-500 uppercase font-mono font-bold">Administrator</p>
          </div>
          <button
            onClick={() => {
              logoutUser();
              navigate('/login');
            }}
            className="p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
            title="Logout"
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
