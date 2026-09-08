import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SOSModal from '../components/sos/SOSModal';
import ScrollToTop from '../components/common/ScrollToTop';
import MobileBottomBar from '../components/common/MobileBottomBar';

const PublicLayout = () => {
  const location = useLocation();
  const authPaths = ['/login', '/register', '/signin', '/signup', '/forgot-password', '/admin/login'];
  const isAuthPage = authPaths.includes(location.pathname);

  if (isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 selection:bg-rose-500/20 selection:text-rose-500 transition-colors duration-200 p-4 sm:p-6 relative overflow-hidden">
        {/* Subtle ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <ScrollToTop />
        <main className="w-full flex items-center justify-center relative z-10">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 selection:bg-rose-500/20 selection:text-rose-500 transition-colors duration-200 pb-16 lg:pb-0">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <SOSModal />
      <MobileBottomBar />
    </div>
  );
};

export default PublicLayout;
