import React from 'react';
import { FiShield, FiHeart, FiLock } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const About = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-mono text-[#737373] dark:text-[#85858b]">
          {isBn ? 'উদ্দেশ্য ও মূলনীতি' : 'Mission and architecture'}
        </p>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed]">
          {isBn
            ? 'ব্যক্তিগত নিরাপত্তা ও দ্রুত জরুরি ডিসপ্যাচ নেটওয়ার্ক'
            : 'Personal safety through rapid emergency dispatch'}
        </h1>
        <p className="text-base text-[#525252] dark:text-[#a1a1a6] leading-relaxed">
          {isBn
            ? 'সেফহেভেন তৈরি করা হয়েছে বিপদের মুহূর্তে এবং উদ্ধারকারীদের দ্রুত পদক্ষেপের মধ্যকার সময় কমিয়ে আনতে, যাতে জরুরি পরিস্থিতিতে যোগাযোগ ও প্রমাণ সংরক্ষণ সহজ হয়।'
            : 'SafeHaven is built to shorten the time between distress detection and responder action while keeping evidence under user custody.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="surface-card p-6 space-y-3">
          <FiShield className="w-5 h-5 text-[#e11d48] dispatch-icon" />
          <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">
            {isBn ? 'আমাদের লক্ষ্য' : 'Our mission'}
          </h2>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6] leading-relaxed">
            {isBn
              ? 'জিরো-ফ্রিকশন জরুরি এসওএস প্যানিক ট্রিগার, জিপিএস অবস্থান ব্রডকাস্টিং এবং জাতীয় হেল্পলাইনের (৯৯৯) সাথে সরাসরি সংযোগ নিশ্চিত করা।'
              : 'Provide reliable emergency panic activation, geolocation dispatch broadcasting, and direct national helpline routing across Bangladesh.'}
          </p>
        </div>

        <div className="surface-card p-6 space-y-3">
          <FiHeart className="w-5 h-5 text-[#525252] dark:text-[#a1a1a6] dispatch-icon" />
          <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">
            {isBn ? 'সুরক্ষা ও সহায়তা' : 'User empowerment'}
          </h2>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6] leading-relaxed">
            {isBn
              ? 'ব্যবহারকারীদের জন্য আত্মরক্ষা কৌশল, আইনি অধিকার নির্দেশিকা, হ্যান্ডস-ফ্রি ভয়েস শনাক্তকরণ এবং প্রমাণ সংরক্ষণাগার সুবিধা একত্রে দেওয়া।'
              : 'Equip individuals with clear self-defense guidance, legal rights references, hands-free voice triggers, and local evidence lockers.'}
          </p>
        </div>

        <div className="surface-card p-6 space-y-3">
          <FiLock className="w-5 h-5 text-[#525252] dark:text-[#a1a1a6] dispatch-icon" />
          <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">
            {isBn ? 'তথ্য গোপনীয়তা' : 'Cryptographic privacy'}
          </h2>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6] leading-relaxed">
            {isBn
              ? 'অবস্থানের তথ্য কেবল সক্রিয় এসওএস বিপদকালীন সময় সংগৃহীত হয় এবং ক্রিপ্টোগ্রাফিক সুরক্ষায় সংরক্ষিত থাকে।'
              : 'Location telemetry is recorded strictly during active distress broadcasts and secured through Firebase rules and local SHA-256 digests.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
