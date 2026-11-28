import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { localizeNum } from '../../utils/helpers';
import BrandMark from './BrandMark';

const Footer = () => {
  const { t, language } = useLanguage();
  const isBn = language === 'bn';

  const hotlines = [
    { label: t('hotlines.nationalService'), num: '999', href: 'tel:999' },
    { label: t('hotlines.policeHelpline'), num: '999', href: 'tel:999' },
    { label: t('hotlines.womenHelpline'), num: '109', href: 'tel:109' },
    { label: t('hotlines.childHelpline'), num: '1098', href: 'tel:1098' },
    { label: t('hotlines.shasthyoBatayon'), num: '16263', href: 'tel:16263' }
  ];

  return (
    <footer className="bg-[#0f0f10] text-[#a1a1a6] pt-12 pb-12 border-t border-white/[0.08]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Dispatch Telemetry Strip */}
        <div className="px-4 py-3 rounded-xl bg-[#19191b] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#4cc38a]"></span>
            <span className="font-medium text-[#ededed]">
              {isBn ? 'জাতীয় জরুরি সেবা টেলিমেট্রি' : 'National emergency dispatch telemetry'}
            </span>
            <span className="text-[#85858b]">·</span>
            <span className="text-[#4cc38a] font-medium">
              {isBn ? 'সক্রিয়' : 'Operational'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-[#85858b]">
            <span>{isBn ? 'বিলম্ব: < ৩ সেকেন্ড' : 'Latency: < 3s'}</span>
            <span>{isBn ? 'SHA-256 কাস্টডি' : 'SHA-256 Custody'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/[0.08]">
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <BrandMark name={t('nav.brandName')} inverted />
            <p className="text-xs leading-relaxed text-[#a1a1a6]">
              {t('footer.desc')}
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-[#ededed] font-medium text-xs">
              {isBn ? 'নেভিগেশন' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-[#ededed] transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/about" className="hover:text-[#ededed] transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/features" className="hover:text-[#ededed] transition-colors">{t('nav.features')}</Link></li>
              <li><Link to="/safety-tips" className="hover:text-[#ededed] transition-colors">{t('nav.safetyTips')}</Link></li>
              <li><Link to="/emergency-help" className="hover:text-[#ededed] transition-colors">{t('nav.emergencyHelp')}</Link></li>
              <li><Link to="/blog" className="hover:text-[#ededed] transition-colors">{t('nav.blog')}</Link></li>
              <li><Link to="/contact" className="hover:text-[#ededed] transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Col 3: Emergency Hotlines */}
          <div className="space-y-3">
            <h4 className="text-[#ededed] font-medium text-xs">
              {t('footer.hotlines')}
            </h4>
            <ul className="space-y-2 text-xs">
              {hotlines.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center gap-3">
                  <span className="truncate">{item.label}</span>
                  <a
                    href={item.href}
                    className="font-mono tabular-nums font-medium text-[#ededed] hover:text-[#fb7185] transition-colors shrink-0"
                  >
                    {localizeNum(item.num, isBn)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Telemetry Security */}
          <div className="space-y-3">
            <h4 className="text-[#ededed] font-medium text-xs">
              {t('footer.telemetry')}
            </h4>
            <p className="text-xs leading-relaxed text-[#a1a1a6]">
              {t('footer.security')}
            </p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#85858b]">
          <p className="tabular-nums">© {localizeNum(new Date().getFullYear(), isBn)} {t('footer.allRightsReserved')}</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-[#ededed] transition-colors">
              {isBn ? 'গোপনীয়তা নীতি' : 'Privacy policy'}
            </Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-[#ededed] transition-colors">
              {isBn ? 'সহায়তা ডেস্ক' : 'Support desk'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
