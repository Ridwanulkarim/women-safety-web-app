import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiPhoneCall, FiLock, FiActivity, FiCheckCircle } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#09090d] text-zinc-400 pt-12 pb-16 lg:pb-12 border-t border-zinc-800/80 font-sans relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Operational Status Strip */}
        <div className="mb-10 p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 telemetry-dot"></span>
            <span className="text-xs font-semibold text-zinc-200">
              National Emergency Dispatch Telemetry: <span className="text-emerald-400 font-bold">OPERATIONAL</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5"><FiActivity className="text-rose-500" /> Latency: &lt;3s</span>
            <span className="flex items-center gap-1.5"><FiCheckCircle className="text-emerald-500" /> AES-256 Vault</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-zinc-800/80">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center font-bold shadow-md shadow-rose-600/30">
                <FiShield className="w-4.5 h-4.5" />
              </div>
              <span className="text-base font-extrabold text-white tracking-tight font-heading">
                {t('nav.brandName')}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              {t('footer.desc')}
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase font-mono">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-rose-400 transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/about" className="hover:text-rose-400 transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/features" className="hover:text-rose-400 transition-colors">{t('nav.features')}</Link></li>
              <li><Link to="/safety-tips" className="hover:text-rose-400 transition-colors">{t('nav.safetyTips')}</Link></li>
              <li><Link to="/blog" className="hover:text-rose-400 transition-colors">{t('nav.blog')}</Link></li>
            </ul>
          </div>

          {/* Col 3: Emergency Dispatch */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase font-mono flex items-center gap-1.5">
              <FiPhoneCall className="text-rose-500" /> {t('footer.hotlines')}
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li className="flex justify-between items-center text-zinc-300">
                <span>{t('hotlines.nationalService')}</span>
                <a href="tel:999" className="font-bold text-rose-400 hover:text-rose-300 hover:underline px-2 py-0.5 rounded bg-rose-500/10">999</a>
              </li>
              <li className="flex justify-between items-center text-zinc-300">
                <span>{t('hotlines.policeHelpline')}</span>
                <a href="tel:999" className="font-bold text-blue-400 hover:text-blue-300 hover:underline px-2 py-0.5 rounded bg-blue-500/10">999</a>
              </li>
              <li className="flex justify-between items-center text-zinc-300">
                <span>{t('hotlines.womenHelpline')}</span>
                <a href="tel:109" className="font-bold text-rose-400 hover:text-rose-300 hover:underline px-2 py-0.5 rounded bg-rose-500/10">109</a>
              </li>
              <li className="flex justify-between items-center text-zinc-300">
                <span>{t('hotlines.childHelpline')}</span>
                <a href="tel:1098" className="font-bold text-purple-400 hover:text-purple-300 hover:underline px-2 py-0.5 rounded bg-purple-500/10">1098</a>
              </li>
              <li className="flex justify-between items-center text-zinc-300">
                <span>{t('hotlines.shasthyoBatayon')}</span>
                <a href="tel:16263" className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline px-2 py-0.5 rounded bg-emerald-500/10">16263</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Telemetry Security */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase font-mono flex items-center gap-1.5">
              <FiLock className="text-emerald-500" /> {t('footer.telemetry')}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              {t('footer.security')}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <p>© {new Date().getFullYear()} SafeHaven. {t('footer.allRightsReserved')}</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-zinc-300 transition text-rose-400 font-semibold">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-zinc-300 transition">{t('footer.support')}</Link>
            <Link to="/safety-tips" className="hover:text-zinc-300 transition">{t('footer.securityProtocol')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
