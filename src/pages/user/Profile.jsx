import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiSave, FiCheckCircle, FiCalendar, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import ProfilePictureUpload from '../../components/profile/ProfilePictureUpload';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUserProfile, logoutUser } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();
  const dateInputRef = useRef(null);

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || '',
      bloodGroup: user?.bloodGroup || '',
      address: user?.address || '',
      city: user?.city || '',
      country: user?.country || '',
      profilePictureUrl: user?.profilePictureUrl || user?.profileImage || '',
      profileImage: user?.profileImage || user?.profilePictureUrl || ''
    }
  });

  const { ref: dobRef, ...dobRegisterProps } = register('dateOfBirth');

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        bloodGroup: user.bloodGroup || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        profilePictureUrl: user.profilePictureUrl || user.profileImage || '',
        profileImage: user.profileImage || user.profilePictureUrl || ''
      });
    }
  }, [user, reset]);

  const [loading, setLoading] = useState(false);

  const handleImageUploadSuccess = (uploadedUrl) => {
    setValue('profilePictureUrl', uploadedUrl);
    setValue('profileImage', uploadedUrl);
    updateUserProfile({ profilePictureUrl: uploadedUrl, profileImage: uploadedUrl });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.put('/users/profile', data);
      const updated = res.data?.data || data;
      updateUserProfile(updated);
      toast.success(isBn ? 'প্রোফাইল আপডেট হয়েছে' : 'Profile updated');
    } catch (error) {
      updateUserProfile(data);
      toast.success(isBn ? 'প্রোফাইল স্থানীয়ভাবে সংরক্ষিত হয়েছে' : 'Profile saved locally');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="surface-panel p-6 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-medium text-[#171717] dark:text-[#ededed]">
              {isBn ? 'প্রোফাইল সেটিংস' : 'Profile'}
            </h1>
            <span className="status-tag mono-tag-emerald">
              <FiCheckCircle className="w-3.5 h-3.5 dispatch-icon" /> {isBn ? 'যাচাইকৃত' : 'Verified'}
            </span>
          </div>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
            {isBn ? 'ব্যক্তিগত প্রোফাইল ও জরুরি পরিচিতি তথ্য পরিচালনা করুন' : 'Manage your personal profile and health details'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="surface-panel p-6 sm:p-8 space-y-6">
        <div className="border-b border-zinc-900/[0.08] dark:border-white/[0.08] pb-6">
          <label className="human-label text-center mb-3">
            {isBn ? 'প্রোফাইল ছবি' : 'Profile photo'}
          </label>
          <ProfilePictureUpload
            currentUrl={user?.profilePictureUrl || user?.profileImage}
            onUploadSuccess={handleImageUploadSuccess}
            userId={user?.uid}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="human-label">{isBn ? 'পুরো নাম' : 'Full name'}</label>
            <div className="relative">
              <FiUser className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
              <input
                type="text"
                placeholder={isBn ? 'আয়েশা রহমান' : 'Ayesha Rahman'}
                {...register('fullName', { required: isBn ? 'পুরো নাম আবশ্যক' : 'Full name is required' })}
                className="human-input human-input-has-icon"
              />
            </div>
          </div>

          <div>
            <label className="human-label">{isBn ? 'ইমেইল ঠিকানা (অপরিবর্তনীয়)' : 'Email address'}</label>
            <div className="relative">
              <FiMail className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
              <input
                type="email"
                disabled
                {...register('email')}
                className="human-input human-input-has-icon opacity-60 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div>
            <label className="human-label">{isBn ? 'ফোন নম্বর' : 'Phone number'}</label>
            <div className="relative">
              <FiPhone className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
              <input
                type="tel"
                placeholder="+880 1700000000"
                {...register('phone')}
                className="human-input human-input-has-icon font-mono tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="human-label">{isBn ? 'জন্ম তারিখ' : 'Date of birth'}</label>
            <div className="relative">
              <input
                type="date"
                {...dobRegisterProps}
                ref={(e) => {
                  dobRef(e);
                  dateInputRef.current = e;
                }}
                className="human-input pr-10 font-mono tabular-nums"
              />
              <button
                type="button"
                onClick={() => {
                  if (dateInputRef.current && typeof dateInputRef.current.showPicker === 'function') {
                    dateInputRef.current.showPicker();
                  } else if (dateInputRef.current) {
                    dateInputRef.current.focus();
                  }
                }}
                className="absolute right-2.5 top-2 p-1 rounded-md text-[#737373] dark:text-[#85858b] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors cursor-pointer"
                title={isBn ? 'ক্যালেন্ডার খুলুন' : 'Open calendar'}
              >
                <FiCalendar className="w-4 h-4 dispatch-icon" />
              </button>
            </div>
          </div>

          <div>
            <label className="human-label">{isBn ? 'লিঙ্গ' : 'Gender'}</label>
            <select {...register('gender')} className="human-input">
              <option value="">{isBn ? 'নির্বাচন করুন' : 'Select gender'}</option>
              <option value="Female">{isBn ? 'নারী (Female)' : 'Female'}</option>
              <option value="Male">{isBn ? 'পুরুষ (Male)' : 'Male'}</option>
              <option value="Other">{isBn ? 'অন্যান্য (Other)' : 'Other'}</option>
              <option value="Prefer not to say">{isBn ? 'বলতে অনিচ্ছুক' : 'Prefer not to say'}</option>
            </select>
          </div>

          <div>
            <label className="human-label">{isBn ? 'রক্তের গ্রুপ' : 'Blood group'}</label>
            <select {...register('bloodGroup')} className="human-input font-mono">
              <option value="">{isBn ? 'নির্বাচন করুন' : 'Select blood group'}</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label className="human-label">{isBn ? 'শহর' : 'City'}</label>
            <input
              type="text"
              placeholder={isBn ? 'ঢাকা / চট্টগ্রাম' : 'Dhaka'}
              {...register('city')}
              className="human-input"
            />
          </div>

          <div>
            <label className="human-label">{isBn ? 'দেশ' : 'Country'}</label>
            <input
              type="text"
              placeholder={isBn ? 'বাংলাদেশ' : 'Bangladesh'}
              {...register('country')}
              className="human-input"
            />
          </div>
        </div>

        <div>
          <label className="human-label">{isBn ? 'স্থায়ী ঠিকানা' : 'Address'}</label>
          <textarea
            rows="3"
            placeholder={isBn ? 'বিস্তারিত ঠিকানা' : 'Street address'}
            {...register('address')}
            className="human-input"
          ></textarea>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button type="submit" disabled={loading} className="w-full sm:flex-1 btn-solid h-11 text-sm">
            <FiSave className="w-4 h-4 dispatch-icon" />
            {loading ? (isBn ? 'সংরক্ষণ হচ্ছে' : 'Saving changes') : (isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save changes')}
          </button>

          <button
            type="button"
            onClick={() => {
              logoutUser();
              navigate('/login');
            }}
            className="w-full sm:w-auto btn-outline h-11 px-5 text-sm text-[#dc2626] dark:text-[#e5484d]"
          >
            <FiLogOut className="w-4 h-4 dispatch-icon" /> {isBn ? 'লগআউট' : 'Log out'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
