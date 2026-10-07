import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  verifyOtp,
  resetPassword
} from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==============================
  // LOAD CURRENT USER
  // ==============================

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      return null;
    }

    const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const cleanBase = rawUrl.replace(/\/+$/, '').replace(/\/api\/v1$/, '');

    const response = await fetch(
      `${cleanBase}/api/v1/auth/me`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Not authenticated');
    }

    const currentUser = await response.json();

    if (currentUser?.id) {
      localStorage.setItem('userId', String(currentUser.id));
      localStorage.setItem('user', JSON.stringify(currentUser));
    }

    setUser(currentUser);

    return currentUser;
  }, []);

  // ==============================
  // CHECK LOGIN ON APP START
  // ==============================

  useEffect(() => {
    let isMounted = true;

    loadUser()
      .catch(() => {
        localStorage.removeItem('token');

        if (isMounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [loadUser]);

  // ==============================
  // NORMAL LOGIN
  // ==============================

  const login = async (email, password) => {
    const res = await loginUser({
      email,
      password
    });

    if (res?.token) {
      localStorage.setItem('token', res.token);
    }

    if (res?.user) {
      localStorage.setItem('userId', String(res.user.id));
      localStorage.setItem('user', JSON.stringify(res.user));
    }

    setUser(res.user);

    return res;
  };

  // ==============================
  // REGISTER
  // ==============================

  const register = async (userData) => {
    const res = await registerUser(userData);

    if (res?.id) {
      localStorage.setItem('userId', String(res.id));
      localStorage.setItem('user', JSON.stringify(res));
    }

    setUser(res);

    return res;
  };

  // ==============================
  // LOGOUT
  // ==============================

  const logout = async () => {
    logoutUser();
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    setUser(null);
  };

  // ==============================
  // FORGOT PASSWORD
  // ==============================

  const forgotPasswordRequest = async (email) => {
    return forgotPassword(email);
  };

  // ==============================
  // VERIFY OTP
  // ==============================

  const verifyOtpRequest = async (data) => {
    return verifyOtp(data);
  };

  // ==============================
  // RESET PASSWORD
  // ==============================

  const resetPasswordRequest = async (data) => {
    return resetPassword(data);
  };

  // ==============================
  // UPDATE PROFILE (LOCAL & STATE)
  // ==============================

  const updateProfile = useCallback((updatedUserData) => {
    setUser((prev) => {
      const updated = {
        ...(prev || {}),
        ...updatedUserData
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updated));
        if (updated.id) {
          localStorage.setItem('userId', String(updated.id));
        }
      }
      return updated;
    });
  }, []);

  // ==============================
  // CONTEXT VALUE
  // ==============================

  const value = {
    user,
    loading,

    isAuthenticated: !!user,

    isBusiness:
      user?.role === 'SELLER' ||
      user?.role === 'BUSINESS',

    isAdmin:
      user?.role === 'ADMIN',

    login,
    register,
    logout,

    loadUser,
    updateProfile,

    forgotPassword: forgotPasswordRequest,
    verifyOtp: verifyOtpRequest,
    resetPassword: resetPasswordRequest
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}