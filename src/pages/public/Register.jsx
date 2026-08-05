import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiShield, FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { registerUser, loginWithGoogle } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data.email, data.password, data.fullName);
      navigate('/dashboard');
    } catch (e) {
      // toast in context
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (e) {
      // toast in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-pink-600/30">
            <FiShield />
          </div>
          <h2 className="text-2xl font-bold font-heading">Create Protection Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Join SafeHaven 24/7 Safety Network.</p>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-3 transition shadow-sm"
        >
          <FcGoogle className="text-lg" /> Sign up with Google
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
          <span className="absolute bg-slate-50 dark:bg-slate-950 px-3 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            Or fill registration details
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Jane Doe"
                {...register('fullName', { required: 'Full name is required' })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs focus:outline-none focus:border-pink-500"
              />
            </div>
            {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                placeholder="jane@example.com"
                {...register('email', { required: 'Valid email is required' })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs focus:outline-none focus:border-pink-500"
              />
            </div>
            {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                placeholder="Minimum 6 characters"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
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
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-pink-600 dark:text-pink-400 hover:underline">
            Sign In Here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
