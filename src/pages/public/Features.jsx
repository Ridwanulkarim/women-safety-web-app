import React from 'react';
import { FiAlertCircle, FiPhoneCall, FiMapPin, FiShield, FiBell, FiPieChart } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const Features = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const featureList = [
    {
      title: isBn ? '১-ট্যাপ এসওএস প্যানিক বাটন' : 'One-Tap SOS Panic Button',
      desc: isBn ? '৩-সেকেন্ডের ভুল এলার্ম বাতিল সুবিধাসহ তাৎক্ষণিক বিপদবার্তা ট্রিগার এবং অভিভাবকদের কাছে লাইভ লোকেশন ট্রান্সমিশন।' : 'Instant distress trigger with 3s cancel window and real-time location transmission to linked guardians.',
      icon: FiAlertCircle,
      tag: isBn ? 'জরুরি ডিসপ্যাচ' : 'CRITICAL DISPATCH'
    },
    {
      title: isBn ? '৫ জন অগ্রাধিকার জরুরি পরিচিতি' : '5 Priority Emergency Contacts',
      desc: isBn ? '১-ট্যাপ স্পিড ডায়াল ও স্বয়ংক্রিয় জরুরি এসএমএস পাঠানোর সুবিধাযুক্ত কাস্টমাইজেবল অভিভাবক তালিকা।' : 'Customizable guardian list with 1-tap speed dial and automated emergency SMS triggers.',
      icon: FiPhoneCall,
      tag: isBn ? 'যোগাযোগ' : 'COMMUNICATION'
    },
    {
      title: isBn ? 'ডুয়াল-ইঞ্জিন জিওলোকেশন রাডার' : 'Dual-Engine Geolocation Radar',
      desc: isBn ? 'লিফলেট ও ওপেনস্ট্রিটম্যাপ সমন্বয়ে অত্যন্ত নিখুঁত স্যাটেলাইট জিপিএস পজিশনিং ও লাইভ এরিয়া সার্চ।' : 'Ultra-accurate GPS positioning with Leaflet and OpenStreetMap rendering requiring zero paid external keys.',
      icon: FiMapPin,
      tag: isBn ? 'টেলিমেট্রি' : 'TELEMETRY'
    },
    {
      title: isBn ? 'জাতীয় ৯৯৯ সরাসরি ইন্টিগ্রেশন' : 'National 999 Integration',
      desc: isBn ? 'বাংলাদেশ জাতীয় জরুরি সেবা, পুলিশ, ফায়ার সার্ভিস এবং জাতীয় নারী হেল্পলাইনে (১০৯) সরাসরি কল সুবিধা।' : 'Speed-dial gateway to Bangladesh National Emergency Service, Police, Fire Dispatch, and Women Helpline.',
      icon: FiShield,
      tag: isBn ? 'জাতীয় সেবা' : 'CIVIL DISPATCH'
    },
    {
      title: isBn ? 'নিরাপদ প্রমাণ সংরক্ষণাগার (ভল্ট)' : 'Evidence Vault Locker',
      desc: isBn ? 'এনক্রিপ্টেড ক্যামেরা ছবি, অডিও রেকর্ডিং ও আদালতের গ্রহণযোগ্যতায় SHA-256 আইনি প্রমাণপত্র ডাউনলোড।' : 'Encrypted camera capture and ambient audio recording locker with timestamped legal chain-of-custody export.',
      icon: FiBell,
      tag: isBn ? 'ডিজিটাল প্রমাণ' : 'DIGITAL EVIDENCE'
    },
    {
      title: isBn ? 'এআই ভয়েস গার্ডিয়ান হ্যান্ডস-ফ্রি এসওএস' : 'AI Hands-Free Voice SOS Guardian',
      desc: isBn ? 'বিপদের মুহূর্তে ফোন না ছুঁয়ে শুধু মুখে "বাঁচাও" বা "Help" বললেই স্বয়ংক্রিয়ভাবে সাইরেন বাজা ও লাইভ লোকেশন সহ এসওএস পাঠানো।' : 'Hands-free ambient voice recognition triggering automated siren and live GPS dispatch on detecting "বাঁচাও" or "Help".',
      icon: FiPieChart,
      tag: isBn ? 'এআই প্রযুক্তি' : 'AI TECHNOLOGY'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="text-center max-w-3xl mx-auto space-y-3 relative z-10">
        <span className="mono-tag mono-tag-rose">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 telemetry-dot"></span> {isBn ? 'সিস্টেম আর্কিটেকচার ও সুবিধাসমূহ' : 'System Architecture & Capabilities'}
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
          {isBn ? 'প্ল্যাটফর্মের সর্বাধুনিক ' : 'Comprehensive Platform '}<span className="gradient-text-rose">{isBn ? 'নিরাপত্তা ফিচারসমূহ' : 'Safety Features'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          {isBn ? 'তাৎক্ষণিক বিপদ প্রতিরোধ, জরুরি সহায়তা এবং ডিজিটাল প্রমাণ সংরক্ষণের জন্য বিশেষভাবে তৈরি।' : 'Everything engineered for immediate emergency deterrence, rapid response, and digital evidence protection.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {featureList.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="product-card product-card-hover p-7 sm:p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center text-xl shadow-lg shadow-rose-600/25">
                    <Icon />
                  </div>
                  <span className="mono-tag mono-tag-zinc text-[10px]">{f.tag}</span>
                </div>
                <h3 className="text-base font-extrabold text-zinc-900 dark:text-white font-heading">{f.title}</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Features;
