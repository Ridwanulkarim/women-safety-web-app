import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiActivity } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import BrandMark from '../../components/common/BrandMark';

const Register = () => {
  const { registerUser, loginWithGoogle } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data.email, data.password, data.fullName);
      navigate('/dashboard', { replace: true });
    } catch (e) {
      // toast handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard', { replace: true });
    } catch (e) {
      // toast handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 surface-panel overflow-hidden">
        {/* Left: Summary Panel */}
        <div className="hidden lg:flex lg:col-span-5 bg-[#0f0f10] text-[#ededed] p-8 flex-col justify-between border-r border-white/[0.08]">
          <div className="space-y-5">
            <BrandMark name={t('nav.brandName')} subtitle={isBn ? 'অ্যাকাউন্ট নিবন্ধন' : 'Account setup'} inverted />

            <div className="space-y-3 pt-4">
              <h2 className="text-2xl font-medium tracking-[-0.02em] leading-snug text-[#ededed]">
                {isBn ? 'জাতীয় জরুরি নিরাপত্তা নেটওয়ার্কে যুক্ত হোন' : 'Set up your personal emergency network'}
              </h2>
              <p className="text-sm text-[#a1a1a6] leading-relaxed">
                {isBn
                  ? 'কয়েক সেকেন্ডে অ্যাকাউন্ট তৈরি করে আপনার এসওএস প্যানিক ট্রিগার, পরিচিতি তালিকা ও প্রমাণ সংরক্ষণাগার সক্রিয় করুন।'
                  : 'Create an account to link up to five emergency contacts, enable voice SOS alerts, and save timestamped evidence.'}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/[0.08] text-xs text-[#a1a1a6]">
            <div className="flex items-center gap-2.5">
              <FiCheckCircle className="w-4 h-4 text-[#4cc38a] dispatch-icon shrink-0" />
              <span>{isBn ? 'সর্বোচ্চ ৫ জন জরুরি পরিচিতি সংরক্ষণ' : 'Up to 5 priority emergency contacts'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <FiCheckCircle className="w-4 h-4 text-[#4cc38a] dispatch-icon shrink-0" />
              <span>{isBn ? 'সার্বক্ষণিক জিপিএস ব্রডকাস্ট সুবিধা' : 'Live hardware GPS dispatch'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <FiCheckCircle className="w-4 h-4 text-[#4cc38a] dispatch-icon shrink-0" />
              <span>{isBn ? 'এনক্রিপ্টেড ডিজিটাল এভিডেন্স লকার' : 'SHA-256 verifiable evidence locker'}</span>
            </div>
          </div>
        </div>

        {/* Right: Registration Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-center">
          <div className="space-y-1.5">
            <div className="lg:hidden mb-3">
              <BrandMark name={t('nav.brandName')} />
            </div>
            <h1 className="text-2xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed]">
              {t('auth.registerTitle')}
            </h1>
            <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
              {t('auth.registerSub')}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full btn-outline h-11 text-sm"
          >
            <FcGoogle className="text-base shrink-0" />
            <span>{t('auth.googleContinue')}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-zinc-900/[0.08] dark:border-white/[0.08] w-full"></div>
            <span className="absolute bg-[#ffffff] dark:bg-[#19191b] px-3 text-xs text-[#737373] dark:text-[#85858b]">
              {isBn ? 'অথবা তথ্য দিয়ে তৈরি করুন' : 'Or register with email'}
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="human-label">{t('auth.fullNameLabel')}</label>
              <div className="relative">
                <FiUser className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
                <input
                  type="text"
                  placeholder={t('auth.fullNamePlaceholder')}
                  {...register('fullName', { required: isBn ? 'নাম দেওয়া আবশ্যক' : 'Full name is required' })}
                  className={`human-input human-input-has-icon ${errors.fullName ? 'human-input-error' : ''}`}
                />
              </div>
              {errors.fullName && <p className="text-xs text-[#dc2626] dark:text-[#e5484d] mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="human-label">{t('auth.emailLabel')}</label>
              <div className="relative">
                <FiMail className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
                <input
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  {...register('email', { required: isBn ? 'সঠিক ইমেইল আবশ্যক' : 'Valid email is required' })}
                  className={`human-input human-input-has-icon ${errors.email ? 'human-input-error' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs text-[#dc2626] dark:text-[#e5484d] mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="human-label">{t('auth.passwordLabel')}</label>
              <div className="relative">
                <FiLock className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isBn ? 'কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড' : 'Minimum 6 characters'}
                  {...register('password', {
                    required: isBn ? 'পাসওয়ার্ড আবশ্যক' : 'Password is required',
                    minLength: { value: 6, message: isBn ? 'কমপক্ষে ৬ অক্ষর হতে হবে' : 'Minimum 6 characters' }
                  })}
                  className={`human-input human-input-has-icon pr-10 ${errors.password ? 'human-input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#737373] dark:text-[#85858b] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors cursor-pointer"
                  title={showPassword ? (isBn ? 'লুকান' : 'Hide password') : (isBn ? 'দেখুন' : 'Show password')}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4 dispatch-icon" /> : <FiEye className="w-4 h-4 dispatch-icon" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-[#dc2626] dark:text-[#e5484d] mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-solid h-11 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <FiActivity className="w-4 h-4 animate-spin dispatch-icon" /> {t('auth.creatingAccount')}
                </span>
              ) : (
                t('auth.registerBtn')
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#525252] dark:text-[#a1a1a6]">
            {t('auth.alreadyRegistered')}{' '}
            <Link to="/login" className="font-medium text-[#e11d48] dark:text-[#fb7185] hover:underline">
              {t('auth.signInHere')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
