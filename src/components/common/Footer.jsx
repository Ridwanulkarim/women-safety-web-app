import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiPhoneCall, FiHeart, FiLock } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white">
                <FiShield className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black font-heading text-white tracking-tight">
                SafeHaven
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering women with instant SOS distress alerts, continuous live location tracking, direct emergency dispatch, and personal safety resources.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase font-heading">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-pink-400 transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-pink-400 transition">About SafeHaven</Link></li>
              <li><Link to="/features" className="hover:text-pink-400 transition">Features</Link></li>
              <li><Link to="/safety-tips" className="hover:text-pink-400 transition">Safety Manual</Link></li>
              <li><Link to="/blog" className="hover:text-pink-400 transition">Safety Blog</Link></li>
            </ul>
          </div>

          {/* Col 3: Emergency Hotlines */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase font-heading flex items-center gap-2">
              <FiPhoneCall className="text-pink-500" /> Emergency Hotlines
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between items-center text-slate-300">
                <span>National Emergency</span>
                <a href="tel:999" className="font-bold text-pink-400 hover:underline">999</a>
              </li>
              <li className="flex justify-between items-center text-slate-300">
                <span>Police Hotline</span>
                <a href="tel:999" className="font-bold text-blue-400 hover:underline">999</a>
              </li>
              <li className="flex justify-between items-center text-slate-300">
                <span>Women Helpline</span>
                <a href="tel:109" className="font-bold text-pink-400 hover:underline">109 / 10921</a>
              </li>
              <li className="flex justify-between items-center text-slate-300">
                <span>Fire & Ambulance</span>
                <a href="tel:16163" className="font-bold text-amber-400 hover:underline">16163 / 199</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Security */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase font-heading flex items-center gap-2">
              <FiLock className="text-pink-500" /> Privacy & Trust
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your location data is encrypted in transit and shared strictly during SOS distress broadcasts with your specified emergency contacts and law enforcement dispatch.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center gap-3">
              <FiHeart className="text-pink-500 text-xl flex-shrink-0 animate-pulse" />
              <span className="text-xs text-slate-300">Designed with maximum priority for women safety and rapid emergency response.</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SafeHaven. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/contact" className="hover:text-slate-300 transition">Support</Link>
            <Link to="/safety-tips" className="hover:text-slate-300 transition">Emergency Guide</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
