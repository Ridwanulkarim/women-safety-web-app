import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from './config';

export const firebaseRegister = async (email, password, fullName) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (fullName && res.user) {
      await updateProfile(res.user, { displayName: fullName });
    }
    // Send email verification
    if (res.user) {
      try {
        await sendEmailVerification(res.user);
      } catch (e) {
        console.warn('Verification email send attempt:', e.message);
      }
    }
    return res.user;
  } catch (error) {
    throw error;
  }
};

export const firebaseLogin = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  } catch (error) {
    throw error;
  }
};

export const firebaseGoogleLogin = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    return res.user;
  } catch (error) {
    throw error;
  }
};

export const firebaseLogout = async () => {
  return await signOut(auth);
};

export const firebaseResetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};
