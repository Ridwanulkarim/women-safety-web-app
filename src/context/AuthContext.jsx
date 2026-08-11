import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { firebaseLogin, firebaseRegister, firebaseGoogleLogin, firebaseLogout, firebaseResetPassword } from '../firebase/authService';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('safehaven_token') || null);

  // Sync user from backend or local token
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken();
          const res = await api.post('/auth/login', {
            email: fbUser.email,
            idToken
          });

          if (res.data?.data) {
            setUser(res.data.data.user);
            setToken(res.data.data.token);
            localStorage.setItem('safehaven_token', res.data.data.token);
          }
        } catch (err) {
          console.warn('Backend sync warning, fallback client session:', err.message);
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            fullName: fbUser.displayName || fbUser.email.split('@')[0],
            role: 'user',
            profileImage: fbUser.photoURL || '',
            status: 'active'
          });
        }
      } else {
        const storedToken = localStorage.getItem('safehaven_token');
        if (storedToken) {
          try {
            const res = await api.get('/auth/me');
            if (res.data?.data) {
              setUser(res.data.data);
            }
          } catch (e) {
            setUser(null);
            localStorage.removeItem('safehaven_token');
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const registerUser = async (email, password, fullName) => {
    setLoading(true);
    try {
      const fbUser = await firebaseRegister(email, password, fullName);
      const res = await api.post('/auth/register', {
        uid: fbUser.uid,
        email: fbUser.email,
        password,
        fullName: fullName || fbUser.displayName || email.split('@')[0]
      });

      const newUser = res.data?.data?.user || {
        uid: fbUser.uid,
        email,
        fullName: fullName || email.split('@')[0],
        role: 'user'
      };
      const newToken = res.data?.data?.token || 'mock_jwt_token';

      setUser(newUser);
      setToken(newToken);
      localStorage.setItem('safehaven_token', newToken);
      toast.success('Registration successful! Verification email sent.');
      return newUser;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const fbUser = await firebaseLogin(email, password);
      const idToken = await fbUser.getIdToken();
      const res = await api.post('/auth/login', { email, password, idToken });

      const loggedUser = res.data?.data?.user || {
        uid: fbUser.uid,
        email,
        fullName: fbUser.displayName || email.split('@')[0],
        role: 'user'
      };
      const newToken = res.data?.data?.token || 'mock_jwt_token';

      setUser(loggedUser);
      setToken(newToken);
      localStorage.setItem('safehaven_token', newToken);
      toast.success('Welcome back!');
      return loggedUser;
    } catch (error) {
      toast.error(error.message || 'Invalid email or password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const fbUser = await firebaseGoogleLogin();
      const idToken = await fbUser.getIdToken();
      const res = await api.post('/auth/login', { email: fbUser.email, idToken });

      const loggedUser = res.data?.data?.user || {
        uid: fbUser.uid,
        email: fbUser.email,
        fullName: fbUser.displayName || fbUser.email.split('@')[0],
        role: 'user'
      };
      const newToken = res.data?.data?.token || 'mock_jwt_token';

      setUser(loggedUser);
      setToken(newToken);
      localStorage.setItem('safehaven_token', newToken);
      toast.success('Signed in with Google successfully!');
      return loggedUser;
    } catch (error) {
      toast.error(error.message || 'Google login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      await firebaseLogout();
    } catch (e) {
      console.warn('Firebase logout notice:', e.message);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('safehaven_token');
    toast.success('Logged out safely.');
  };

  const resetPassword = async (email) => {
    try {
      await firebaseResetPassword(email);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email');
      throw error;
    }
  };

  const updateUserProfile = (updatedData) => {
    setUser(prev => (prev ? { ...prev, ...updatedData } : updatedData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        registerUser,
        loginUser,
        loginWithGoogle,
        logoutUser,
        resetPassword,
        updateUserProfile,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
