import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Star, ShieldCheck } from 'lucide-react';
import { reviewApi } from '../../services/reviewApi';
import { useToast } from '../../context/ToastContext';
import { SellerBadge } from '../common/SellerBadge';

const RATING_LABELS = {
  1: 'Poor experience',
  2: 'Fair / Below expectations',
  3: 'Good experience',
  4: 'Very good / Highly recommended',
  5: 'Excellent! Perfect seller'
};

export function RateSellerModal({ isOpen, onClose, seller, book, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const activeRating = hoverRating || rating;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!seller && !book) return;

    const sellerId = seller?.id || book?.seller?.id;
    const bookId = book?.id;

    if (!sellerId && !bookId) {
      addToast('Cannot identify seller to rate.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await reviewApi.submitReview({
        sellerId,
        bookId,
        rating,
        comment
      });
      addToast('Thank you! Your seller rating has been submitted successfully.', 'success');
      if (onSuccess) {
        onSuccess(res);
      }
      onClose();
      setComment('');
    } catch (err) {
      console.error('Submit rating error:', err);
      addToast(err?.message || 'Failed to submit rating. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const sellerName = seller?.name || book?.seller?.name || 'Seller';
  const sellerAvatar = seller?.avatar || book?.seller?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80';
  const isVerified = seller?.verified || book?.seller?.verified;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rate & Review Seller">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Seller Info Header */}
        <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <img
            src={sellerAvatar}
            alt={sellerName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-serif font-bold text-slate-900 text-base truncate">
                {sellerName}
              </span>
              <SellerBadge verified={isVerified} compact={true} />
            </div>
            {book?.title && (
              <p className="text-xs text-slate-500 truncate mt-0.5">
                Regarding: <span className="font-medium text-slate-700">"{book.title}"</span>
              </p>
            )}
            <p className="text-[11px] text-slate-400">
              Your feedback helps keep BookLoop trustworthy and safe for readers.
            </p>
          </div>
        </div>

        {/* Rating Stars Selection */}
        <div className="text-center py-2 space-y-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Overall Rating *
          </label>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 rounded-lg hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= activeRating
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-slate-100 text-slate-300 hover:text-amber-200'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="text-xs font-semibold text-amber-600 h-5">
            {RATING_LABELS[activeRating] || ''}
          </div>
        </div>

        {/* Review Comments */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Your Review & Feedback
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share details about book condition, communication, speed, or meetup experience..."
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
            maxLength={1000}
          />
          <div className="text-right text-[10px] text-slate-400 mt-1">
            {comment.length}/1000 characters
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default RateSellerModal;
