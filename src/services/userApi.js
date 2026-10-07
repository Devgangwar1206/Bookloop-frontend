// User Profile & Settings API Service

import { apiClient } from '../api/apiClient';
export const userApi = {

  // ================================
  // GET CURRENT USER PROFILE
  // ================================
  async getProfile() {

    return apiClient('/users/me');
  },

  // Alias used by other parts of the app
  async getUserProfile() {

    return apiClient('/users/me');
  },

  // ================================
  // UPDATE CURRENT USER PROFILE
  // ================================
  async updateProfile(updates) {

    return apiClient('/users/me', {
      method: 'PUT',
      body: JSON.stringify({
        name: updates.name,
        phone: updates.phone,
        city: updates.city,
        location: updates.location,
        pincode: updates.pincode,
        bio: updates.bio,
        avatar: updates.avatar
      })
    });
  },

  // ================================
  // UPDATE PROFILE PHOTO
  // ================================
  async updateAvatar(avatarDataUrl) {

    return apiClient('/users/me', {
      method: 'PUT',
      body: JSON.stringify({
        avatar: avatarDataUrl
      })
    });
  },

  // ================================
  // GET SETTINGS
  // ================================
  async getSettings() {

    /*
     * Abhi backend me GET /users/me/settings
     * endpoint available nahi hai.
     *
     * Isliye yahan fake profile data use nahi kar rahe.
     * Settings ke liye backend GET endpoint baad me
     * add kiya ja sakta hai.
     */
    return {
      notifications: {
        chatMessages: true,
        priceOffers: true,
        exchangeAlerts: true,
        orderUpdates: true,
        recommendations: false,
        emailDigest: true
      },

      privacy: {
        showPhoneNumber: false,
        showOnlineStatus: true,
        allowDirectChat: true,
        shareApproximateLocationOnly: true
      },

      security: {
        twoFactorAuth: false,
        loginAlerts: true
      },

      chat: {
        readReceipts: true,
        soundAlerts: true,
        autoSuggestQuickReplies: true
      }
    };
  },

  // ================================
  // UPDATE SETTINGS
  // ================================
  async updateSettings(category, key, value) {

    /*
     * Current backend UpdateSettingsRequest me
     * 3 fields available hain:
     *
     * emailNotifications
     * offerNotifications
     * chatNotifications
     *
     * Isliye unhi ko backend se update karenge.
     */

    if (
      category === 'notifications' &&
      (
        key === 'emailDigest' ||
        key === 'priceOffers' ||
        key === 'chatMessages'
      )
    ) {

      const currentSettings = await this.getProfile();

      const emailNotifications =
        key === 'emailDigest'
          ? value
          : currentSettings.emailNotifications ?? true;

      const offerNotifications =
        key === 'priceOffers'
          ? value
          : currentSettings.offerNotifications ?? true;

      const chatNotifications =
        key === 'chatMessages'
          ? value
          : currentSettings.chatNotifications ?? true;

      return apiClient('/users/me/settings', {
        method: 'PUT',
        body: JSON.stringify({
          emailNotifications,
          offerNotifications,
          chatNotifications
        })
      });
    }

    return this.getSettings();
  }
};

export default userApi;