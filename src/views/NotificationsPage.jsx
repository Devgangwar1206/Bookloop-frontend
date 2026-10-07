import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, Filter } from 'lucide-react';
import { notificationApi } from '../services/notificationApi';
import { useMarketplace } from '../context/MarketplaceContext';
import { NotificationCard } from '../components/cards/NotificationCard';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { setUnreadNotifications } = useMarketplace();
  const { addToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    notificationApi.getNotifications().then((data) => {
      if (isMounted) {
        setNotifications(data || []);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const handleMarkAsRead = async (id) => {
    const updated = await notificationApi.markAsRead(id);
    setNotifications([...updated]);
    setUnreadNotifications(updated.filter(n => !n.read).length);
  };

  const handleMarkAllRead = async () => {
    const updated = await notificationApi.markAllAsRead();
    setNotifications([...updated]);
    setUnreadNotifications(0);
    addToast('All notifications marked as read', 'success');
  };

  const handleDelete = async (id) => {
    const updated = await notificationApi.deleteNotification(id);
    setNotifications([...updated]);
    setUnreadNotifications(updated.filter(n => !n.read).length);
    addToast('Notification removed', 'info');
  };

  const handleClearAll = async () => {
    if (window.confirm('Clear all notifications?')) {
      await notificationApi.clearAll();
      setNotifications([]);
      setUnreadNotifications(0);
      addToast('All notifications cleared', 'info');
    }
  };

  const filteredList = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'deals') return n.type === 'offer' || n.type === 'exchange';
    if (activeFilter === 'messages') return n.type === 'message';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Bell className="w-3.5 h-3.5" />
              <span>Activity Center</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Notifications
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {unreadCount > 0 ? `You have ${unreadCount} unread alerts` : 'All caught up on reader activities'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200/80 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 transition-colors"
                title="Clear all notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: `All (${notifications.length})` },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'deals', label: 'Offers & Swaps' },
            { id: 'messages', label: 'Messages' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                activeFilter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List of Notifications */}
        {filteredList.length === 0 ? (
          <EmptyState
            type="books"
            title={activeFilter === 'unread' ? 'No unread notifications' : 'No notifications found'}
            description="When buyers message, offer swaps, or inquire on your books, alerts will appear here."
          />
        ) : (
          <div className="space-y-3">
            {filteredList.map((notif) => (
              <NotificationCard
                key={notif.id}
                notification={notif}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default NotificationsPage;
