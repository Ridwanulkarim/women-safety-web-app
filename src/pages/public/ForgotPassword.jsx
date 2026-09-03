import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await resetPassword(email);
    } catch (err) {}
    setLoading(false);
  };

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card-xl p-8 rounded-3xl space-y-6 text-center shadow-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#121215]">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-2xl shadow-md">
          <FiShield />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-2xl font-extrabold font-heading text-zinc-900 dark:text-white">Reset Password</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Enter your registered email address to receive a secure password recovery link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="human-label">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-3.5 text-zinc-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="human-input human-input-has-icon"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-danger py-3.5 text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-rose-600/25"
          >
            {loading ? 'Sending Request...' : 'Send Recovery Email'}
          </button>
        </form>

        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline">
          <FiArrowLeft /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
