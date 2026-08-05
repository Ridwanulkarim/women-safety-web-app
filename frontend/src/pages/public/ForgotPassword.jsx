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
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl space-y-6 text-center shadow-2xl">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center text-2xl">
          <FiShield />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-heading">Reset Password</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your registered email address to receive a secure password recovery link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold mb-1">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-600/30 transition"
          >
            {loading ? 'Sending Request...' : 'Send Recovery Email'}
          </button>
        </form>

        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline">
          <FiArrowLeft /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
