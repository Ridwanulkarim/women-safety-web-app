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
      toast.error('Missing reset token in URL');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { token, newPassword });
      toast.success(res.data?.message || 'Password updated');
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full surface-panel p-8 space-y-6">
        {submitted ? (
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-[#16a34a] dark:text-[#4cc38a] flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 dispatch-icon" />
            </div>
            <h1 className="text-2xl font-medium text-[#171717] dark:text-[#ededed]">Password updated</h1>
            <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
              All active sessions have been revoked. You can now sign in with your new password.
            </p>
            <button onClick={() => navigate('/login')} className="w-full btn-solid h-11 text-sm">
              Continue to sign in
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#525252] dark:text-[#a1a1a6] flex items-center justify-center">
                <FiShield className="w-5 h-5 dispatch-icon" />
              </div>
              <h1 className="text-2xl font-medium text-[#171717] dark:text-[#ededed]">Set new password</h1>
              <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
                Choose a strong password for your SafeHaven account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="human-label">New password</label>
                <div className="relative">
                  <FiLock className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="human-input human-input-has-icon"
                  />
                </div>
              </div>

              <div>
                <label className="human-label">Confirm password</label>
                <div className="relative">
                  <FiLock className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="human-input human-input-has-icon"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full btn-solid h-11 text-sm">
                {loading ? 'Updating password' : 'Update password'}
              </button>
            </form>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-medium text-[#525252] dark:text-[#a1a1a6] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors"
            >
              <FiArrowLeft className="w-3.5 h-3.5 dispatch-icon" /> Back to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
