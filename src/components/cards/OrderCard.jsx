import React from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertTriangle, 
  MapPin, 
  ChevronRight, 
  ShieldCheck, 
  Navigation, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

export function OrderCard({ order, onSelectOrder, onUpdateStatus }) {
  const statusConfig = {
    Pending: { 
      badge: 'text-amber-800 bg-amber-50 border-amber-300', 
      icon: Clock,
      borderAccent: 'border-l-4 border-l-amber-500'
    },
    Confirmed: { 
      badge: 'text-blue-800 bg-blue-50 border-blue-300', 
      icon: Package,
      borderAccent: 'border-l-4 border-l-blue-600'
    },
    Shipped: { 
      badge: 'text-purple-800 bg-purple-50 border-purple-300', 
      icon: Truck,
      borderAccent: 'border-l-4 border-l-purple-600'
    },
    'Out for Delivery': { 
      badge: 'text-rose-800 bg-rose-50 border-rose-300 animate-pulse', 
      icon: Navigation,
      borderAccent: 'border-l-4 border-l-rose-500'
    },
    Completed: { 
      badge: 'text-emerald-800 bg-emerald-50 border-emerald-300', 
      icon: CheckCircle2,
      borderAccent: 'border-l-4 border-l-emerald-600'
    },
    Cancelled: { 
      badge: 'text-red-800 bg-red-50 border-red-300', 
      icon: AlertTriangle,
      borderAccent: 'border-l-4 border-l-red-500'
    }
  }[order.status] || { 
    badge: 'text-slate-700 bg-slate-100 border-slate-200', 
    icon: Clock,
    borderAccent: 'border-l-4 border-l-slate-400'
  };

  const StatusIcon = statusConfig.icon;

  const trackerSteps = ['Placed', 'Confirmed', 'Dispatched', 'Out for Delivery', 'Completed'];
  const statusStepMap = {
    Pending: 0,
    Confirmed: 1,
    Shipped: 2,
    'Out for Delivery': 3,
    Completed: 4,
    Cancelled: -1
  };
  const currentStep = statusStepMap[order.status] ?? 1;

  return (
    <div 
      onClick={() => onSelectOrder && onSelectOrder(order)}
      className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer group ${statusConfig.borderAccent} hover:border-slate-300 relative`}
    >
      {/* Top Meta Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-3.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {order.id}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">{order.date}</span>
            {order.trackingNumber && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-[11px] font-mono text-slate-400">
                  AWB: {order.trackingNumber}
                </span>
              </>
            )}
          </div>
          <div className="text-xs text-slate-600 mt-1 font-medium flex items-center gap-1.5 flex-wrap">
            <span>{order.type === 'buying' ? 'Seller:' : 'Buyer:'}</span>
            <strong className="text-slate-800">{order.partyName}</strong>
            {order.deliveryMethod && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500">{order.deliveryMethod}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg border ${statusConfig.badge}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{order.status}</span>
          </span>
        </div>
      </div>

      {/* Middle Product Info */}
      <div className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <img
            src={order.bookImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80'}
            alt={order.bookTitle}
            className="w-16 h-20 sm:w-18 sm:h-24 object-cover rounded-xl border border-slate-200 shrink-0 shadow-2xs group-hover:scale-102 transition-transform"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                {order.condition || 'Used - Good'}
              </span>
              {order.urgentBanner && (
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-700 border border-red-200">
                  Arriving Today
                </span>
              )}
            </div>
            <h4 className="font-serif font-bold text-slate-900 text-sm sm:text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
              {order.bookTitle}
            </h4>
            <p className="text-xs text-slate-500 mb-2 truncate">
              Author: {order.bookAuthor || 'Various'}
            </p>
            
            {/* Price with gold and crimson discount accents */}
            <div className="flex items-baseline gap-2 text-xs">
              <span className="text-slate-950 font-extrabold text-base sm:text-lg">
                ₹{order.price}
              </span>
              {order.originalPrice > order.price && (
                <>
                  <span className="text-slate-400 line-through text-xs">
                    ₹{order.originalPrice}
                  </span>
                  <span className="text-red-700 font-bold bg-red-50 px-1.5 py-0.5 rounded text-[10px]">
                    Save ₹{order.originalPrice - order.price}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right CTA Button */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="text-[11px] text-slate-500 text-left sm:text-right">
            <span>Estimated Handover:</span>
            <div className="font-semibold text-slate-800 line-clamp-1">
              {order.estimatedDelivery || 'In Progress'}
            </div>
          </div>

          <button
            type="button"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 group-hover:bg-amber-600 text-slate-950 transition-colors flex items-center gap-1.5 shadow-2xs shrink-0"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Track Order</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Progress Multi-Bar */}
      {order.status !== 'Cancelled' && (
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
            <span className="font-semibold text-slate-700">Fulfillment Pipeline</span>
            <span className="font-bold text-blue-600">{order.status}</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {trackerSteps.map((step, idx) => {
              const isFilled = currentStep >= idx;
              const isCurrent = currentStep === idx;
              return (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'bg-amber-500 ring-2 ring-amber-200'
                      : isFilled
                      ? 'bg-blue-600'
                      : 'bg-slate-200'
                  }`}
                  title={`${step} (${isFilled ? 'Completed' : 'Pending'})`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderCard;
