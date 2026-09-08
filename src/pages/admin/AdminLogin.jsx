import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiShield, FiLock, FiMail, FiEye, FiEyeOff, FiActivity, FiAlertCircle } from 'react-icons/fi';
import { useAuth, isUserAdmin } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const { loginUser, user, isAdmin, logoutUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // If user is already logged in as admin, redirect to /admin
  React.useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    setAuthError('');
    try {
      const loggedIn = await loginUser(data.email, data.password);
      if (!isUserAdmin(loggedIn.email)) {
        setAuthError('Access Denied: This account does not possess administrator clearance.');
        toast.error('Unauthorized: Administrator clearance required.');
        await logoutUser();
        return;
      }
      toast.success('Administrator clearance verified. Welcome to Command Center.');
      navigate('/admin', { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08080c] text-zinc-100 p-4 font-sans relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-[#0e0e14]/95 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-6">
        
        {/* Header Badge */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center text-2xl font-bold shadow-xl shadow-rose-600/30">
            <FiShield />
          </div>
          <div className="space-y-1">
            <span className="mono-tag mono-tag-rose text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> RESTRICTED ACCESS
            </span>
            <h1 className="text-2xl font-extrabold font-heading text-white tracking-tight">
              Admin Command Login
            </h1>
            <p className="text-xs text-zinc-400">
              SafeHaven Security Network • Authorized Personnel Only
            </p>
          </div>
        </div>

        {authError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5 font-medium">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-3.5 text-zinc-500 text-sm" />
              <input
                type="email"
                placeholder="ridwanulk08@gmail.com"
                {...register('email', { required: 'Admin email is required' })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-rose-500 transition font-sans"
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Security Key / Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5 text-zinc-500 text-sm" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                {...register('password', { required: 'Password is required' })}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-rose-500 transition font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300 text-sm transition"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <p className="text-[11px] text-rose-500 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-danger py-3.5 text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-rose-600/30 active:scale-[0.99] transition mt-2 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <FiActivity className="animate-spin text-sm" /> VERIFYING CLEARANCE...
              </span>
            ) : (
              'AUTHENTICATE CLEARANCE'
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-zinc-800/80 text-center">
          <p className="text-[11px] text-zinc-500 font-mono">
            Unlawfully accessing emergency telecommunication systems is strictly audited.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
