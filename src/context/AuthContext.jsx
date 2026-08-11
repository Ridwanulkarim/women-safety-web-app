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
        // Fast local user state initialization
        const fastUser = {
          uid: fbUser.uid,
          email: fbUser.email,
          fullName: fbUser.displayName || fbUser.email.split('@')[0],
          role: 'user',
          profileImage: fbUser.photoURL || '',
          status: 'active'
        };
        setUser(prev => prev || fastUser);

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
          console.warn('Backend sync notice, using client session:', err.message);
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
      const newUser = {
        uid: fbUser.uid,
        email,
        fullName: fullName || email.split('@')[0],
        role: 'user',
        profileImage: ''
      };

      setUser(newUser);
      setToken('firebase_active_token');
      localStorage.setItem('safehaven_token', 'firebase_active_token');
      toast.success('Registration successful!');

      // Background Backend Sync
      (async () => {
        try {
          const res = await api.post('/auth/register', {
            uid: fbUser.uid,
            email: fbUser.email,
            password,
            fullName: fullName || fbUser.displayName || email.split('@')[0]
          });
          if (res.data?.data?.user) setUser(res.data.data.user);
          if (res.data?.data?.token) {
            setToken(res.data.data.token);
            localStorage.setItem('safehaven_token', res.data.data.token);
          }
        } catch (err) {
          console.warn('Background register sync notice:', err.message);
        }
      })();

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

      const loggedUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        fullName: fbUser.displayName || email.split('@')[0],
        role: 'user',
        profileImage: fbUser.photoURL || ''
      };

      // Instant session activation (0-lag navigation!)
      setUser(loggedUser);
      setToken('firebase_active_token');
      localStorage.setItem('safehaven_token', 'firebase_active_token');
      toast.success('Welcome back!');

      // Background Backend Sync (does not block user)
      (async () => {
        try {
          const idToken = await fbUser.getIdToken();
          const res = await api.post('/auth/login', { email, password, idToken });
          if (res.data?.data?.user) setUser(res.data.data.user);
          if (res.data?.data?.token) {
            setToken(res.data.data.token);
            localStorage.setItem('safehaven_token', res.data.data.token);
          }
        } catch (err) {
          console.warn('Background login sync notice:', err.message);
        }
      })();

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
      const loggedUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        fullName: fbUser.displayName || fbUser.email.split('@')[0],
        role: 'user',
        profileImage: fbUser.photoURL || ''
      };

      // Instant session activation (0-lag navigation!)
      setUser(loggedUser);
      setToken('firebase_active_token');
      localStorage.setItem('safehaven_token', 'firebase_active_token');
      toast.success('Signed in with Google!');

      // Background Backend Sync (does not block user)
      (async () => {
        try {
          const idToken = await fbUser.getIdToken();
          const res = await api.post('/auth/login', { email: fbUser.email, idToken });
          if (res.data?.data?.user) setUser(res.data.data.user);
          if (res.data?.data?.token) {
            setToken(res.data.data.token);
            localStorage.setItem('safehaven_token', res.data.data.token);
          }
        } catch (err) {
          console.warn('Background Google auth sync notice:', err.message);
        }
      })();

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
