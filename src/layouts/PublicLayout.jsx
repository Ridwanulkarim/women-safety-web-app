import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SOSModal from '../components/sos/SOSModal';
import ScrollToTop from '../components/common/ScrollToTop';
import MobileBottomBar from '../components/common/MobileBottomBar';

const PublicLayout = () => {
  const location = useLocation();
  const hiddenPaths = ['/login', '/register', '/signin', '/signup'];
  const shouldHideBottomBar = hiddenPaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 selection:bg-rose-500/20 selection:text-rose-500 transition-colors duration-200 pb-16 lg:pb-0">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <SOSModal />
      {!shouldHideBottomBar && <MobileBottomBar />}
    </div>
  );
};

export default PublicLayout;
