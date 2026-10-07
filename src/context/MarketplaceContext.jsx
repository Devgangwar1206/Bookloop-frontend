import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { bookApi } from '../services/bookApi';
import { notificationApi } from '../services/notificationApi';
import { chatApi } from '../services/chatApi';
import { useToast } from './ToastContext';

const MarketplaceContext = createContext(null);

export function MarketplaceProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState('Noida, UP');
  const [favorites, setFavorites] = useState(new Set());
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [desktopPermission, setDesktopPermission] = useState('default');
  const { addToast } = useToast();

  const requestDesktopPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setDesktopPermission(perm);
        if (perm === 'granted') {
          addToast('🔔 Desktop notifications enabled for BookLoop!', 'success');
        } else if (perm === 'denied') {
          addToast('⚠️ Desktop notifications blocked. Enable in browser settings.', 'warning');
        }
        return perm;
      } catch (err) {
        console.warn('Notification permission error:', err);
      }
    }
    return 'unsupported';
  }, [addToast]);

  const toggleFavorite = useCallback(async (bookId, bookTitle = 'Book') => {
    try {
      const res = await bookApi.toggleFavorite(bookId);
      setFavorites((prev) => {
        const next = new Set(prev);
        if (res.favorited) {
          next.add(bookId);
        } else {
          next.delete(bookId);
        }
        return next;
      });

      if (res.favorited) {
        addToast(`"${bookTitle}" added to saved bookshelf`, 'success');
      } else {
        addToast(`"${bookTitle}" removed from saved bookshelf`, 'info');
      }
      return res;
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  }, [addToast]);

  const isFavorite = useCallback((bookId) => {
    return favorites.has(bookId);
  }, [favorites]);

  const refreshCounts = useCallback(async () => {
    try {
      const notifs = await notificationApi.getUnreadCount();
      setUnreadNotifications(notifs);
      const unreadTotal = await chatApi.getUnreadCount();
      setUnreadMessages(unreadTotal);
    } catch (err) {
      console.error('Failed to refresh counts', err);
    }
  }, []);

  const markChatAsRead = useCallback(async (chatId) => {
    try {
      const remaining = await chatApi.markAsRead(chatId);
      setUnreadMessages(remaining);
    } catch (err) {
      console.error('Failed to mark chat as read', err);
    }
  }, []);

  const markAllChatsAsRead = useCallback(async () => {
    try {
      await chatApi.markAllAsRead();
      setUnreadMessages(0);
      addToast('All conversations marked as read', 'info');
    } catch (err) {
      console.error('Failed to mark all chats as read', err);
    }
  }, [addToast]);

  const syncFavorites = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('accessToken')) : null;
      if (!token) return;
      const favs = await bookApi.getFavorites();
      if (Array.isArray(favs)) {
        setFavorites(new Set(favs.map(b => b.id)));
      }
    } catch (err) {
      // Silently catch if unauthenticated
    }
  }, []);

  // Initial count load, favorites sync, and sync with notification store updates
  useEffect(() => {
    refreshCounts();
    syncFavorites();

    if (typeof window !== 'undefined' && 'Notification' in window) {
      setDesktopPermission(Notification.permission);
    }

    const handleNotificationsUpdated = () => {
      notificationApi.getUnreadCount().then(setUnreadNotifications);
    };

    window.addEventListener('bookloop_notifications_updated', handleNotificationsUpdated);
    return () => {
      window.removeEventListener('bookloop_notifications_updated', handleNotificationsUpdated);
    };
  }, [refreshCounts, syncFavorites]);

  // Real-time Global Notifications, Desktop OS Alerts & Header Badges via WebSocket
  useEffect(() => {
    const unsubscribe = chatApi.connectGlobalNotifications({
      onNotification: async (dto) => {
        if (!dto) return;

        let currentUserId = String(localStorage.getItem('userId') || '');
        let currentEmail = '';
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const parsed = JSON.parse(userStr);
            currentEmail = parsed?.email || '';
            if (!currentUserId && parsed?.id) {
              currentUserId = String(parsed.id);
            }
          }
        } catch (e) {}

        // Check if this is an Offer or Exchange notification
        const isOfferOrExchange = dto.type && (dto.type.startsWith('OFFER_') || dto.type.startsWith('EXCHANGE_'));

        if (isOfferOrExchange) {
          // Check if current user is the target recipient
          const isTargetRecipient =
            (dto.targetUserId && String(dto.targetUserId) === currentUserId) ||
            (dto.targetUserEmail && currentEmail && dto.targetUserEmail.toLowerCase() === currentEmail.toLowerCase());

          if (isTargetRecipient) {
            // 1. Increment notification badge counter in header
            setUnreadNotifications((prev) => prev + 1);

            // 2. Add to Activity Center / Notifications Page
            await notificationApi.addNotification({
              id: dto.id || `notif-${Date.now()}`,
              type: dto.type.startsWith('OFFER_') ? 'offer' : 'exchange',
              title: dto.title || 'Notification',
              description: dto.message || '',
              time: dto.time || 'Just now',
              read: false,
              link: dto.actionUrl || (dto.type.startsWith('OFFER_') ? '/dashboard/offers' : '/dashboard/exchanges'),
              avatar: dto.senderAvatar || null,
            });

            // 3. In-App Toast alert
            addToast(`${dto.title}: ${dto.message}`, 'info');

            // 4. Desktop OS Notification
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              try {
                const osNotif = new Notification(dto.title || 'BookLoop Notification', {
                  body: dto.message || 'You received a new update',
                  icon: dto.senderAvatar || '/loopie_clean_bot.png',
                  badge: '/loopie_clean_bot.png',
                  tag: `notif-${dto.id || Date.now()}`,
                  renotify: true,
                });
                osNotif.onclick = () => {
                  window.focus();
                  if (dto.actionUrl) {
                    window.location.href = dto.actionUrl;
                  }
                };
              } catch (err) {
                console.warn('Native desktop notification failed:', err);
              }
            }
          }
          return;
        }

        // Otherwise, it is a chat message
        const isFromOtherUser =
          dto.senderId &&
          dto.senderId !== currentUserId &&
          (!currentEmail || dto.senderId !== currentEmail) &&
          dto.senderId !== 'u-me';

        if (isFromOtherUser) {
          // 1. Increment chat counter in header
          setUnreadMessages((prev) => prev + 1);

          // 2. Add to Activity Center / Notifications Page
          await notificationApi.addNotification({
            id: `msg-${dto.id || Date.now()}`,
            type: 'message',
            title: `New message from reader`,
            description: dto.text || 'Sent you a message',
            time: dto.time || 'Just now',
            read: false,
            link: dto.conversationId ? `/chat/${dto.conversationId}` : '/chat',
          });

          // 3. Increment notification badge counter in header
          setUnreadNotifications((prev) => prev + 1);

          // 4. In-App Toast alert
          const snippet = dto.text
            ? dto.text.length > 40
              ? dto.text.substring(0, 40) + '...'
              : dto.text
            : 'New message received';
          addToast(`💬 New message: "${snippet}"`, 'info');

          // 5. System Desktop / OS Notification (WhatsApp-like)
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              const osNotif = new Notification('BookLoop Message', {
                body: dto.text || 'You received a new message',
                icon: '/loopie_clean_bot.png',
                badge: '/loopie_clean_bot.png',
                tag: `chat-${dto.conversationId}`,
                renotify: true,
              });
              osNotif.onclick = () => {
                window.focus();
                if (dto.conversationId) {
                  window.location.href = `/chat/${dto.conversationId}`;
                }
              };
            } catch (err) {
              console.warn('Native desktop notification failed:', err);
            }
          }
        }
      },
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [addToast]);

  const value = {
    selectedLocation,
    setSelectedLocation,
    favorites,
    toggleFavorite,
    isFavorite,
    unreadNotifications,
    setUnreadNotifications,
    unreadMessages,
    setUnreadMessages,
    desktopPermission,
    requestDesktopPermission,
    markChatAsRead,
    markAllChatsAsRead,
    refreshCounts,
    syncFavorites,
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}
