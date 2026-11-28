import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiLock, FiMail, FiEye, FiEyeOff, FiActivity, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth, isUserAdmin, formatAuthError } from '../../context/AuthContext';
import BrandMark from '../../components/common/BrandMark';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const { loginUser, loginWithGoogle, user, isAdmin, logoutUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const navigate = useNavigate();

  React.useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setAuthError('');
    try {
      const loggedIn = await loginWithGoogle();
      if (!isUserAdmin(loggedIn.email)) {
        setAuthError(`Access denied: Account (${loggedIn.email}) does not hold administrator clearance.`);
        toast.error('Administrator clearance required');
        await logoutUser();
        return;
      }
      toast.success('Administrator access verified');
      navigate('/admin', { replace: true });
    } catch (err) {
      setAuthError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setAuthError('');
    try {
      const loggedIn = await loginUser(data.email, data.password);
      if (!isUserAdmin(loggedIn.email)) {
        setAuthError('Access denied: This account does not hold administrator clearance.');
        toast.error('Administrator clearance required');
        await logoutUser();
        return;
      }
      toast.success('Administrator access verified');
      navigate('/admin', { replace: true });
    } catch (err) {
      setAuthError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f8ff] dark:bg-[#141415] text-[#171717] dark:text-[#ededed] p-4">
      <div className="max-w-md w-full surface-panel p-8 space-y-6">
        <div className="space-y-2">
          <BrandMark name="SafeHaven" subtitle="Restricted dispatch access" />
          <div className="pt-2 space-y-1">
            <h1 className="text-2xl font-medium tracking-[-0.02em]">
              Administrator sign in
            </h1>
            <p className="text-xs text-[#525252] dark:text-[#a1a1a6]">
              Authorized emergency dispatch personnel only
            </p>
          </div>
        </div>

        {authError && (
          <div className="p-3.5 rounded-lg bg-[#dc2626]/10 border border-[#dc2626]/25 text-[#dc2626] dark:text-[#e5484d] text-xs flex items-center gap-2.5">
            <FiAlertCircle className="w-4 h-4 shrink-0 dispatch-icon" />
            <span>{authError}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full btn-outline h-11 text-sm"
        >
          <FcGoogle className="text-base shrink-0" /> Continue with Google
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-zinc-900/[0.08] dark:border-white/[0.08] w-full"></div>
          <span className="absolute bg-[#ffffff] dark:bg-[#19191b] px-3 text-xs text-[#737373] dark:text-[#85858b]">
            Or credentials
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="human-label">Administrator email</label>
            <div className="relative">
              <FiMail className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
              <input
                type="email"
                placeholder="ridwanulk08@gmail.com"
                {...register('email', { required: 'Admin email is required' })}
                className="human-input human-input-has-icon"
              />
            </div>
            {errors.email && <p className="text-xs text-[#dc2626] dark:text-[#e5484d] mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="human-label mb-0">Password</label>
              <Link to="/forgot-password" className="text-xs text-[#e11d48] dark:text-[#fb7185] hover:underline">
                Forgot password
              </Link>
            </div>
            <div className="relative">
              <FiLock className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                {...register('password', { required: 'Password is required' })}
                className="human-input human-input-has-icon pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#737373] dark:text-[#85858b] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors cursor-pointer"
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
                <FiActivity className="w-4 h-4 animate-spin dispatch-icon" /> Verifying clearance
              </span>
            ) : (
              'Sign in to command center'
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-zinc-900/[0.08] dark:border-white/[0.08] text-center">
          <p className="text-xs text-[#737373] dark:text-[#85858b]">
            All administrative access is recorded in the security audit log.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
