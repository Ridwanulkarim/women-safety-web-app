import React from 'react';
import { useForm } from 'react-hook-form';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

const Contact = () => {
  const { register, handleSubmit, reset } = useForm();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const onSubmit = (data) => {
    toast.success(isBn ? 'ধন্যবাদ! আপনার বার্তাটি সেফহ্যাভেন সাপোর্ট টিমের কাছে পৌঁছে গেছে।' : 'Thank you! Your message has been sent to the SafeHaven support team.');
    reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="text-center max-w-2xl mx-auto space-y-3 relative z-10">
        <span className="mono-tag mono-tag-rose">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 telemetry-dot"></span> {isBn ? 'কমিউনিটি ও কারিগরি সহায়তা' : 'Community & Technical Help'}
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
          {isBn ? 'আমাদের সাথে ' : 'Get In '}<span className="gradient-text-rose">{isBn ? 'যোগাযোগ করুন' : 'Touch'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          {isBn ? 'যেকোনো প্রশ্ন, প্রযুক্তিগত পরামর্শ বা জরুরি রেসপন্স পার্টনারশিপের জন্য আমরা সার্বক্ষণিক প্রস্তুত।' : 'Have questions, technical feedback, or need emergency response integration? We are here 24/7.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div className="space-y-6">
          <div className="glass-card-xl p-7 sm:p-8 space-y-6">
            <h3 className="text-lg font-extrabold font-heading text-zinc-900 dark:text-white">
              {isBn ? 'যোগাযোগের তথ্য' : 'Contact Information'}
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg">
                  <FiMail />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold font-mono">{isBn ? 'ইমেইল সাপোর্ট' : 'Email Support'}</p>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-100 text-xs sm:text-sm font-mono">support@safehaven-app.org</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg">
                  <FiPhone />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold font-mono">{isBn ? 'হটলাইন ডেস্ক' : 'Hotline Desk'}</p>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-100 text-xs sm:text-sm font-mono">+880 9612-999999</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg">
                  <FiMapPin />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold font-mono">{isBn ? 'কমান্ড অপারেশন সেন্টার' : 'Operations Headquarters'}</p>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-100 text-xs sm:text-sm">
                    {isBn ? 'ঢাকা ও চট্টগ্রাম, বাংলাদেশ' : 'Dhaka & Chittagong, Bangladesh'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-card-xl p-7 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="human-label">{isBn ? 'আপনার নাম' : 'Your Name'}</label>
              <input
                type="text"
                required
                placeholder={isBn ? 'যেমন: সুমাইয়া আক্তার' : 'e.g. Sumaiya Akter'}
                {...register('name')}
                className="human-input"
              />
            </div>

            <div>
              <label className="human-label">{isBn ? 'ইমেইল ঠিকানা' : 'Email Address'}</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                {...register('email')}
                className="human-input font-mono"
              />
            </div>

            <div>
              <label className="human-label">{isBn ? 'বার্তার বিষয়' : 'Subject'}</label>
              <input
                type="text"
                required
                placeholder={isBn ? 'যেমন: জরুরী সহায়তা সংক্রান্ত প্রশ্ন' : 'e.g. Technical Question'}
                {...register('subject')}
                className="human-input"
              />
            </div>

            <div>
              <label className="human-label">{isBn ? 'বিস্তারিত বার্তা' : 'Message'}</label>
              <textarea
                rows="4"
                required
                placeholder={isBn ? 'আপনার বার্তা এখানে লিখুন...' : 'Write your message here...'}
                {...register('message')}
                className="human-input"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full btn-danger py-3.5 font-mono uppercase font-bold text-xs tracking-wider flex items-center justify-center gap-2"
            >
              <FiSend /> {isBn ? 'বার্তা পাঠান' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
