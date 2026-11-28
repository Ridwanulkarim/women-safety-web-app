import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

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
      <div className="max-w-md w-full surface-panel p-8 space-y-6">
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-lg bg-[#e11d48]/10 text-[#e11d48] flex items-center justify-center">
            <FiShield className="w-5 h-5 dispatch-icon" />
          </div>
          <h1 className="text-2xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed]">
            {t('auth.resetTitle')}
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
            {t('auth.resetSub')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="human-label">{t('auth.emailLabel')}</label>
            <div className="relative">
              <FiMail className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
              <input
                type="email"
                required
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="human-input human-input-has-icon font-mono"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-solid h-11 text-sm">
            {loading ? t('auth.sending') : t('auth.sendResetLink')}
          </button>
        </form>

        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#525252] dark:text-[#a1a1a6] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors"
        >
          <FiArrowLeft className="w-3.5 h-3.5 dispatch-icon" /> {isBn ? 'লগইনে ফিরে যান' : 'Back to sign in'}
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
