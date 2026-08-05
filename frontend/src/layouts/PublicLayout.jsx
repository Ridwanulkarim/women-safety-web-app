import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SOSModal from '../components/sos/SOSModal';
import ScrollToTop from '../components/common/ScrollToTop';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-pink-500 selection:text-white transition-colors duration-300">
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
