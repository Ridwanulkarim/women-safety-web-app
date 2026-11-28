import React from 'react';
import { useForm } from 'react-hook-form';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

const Contact = () => {
  const { register, handleSubmit, reset } = useForm();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const onSubmit = () => {
    toast.success(isBn ? 'আপনার বার্তা সেফহেভেন সাপোর্ট টিমের কাছে পাঠানো হয়েছে' : 'Message sent to the SafeHaven support desk');
    reset();
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-mono text-[#737373] dark:text-[#85858b]">
          {isBn ? 'সহায়তা ও যোগাযোগ' : 'Support and technical desk'}
        </p>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed]">
          {isBn ? 'আমাদের সাথে যোগাযোগ করুন' : 'Contact support desk'}
        </h1>
        <p className="text-base text-[#525252] dark:text-[#a1a1a6]">
          {isBn
            ? 'যেকোনো প্রশ্ন, কারিগরি পরামর্শ বা জরুরি রেসপন্স সমন্বয়ের জন্য লিখুন'
            : 'Reach out for platform questions, feedback, or responder integration requests'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="surface-panel p-6 space-y-4">
            <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">
              {isBn ? 'যোগাযোগের মাধ্যম' : 'Direct channels'}
            </h2>

            <div className="space-y-3">
              <div className="surface-raised p-4 flex items-center gap-3.5">
                <FiMail className="w-4 h-4 text-[#525252] dark:text-[#a1a1a6] shrink-0 dispatch-icon" />
                <div>
                  <span className="text-xs text-[#737373] dark:text-[#85858b] block">{isBn ? 'ইমেইল সাপোর্ট' : 'Email support'}</span>
                  <span className="text-sm font-mono text-[#171717] dark:text-[#ededed]">support@safehaven-app.org</span>
                </div>
              </div>

              <div className="surface-raised p-4 flex items-center gap-3.5">
                <FiPhone className="w-4 h-4 text-[#525252] dark:text-[#a1a1a6] shrink-0 dispatch-icon" />
                <div>
                  <span className="text-xs text-[#737373] dark:text-[#85858b] block">{isBn ? 'হটলাইন ডেস্ক' : 'Hotline desk'}</span>
                  <span className="text-sm font-mono tabular-nums text-[#171717] dark:text-[#ededed]">+880 9612-999999</span>
                </div>
              </div>

              <div className="surface-raised p-4 flex items-center gap-3.5">
                <FiMapPin className="w-4 h-4 text-[#525252] dark:text-[#a1a1a6] shrink-0 dispatch-icon" />
                <div>
                  <span className="text-xs text-[#737373] dark:text-[#85858b] block">{isBn ? 'অপারেশন কেন্দ্র' : 'Operations center'}</span>
                  <span className="text-sm text-[#171717] dark:text-[#ededed]">
                    {isBn ? 'ঢাকা ও চট্টগ্রাম, বাংলাদেশ' : 'Dhaka and Chittagong, Bangladesh'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 surface-panel p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="human-label">{isBn ? 'আপনার নাম' : 'Name'}</label>
                <input
                  type="text"
                  required
                  placeholder={isBn ? 'আয়েশা রহমান' : 'Ayesha Rahman'}
                  {...register('name')}
                  className="human-input"
                />
              </div>

              <div>
                <label className="human-label">{isBn ? 'ইমেইল ঠিকানা' : 'Email'}</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  {...register('email')}
                  className="human-input font-mono"
                />
              </div>
            </div>

            <div>
              <label className="human-label">{isBn ? 'বার্তার বিষয়' : 'Subject'}</label>
              <input
                type="text"
                required
                placeholder={isBn ? 'জরুরি সহায়তা বা প্রশ্ন' : 'Technical question'}
                {...register('subject')}
                className="human-input"
              />
            </div>

            <div>
              <label className="human-label">{isBn ? 'বার্তা' : 'Message'}</label>
              <textarea
                rows="4"
                required
                placeholder={isBn ? 'বিস্তারিত লিখুন' : 'Write your message'}
                {...register('message')}
                className="human-input"
              ></textarea>
            </div>

            <button type="submit" className="btn-solid h-11 px-5 text-sm">
              <FiSend className="w-4 h-4 dispatch-icon" /> {isBn ? 'বার্তা পাঠান' : 'Send message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
