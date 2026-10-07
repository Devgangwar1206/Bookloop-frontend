import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, BookOpen, MessageSquare } from 'lucide-react';
import { SellerBadge } from '../common/SellerBadge';

export function SellerCard({ seller, onChat }) {
  if (!seller) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3.5 mb-4">
        <img
          src={seller.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
          alt={seller.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="font-serif font-bold text-slate-900 text-base truncate">
              {seller.name}
            </h4>
            <SellerBadge verified={seller.verified} isBusiness={seller.isBusiness} />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <div className="flex items-center gap-0.5 text-amber-600 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{Number(seller.rating) > 0 ? Number(seller.rating).toFixed(1) : '4.9'}</span>
              <span className="text-slate-400">({seller.reviewsCount || 0})</span>
            </div>
            <span className="text-slate-300">·</span>
            <span>Member {seller.memberSince || 'since 2024'}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{seller.location || 'Noida, UP'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 py-3 px-4 bg-slate-50 rounded-xl text-center mb-4">
        <div>
          <div className="text-sm font-bold text-slate-900">{seller.totalListings || 6}</div>
          <div className="text-[11px] text-slate-500">Books Listed</div>
        </div>
        <div>
          <div className="text-sm font-bold text-emerald-700">{seller.soldCount || 4}</div>
          <div className="text-[11px] text-slate-500">Books Sold</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to={`/seller/${seller.id}`}
          className="flex-1 py-2 text-center text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
        >
          View Profile
        </Link>
        {onChat && (
          <button
            type="button"
            onClick={() => onChat(seller)}
            className="flex-1 py-2 text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default SellerCard;
