import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { FiLock, FiArrowLeft, FiShield, FiCheckCircle } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Missing reset token in URL.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { token, newPassword });
      toast.success(res.data?.message || 'Password reset successfully!');
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl space-y-6 text-center shadow-2xl">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center text-2xl">
          <FiShield />
        </div>

        {submitted ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl">
              <FiCheckCircle />
            </div>
            <h2 className="text-2xl font-bold font-heading text-emerald-400">Password Reset Complete!</h2>
            <p className="text-xs text-slate-400">All active sessions have been revoked. You may now log in with your new password.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Proceed to Login
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-heading">Set New Password</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create a strong new password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold mb-1">New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Confirm New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-600/30 transition"
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
              </button>
            </form>

            <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline">
              <FiArrowLeft /> Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
