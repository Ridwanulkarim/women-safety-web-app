import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertOctagon, FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-pink-500/20 text-pink-500 rounded-full flex items-center justify-center text-4xl">
          <FiAlertOctagon />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold font-heading text-pink-600">404</h1>
          <h2 className="text-xl font-bold font-heading">Page Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The requested page does not exist or has been moved.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-600/30 transition hover:scale-105"
        >
          <FiHome /> Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
