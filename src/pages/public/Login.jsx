import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiLock, FiMail, FiEye, FiEyeOff, FiCheckCircle, FiActivity, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import BrandMark from '../../components/common/BrandMark';

const Login = () => {
  const { loginUser, loginWithGoogle } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const { t, language } = useLanguage();
  const isBn = language === 'bn';

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data) => {
    setLoading(true);
    setAuthError('');
    try {
      await loginUser(data.email, data.password);
      navigate(from, { replace: true });
    } catch (e) {
      setAuthError(e.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setAuthError('');
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (e) {
      setAuthError(e.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 surface-panel overflow-hidden">
        {/* Left: Calm Dispatch Summary Panel */}
        <div className="hidden lg:flex lg:col-span-5 bg-[#0f0f10] text-[#ededed] p-8 flex-col justify-between border-r border-white/[0.08]">
          <div className="space-y-5">
            <BrandMark name={t('nav.brandName')} subtitle={isBn ? 'নিরাপত্তা নেটওয়ার্ক' : 'Emergency network'} inverted />

            <div className="space-y-3 pt-4">
              <h2 className="text-2xl font-medium tracking-[-0.02em] leading-snug text-[#ededed]">
                {isBn
                  ? 'তাৎক্ষণিক জিপিএস বিপদ সংকেত ও জরুরি ডিসপ্যাচ'
                  : 'Real-time GPS distress broadcast and guardian dispatch'}
              </h2>
              <p className="text-sm text-[#a1a1a6] leading-relaxed">
                {isBn
                  ? 'আপনার ৫ জন জরুরি পরিচিতি পরিচালনা করতে, এসওএস রেকর্ড দেখতে এবং প্রমাণ সংরক্ষণাগারে প্রবেশ করতে সাইন ইন করুন।'
                  : 'Sign in to manage your five emergency contacts, monitor SOS broadcasts, and export local evidence.'}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/[0.08] text-xs text-[#a1a1a6]">
            <div className="flex items-center gap-2.5">
              <FiCheckCircle className="w-4 h-4 text-[#4cc38a] dispatch-icon shrink-0" />
              <span>{isBn ? 'প্রতিক্রিয়ার সময় < ৩ সেকেন্ড' : 'Sub-3 second dispatch relay'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <FiCheckCircle className="w-4 h-4 text-[#4cc38a] dispatch-icon shrink-0" />
              <span>{isBn ? 'SHA-256 প্রমাণ সংরক্ষণাগার' : 'SHA-256 chain-of-custody locker'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <FiCheckCircle className="w-4 h-4 text-[#4cc38a] dispatch-icon shrink-0" />
              <span>{isBn ? 'জাতীয় জরুরি সেবা ৯৯৯ সংযোগ' : 'Direct Bangladesh 999 speed dial'}</span>
            </div>
          </div>
        </div>

        {/* Right: Sign-In Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-center">
          <div className="space-y-1.5">
            <div className="lg:hidden mb-3">
              <BrandMark name={t('nav.brandName')} />
            </div>
            <h1 className="text-2xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed]">
              {t('auth.loginTitle')}
            </h1>
            <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
              {t('auth.loginSub')}
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
              {t('auth.orEmail')}
            </span>
          </div>

          {authError && (
            <div className="p-3.5 rounded-lg bg-[#dc2626]/10 border border-[#dc2626]/25 text-[#dc2626] dark:text-[#e5484d] text-xs flex items-start gap-2.5">
              <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0 dispatch-icon" />
              <div className="space-y-1">
                <p>{authError}</p>
                {authError.includes('Google') && (
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="font-medium underline cursor-pointer text-xs"
                  >
                    Sign in with Google instead
                  </button>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="human-label">{t('auth.emailLabel')}</label>
              <div className="relative">
                <FiMail className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
                <input
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  {...register('email', { required: 'Email address is required' })}
                  className={`human-input human-input-has-icon ${errors.email ? 'human-input-error' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs text-[#dc2626] dark:text-[#e5484d] mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="human-label mb-0">{t('auth.passwordLabel')}</label>
                <Link to="/forgot-password" className="text-xs font-medium text-[#e11d48] dark:text-[#fb7185] hover:underline">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <FiLock className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.passwordPlaceholder')}
                  {...register('password', { required: 'Password is required' })}
                  className={`human-input human-input-has-icon pr-10 ${errors.password ? 'human-input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#737373] dark:text-[#85858b] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
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
                  <FiActivity className="w-4 h-4 animate-spin dispatch-icon" /> {t('auth.authenticating')}
                </span>
              ) : (
                t('auth.signInBtn')
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#525252] dark:text-[#a1a1a6]">
            {t('auth.dontHaveAccount')}{' '}
            <Link to="/register" className="font-medium text-[#e11d48] dark:text-[#fb7185] hover:underline">
              {t('auth.registerFree')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
