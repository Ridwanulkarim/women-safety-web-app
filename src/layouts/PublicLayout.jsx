import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SOSModal from '../components/sos/SOSModal';
import ScrollToTop from '../components/common/ScrollToTop';

const PublicLayout = () => {
  const location = useLocation();
  const authPaths = ['/login', '/register', '/signin', '/signup', '/forgot-password', '/admin/login'];
  const isAuthPage = authPaths.includes(location.pathname);

  if (isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8fafc] dark:bg-[#141415] text-[#171717] dark:text-[#ededed] p-4 sm:p-6">
        <ScrollToTop />
        <main className="w-full flex items-center justify-center">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] dark:bg-[#141415] text-[#171717] dark:text-[#ededed]">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <SOSModal />
    </div>
  );
};

export default PublicLayout;
