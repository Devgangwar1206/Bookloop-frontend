import React, { useState } from 'react';
import { Check, X, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react';

export function OfferCard({
  offer,
  isSent = false,
  onAccept,
  onReject,
  onCounter,
  onCancel,
  onChat
}) {
  const [showCounterInput, setShowCounterInput] = useState(false);
  const [counterValue, setCounterValue] = useState(
    offer.book?.originalPrice
      ? Math.round((offer.offerPrice + offer.book.originalPrice) / 2)
      : offer.offerPrice + 50
  );

  const normalizedStatus = String(offer.status || 'Pending');

  const statusColor = {
    Pending: 'text-amber-700 bg-amber-50 border-amber-200',
    Accepted: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    Rejected: 'text-rose-700 bg-rose-50 border-rose-200',
    Countered: 'text-blue-700 bg-blue-50 border-blue-200',
    Cancelled: 'text-slate-600 bg-slate-100 border-slate-200'
  }[normalizedStatus] || 'text-slate-700 bg-slate-100 border-slate-200';

  const handleSendCounter = () => {
    if (onCounter) {
      onCounter(offer.id, counterValue);
      setShowCounterInput(false);
    }
  };

  const partnerName = isSent
    ? (offer.seller?.name || 'Book Seller')
    : (offer.buyer?.name || 'Buyer');

  const partnerAvatar = isSent
    ? (offer.seller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80')
    : (offer.buyer?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80');

  const partnerLocation = isSent
    ? (offer.seller?.location || 'Seller')
    : (offer.buyer?.location || 'India');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition-shadow">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img
            src={partnerAvatar}
            alt={partnerName}
            className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {isSent ? `Offer sent to ${partnerName}` : partnerName}
            </div>
            <div className="text-xs text-slate-500">
              {partnerLocation} · {offer.date || 'Recently'}
            </div>
          </div>
        </div>

        <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${statusColor}`}>
          {normalizedStatus}
        </span>
      </div>

      {/* Book & Offer Details */}
      <div className="py-4 flex items-center gap-4">
        <img
          src={offer.book?.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80'}
          alt={offer.book?.title}
          className="w-14 h-18 object-cover rounded-lg border border-slate-200 shrink-0 shadow-xs"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-serif font-semibold text-slate-900 text-sm line-clamp-1 mb-1">
            {offer.book?.title}
          </h4>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">
              Listed: <strong className="text-slate-700">₹{offer.book?.originalPrice || 0}</strong>
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-900 font-bold">
              Offer: <span className="text-emerald-700 text-sm font-bold">₹{offer.offerPrice}</span>
            </span>
          </div>

          {offer.message && (
            <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl italic">
              "{offer.message}"
            </p>
          )}

          {offer.counterPrice && (
            <div className="mt-2 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg inline-block">
              Counter offer: ₹{offer.counterPrice}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        {/* SELLER PERSPECTIVE (Received Offer) */}
        {!isSent && normalizedStatus === 'Pending' && (
          <>
            {!showCounterInput ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onAccept && onAccept(offer.id)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept Offer</span>
                </button>
                <button
                  type="button"
                  onClick={() => onReject && onReject(offer.id)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-rose-700 hover:bg-rose-50 transition-colors border border-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCounterInput(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Counter Offer
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 animate-in fade-in">
                <div className="relative w-36">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={counterValue}
                    onChange={(e) => setCounterValue(Number(e.target.value))}
                    className="w-full pl-6 pr-2 py-1.5 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendCounter}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer"
                >
                  Send Counter
                </button>
                <button
                  type="button"
                  onClick={() => setShowCounterInput(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}

        {/* BUYER PERSPECTIVE (Sent Offer - Pending can be cancelled) */}
        {isSent && normalizedStatus === 'Pending' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onCancel && onCancel(offer.id)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-rose-700 hover:bg-rose-50 transition-colors border border-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel Offer</span>
            </button>
            <span className="text-xs text-slate-500">
              Awaiting seller's response
            </span>
          </div>
        )}

        {/* BUYER PERSPECTIVE (Countered offer - Buyer responds to counter) */}
        {isSent && normalizedStatus === 'Countered' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onAccept && onAccept(offer.id)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept Counter (₹{offer.counterPrice || offer.offerPrice})</span>
            </button>
            <button
              type="button"
              onClick={() => onReject && onReject(offer.id)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-rose-700 hover:bg-rose-50 transition-colors border border-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Decline</span>
            </button>
          </div>
        )}

        {/* Non-action status label */}
        {normalizedStatus !== 'Pending' && (!isSent || normalizedStatus !== 'Countered') && (
          <div className="text-xs text-slate-500 font-medium">
            Offer marked as {normalizedStatus.toLowerCase()}
          </div>
        )}

        {/* Chat Button */}
        {onChat && (
          <button
            type="button"
            onClick={() => onChat(offer)}
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-blue-600 transition-colors cursor-pointer ml-auto"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isSent ? 'Chat with Seller' : 'Chat with Buyer'}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default OfferCard;
