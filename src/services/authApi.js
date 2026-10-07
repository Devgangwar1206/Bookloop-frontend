// Authentication API Service
// Ready to switch to Spring Boot /api/v1/auth/ endpoints
import { CURRENT_USER } from '../data/mockData';
import { apiClient } from '../api/apiClient';

const AUTH_STORAGE_KEY = 'bookloop_active_user';
const USERS_REGISTRY_KEY = 'bookloop_users_registry';

function loadActiveUser() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load user from localStorage', e);
  }
  return { ...CURRENT_USER };
}

function persistActiveUser(user) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        // Also remember this user in the registry by email/phone
        const registry = JSON.parse(localStorage.getItem(USERS_REGISTRY_KEY) || '{}');
        const key = (user.email || user.phone || 'default').toLowerCase();
        registry[key] = user;
        localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(registry));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  } catch (e) {
    console.error('Failed to persist user in localStorage', e);
  }
}

let activeUser = loadActiveUser();

export const authApi = {
  async getCurrentUser() {
    return Promise.resolve(activeUser);
  },

  async login(emailOrPhone, password) {
    if (!emailOrPhone) throw new Error('Email or mobile number is required');
    if (!password) throw new Error('Password is required');

    // Check registry first to preserve previous changes (like avatar)
    let matchedProfile = null;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const registry = JSON.parse(localStorage.getItem(USERS_REGISTRY_KEY) || '{}');
        const key = emailOrPhone.toLowerCase();
        matchedProfile = registry[key];
      }
    } catch (e) {}

    const baseProfile = matchedProfile || CURRENT_USER;

    activeUser = {
      ...baseProfile,
      email: emailOrPhone.includes('@') ? emailOrPhone : (baseProfile.email || CURRENT_USER.email),
      phone: !emailOrPhone.includes('@') ? emailOrPhone : (baseProfile.phone || CURRENT_USER.phone),
    };
    persistActiveUser(activeUser);
    return Promise.resolve({ user: activeUser, message: 'Welcome back to BookLoop!' });
  },

  async register(userData) {
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error('Please fill all required registration fields');
    }

    activeUser = {
      ...CURRENT_USER,
      id: `u-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '+91 98765 00000',
      city: userData.city || 'Noida, UP',
      role: userData.role || 'user',
      memberSince: 'Just now',
    };
    persistActiveUser(activeUser);
    return Promise.resolve({ user: activeUser, message: 'Account created successfully!' });
  },

  async logout() {
    activeUser = null;
    persistActiveUser(null);
    return Promise.resolve({ success: true, message: 'Logged out successfully' });
  },

  async updateActiveUser(updates) {
    if (!activeUser) {
      activeUser = { ...CURRENT_USER, ...updates };
    } else {
      activeUser = { ...activeUser, ...updates };
    }
    persistActiveUser(activeUser);
    return Promise.resolve(activeUser);
  },

  async forgotPassword(emailOrPhone) {
    return Promise.resolve({ success: true, message: `Password reset link and OTP sent to ${emailOrPhone}` });
  },

  async verifyOtp(otp) {
    if (otp === '1234' || otp.length === 4) {
      return Promise.resolve({ success: true });
    }
    throw new Error('Invalid OTP. Please enter valid code (e.g. 1234)');
  }
};

export default authApi;
