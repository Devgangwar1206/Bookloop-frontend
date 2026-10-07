import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Tag, 
  ArrowLeftRight, 
  Package, 
  CheckCircle2, 
  ShoppingBag, 
  Heart,
  ChevronRight,
  Trash2
} from 'lucide-react';

export function NotificationCard({ notification, onMarkAsRead, onDelete }) {
  const navigate = useNavigate();

  const iconConfig = {
    message: { icon: MessageSquare, color: 'text-blue-600 bg-blue-50 border-blue-200/80' },
    offer: { icon: Tag, color: 'text-amber-600 bg-amber-50 border-amber-200/80' },
    exchange: { icon: ArrowLeftRight, color: 'text-emerald-600 bg-emerald-50 border-emerald-200/80' },
    listing: { icon: Package, color: 'text-indigo-600 bg-indigo-50 border-indigo-200/80' },
    order: { icon: ShoppingBag, color: 'text-violet-600 bg-violet-50 border-violet-200/80' },
    favorite: { icon: Heart, color: 'text-rose-600 bg-rose-50 border-rose-200/80' }
  }[notification.type] || { icon: CheckCircle2, color: 'text-slate-600 bg-slate-50 border-slate-200' };

  const Icon = iconConfig.icon;

  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
        notification.read
          ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
          : 'bg-blue-50/40 border-blue-200/80 hover:bg-blue-50/70 shadow-xs'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${iconConfig.color}`}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className={`text-sm leading-snug truncate ${notification.read ? 'font-medium text-slate-800' : 'font-bold text-slate-900'}`}>
            {notification.title}
          </h4>
          <span className="text-[11px] text-slate-400 shrink-0 font-medium">
            {notification.time}
          </span>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2.5">
          {notification.description}
        </p>

        <div className="flex items-center justify-between">
          {notification.link ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:underline">
              <span>View details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          ) : <span />}

          <div className="flex items-center gap-2">
            {!notification.read && (
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" title="Unread notification" />
            )}

            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                title="Delete notification"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
