import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import api from '../../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token in URL.');
      return;
    }

    const verify = async () => {
      try {
        const res = await api.post('/auth/verify-email', { token });
        setStatus('success');
        setMessage(res.data?.message || 'Email verified.');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed or token expired.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafafa] dark:bg-[#141415] text-[#171717] dark:text-[#ededed]">
      <div className="max-w-md w-full surface-panel p-8 text-center space-y-5">
        {status === 'verifying' && (
          <>
            <div className="w-10 h-10 mx-auto rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#525252] dark:text-[#a1a1a6] flex items-center justify-center">
              <FiLoader className="w-5 h-5 dispatch-icon animate-spin" />
            </div>
            <h1 className="text-xl font-medium">Verifying your email</h1>
            <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
              Validating your security token
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-10 h-10 mx-auto rounded-lg bg-emerald-500/10 text-[#16a34a] dark:text-[#4cc38a] flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 dispatch-icon" />
            </div>
            <h1 className="text-xl font-medium">Email verified</h1>
            <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">{message}</p>
            <Link to="/login" className="btn-solid w-full h-11 text-sm">
              Continue to sign in
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-10 h-10 mx-auto rounded-lg bg-[#dc2626]/10 text-[#dc2626] dark:text-[#e5484d] flex items-center justify-center">
              <FiXCircle className="w-5 h-5 dispatch-icon" />
            </div>
            <h1 className="text-xl font-medium">Verification failed</h1>
            <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">{message}</p>
            <Link to="/login" className="btn-outline w-full h-11 text-sm">
              Return to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
