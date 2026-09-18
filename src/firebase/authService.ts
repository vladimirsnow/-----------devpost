import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged as fbOnAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';
import { UserStats } from '../types';

export interface AuthResponse {
  success: boolean;
  user?: User | null;
  error?: string;
}

export const registerWithEmail = async (
  email: string,
  pass: string,
  username: string
): Promise<AuthResponse> => {
  if (!isFirebaseConfigured() || !auth) {
    // Local demo registration
    const demoUser = {
      uid: 'demo-user-' + Date.now(),
      email,
      displayName: username,
    } as unknown as User;
    localStorage.setItem('devquest_demo_user', JSON.stringify(demoUser));
    return { success: true, user: demoUser };
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: username });
    }
    return { success: true, user: cred.user };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
};

export const loginWithEmail = async (
  email: string,
  pass: string
): Promise<AuthResponse> => {
  if (!isFirebaseConfigured() || !auth) {
    const saved = localStorage.getItem('devquest_demo_user');
    let user: User;
    if (saved) {
      user = JSON.parse(saved);
    } else {
      user = {
        uid: 'demo-user-1',
        email,
        displayName: email.split('@')[0],
      } as unknown as User;
      localStorage.setItem('devquest_demo_user', JSON.stringify(user));
    }
    return { success: true, user };
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return { success: true, user: cred.user };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
};

export const logoutUser = async (): Promise<void> => {
  if (!isFirebaseConfigured() || !auth) {
    localStorage.removeItem('devquest_demo_user');
    return;
  }
  await fbSignOut(auth);
};

export const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
  if (!isFirebaseConfigured() || !auth) {
    return { success: true };
  }
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
};

export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
): (() => void) => {
  if (!isFirebaseConfigured() || !auth) {
    const saved = localStorage.getItem('devquest_demo_user');
    if (saved) {
      callback(JSON.parse(saved));
    } else {
      callback(null);
    }
    return () => {};
  }

  return fbOnAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
