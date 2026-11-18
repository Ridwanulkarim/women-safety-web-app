import React from 'react';
import { useForm } from 'react-hook-form';
import { FiX, FiPlusCircle } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const ContactModal = ({ isOpen, onClose, onSave }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onSave(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative max-w-md w-full human-card p-6 sm:p-8 space-y-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 rounded-lg bg-slate-100 dark:bg-slate-800"
          title={isBn ? 'বন্ধ করুন' : 'Close'}
        >
          <FiX className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
            {isBn ? 'জরুরি পরিচিতি যোগ করুন' : 'Add Emergency Contact'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isBn ? 'আপনার একজন বিশ্বস্ত মানুষের যোগাযোগের তথ্য দিন (সর্বোচ্চ ৫ জন)।' : "Enter a trusted person's contact details (Max 5 contacts)."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="human-label">{isBn ? 'পুরো নাম' : 'Full Name'}</label>
            <input
              type="text"
              placeholder={isBn ? 'যেমন: আয়েশা রহমান' : 'e.g. Ayesha Rahman'}
              {...register('name', { required: isBn ? 'নাম দেওয়া আবশ্যক' : 'Name is required' })}
              className={`human-input ${errors.name ? 'human-input-error' : ''}`}
            />
            {errors.name && <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="human-label">{isBn ? 'ফোন নম্বর' : 'Phone Number'}</label>
            <input
              type="tel"
              placeholder={isBn ? 'যেমন: +8801700000000' : 'e.g. +8801700000000'}
              {...register('phone', { required: isBn ? 'ফোন নম্বর দেওয়া আবশ্যক' : 'Phone number is required' })}
              className={`human-input ${errors.phone ? 'human-input-error' : ''}`}
            />
            {errors.phone && <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="human-label">{isBn ? 'সম্পর্ক' : 'Relationship'}</label>
            <select
              {...register('relationship', { required: isBn ? 'সম্পর্ক নির্বাচন করুন' : 'Relationship is required' })}
              className="human-input"
            >
              <option value={isBn ? 'মা' : 'Mother'}>{isBn ? 'মা (Mother)' : 'Mother'}</option>
              <option value={isBn ? 'বাবা' : 'Father'}>{isBn ? 'বাবা (Father)' : 'Father'}</option>
              <option value={isBn ? 'বোন' : 'Sister'}>{isBn ? 'বোন (Sister)' : 'Sister'}</option>
              <option value={isBn ? 'ভাই' : 'Brother'}>{isBn ? 'ভাই (Brother)' : 'Brother'}</option>
              <option value={isBn ? 'স্বামী/স্ত্রী' : 'Spouse'}>{isBn ? 'স্বামী/স্ত্রী (Spouse)' : 'Spouse'}</option>
              <option value={isBn ? 'বন্ধু' : 'Friend'}>{isBn ? 'বন্ধু (Friend)' : 'Friend'}</option>
              <option value={isBn ? 'আত্মীয়' : 'Relative'}>{isBn ? 'আত্মীয় (Relative)' : 'Relative'}</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPrimary"
              {...register('isPrimary')}
              className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
            />
            <label htmlFor="isPrimary" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              {isBn ? 'প্রধান জরুরি পরিচিতি হিসেবে সেট করুন' : 'Set as Primary Emergency Contact'}
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 btn-secondary"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="w-1/2 btn-primary"
            >
              <FiPlusCircle /> {isBn ? 'সংরক্ষণ করুন' : 'Save Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
