import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiPhoneCall, FiLock } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-12 pb-10 border-t border-zinc-800/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-zinc-800/80">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-white text-zinc-900 flex items-center justify-center font-bold">
                <FiShield className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight font-heading">
                {t('nav.brandName')}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              {t('footer.desc')}
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase font-mono">
              {t('nav.home')}
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/" className="hover:text-white transition">{t('nav.home')}</Link></li>
              <li><Link to="/about" className="hover:text-white transition">{t('nav.about')}</Link></li>
              <li><Link to="/features" className="hover:text-white transition">{t('nav.features')}</Link></li>
              <li><Link to="/safety-tips" className="hover:text-white transition">{t('nav.safetyTips')}</Link></li>
              <li><Link to="/blog" className="hover:text-white transition">{t('nav.blog')}</Link></li>
            </ul>
          </div>

          {/* Col 3: Emergency Dispatch */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase font-mono flex items-center gap-1.5">
              <FiPhoneCall className="text-rose-500" /> {t('footer.hotlines')}
            </h4>
            <ul className="space-y-1.5 text-xs font-mono">
              <li className="flex justify-between items-center text-zinc-300">
                <span>{t('hotlines.nationalService')}</span>
                <a href="tel:999" className="font-bold text-rose-400 hover:underline">999</a>
              </li>
              <li className="flex justify-between items-center text-zinc-300">
                <span>{t('hotlines.policeHelpline')}</span>
                <a href="tel:999" className="font-bold text-blue-400 hover:underline">999</a>
              </li>
              <li className="flex justify-between items-center text-zinc-300">
                <span>{t('hotlines.womenHelpline')}</span>
                <a href="tel:109" className="font-bold text-rose-400 hover:underline">109</a>
              </li>
              <li className="flex justify-between items-center text-zinc-300">
                <span>{t('hotlines.childHelpline')}</span>
                <a href="tel:1098" className="font-bold text-purple-400 hover:underline">1098</a>
              </li>
              <li className="flex justify-between items-center text-zinc-300">
                <span>{t('hotlines.shasthyoBatayon')}</span>
                <a href="tel:16263" className="font-bold text-emerald-400 hover:underline">16263</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Telemetry Security */}
          <div className="space-y-2">
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
          <p>© {new Date().getFullYear()} {t('footer.allRightsReserved')}</p>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-zinc-300 transition">{t('footer.support')}</Link>
            <Link to="/safety-tips" className="hover:text-zinc-300 transition">{t('footer.securityProtocol')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
