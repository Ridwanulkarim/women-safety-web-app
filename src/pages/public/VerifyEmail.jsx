import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import api from '../../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
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
        setMessage(res.data?.message || 'Email verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed or token expired.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-900 text-white">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl text-center space-y-6">
        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 mx-auto bg-pink-500/20 text-pink-500 rounded-full flex items-center justify-center text-3xl animate-spin">
              <FiLoader />
            </div>
            <h2 className="text-2xl font-bold font-heading">Verifying Your Email</h2>
            <p className="text-sm text-slate-400">Please wait while we validate your security verification token...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl">
              <FiCheckCircle />
            </div>
            <h2 className="text-2xl font-bold font-heading text-emerald-400">Email Verified!</h2>
            <p className="text-sm text-slate-300">{message}</p>
            <Link
              to="/login"
              className="inline-block w-full py-3 bg-pink-600 hover:bg-pink-700 rounded-xl font-semibold transition"
            >
              Proceed to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center text-3xl">
              <FiXCircle />
            </div>
            <h2 className="text-2xl font-bold font-heading text-rose-500">Verification Failed</h2>
            <p className="text-sm text-slate-400">{message}</p>
            <Link
              to="/login"
              className="inline-block w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-semibold transition text-slate-200"
            >
              Return to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
