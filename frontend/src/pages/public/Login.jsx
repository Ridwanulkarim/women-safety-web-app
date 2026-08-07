import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiShield, FiLock, FiMail } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const Login = () => {
  const { loginUser, loginWithGoogle } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await loginUser(data.email, data.password);
      navigate(from, { replace: true });
    } catch (e) {
      // toast shown in context
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (e) {
      // toast shown in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full product-card p-8 space-y-6 shadow-lg">
        
        <div className="text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-xl bg-rose-600 flex items-center justify-center text-white text-xl shadow-md">
            <FiShield />
          </div>
          <h2 className="text-2xl font-extrabold font-heading text-zinc-900 dark:text-white">{t('auth.loginTitle')}</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('auth.loginSub')}</p>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-semibold text-xs flex items-center justify-center gap-3 transition shadow-xs"
        >
          <FcGoogle className="text-base" /> {t('auth.googleContinue')}
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-zinc-200 dark:border-zinc-800 w-full"></div>
          <span className="absolute bg-white dark:bg-[#121215] px-3 text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
            {t('auth.orEmail')}
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="human-label">{t('auth.emailLabel')}</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-3 text-zinc-400" />
              <input
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                {...register('email', { required: 'Email address is required' })}
                className={`human-input human-input-has-icon ${errors.email ? 'human-input-error' : ''}`}
              />
            </div>
            {errors.email && <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="human-label mb-0">{t('auth.passwordLabel')}</label>
              <Link to="/forgot-password" className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline">
                {t('auth.forgotPassword')}
              </Link>
            </div>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3 text-zinc-400" />
              <input
                type="password"
                placeholder={t('auth.passwordPlaceholder')}
                {...register('password', { required: 'Password is required' })}
                className={`human-input human-input-has-icon ${errors.password ? 'human-input-error' : ''}`}
              />
            </div>
            {errors.password && <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-danger py-3 font-mono font-bold uppercase"
          >
            {loading ? t('auth.authenticating') : t('auth.signInBtn')}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          {t('auth.dontHaveAccount')}{' '}
          <Link to="/register" className="font-bold text-rose-600 dark:text-rose-400 hover:underline">
            {t('auth.registerFree')}
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
