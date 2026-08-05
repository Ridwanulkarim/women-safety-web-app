import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiPhoneCall, FiLock } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-[#0b0f19] text-slate-400 pt-16 pb-12 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white">
                <FiShield className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold font-heading text-white tracking-tight">
                SafeHaven
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering personal safety through instantaneous distress broadcasting, continuous location telemetry, and direct emergency dispatch.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase font-heading">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-rose-400 transition">Home Overview</Link></li>
              <li><Link to="/about" className="hover:text-rose-400 transition">About SafeHaven</Link></li>
              <li><Link to="/features" className="hover:text-rose-400 transition">Product Features</Link></li>
              <li><Link to="/safety-tips" className="hover:text-rose-400 transition">Safety Manual</Link></li>
              <li><Link to="/blog" className="hover:text-rose-400 transition">Safety Articles</Link></li>
            </ul>
          </div>

          {/* Col 3: Emergency Hotlines */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase font-heading flex items-center gap-2">
              <FiPhoneCall className="text-rose-500" /> Hotlines
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between items-center text-slate-300">
                <span>National Emergency</span>
                <a href="tel:999" className="font-bold font-mono text-rose-400 hover:underline">999</a>
              </li>
              <li className="flex justify-between items-center text-slate-300">
                <span>Police Dispatch</span>
                <a href="tel:999" className="font-bold font-mono text-blue-400 hover:underline">999</a>
              </li>
              <li className="flex justify-between items-center text-slate-300">
                <span>Women Helpline</span>
                <a href="tel:109" className="font-bold font-mono text-rose-400 hover:underline">109 / 10921</a>
              </li>
              <li className="flex justify-between items-center text-slate-300">
                <span>Ambulance Service</span>
                <a href="tel:199" className="font-bold font-mono text-amber-400 hover:underline">199</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Security */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase font-heading flex items-center gap-2">
              <FiLock className="text-rose-500" /> Privacy & Encryption
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Telemetry is encrypted end-to-end and transmitted solely during authorized SOS distress events to your priority contacts.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SafeHaven Systems Inc. All rights reserved.</p>
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
