import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './config';

export const syncUserDocument = async (user, fullName) => {
  if (!user || !user.uid) return;
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const email = user.email ? user.email.toLowerCase().trim() : '';
    const isAdmin = email === 'ridwanulk08@gmail.com';

    await setDoc(
      userDocRef,
      {
        uid: user.uid,
        email: user.email,
        fullName: fullName || user.displayName || email.split('@')[0],
        phone: user.phoneNumber || '',
        role: isAdmin ? 'admin' : 'user',
        status: 'active',
        profileImage: user.photoURL || '',
        lastLogin: new Date().toISOString(),
        createdAt: user.metadata?.creationTime || new Date().toISOString()
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore user auto-sync notice:', err.message);
  }
};

export const firebaseRegister = async (email, password, fullName) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (fullName && res.user) {
      await updateProfile(res.user, { displayName: fullName });
    }
    // Automatically persist to Firestore cloud database
    if (res.user) {
      await syncUserDocument(res.user, fullName);
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
    if (res.user) {
      await syncUserDocument(res.user);
    }
    return res.user;
  } catch (error) {
    throw error;
  }
};

export const firebaseGoogleLogin = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    if (res.user) {
      await syncUserDocument(res.user);
    }
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
