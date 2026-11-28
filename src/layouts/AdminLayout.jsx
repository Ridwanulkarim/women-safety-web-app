import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiShield,
  FiUsers,
  FiPieChart,
  FiAlertTriangle,
  FiRadio,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiArrowLeft
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';
import BrandMark from '../components/common/BrandMark';
import ScrollToTop from '../components/common/ScrollToTop';

const AdminLayout = () => {
  const { user, logoutUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const adminMenu = [
    { name: 'Overview', path: '/admin', icon: FiShield },
    { name: 'Emergency alerts', path: '/admin/alerts', icon: FiAlertTriangle },
    { name: 'SOS reports', path: '/admin/sos-reports', icon: FiFileText },
    { name: 'Analytics', path: '/admin/analytics', icon: FiPieChart },
    { name: 'User directory', path: '/admin/users', icon: FiUsers },
    { name: 'Announcements', path: '/admin/announcements', icon: FiRadio },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#141415] text-[#171717] dark:text-[#ededed]">
      <ScrollToTop />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#ffffff] dark:bg-[#0f0f10] border-r border-zinc-900/[0.08] dark:border-white/[0.08] p-4 sticky top-0 h-screen z-30">
        <Link to="/admin" className="mb-5 px-1">
          <BrandMark name="SafeHaven" subtitle="Dispatch command" />
        </Link>

        <Link
          to="/dashboard"
          className="btn-outline mb-5 h-9 text-xs justify-start px-3"
        >
          <FiArrowLeft className="w-4 h-4 text-[#737373] dark:text-[#85858b] dispatch-icon" />
          <span>Return to user portal</span>
        </Link>

        <div className="px-2 mb-2">
          <span className="text-xs font-medium text-[#737373] dark:text-[#85858b]">
            Operations
          </span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {adminMenu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`h-9 flex items-center gap-2.5 px-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                  active
                    ? 'bg-[#fff1f2] dark:bg-[#232325] text-[#be123c] dark:text-[#ededed] border border-[#e11d48]/20 dark:border-white/[0.1]'
                    : 'text-[#525252] dark:text-[#a1a1a6] hover:text-[#171717] dark:hover:text-[#ededed] hover:bg-[#f4f4f5]/60 dark:hover:bg-[#19191b]'
                }`}
              >
                <span className="w-4 flex items-center justify-center shrink-0">
                  <Icon
                    className={`w-4 h-4 dispatch-icon ${
                      active ? 'text-[#e11d48]' : 'text-[#737373] dark:text-[#85858b]'
                    }`}
                  />
                </span>
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 mt-4 border-t border-zinc-900/[0.08] dark:border-white/[0.08] flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#171717] dark:text-[#ededed] truncate">
              {user?.fullName || 'Admin User'}
            </p>
            <p className="text-[11px] text-[#737373] dark:text-[#85858b]">Administrator</p>
          </div>
          <button
            onClick={() => {
              logoutUser();
              navigate('/login');
            }}
            className="h-8 w-8 rounded-lg text-[#737373] dark:text-[#85858b] hover:text-[#dc2626] dark:hover:text-[#e5484d] hover:bg-[#f4f4f5] dark:hover:bg-[#19191b] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Log out"
          >
            <FiLogOut className="w-4 h-4 dispatch-icon" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#ffffff] dark:bg-[#141415] border-b border-zinc-900/[0.08] dark:border-white/[0.08] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-9 w-9 rounded-lg lg:hidden bg-[#f4f4f5] dark:bg-[#232325] text-[#171717] dark:text-[#ededed] border border-zinc-900/10 dark:border-white/10 flex items-center justify-center"
            >
              {sidebarOpen ? <FiX className="w-4 h-4 dispatch-icon" /> : <FiMenu className="w-4 h-4 dispatch-icon" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#e11d48]"></span>
              <h1 className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
                Dispatch command center
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="btn-outline h-9 px-3 text-xs">
              <FiArrowLeft className="w-4 h-4 text-[#737373] dark:text-[#85858b] dispatch-icon" />
              <span className="hidden sm:inline">User portal</span>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        {sidebarOpen && (
          <div className="lg:hidden bg-[#ffffff] dark:bg-[#0f0f10] border-b border-zinc-900/[0.08] dark:border-white/[0.08] p-4 space-y-1">
            {adminMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(item.path)
                    ? 'bg-[#f4f4f5] dark:bg-[#232325] text-[#171717] dark:text-[#ededed]'
                    : 'text-[#525252] dark:text-[#a1a1a6]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}

        <main className="p-4 sm:p-6 lg:p-8 flex-1 w-full max-w-[1440px] mx-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
