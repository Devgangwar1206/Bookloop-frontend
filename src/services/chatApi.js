// Realtime Chat & Marketplace Messaging Service
// BookLoop - Spring Boot REST + STOMP/SockJS
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

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
  if (typeof window === 'undefined') return '';
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

  return '';
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
// LOCAL STORAGE CACHE (REAL DATA ONLY - NO MOCK CONVERSATIONS)
// ---------------------------------------------------------

function loadStoredChats() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(CHATS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load chats from storage:', error);
  }
  return [];
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
let stompClient = null;
let globalStompClient = null;

// ---------------------------------------------------------
// MAIN CHAT API MODULE
// ---------------------------------------------------------

export const chatApi = {
  getBackendUrl() {
    return BACKEND_URL;
  },

  async isBackendAvailable() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        headers: getAuthHeaders(),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res.ok || res.status === 401 || res.status === 403;
    } catch {
      return false;
    }
  },

  /**
   * Fetch all user conversations from real backend database.
   * If user has 0 conversations, returns an empty array [] (never mock data).
   */
  async getConversations(userId = null) {
    const currentId = userId || getStoredUserId();
    try {
      const params = new URLSearchParams();
      if (currentId && currentId !== 'u-me') {
        params.set('userId', currentId);
      }

      const response = await fetch(`${API_BASE}/conversations${params.toString() ? '?' + params.toString() : ''}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          chatsStore = data;
          persistChats(data);
          return data;
        }
      }
    } catch (error) {
      console.warn('getConversations backend fetch failed:', error);
    }

    return [...chatsStore];
  },

  /**
   * Fetch a specific conversation with message history
   */
  async getConversationById(chatId, userId = null) {
    const currentId = userId || getStoredUserId();
    try {
      const params = new URLSearchParams();
      if (currentId && currentId !== 'u-me') {
        params.set('userId', currentId);
      }
      const response = await fetch(
        `${API_BASE}/conversations/${encodeURIComponent(chatId)}${params.toString() ? '?' + params.toString() : ''}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data) {
          updateOrAddLocalChat(data);
          return data;
        }
      }
    } catch (error) {
      console.warn('getConversationById failed:', error);
    }

    const conv = chatsStore.find((c) => String(c.id) === String(chatId));
    return conv ? { ...conv } : null;
  },

  /**
   * Fetch messages history for a conversation
   */
  async getMessages(chatId) {
    try {
      const response = await fetch(`${API_BASE}/conversations/${encodeURIComponent(chatId)}/messages`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          // Sync messages with local store
          const conv = chatsStore.find((c) => String(c.id) === String(chatId));
          if (conv) {
            conv.messages = data;
            persistChats(chatsStore);
          }
          return data;
        }
      }
    } catch (error) {
      console.warn('getMessages failed:', error);
    }

    const conv = chatsStore.find((c) => String(c.id) === String(chatId));
    return conv ? [...(conv.messages || [])] : [];
  },

  /**
   * Mark all messages in a conversation as read
   */
  async markAsRead(chatId, userId = null) {
    const currentId = userId || getStoredUserId();
    try {
      const params = new URLSearchParams();
      if (currentId && currentId !== 'u-me') params.set('userId', currentId);

      const response = await fetch(`${API_BASE}/conversations/${encodeURIComponent(chatId)}/read?${params.toString()}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        const conv = chatsStore.find((c) => String(c.id) === String(chatId));
        if (conv) conv.unreadCount = 0;
        persistChats(chatsStore);
        return data.unreadCount || 0;
      }
    } catch (error) {
      console.warn('markAsRead failed:', error);
    }

    const conv = chatsStore.find((c) => String(c.id) === String(chatId));
    if (conv) conv.unreadCount = 0;
    persistChats(chatsStore);
    return chatsStore.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  },

  async markAllAsRead(userId = null) {
    const currentId = userId || getStoredUserId();
    try {
      const params = new URLSearchParams();
      if (currentId && currentId !== 'u-me') params.set('userId', currentId);
      await fetch(`${API_BASE}/read-all?${params.toString()}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (error) {}

    chatsStore.forEach((c) => (c.unreadCount = 0));
    persistChats(chatsStore);
    return 0;
  },

  async getUnreadCount(userId = null) {
    const currentId = userId || getStoredUserId();
    try {
      const params = new URLSearchParams();
      if (currentId && currentId !== 'u-me') params.set('userId', currentId);
      const response = await fetch(`${API_BASE}/unread-count?${params.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        return data.unreadCount || 0;
      }
    } catch (error) {}

    return chatsStore.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  },

  /**
   * Delete conversation permanently from backend and local cache
   */
  async deleteConversation(chatId, userId = null) {
    const currentId = userId || getStoredUserId();
    try {
      const params = new URLSearchParams();
      if (currentId && currentId !== 'u-me') params.set('userId', currentId);

      const response = await fetch(`${API_BASE}/conversations/${encodeURIComponent(chatId)}?${params.toString()}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        chatsStore = chatsStore.filter((c) => String(c.id) !== String(chatId));
        persistChats(chatsStore);
        return true;
      }
    } catch (err) {
      console.warn('deleteConversation backend error:', err);
    }

    // Always remove from local store
    chatsStore = chatsStore.filter((c) => String(c.id) !== String(chatId));
    persistChats(chatsStore);
    return true;
  },

  /**
   * Start or get conversation with a seller (called from BookDetails, SellerProfile, etc.)
   */
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

    const bookImage = Array.isArray(book.images) && book.images[0] ? book.images[0] : (book.image || '');

    const payload = {
      bookId: String(book.id || ''),
      bookTitle: book.title || 'Book Inquiry',
      bookPrice: Number(book.price || 0),
      bookImage: bookImage,
      seller: {
        id: String(seller.id || seller.sellerId || ''),
        name: seller.name || 'Book Seller',
        avatar: seller.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        verified: Boolean(seller.verified),
        location: seller.location || seller.city || 'Noida, UP',
      },
      buyer: buyerInfo,
      currentUserId: currentId,
      initialMessage: `Hi ${seller.name || 'there'}, is "${book.title || 'this book'}" still available?`,
    };

    try {
      const response = await fetch(`${API_BASE}/start`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const conv = await response.json();
        updateOrAddLocalChat(conv);
        return conv;
      }
    } catch (error) {
      console.warn('startOrGetChatWithSeller backend failed:', error);
    }

    // Fallback if backend is warming up
    const existing = chatsStore.find(
      (c) => String(c.bookId) === String(book.id) && c.otherUser && String(c.otherUser.id) === String(seller.id)
    );
    if (existing) return existing;

    const newChatId = `c-${Date.now()}`;
    const newChat = {
      id: newChatId,
      bookId: String(book.id),
      bookTitle: book.title,
      bookPrice: book.price,
      bookImage: bookImage,
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
      lastMessage: payload.initialMessage,
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: [
        {
          id: `m-${Date.now()}`,
          conversationId: newChatId,
          senderId: currentId,
          text: payload.initialMessage,
          time: 'Just now',
          isRead: false,
        },
      ],
    };
    chatsStore.unshift(newChat);
    persistChats(chatsStore);
    return newChat;
  },

  /**
   * Send message via REST API and broadcast via WebSocket
   */
  async sendMessage(chatId, text, senderId = null) {
    const actualSender = senderId || getStoredUserId();
    const payload = {
      conversationId: chatId,
      senderId: actualSender,
      text: text.trim(),
      messageType: 'TEXT',
    };

    // Broadcast over WebSocket if connected
    if (stompClient && stompClient.connected) {
      try {
        stompClient.publish({
          destination: '/app/chat.sendMessage',
          body: JSON.stringify(payload),
        });
      } catch (e) {
        console.warn('STOMP publish error:', e);
      }
    }

    // Persist via REST API (authoritative source)
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
      console.warn('REST sendMessage error:', err);
    }

    // Temporary optimistic message with isRead: false
    const fallbackMsg = {
      id: `m-${Date.now()}`,
      conversationId: chatId,
      senderId: actualSender,
      text: text.trim(),
      time: 'Just now',
      messageType: 'TEXT',
      isRead: false,
    };
    updateLocalConversation(chatId, fallbackMsg);
    return fallbackMsg;
  },

  /**
   * Connect WebSocket STOMP broker for instant real-time message delivery
   */
  connectWebSocket(chatId, { onMessage, onTyping, onReadReceipt, onDeleted, onStatusChange } = {}) {
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
      reconnectDelay: 4000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        if (onStatusChange) onStatusChange('connected');

        if (chatId) {
          // 1. Subscribe to conversation messages
          client.subscribe(`/topic/chat/${chatId}`, (frame) => {
            try {
              const msg = JSON.parse(frame.body);
              if (msg.type === 'READ_RECEIPT' || msg.text === '__READ__') {
                if (onReadReceipt) onReadReceipt(msg);
                return;
              }
              updateLocalConversation(chatId, msg);
              if (onMessage) onMessage(msg);
            } catch (err) {
              console.error('Invalid message frame:', err);
            }
          });

          // 2. Subscribe to read receipts (blue ticks)
          client.subscribe(`/topic/chat/${chatId}/read`, (frame) => {
            try {
              const receipt = JSON.parse(frame.body);
              if (onReadReceipt) onReadReceipt(receipt);
            } catch (err) {}
          });

          // 3. Subscribe to typing indicator
          client.subscribe(`/topic/chat/${chatId}/typing`, (frame) => {
            try {
              const typingData = JSON.parse(frame.body);
              if (onTyping) onTyping(typingData);
            } catch (err) {}
          });

          // 4. Subscribe to conversation deletion
          client.subscribe(`/topic/chat/${chatId}/deleted`, () => {
            if (onDeleted) onDeleted(chatId);
          });
        }
      },
      onStompError: () => {
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

  /**
   * Global notifications WebSocket for header unread badges
   */
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
          } catch (e) {}
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

function updateOrAddLocalChat(conv) {
  if (!conv || !conv.id) return;
  const index = chatsStore.findIndex((c) => String(c.id) === String(conv.id));
  if (index >= 0) {
    chatsStore[index] = { ...chatsStore[index], ...conv };
  } else {
    chatsStore.unshift(conv);
  }
  persistChats(chatsStore);
}

function updateLocalConversation(chatId, message) {
  if (!message || message.text === '__READ__') return;
  const chat = chatsStore.find((c) => String(c.id) === String(chatId));
  if (!chat) return;
  if (!chat.messages) chat.messages = [];

  const existingIdx = chat.messages.findIndex((m) => String(m.id) === String(message.id));
  if (existingIdx !== -1) {
    chat.messages[existingIdx] = message;
  } else {
    chat.messages.push(message);
  }
  chat.lastMessage = message.text;
  chat.lastMessageTime = message.time || 'Just now';
  persistChats(chatsStore);
}

export default chatApi;