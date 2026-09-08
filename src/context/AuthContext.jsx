import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { firebaseLogin, firebaseRegister, firebaseGoogleLogin, firebaseLogout, firebaseResetPassword } from '../firebase/authService';
import api from '../services/api';
import toast from 'react-hot-toast';
import { upsertRegisteredUser } from '../utils/adminDataRegistry';

export const ADMIN_EMAILS = [
  'ridwanulk08@gmail.com',
  'admin@safehaven.app',
  'admin@safehaven.org'
];

export const isUserAdmin = (email) => {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return ADMIN_EMAILS.includes(clean) || clean.startsWith('admin@');
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('safehaven_token') || null);

  // Instant non-blocking session listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Fast local user state initialization (instant UI render!)
        const role = isUserAdmin(fbUser.email) ? 'admin' : 'user';
        const cleanEmail = fbUser.email ? fbUser.email.toLowerCase().trim() : '';
        const fastUser = {
          uid: fbUser.uid,
          email: cleanEmail,
          fullName: fbUser.displayName || cleanEmail.split('@')[0],
          role,
          profileImage: fbUser.photoURL || '',
          status: 'active',
          createdAt: fbUser.metadata?.creationTime || new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        setUser(prev => prev || fastUser);
        await upsertRegisteredUser(fastUser);
        setLoading(false); // Unblock UI immediately!

        // Background server sync
        (async () => {
          try {
            const idToken = await fbUser.getIdToken();
            const res = await api.post('/auth/login', {
              email: cleanEmail,
              uid: fbUser.uid,
              idToken
            }, { timeout: 3000 });

            if (res.data?.data?.user) {
              const serverUser = { ...res.data.data.user, uid: fbUser.uid };
              setUser(serverUser);
              await upsertRegisteredUser(serverUser);
              if (res.data?.data?.token) {
                setToken(res.data.data.token);
                localStorage.setItem('safehaven_token', res.data.data.token);
              }
            }
          } catch (err) {
            console.warn('Backend auth sync notice:', err.message);
          }
        })();
      } else {
        setUser(null);
        localStorage.removeItem('safehaven_token');
        setLoading(false); // Unblock UI immediately!
      }
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
        role: isUserAdmin(email) ? 'admin' : 'user',
        profileImage: ''
      };

      setUser(newUser);
      upsertRegisteredUser(newUser);
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
          if (res.data?.data?.user) {
            setUser(res.data.data.user);
            upsertRegisteredUser(res.data.data.user);
          }
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
        role: isUserAdmin(email) ? 'admin' : 'user',
        profileImage: fbUser.photoURL || ''
      };

      // Instant session activation (0-lag navigation!)
      setUser(loggedUser);
      await upsertRegisteredUser(loggedUser);
      setToken('firebase_active_token');
      toast.success('Welcome back!');

      // Background Backend Sync (does not block user)
      (async () => {
        try {
          const idToken = await fbUser.getIdToken();
          const res = await api.post('/auth/login', { email: fbUser.email, uid: fbUser.uid, idToken });
          if (res.data?.data?.user) {
            const serverUser = { ...res.data.data.user, uid: fbUser.uid };
            setUser(serverUser);
            await upsertRegisteredUser(serverUser);
          }
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
        role: isUserAdmin(fbUser.email) ? 'admin' : 'user',
        profileImage: fbUser.photoURL || '',
        status: 'active',
        createdAt: fbUser.metadata?.creationTime || new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Instant session activation (0-lag navigation!)
      setUser(loggedUser);
      await upsertRegisteredUser(loggedUser);
      setToken('firebase_active_token');
      localStorage.setItem('safehaven_token', 'firebase_active_token');
      toast.success('Signed in with Google!');

      // Background Backend Sync (does not block user)
      (async () => {
        try {
          const idToken = await fbUser.getIdToken();
          const res = await api.post('/auth/login', { email: fbUser.email, uid: fbUser.uid, idToken });
          if (res.data?.data?.user) {
            const serverUser = { ...res.data.data.user, uid: fbUser.uid };
            setUser(serverUser);
            await upsertRegisteredUser(serverUser);
          }
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
        isAdmin: isUserAdmin(user?.email)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
