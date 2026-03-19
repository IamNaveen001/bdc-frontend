import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../services/firebase';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

const normalizeAuthError = (err) => {
  if (err?.response?.status === 401) {
    return new Error('Login failed because the backend could not verify your Firebase token. Make sure the frontend API URL and backend Firebase Admin credentials belong to the same project.');
  }

  return err;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Sync verified user with backend
  const syncProfile = async (firebaseUser) => {
    const token = await firebaseUser.getIdToken();
    setAuthToken(token);

    try {
      const response = await api.post('/api/auth/ensure', {
        name: firebaseUser.displayName || ''
      });

      setRole(response.data.role);
      return response.data.role;
    } catch (err) {
      setAuthToken(null);
      throw normalizeAuthError(err);
    }
  };

  // 🔐 Auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // 🚫 Block unverified users
          if (!firebaseUser.emailVerified) {
            await signOut(auth);
            setUser(null);
            setRole(null);
            setAuthToken(null);
            return;
          }

          setUser(firebaseUser);
          await syncProfile(firebaseUser);
        } else {
          setUser(null);
          setRole(null);
          setAuthToken(null);
        }
      } catch (err) {
        console.error(err);
        setUser(null);
        setRole(null);
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // ✅ SIGNUP (with email verification)
  const signup = async (name, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(result.user, { displayName: name });
    await sendEmailVerification(result.user);

    // Logout until email is verified
    await signOut(auth);

    return result.user;
  };

  // ✅ LOGIN (only if verified)
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);

    if (!result.user.emailVerified) {
      await signOut(auth);
      throw new Error('Please verify your email before logging in.');
    }

    const resolvedRole = await syncProfile(result.user);
    setUser(result.user);
    return { user: result.user, role: resolvedRole };
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);

    const resolvedRole = await syncProfile(result.user);
    setUser(result.user);
    return { user: result.user, role: resolvedRole };
  };

  // ✅ RESET PASSWORD
  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  // ✅ LOGOUT
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
    setAuthToken(null);
  };

  // ✅ SINGLE CONTEXT VALUE
  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      signup,
      login,
      loginWithGoogle,
      logout,
      resetPassword
    }),
    [user, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
