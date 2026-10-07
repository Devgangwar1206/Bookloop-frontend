// Realtime Chat & Marketplace Messaging Service
// BookLoop - Spring Boot REST + STOMP/SockJS
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { INITIAL_CHATS } from '../data/mockData';

const RAW_API_URL =
  typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:8000';

const DERIVED_BACKEND = RAW_API_URL.replace(/\/+$/, '').replace(/\/api\/v1$/, '');

const BACKEND_URL =
  typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_CHAT_BACKEND_URL
    ? process.env.NEXT_PUBLIC_CHAT_BACKEND_URL
    : DERIVED_BACKEND;

const API_BASE = `${BACKEND_URL}/api/chat`;
const WS_ENDPOINT =
  typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_WS_URL
    ? process.env.NEXT_PUBLIC_WS_URL
    : `${BACKEND_URL}/ws-chat`;

const CHATS_STORAGE_KEY = 'bookloop_chats_data';

// ---------------------------------------------------------
// AUTH HELPERS
// ---------------------------------------------------------

function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    localStorage.getItem('jwt')
  );
}

function getStoredUserId() {
  if (typeof window === 'undefined') return 'u-me';
  const storedId = localStorage.getItem('userId') || localStorage.getItem('id');
  if (storedId) return String(storedId);

  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed?.id) return String(parsed.id);
      if (parsed?.email) return String(parsed.email);
    }
  } catch (e) {}

  return 'u-me';
}

function getStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem('user');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return null;
}

function getAuthHeaders(includeJson = false) {
  const token = getAuthToken();
  const headers = { Accept: 'application/json' };
  if (includeJson) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// ---------------------------------------------------------
// LOCAL FALLBACK STORAGE
// ---------------------------------------------------------

function loadStoredChats() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(CHATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load chats from storage:', error);
  }
  return INITIAL_CHATS.map((chat) => ({
    ...chat,
    messages: [...(chat.messages || [])],
  }));
}

function persistChats(chats) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
    }
  } catch (error) {
    console.warn('Failed to persist chats:', error);
  }
}

let chatsStore = loadStoredChats();
let isBackendAlive = null;
let stompClient = null;
let globalStompClient = null;

// ---------------------------------------------------------
// CONNECTIVITY CHECK
// ---------------------------------------------------------

async function checkBackendConnectivity() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: getAuthHeaders(),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok || response.status === 401 || response.status === 403) {
      isBackendAlive = true;
      return true;
    }
  } catch (error) {
    // Offline or starting up
  }
  isBackendAlive = false;
  return false;
}

// ---------------------------------------------------------
// MAIN CHAT API MODULE
// ---------------------------------------------------------

export const chatApi = {
  getBackendUrl() {
    return BACKEND_URL;
  },

  async isBackendAvailable() {
    return await checkBackendConnectivity();
  },

  async getConversations(userId = null) {
    const currentId = userId || getStoredUserId();
    const alive = await this.isBackendAvailable();
    if (alive) {
      try {
        const params = new URLSearchParams();
        if (currentId && currentId !== 'u-me') {
          params.set('userId', currentId);
        }

        const response = await fetch(`${API_BASE}/conversations?${params.toString()}`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            return data;
          }
        }
      } catch (error) {
        console.warn('getConversations failed:', error);
      }
    }
    return [...chatsStore];
  },

  async getConversationById(chatId, userId = null) {
    const currentId = userId || getStoredUserId();
    const alive = await this.isBackendAvailable();
    if (alive) {
      try {
        const params = new URLSearchParams();
        if (currentId && currentId !== 'u-me') {
          params.set('userId', currentId);
        }
        const response = await fetch(
          `${API_BASE}/conversations/${encodeURIComponent(chatId)}?${params.toString()}`,
          {
            method: 'GET',
            headers: getAuthHeaders(),
          }
        );
        if (response.ok) return await response.json();
      } catch (error) {
        console.warn('getConversationById failed:', error);
      }
    }
    const conv = chatsStore.find((c) => String(c.id) === String(chatId));
    return conv ? { ...conv } : null;
  },

  async getMessages(chatId) {
    const alive = await this.isBackendAvailable();
    if (alive) {
      try {
        const response = await fetch(`${API_BASE}/conversations/${encodeURIComponent(chatId)}/messages`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) return data;
        }
      } catch (error) {
        console.warn('getMessages failed:', error);
      }
    }
    const conv = chatsStore.find((c) => String(c.id) === String(chatId));
    return conv ? [...(conv.messages || [])] : [];
  },

  async markAsRead(chatId, userId = null) {
    const currentId = userId || getStoredUserId();
    const alive = await this.isBackendAvailable();
    if (alive) {
      try {
        const params = new URLSearchParams({ userId: currentId });
        const response = await fetch(`${API_BASE}/conversations/${encodeURIComponent(chatId)}/read?${params.toString()}`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          return data.unreadCount || 0;
        }
      } catch (error) {
        console.warn('markAsRead failed:', error);
      }
    }
    const conv = chatsStore.find((c) => String(c.id) === String(chatId));
    if (conv) conv.unreadCount = 0;
    persistChats(chatsStore);
    return chatsStore.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  },

  async markAllAsRead(userId = null) {
    const currentId = userId || getStoredUserId();
    const alive = await this.isBackendAvailable();
    if (alive) {
      try {
        const params = new URLSearchParams({ userId: currentId });
        await fetch(`${API_BASE}/read-all?${params.toString()}`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
      } catch (error) {}
    }
    chatsStore.forEach((c) => (c.unreadCount = 0));
    persistChats(chatsStore);
    return 0;
  },

  async getUnreadCount(userId = null) {
    const currentId = userId || getStoredUserId();
    const alive = await this.isBackendAvailable();
    if (alive) {
      try {
        const params = new URLSearchParams({ userId: currentId });
        const response = await fetch(`${API_BASE}/unread-count?${params.toString()}`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          return data.unreadCount || 0;
        }
      } catch (error) {}
    }
    return chatsStore.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  },

  async startOrGetChatWithSeller(book, seller, currentUserId = null) {
    const currentId = currentUserId || getStoredUserId();
    const currentUser = getStoredUser();

    const buyerInfo = {
      id: currentId,
      name: currentUser?.name || 'Buyer',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      verified: Boolean(currentUser?.verified),
      location: currentUser?.city || 'Local',
    };

    const alive = await this.isBackendAvailable();
    if (alive) {
      try {
        const payload = {
          bookId: String(book.id),
          bookTitle: book.title,
          bookPrice: book.price,
          bookImage: book.images?.[0] || '',
          seller: {
            id: String(seller.id),
            name: seller.name || 'Book Seller',
            avatar: seller.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
            verified: Boolean(seller.verified),
            location: seller.location || seller.city || 'Noida, UP',
          },
          buyer: buyerInfo,
          currentUserId: currentId,
          initialMessage: `Hi ${seller.name || 'there'}, is "${book.title}" still available?`,
        };

        const response = await fetch(`${API_BASE}/start`, {
          method: 'POST',
          headers: getAuthHeaders(true),
          body: JSON.stringify(payload),
        });
        if (response.ok) return await response.json();
      } catch (error) {
        console.warn('startOrGetChatWithSeller failed:', error);
      }
    }

    // Local fallback
    const existing = chatsStore.find(
      (c) => String(c.bookId) === String(book.id) && c.otherUser && String(c.otherUser.id) === String(seller.id)
    );
    if (existing) return existing;

    const newChat = {
      id: `c-${Date.now()}`,
      bookId: String(book.id),
      bookTitle: book.title,
      bookPrice: book.price,
      bookImage: book.images?.[0] || '',
      currentUserId: currentId,
      currentUserName: buyerInfo.name,
      currentUserAvatar: buyerInfo.avatar,
      buyer: buyerInfo,
      otherUser: {
        id: String(seller.id || `s-${Date.now()}`),
        name: seller.name || 'Book Seller',
        avatar: seller.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        verified: Boolean(seller.verified),
        location: seller.location || 'Noida, UP',
      },
      lastMessage: `Hi, is "${book.title}" still available?`,
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: [
        {
          id: `m-${Date.now()}`,
          conversationId: `c-${Date.now()}`,
          senderId: currentId,
          text: `Hi, is "${book.title}" still available?`,
          time: 'Just now',
        },
      ],
    };
    chatsStore.unshift(newChat);
    persistChats(chatsStore);
    return newChat;
  },

  async sendMessage(chatId, text, senderId = null) {
    const actualSender = senderId || getStoredUserId();
    const payload = {
      conversationId: chatId,
      senderId: actualSender,
      text: text.trim(),
      messageType: 'TEXT',
    };

    // 1. Send via WebSocket if connected (DO NOT send REST simultaneously to prevent duplicate messages)
    if (stompClient && stompClient.connected) {
      try {
        stompClient.publish({
          destination: '/app/chat.sendMessage',
          body: JSON.stringify(payload),
        });

        // Optimistic temporary message to render smoothly in UI
        const tempMsg = {
          id: `temp-${Date.now()}`,
          conversationId: chatId,
          senderId: actualSender,
          text: text.trim(),
          time: 'Just now',
          messageType: 'TEXT',
          isRead: false,
          isOptimistic: true,
        };
        updateLocalConversation(chatId, tempMsg);
        return tempMsg;
      } catch (e) {
        console.warn('STOMP publish failed, falling back to REST:', e);
      }
    }

    // 2. Only if WebSocket is NOT connected, use the REST API
    const alive = await this.isBackendAvailable();
    if (alive) {
      try {
        const response = await fetch(`${API_BASE}/conversations/${encodeURIComponent(chatId)}/messages`, {
          method: 'POST',
          headers: getAuthHeaders(true),
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const savedMsg = await response.json();
          updateLocalConversation(chatId, savedMsg);
          return savedMsg;
        }
      } catch (err) {
        console.warn('REST sendMessage failed:', err);
      }
    }

    // 3. Fallback local message
    const localMsg = {
      id: `m-${Date.now()}`,
      conversationId: chatId,
      senderId: actualSender,
      text: text.trim(),
      time: 'Just now',
      messageType: 'TEXT',
      isRead: false,
    };
    updateLocalConversation(chatId, localMsg);
    return localMsg;
  },

  connectWebSocket(chatId, { onMessage, onTyping, onStatusChange } = {}) {
    if (typeof window === 'undefined') {
      return { disconnect: () => {}, sendTyping: () => {} };
    }

    if (stompClient) {
      try {
        stompClient.deactivate();
      } catch (e) {}
      stompClient = null;
    }

    const token = getAuthToken();
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_ENDPOINT),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (msg) => {
        if (process.env.NODE_ENV === 'development') {
          console.debug('[STOMP]', msg);
        }
      },
      onConnect: () => {
        isBackendAlive = true;
        if (onStatusChange) onStatusChange('connected');

        if (chatId) {
          // Subscribe to main conversation messages topic
          client.subscribe(`/topic/chat/${chatId}`, (frame) => {
            try {
              const msg = JSON.parse(frame.body);
              updateLocalConversation(chatId, msg);
              if (onMessage) onMessage(msg);
            } catch (err) {
              console.error('Invalid message format:', err);
            }
          });

          // Subscribe to typing notifications topic
          client.subscribe(`/topic/chat/${chatId}/typing`, (frame) => {
            try {
              const typingData = JSON.parse(frame.body);
              if (onTyping) onTyping(typingData);
            } catch (err) {
              console.error('Invalid typing payload:', err);
            }
          });
        }
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        if (onStatusChange) onStatusChange('error');
      },
      onWebSocketClose: () => {
        if (onStatusChange) onStatusChange('disconnected');
      },
    });

    stompClient = client;
    client.activate();

    return {
      disconnect: () => {
        try {
          client.deactivate();
        } catch (e) {}
        if (stompClient === client) stompClient = null;
      },
      sendTyping: (isTyping, userName = 'You') => {
        if (client.connected && chatId) {
          try {
            client.publish({
              destination: '/app/chat.typing',
              body: JSON.stringify({
                conversationId: chatId,
                userId: getStoredUserId(),
                userName,
                typing: isTyping,
              }),
            });
          } catch (e) {}
        }
      },
    };
  },

  // -------------------------------------------------------
  // GLOBAL NOTIFICATIONS WEBSOCKET LISTENER
  // -------------------------------------------------------
  connectGlobalNotifications({ onNotification } = {}) {
    if (typeof window === 'undefined') {
      return () => {};
    }

    if (globalStompClient) {
      try {
        globalStompClient.deactivate();
      } catch (e) {}
      globalStompClient = null;
    }

    const token = getAuthToken();
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_ENDPOINT),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 6000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        client.subscribe('/topic/notifications', (frame) => {
          try {
            const data = JSON.parse(frame.body);
            if (onNotification) onNotification(data);
          } catch (e) {
            console.error('Failed to parse global notification:', e);
          }
        });
      },
    });

    globalStompClient = client;
    client.activate();

    return () => {
      try {
        client.deactivate();
      } catch (e) {}
      if (globalStompClient === client) globalStompClient = null;
    };
  },
};

function updateLocalConversation(chatId, message) {
  if (!message) return;
  const chat = chatsStore.find((c) => String(c.id) === String(chatId));
  if (!chat) return;
  if (!chat.messages) chat.messages = [];
  
  // If replacing an optimistic message
  if (!message.isOptimistic) {
    const optIndex = chat.messages.findIndex(
      (m) => m.isOptimistic && m.text === message.text && String(m.senderId) === String(message.senderId)
    );
    if (optIndex !== -1) {
      chat.messages[optIndex] = message;
      chat.lastMessage = message.text;
      chat.lastMessageTime = message.time || 'Just now';
      persistChats(chatsStore);
      return;
    }
  }

  if (!chat.messages.some((m) => String(m.id) === String(message.id))) {
    chat.messages.push(message);
  }
  chat.lastMessage = message.text;
  chat.lastMessageTime = message.time || 'Just now';
  persistChats(chatsStore);
}

export default chatApi;