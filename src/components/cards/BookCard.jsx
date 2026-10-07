import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MessageSquare, MapPin, ArrowRight } from 'lucide-react';
import { FavoriteButton } from '../common/FavoriteButton';
import { SellerBadge } from '../common/SellerBadge';
import { chatApi } from '../../services/chatApi';

export function BookCard({ book, onQuickView }) {
  const navigate = useNavigate();

  const handleChat = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const chat = await chatApi.startOrGetChatWithSeller(book, book.seller || {});
      navigate(`/chat/${chat.id}`);
    } catch (err) {
      navigate('/chat');
    }
  };

  const conditionColorMap = {
    'Like New': 'text-emerald-800 bg-emerald-50/90 border-emerald-200',
    'Used - Good': 'text-sky-800 bg-sky-50/90 border-sky-200',
    'Brand New': 'text-indigo-800 bg-indigo-50/90 border-indigo-200',
    'Acceptable': 'text-amber-800 bg-amber-50/90 border-amber-200'
  };

  const badgeClass = conditionColorMap[book.condition] || 'text-slate-700 bg-slate-100 border-slate-200';

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden h-full">
      {/* Book cover container */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden shrink-0">
        <img
          src={book.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
          alt={book.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Favorite button top right */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <FavoriteButton bookId={book.id} bookTitle={book.title} />
        </div>

        {/* Condition label top left */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold border backdrop-blur-xs shadow-2xs ${badgeClass}`}>
            {book.condition}
          </span>
        </div>

        {/* Quick View overlay on hover */}
        {onQuickView && (
          <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-3 pointer-events-none group-hover:pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(book);
              }}
              className="px-4 py-2 text-xs font-bold bg-white/95 text-slate-900 rounded-xl shadow-lg hover:bg-white hover:scale-105 transition-all cursor-pointer"
            >
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* Book details & metadata */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Price & Badges row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="text-xl font-bold text-slate-900 font-sans tracking-tight">
                ₹{book.price}
              </span>
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="text-xs text-slate-400 line-through truncate">
                  ₹{book.originalPrice}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {book.negotiable ? (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                  Negotiable
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 font-medium bg-slate-50 border border-slate-200/70 px-2 py-0.5 rounded-md">
                  Fixed
                </span>
              )}

              {book.transaction && book.transaction.includes('Exchange') && (
                <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-md" title="Open to book swap">
                  Swap
                </span>
              )}
            </div>
          </div>

          {/* Book title */}
          <Link to={`/books/${book.id}`} className="block group-hover:text-indigo-600 transition-colors">
            <h3 className="font-serif font-bold text-slate-900 text-base leading-snug line-clamp-1">
              {book.title}
            </h3>
          </Link>

          {/* Author */}
          <p className="text-xs text-slate-500 line-clamp-1">
            by <span className="font-semibold text-slate-700">{book.author}</span>
          </p>

          {/* Location & distance */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-0.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{book.location || book.city}</span>
            {book.distance && (
              <>
                <span className="text-slate-300">·</span>
                <span className="shrink-0 text-slate-600 font-medium">{book.distance}</span>
              </>
            )}
          </div>
        </div>

        {/* Card footer: Seller info & action buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
          {/* Seller snippet */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <img
              src={book.seller?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80'}
              alt={book.seller?.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-800 truncate max-w-[80px]">
                  {book.seller?.name?.split(' ')[0] || 'Seller'}
                </span>
                <SellerBadge verified={book.seller?.verified} isBusiness={book.seller?.isBusiness} compact={true} />
              </div>
              <div className="flex items-center gap-0.5 text-[10px] text-amber-600 font-semibold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                <span>
                  {Number(book.seller?.rating) > 0
                    ? Number(book.seller.rating).toFixed(1)
                    : (Number(book.rating) > 0 ? Number(book.rating).toFixed(1) : '4.9')}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleChat}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 rounded-xl transition-colors border border-slate-200 cursor-pointer"
              title="Chat with seller"
              aria-label="Chat with seller"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>

            <Link
              to={`/books/${book.id}`}
              className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 rounded-xl transition-colors flex items-center gap-1 shadow-xs"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
