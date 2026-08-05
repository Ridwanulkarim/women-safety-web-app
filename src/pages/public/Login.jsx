import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiShield, FiLock, FiMail } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { loginUser, loginWithGoogle } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-pink-600/30">
            <FiShield />
          </div>
          <h2 className="text-2xl font-bold font-heading">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Access your personal safety portal.</p>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-3 transition shadow-sm"
        >
          <FcGoogle className="text-lg" /> Continue with Google
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
          <span className="absolute bg-slate-50 dark:bg-slate-950 px-3 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            Or sign in with email
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                placeholder="name@example.com"
                {...register('email', { required: 'Email is required' })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs focus:outline-none focus:border-pink-500"
              />
            </div>
            {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-pink-600 dark:text-pink-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs focus:outline-none focus:border-pink-500"
              />
            </div>
            {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-600/30 transition hover:scale-[1.02]"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-pink-600 dark:text-pink-400 hover:underline">
            Register for Free
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
