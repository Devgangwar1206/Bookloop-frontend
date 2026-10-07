import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  MessageSquare, 
  UserPlus, 
  Check, 
  Clock, 
  ShieldCheck, 
  BookOpen,
  ThumbsUp,
  MessageCircle
} from 'lucide-react';
import { sellerApi } from '../services/sellerApi';
import { chatApi } from '../services/chatApi';
import { reviewApi } from '../services/reviewApi';
import { BookGrid } from '../components/cards/BookGrid';
import { SellerBadge } from '../components/common/SellerBadge';
import { RateSellerModal } from '../components/modals/RateSellerModal';
import { useToast } from '../context/ToastContext';

export function SellerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [seller, setSeller] = useState(null);
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);

  const loadSellerData = useCallback(async () => {
    try {
      const data = await sellerApi.getSellerProfile(id || 's-1');
      if (data) {
        setSeller(data);
        setBooks(data.books || []);
      }
      if (data?.id) {
        const fetchedReviews = await reviewApi.getSellerReviews(data.id);
        setReviews(fetchedReviews);
      }
    } catch (err) {
      console.warn('Failed to load seller profile data:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadSellerData();
  }, [loadSellerData]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    addToast(isFollowing ? `Unfollowed ${seller.name}` : `Following ${seller.name}. You will get notified on new listings.`, 'success');
  };

  const handleChat = async () => {
    try {
      const firstBook = books[0] || { id: 'b-general', title: 'Bookshelf Inquiry', price: 0 };
      const chat = await chatApi.startOrGetChatWithSeller(firstBook, seller);
      navigate(`/chat/${chat.id}`);
    } catch (err) {
      navigate('/chat');
    }
  };

  if (loading || !seller) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-6">
          <div className="h-48 bg-slate-200 rounded-3xl" />
          <div className="h-64 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            
            <div className="flex items-center gap-5">
              <img
                src={seller.avatar}
                alt={seller.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-slate-100 shadow-sm shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                    {seller.name}
                  </h1>
                  <SellerBadge verified={seller.verified} isBusiness={seller.isBusiness} />
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg">
                  {seller.bio || 'Avid reader, CS student, and book collector. Open to both cash sales and book swaps!'}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 flex-wrap">
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{seller.rating}</span>
                    <span className="text-slate-400 font-normal">({seller.reviewsCount || 12} reviews)</span>
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{seller.location}</span>
                  </span>
                  <span className="text-slate-300">·</span>
                  <span>Member since {seller.memberSince}</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto flex-wrap">
              <button
                type="button"
                onClick={() => setIsRateModalOpen(true)}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Star className="w-4 h-4 fill-white text-white" />
                <span>Rate Seller</span>
              </button>

              <button
                type="button"
                onClick={handleChat}
                className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Directly</span>
              </button>

              <button
                type="button"
                onClick={handleFollow}
                className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  isFollowing
                    ? 'bg-slate-100 border-slate-200 text-slate-800'
                    : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                }`}
              >
                {isFollowing ? <Check className="w-4 h-4 text-emerald-600" /> : <UserPlus className="w-4 h-4" />}
                <span>{isFollowing ? 'Following' : 'Follow Seller'}</span>
              </button>
            </div>
          </div>

          {/* 4 Stats Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-center">
            <div className="p-3 rounded-2xl bg-slate-50">
              <div className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
                {seller.totalListings || books.length || 0}
              </div>
              <div className="text-[11px] text-slate-500 font-medium uppercase mt-0.5">
                Books Listed
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50">
              <div className="text-xl sm:text-2xl font-bold text-emerald-700 font-sans">
                {seller.soldCount || 0}
              </div>
              <div className="text-[11px] text-slate-500 font-medium uppercase mt-0.5">
                Books Sold
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50">
              <div className="text-xl sm:text-2xl font-bold text-amber-700 font-sans">
                {Number(seller.rating) > 0 ? Number(seller.rating).toFixed(1) : '4.9'} ★
              </div>
              <div className="text-[11px] text-slate-500 font-medium uppercase mt-0.5">
                Seller Rating
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50">
              <div className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
                {seller.responseRate || '< 15 mins'}
              </div>
              <div className="text-[11px] text-slate-500 font-medium uppercase mt-0.5">
                Response Time
              </div>
            </div>
          </div>
        </div>

        {/* Books from this Seller */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Books from {seller.name}
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {books.length} active books
            </span>
          </div>

          <BookGrid
            books={books}
            skeletonCount={4}
            emptyTitle="No active books right now"
            emptyDescription="This seller currently has no active listings on their bookshelf."
          />
        </section>

        {/* Customer Reviews Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Community Feedback & Reviews
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Feedback from local buyers and book exchange partners ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-600 font-bold text-base">
                <Star className="w-5 h-5 fill-amber-500" />
                <span>{Number(seller.rating) > 0 ? Number(seller.rating).toFixed(1) : '4.9'} / 5.0</span>
              </div>
              <button
                type="button"
                onClick={() => setIsRateModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Rate Seller</span>
              </button>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.reviewerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&auto=format&fit=crop&q=80'}
                        alt={rev.reviewerName}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <span className="font-bold text-slate-900">{rev.reviewerName || 'Community Reader'}</span>
                    </div>
                    <span className="text-slate-400">
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: rev.rating || 5 }).map((_, r) => (
                      <Star key={r} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  {rev.comment && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  )}
                  {rev.bookTitle && (
                    <div className="text-[11px] text-slate-400">
                      Book: <strong>{rev.bookTitle}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                No customer reviews yet
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Have you interacted with or bought books from {seller.name}? Share your review to help fellow readers!
              </p>
              <button
                type="button"
                onClick={() => setIsRateModalOpen(true)}
                className="mt-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <Star className="w-3.5 h-3.5 fill-white text-white" />
                <span>Leave First Rating</span>
              </button>
            </div>
          )}
        </section>

      </div>

      <RateSellerModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        seller={seller}
        onSuccess={loadSellerData}
      />
    </div>
  );
}

export default SellerProfilePage;
