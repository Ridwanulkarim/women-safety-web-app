import React, { useState } from 'react';
import { FiPhoneCall, FiShield, FiAlertTriangle, FiActivity, FiVolume2 } from 'react-icons/fi';
import { EMERGENCY_NUMBERS } from '../../utils/constants';
import FakeCallModal from '../../components/safety/FakeCallModal';
import SirenAlarmButton from '../../components/safety/SirenAlarmButton';
import MedicalIDModal from '../../components/safety/MedicalIDModal';
import { useLanguage } from '../../context/LanguageContext';

const EmergencyHelp = () => {
  const [fakeCallOpen, setFakeCallOpen] = useState(false);
  const [medicalIdOpen, setMedicalIdOpen] = useState(false);
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const categoryMap = {
    'National Hotline': isBn ? 'জাতীয় হটলাইন' : 'National Hotline',
    'Law Enforcement': isBn ? 'আইন শৃঙ্খলা' : 'Law Enforcement',
    'Specialized Hotline': isBn ? 'বিশেষ হটলাইন' : 'Specialized Hotline',
    'Child Protection': isBn ? 'শিশু সুরক্ষা' : 'Child Protection',
    'Medical Advice': isBn ? 'চিকিৎসা পরামর্শ' : 'Medical Advice'
  };

  const nameMap = {
    'National Emergency Service': isBn ? 'জাতীয় জরুরি সেবা' : 'National Emergency Service',
    'Police Emergency Helpline': isBn ? 'পুলিশ জরুরি হেল্পলাইন' : 'Police Emergency Helpline',
    'National Women Helpline': isBn ? 'জাতীয় নারী হেল্পলাইন' : 'National Women Helpline',
    'Child Helpline Bangladesh': isBn ? 'চাইল্ড হেল্পলাইন বাংলাদেশ' : 'Child Helpline Bangladesh',
    'Shasthyo Batayon': isBn ? 'স্বাস্থ্য বাতায়ন' : 'Shasthyo Batayon'
  };

  const descMap = {
    'National Emergency Service': isBn ? 'পুলিশ, ফায়ার সার্ভিস এবং অ্যাম্বুলেন্স দ্রুত প্রেরণের কেন্দ্রীয় জাতীয় সেবা।' : 'Police, Fire Service, and Ambulance combined dispatch service.',
    'Police Emergency Helpline': isBn ? 'তাৎক্ষণিক পুলিশি সহায়তা ও জরুরি অপরাধ প্রতিরোধের সরাসরি হটলাইন।' : 'Immediate police intervention and crime reporting.',
    'National Women Helpline': isBn ? 'নারীর প্রতি সহিংসতা, হেনস্তা ও পারিবারিক নির্যাতন প্রতিরোধে ২৪/৭ সহায়তা।' : 'Direct support against violence, harassment, and domestic abuse for women.',
    'Child Helpline Bangladesh': isBn ? 'শিশু অধিকার সুরক্ষা ও জরুরি উদ্ধারে ২৪/৭ টোল-ফ্রি হেল্পলাইন।' : '24/7 toll-free emergency helpline for child rights, protection, and rescue.',
    'Shasthyo Batayon': isBn ? 'নিবন্ধিত ডাক্তারের স্বাস্থ্য পরামর্শ, হাসপাতালের তথ্য ও অ্যাম্বুলেন্স তালিকা পেতে সরকারি স্বাস্থ্য সেবা।' : '24/7 government health helpline for medical advice from registered doctors, hospital info, and ambulance listings.'
  };

  const numberMap = {
    '999': isBn ? '৯৯৯' : '999',
    '109': isBn ? '১০৯' : '109',
    '1098': isBn ? '১০৯৮' : '1098',
    '16263': isBn ? '১৬২৬৩' : '16263'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 relative overflow-hidden font-sans">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 relative z-10">
        <span className="mono-tag mono-tag-rose">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 telemetry-dot"></span> {isBn ? 'জরুরি অপারেশন ডেস্ক' : 'Emergency Operations Desk'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
          {isBn ? 'জরুরি স্পিড ডায়াল ও ' : 'Emergency Speed Dial & '}<span className="gradient-text-rose">{isBn ? 'নিরাপত্তা টুলস' : 'Safety Utilities'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          {isBn ? 'তাৎক্ষণিকভাবে জরুরি হেল্পলাইনে কল করতে যেকোনো নম্বরে ট্যাপ করুন অথবা দ্রুত সুরক্ষা টুলস ব্যবহার করুন।' : 'Tap any hotline to call emergency dispatch immediately, or trigger instant deterrence tools.'}
        </p>
      </div>

      {/* Tactile Safety Quick Tools Banner */}
      <div className="glass-card-xl p-6 sm:p-8 border-rose-500/30 space-y-5 relative z-10">
        <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4">
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> {isBn ? 'তাৎক্ষণিক আত্মরক্ষা ও নিরাপত্তা টুলস' : 'Instant Safety Deterrence Tools'}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isBn ? 'তীব্র সাইরেন অ্যালার্ম, ভুয়া কল এবং জরুরি মেডিকেল তথ্যের সহজ অ্যাক্সেস' : 'Tactile deterrence, acoustic alarms, and medical ID access'}
            </p>
          </div>
          <span className="mono-tag mono-tag-emerald py-1 text-[10px]">{isBn ? 'প্রস্তুত ও সক্রিয়' : 'Active & Ready'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{isBn ? 'উচ্চ ডেসিবেল সাইরেন' : 'Loud Acoustic Siren'}</h4>
              <p className="text-[11px] text-zinc-500">{isBn ? 'আশেপাশের দৃষ্টি আকর্ষণে' : 'Maximum decibel alarm'}</p>
            </div>
            <SirenAlarmButton />
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{isBn ? 'ফেক এস্কেপ কল' : 'Fake Escape Call'}</h4>
              <p className="text-[11px] text-zinc-500">{isBn ? 'বিপদ এড়াতে ভুয়া কল' : 'Realistic simulated caller'}</p>
            </div>
            <button
              onClick={() => setFakeCallOpen(true)}
              className="btn-solid text-xs !py-2 !px-3 font-mono shadow-sm"
            >
              <FiPhoneCall /> {isBn ? 'চালু করুন' : 'TRIGGER'}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{isBn ? 'মেডিকেল আইডি কার্ড' : 'Medical ID Card'}</h4>
              <p className="text-[11px] text-zinc-500">{isBn ? 'রক্তের গ্রুপ ও তথ্য' : 'Blood group & allergies'}</p>
            </div>
            <button
              onClick={() => setMedicalIdOpen(true)}
              className="btn-danger text-xs !py-2 !px-3 font-mono shadow-md"
            >
              <FiActivity /> {isBn ? 'আইডি দেখুন' : 'VIEW ID'}
            </button>
          </div>
        </div>
      </div>

      {/* Speed Dial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {EMERGENCY_NUMBERS.map((num) => (
          <div key={num.id} className="product-card product-card-hover p-6 sm:p-7 space-y-5 text-center flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-rose-600/30">
                <FiPhoneCall />
              </div>

              <div className="space-y-1.5">
                <span className="mono-tag mono-tag-zinc py-0.5">
                  {categoryMap[num.category] || num.category}
                </span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-heading">
                  {nameMap[num.name] || num.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                  {descMap[num.name] || num.description}
                </p>
              </div>
            </div>

            <a
              href={`tel:${num.number}`}
              className="w-full btn-danger py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-rose-600/20"
            >
              <FiPhoneCall /> {isBn ? `কল করুন ${numberMap[num.number] || num.number}` : `Dial ${num.number}`}
            </a>
          </div>
        ))}
      </div>

      {/* Modals */}
      <FakeCallModal isOpen={fakeCallOpen} onClose={() => setFakeCallOpen(false)} />
      <MedicalIDModal isOpen={medicalIdOpen} onClose={() => setMedicalIdOpen(false)} />
    </div>
  );
};

export default EmergencyHelp;
