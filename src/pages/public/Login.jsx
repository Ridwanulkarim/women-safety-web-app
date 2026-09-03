import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiShield, FiLock, FiMail, FiEye, FiEyeOff, FiCheckCircle, FiActivity } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const Login = () => {
  const { loginUser, loginWithGoogle } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      // toast shown in AuthContext
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
      // toast shown in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#121215]">
        
        {/* Left Side: Modern Visual Security Banner (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-zinc-900 via-[#18181b] to-rose-950 p-8 flex-col justify-between relative overflow-hidden text-white">
          {/* Subtle Ambient Glow Effect */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> SafeHaven Security Network
            </div>
            <h3 className="text-2xl font-extrabold font-heading leading-tight tracking-tight">
              Instant Geolocation Distress Telemetry & Emergency Help
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Sign in to manage your 5 priority emergency contacts, monitor real-time SOS broadcasts, and access your encrypted evidence locker.
            </p>
          </div>

          <div className="relative z-10 space-y-3 pt-6 border-t border-zinc-800">
            <div className="flex items-center gap-2.5 text-xs text-zinc-300 font-medium">
              <FiCheckCircle className="text-emerald-400 text-sm flex-shrink-0" />
              <span>Response Latency: &lt; 3 Seconds</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-zinc-300 font-medium">
              <FiCheckCircle className="text-emerald-400 text-sm flex-shrink-0" />
              <span>AES-256 Encrypted Telemetry Logs</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-zinc-300 font-medium">
              <FiCheckCircle className="text-emerald-400 text-sm flex-shrink-0" />
              <span>National Dispatch 999 Integration</span>
            </div>
          </div>
        </div>

        {/* Right Side: Sleek Sign-In Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-center">
          
          <div className="text-center sm:text-left space-y-1.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-xl shadow-lg shadow-rose-600/30 mb-3 sm:mb-2 inline-flex lg:flex">
              <FiShield />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
              {t('auth.loginTitle')}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t('auth.loginSub')}
            </p>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-xs flex items-center justify-center gap-3 transition-all duration-200 shadow-xs min-h-[44px] active:scale-[0.99]"
          >
            <FcGoogle className="text-lg flex-shrink-0" /> {t('auth.googleContinue')}
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-zinc-200 dark:border-zinc-800 w-full"></div>
            <span className="absolute bg-white dark:bg-[#121215] px-3 text-[10px] text-zinc-400 uppercase tracking-widest font-mono font-bold">
              {t('auth.orEmail')}
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="human-label">{t('auth.emailLabel')}</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-zinc-400 text-sm" />
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
                <FiLock className="absolute left-3.5 top-3.5 text-zinc-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t('auth.passwordPlaceholder')}
                  {...register('password', { required: 'Password is required' })}
                  className={`human-input human-input-has-icon pr-10 ${errors.password ? 'human-input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-sm transition"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-danger py-3 text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-rose-600/25 active:scale-[0.99] transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <FiActivity className="animate-spin text-sm" /> {t('auth.authenticating')}
                </span>
              ) : (
                t('auth.signInBtn')
              )}
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
    </div>
  );
};

export default Login;
