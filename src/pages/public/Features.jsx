import React from 'react';
import { FiAlertCircle, FiPhoneCall, FiMapPin, FiShield, FiLock, FiMic } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const Features = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const featureList = [
    {
      title: isBn ? 'এক-ট্যাপ এসওএস প্যানিক ট্রিগার' : 'One-tap SOS panic trigger',
      desc: isBn
        ? '৩ সেকেন্ডের বাতিলযোগ্য কাউন্টডাউন সহ তাৎক্ষণিক বিপদ সংকেত ও পরিচিতদের কাছে লাইভ লোকেশন প্রেরণ।'
        : 'Immediate distress trigger with a 3-second cancel window and real-time location relay to saved guardians.',
      icon: FiAlertCircle,
      tag: isBn ? 'জরুরি ডিসপ্যাচ' : 'Dispatch'
    },
    {
      title: isBn ? '৫ জন জরুরি পরিচিতি' : 'Five priority contacts',
      desc: isBn
        ? 'স্পিড ডায়াল ও জরুরি এসএমএস সুবিধাসহ বিশ্বাসযোগ্য পরিবার ও বন্ধুদের তালিকা সংরক্ষণ।'
        : 'Store up to five trusted guardians with relationship labels, SMS links, and direct telephone dialers.',
      icon: FiPhoneCall,
      tag: isBn ? 'যোগাযোগ' : 'Guardians'
    },
    {
      title: isBn ? 'জিওলোকেশন রাডার' : 'Live geolocation radar',
      desc: isBn
        ? 'লিফলেট ও ওপেনস্ট্রিটম্যাপের সমন্বয়ে স্যাটেলাইট জিপিএস পজিশনিং এবং এলাকা অনুসন্ধান।'
        : 'Interactive Leaflet and OpenStreetMap positioning with neighborhood search and manual pin adjustment.',
      icon: FiMapPin,
      tag: isBn ? 'টেলিমেট্রি' : 'Telemetry'
    },
    {
      title: isBn ? 'জাতীয় ৯৯৯ ডিরেক্টরি' : 'National 999 directory',
      desc: isBn
        ? 'বাংলাদেশ জাতীয় জরুরি সেবা, পুলিশ, নারী হেল্পলাইন (১০৯) এবং স্বাস্থ্য বাতায়নে সরাসরি কল।'
        : 'Direct gateway to Bangladesh Emergency 999, Police Dispatch, Women Helpline 109, and Shasthyo Batayon.',
      icon: FiShield,
      tag: isBn ? 'জাতীয় সেবা' : 'Hotlines'
    },
    {
      title: isBn ? 'নিরাপদ প্রমাণ সংরক্ষণাগার' : 'SHA-256 evidence locker',
      desc: isBn
        ? 'স্থানীয় ক্যামেরা ও অডিও রেকর্ডিং সংরক্ষণ এবং SHA-256 আইনি ডকেট ডাউনলোডের সুবিধা।'
        : 'Local camera photo, video, and audio recorder with SHA-256 chain-of-custody exhibit export.',
      icon: FiLock,
      tag: isBn ? 'প্রমাণ সংরক্ষণ' : 'Custody'
    },
    {
      title: isBn ? 'ভয়েস-অ্যাক্টিভেটেড এসওএস গার্ডিয়ান' : 'Hands-free voice guardian',
      desc: isBn
        ? 'ফোন স্পর্শ না করেই মুখে "বাঁচাও" বা "Help" বললে স্বয়ংক্রিয়ভাবে সাইরেন ও এসওএস সংকেত চালু হওয়া।'
        : 'Ambient speech recognition that triggers audible siren and GPS SOS countdown upon hearing Bangla or English distress keywords.',
      icon: FiMic,
      tag: isBn ? 'ভয়েস এসওএস' : 'Voice trigger'
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-mono text-[#737373] dark:text-[#85858b]">
          {isBn ? 'সিস্টেম আর্কিটেকচার' : 'Platform architecture'}
        </p>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed]">
          {isBn ? 'নিরাপত্তা ও ডিসপ্যাচ ফিচারসমূহ' : 'Core safety capabilities'}
        </h1>
        <p className="text-base text-[#525252] dark:text-[#a1a1a6] leading-relaxed">
          {isBn
            ? 'বিপদ প্রতিরোধ, তাৎক্ষণিক জরুরি সহায়তা এবং ডিজিটাল প্রমাণ সংরক্ষণের জন্য প্রতিটি মডিউল সাজানো হয়েছে।'
            : 'Focused modules designed for immediate emergency signaling, responder clarity, and verifiable digital records.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureList.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="surface-card product-card-hover p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Icon className="w-5 h-5 text-[#525252] dark:text-[#a1a1a6] dispatch-icon" />
                  <span className="status-tag">{f.tag}</span>
                </div>
                <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">{f.title}</h2>
                <p className="text-sm text-[#525252] dark:text-[#a1a1a6] leading-relaxed">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Features;
