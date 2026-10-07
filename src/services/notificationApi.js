// Notifications API Service
// BookLoop - Persistent Notification Store
import { INITIAL_NOTIFICATIONS } from '../data/mockData';

const NOTIFICATIONS_STORAGE_KEY = 'bookloop_notifications';

function loadStoredNotifications() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    }
  } catch (e) {
    console.error('Failed to load notifications from storage:', e);
  }
  return [...INITIAL_NOTIFICATIONS];
}

function persistNotifications(list) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event('bookloop_notifications_updated'));
    }
  } catch (e) {
    console.warn('Failed to persist notifications:', e);
  }
}

let notificationsStore = loadStoredNotifications();

export const notificationApi = {
  async getNotifications() {
    notificationsStore = loadStoredNotifications();
    return Promise.resolve([...notificationsStore]);
  },

  async addNotification(item) {
    notificationsStore = loadStoredNotifications();
    // Prevent duplicate notification by id
    const exists = notificationsStore.some(n => String(n.id) === String(item.id));
    if (exists) {
      return Promise.resolve([...notificationsStore]);
    }
    const newNotif = {
      id: item.id || `notif-${Date.now()}`,
      type: item.type || 'message',
      title: item.title || 'New message',
      description: item.description || '',
      time: item.time || 'Just now',
      read: false,
      link: item.link || '/chat',
      avatar: item.avatar || '',
      createdAt: Date.now()
    };
    notificationsStore.unshift(newNotif);
    persistNotifications(notificationsStore);
    return Promise.resolve([...notificationsStore]);
  },

  async markAsRead(id) {
    notificationsStore = loadStoredNotifications();
    notificationsStore = notificationsStore.map(n => 
      String(n.id) === String(id) ? { ...n, read: true } : n
    );
    persistNotifications(notificationsStore);
    return Promise.resolve([...notificationsStore]);
  },

  async markAllAsRead() {
    notificationsStore = loadStoredNotifications();
    notificationsStore = notificationsStore.map(n => ({ ...n, read: true }));
    persistNotifications(notificationsStore);
    return Promise.resolve([...notificationsStore]);
  },

  async deleteNotification(id) {
    notificationsStore = loadStoredNotifications();
    notificationsStore = notificationsStore.filter(n => String(n.id) !== String(id));
    persistNotifications(notificationsStore);
    return Promise.resolve([...notificationsStore]);
  },

  async clearAll() {
    notificationsStore = [];
    persistNotifications(notificationsStore);
    return Promise.resolve([]);
  },

  async getUnreadCount() {
    notificationsStore = loadStoredNotifications();
    return Promise.resolve(notificationsStore.filter(n => !n.read).length);
  }
};

export default notificationApi;
