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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
      <div className="relative max-w-md w-full surface-panel p-6 sm:p-8 space-y-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#737373] dark:text-[#85858b] hover:text-[#171717] dark:hover:text-[#ededed] flex items-center justify-center cursor-pointer"
          title={isBn ? 'বন্ধ করুন' : 'Close'}
        >
          <FiX className="w-4 h-4 dispatch-icon" />
        </button>

        <div className="space-y-1">
          <h2 className="text-xl font-medium text-[#171717] dark:text-[#ededed]">
            {isBn ? 'জরুরি পরিচিতি যোগ করুন' : 'Add emergency contact'}
          </h2>
          <p className="text-xs text-[#525252] dark:text-[#a1a1a6]">
            {isBn
              ? 'সর্বোচ্চ ৫ জন বিশ্বস্ত পরিচিতির যোগাযোগের তথ্য দিন।'
              : 'Add a trusted guardian to notify during emergency dispatches (max 5).'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="human-label">{isBn ? 'পুরো নাম' : 'Full name'}</label>
            <input
              type="text"
              placeholder={isBn ? 'আয়েশা রহমান' : 'Ayesha Rahman'}
              {...register('name', { required: isBn ? 'নাম দেওয়া আবশ্যক' : 'Name is required' })}
              className={`human-input ${errors.name ? 'human-input-error' : ''}`}
            />
            {errors.name && <p className="text-xs text-[#dc2626] dark:text-[#e5484d] mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="human-label">{isBn ? 'ফোন নম্বর' : 'Phone number'}</label>
            <input
              type="tel"
              placeholder="+8801700000000"
              {...register('phone', { required: isBn ? 'ফোন নম্বর দেওয়া আবশ্যক' : 'Phone number is required' })}
              className={`human-input font-mono tabular-nums ${errors.phone ? 'human-input-error' : ''}`}
            />
            {errors.phone && <p className="text-xs text-[#dc2626] dark:text-[#e5484d] mt-1">{errors.phone.message}</p>}
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
              className="w-4 h-4 accent-[#e11d48] rounded cursor-pointer"
            />
            <label htmlFor="isPrimary" className="text-xs font-medium text-[#525252] dark:text-[#a1a1a6] cursor-pointer">
              {isBn ? 'প্রধান জরুরি পরিচিতি হিসেবে নির্ধারণ করুন' : 'Set as primary guardian'}
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="w-1/2 btn-outline h-10 text-xs">
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button type="submit" className="w-1/2 btn-solid h-10 text-xs">
              <FiPlusCircle className="w-4 h-4 dispatch-icon" /> {isBn ? 'সংরক্ষণ করুন' : 'Save contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
