import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { offerApi } from '../../services/offerApi';
import { useToast } from '../../context/ToastContext';
import { Tag } from 'lucide-react';

export function MakeOfferModal({ isOpen, onClose, book }) {
  const [offerPrice, setOfferPrice] = useState(book?.price ? Math.round(book.price * 0.85) : '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleQuickPercent = (pct) => {
    if (book?.price) {
      setOfferPrice(Math.round(book.price * (pct / 100)));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offerPrice || Number(offerPrice) <= 0) {
      addToast('Please enter a valid offer price', 'error');
      return;
    }
    setLoading(true);
    try {
      await offerApi.makeOffer(book, offerPrice, message);
      addToast(`Offer of ₹${offerPrice} sent to ${book.seller?.name || 'seller'}!`, 'success');
      onClose();
    } catch (err) {
      addToast('Failed to send offer', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Make an Offer to Seller">
      <form onSubmit={handleSubmit} className="space-y-4">
        {book && (
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <img
              src={book.images?.[0]}
              alt={book.title}
              className="w-12 h-16 object-cover rounded-lg border border-slate-200"
            />
            <div className="min-w-0">
              <h4 className="font-serif font-semibold text-slate-900 text-sm truncate">
                {book.title}
              </h4>
              <div className="text-xs text-slate-500">
                Listed Price: <strong className="text-slate-800 text-sm">₹{book.price}</strong>
                {book.negotiable && <span className="ml-2 text-emerald-700 font-medium">· Price Negotiable</span>}
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Your Offer Price (₹) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold">₹</span>
            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 text-lg font-bold text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              placeholder="Enter your offer"
              min="10"
              required
            />
          </div>

          {/* Quick offer percentage suggestions */}
          {book?.price && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-slate-400">Quick suggestions:</span>
              {[90, 85, 80, 75].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleQuickPercent(pct)}
                  className="px-2 py-0.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  ₹{Math.round(book.price * (pct / 100))} ({pct}%)
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Message for Seller (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            placeholder="e.g. Can pick up today from Metro station, cash ready!"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{loading ? 'Sending...' : 'Send Offer'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default MakeOfferModal;
