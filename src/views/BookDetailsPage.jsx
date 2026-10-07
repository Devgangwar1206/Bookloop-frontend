import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  ShoppingBag, 
  Tag, 
  ArrowLeftRight, 
  Heart, 
  AlertTriangle, 
  Share2, 
  Clock, 
  BookOpen, 
  Check, 
  Store,
  ChevronRight
} from 'lucide-react';
import { bookApi } from '../services/bookApi';
import { chatApi } from '../services/chatApi';
import { orderApi } from '../services/orderApi';
import { BookGrid } from '../components/cards/BookGrid';
import { SellerBadge } from '../components/common/SellerBadge';
import { FavoriteButton } from '../components/common/FavoriteButton';
import { ReportModal } from '../components/modals/ReportModal';
import { MakeOfferModal } from '../components/modals/MakeOfferModal';
import { RequestExchangeModal } from '../components/modals/RequestExchangeModal';
import { RateSellerModal } from '../components/modals/RateSellerModal';
import { BookLocationMap } from '../components/common/BookLocationMap';
import { useToast } from '../context/ToastContext';

export function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [rateModalOpen, setRateModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setSelectedImage(0);

    bookApi.getBookById(id)
      .then(async (data) => {
        if (isMounted) {
          setBook(data);
          // fetch recommendations in same category
          const all = await bookApi.getAllBooks({ category: data.category });
          if (isMounted) {
            setSimilarBooks(all.books.filter(b => b.id !== id).slice(0, 4));
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        console.warn('Book not found in active listings:', err?.message || err);
        if (isMounted) {
          setBook(null);
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-8">
          <div className="h-8 bg-slate-200 rounded w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 h-96 bg-slate-200 rounded-2xl" />
            <div className="lg:col-span-6 space-y-4">
              <div className="h-10 bg-slate-200 rounded w-3/4" />
              <div className="h-6 bg-slate-200 rounded w-1/2" />
              <div className="h-16 bg-slate-200 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">
          Book Listing Not Found
        </h2>
        <p className="text-slate-600 text-sm max-w-sm mb-6">
          This listing may have been sold or removed by its owner.
        </p>
        <Link
          to="/books"
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-xs hover:bg-blue-700 transition-colors"
        >
          Explore Other Books
        </Link>
      </div>
    );
  }

  const handleChat = async () => {
    try {
      const chat = await chatApi.startOrGetChatWithSeller(book, book.seller || {});
      navigate(`/chat/${chat.id}`);
    } catch (err) {
      navigate('/chat');
    }
  };

  const handleBuyNow = async () => {
    try {
      await orderApi.createOrder(book, book.delivery === 'Pickup' ? 'Meetup Pickup' : 'Local Delivery');
      addToast(`Order placed for "${book.title}"! Track it in your Orders dashboard.`, 'success');
      navigate('/dashboard/orders');
    } catch (err) {
      addToast('Failed to place order', 'error');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Listing link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-slate-800 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link to="/books" className="hover:text-slate-800 transition-colors">Marketplace</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link to={`/books?category=${encodeURIComponent(book.category)}`} className="hover:text-slate-800 transition-colors">
            {book.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-medium truncate max-w-[200px]">{book.title}</span>
        </nav>

        {/* Top Listing Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
              <img
                src={book.images?.[selectedImage] || book.images?.[0]}
                alt={book.title}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
              <div className="absolute top-4 right-4">
                <FavoriteButton bookId={book.id} bookTitle={book.title} className="p-2.5 shadow-md" />
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200/80 shadow-xs">
                  {book.condition}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {book.images && book.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {book.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImage === idx ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Main Details & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              
              {/* Category & Action icons */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {book.category}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Share listing"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(true)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Report listing"
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Author */}
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-1.5">
                  {book.title}
                </h1>
                <p className="text-sm text-slate-600">
                  Written by <span className="font-semibold text-slate-800">{book.author}</span>
                </p>
              </div>

              {/* Price & Badges */}
              <div className="flex items-baseline gap-3 pb-4 border-b border-slate-100 flex-wrap">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
                  ₹{book.price}
                </span>
                {book.originalPrice && (
                  <span className="text-base text-slate-400 line-through">
                    ₹{book.originalPrice}
                  </span>
                )}
                <div className="flex items-center gap-1.5 ml-auto">
                  {book.negotiable && (
                    <span className="px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 rounded-lg border border-amber-200">
                      Negotiable
                    </span>
                  )}
                  {book.transaction && (
                    <span className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200">
                      {book.transaction}
                    </span>
                  )}
                </div>
              </div>

              {/* Location & Distance */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{book.location || book.city}</span>
                {book.distance && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="font-semibold text-slate-800">{book.distance}</span>
                  </>
                )}
              </div>

              {/* Exchange preference alert if available */}
              {book.exchangePreferences && (
                <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-start gap-2.5">
                  <ArrowLeftRight className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900">
                    <strong>Exchange Offer:</strong> {book.exchangePreferences}
                  </div>
                </div>
              )}

              {/* PRIMARY ACTION BUTTONS */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy Now (₹{book.price})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleChat}
                    className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat with Seller</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOfferModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Tag className="w-4 h-4 text-amber-700" />
                    <span>Make an Offer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExchangeModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeftRight className="w-4 h-4 text-teal-700" />
                    <span>Request Book Swap</span>
                  </button>
                </div>
              </div>

              {/* Safety notice banner */}
              <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Meet safely in public daylight locations. Inspect book before paying.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Info Section: Description & Specs on Left, Seller Info on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Description & Specs */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <h2 className="font-serif text-xl font-bold text-slate-900 mb-4">
                Description
              </h2>
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {book.description}
              </div>
            </div>

            {/* Book Details Specifications */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <h2 className="font-serif text-xl font-bold text-slate-900 mb-4">
                Book Details
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-xs font-medium">ISBN</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{book.isbn || 'N/A'}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-xs font-medium">Edition</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{book.edition || 'Standard'}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-xs font-medium">Publisher</div>
                  <div className="font-semibold text-slate-900 mt-0.5 truncate">{book.publisher || 'Independent'}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-xs font-medium">Language</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{book.language || 'English'}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-xs font-medium">Pages</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{book.pages || '320'} pages</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-xs font-medium">Publication Year</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{book.publicationYear || '2023'}</div>
                </div>
              </div>
            </div>

            {/* Google Maps Pickup & Handover Location */}
            <BookLocationMap
              location={book.location}
              city={book.city}
              distance={book.distance}
              bookTitle={book.title}
            />

          </div>

          {/* Right Column: Seller Profile Widget */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
              <h3 className="font-serif text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                Seller Information
              </h3>

              <div className="flex items-center gap-4">
                <img
                  src={book.seller?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                  alt={book.seller?.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-serif font-bold text-slate-900 text-base">
                      {book.seller?.name}
                    </h4>
                    <SellerBadge verified={book.seller?.verified} isBusiness={book.seller?.isBusiness} />
                  </div>

                  <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{book.seller?.rating || '4.9'}</span>
                    <span className="text-slate-400 font-normal">({book.seller?.reviewsCount || 15} reviews)</span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1">
                    Member since {book.seller?.memberSince || '2024'}
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl text-center">
                <div>
                  <div className="text-sm font-bold text-slate-900">{book.seller?.totalListings || 6}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-medium">Total Listings</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-700">{book.seller?.soldCount || 4}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-medium">Books Sold</div>
                </div>
              </div>

              {book.seller?.responseRate && (
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{book.seller.responseRate}</span>
                </div>
              )}

              {/* Profile, Chat & Rate buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  to={`/seller/${book.seller?.id || 's-1'}`}
                  className="w-full py-2.5 text-center text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors block"
                >
                  View Seller Profile
                </Link>
                <button
                  type="button"
                  onClick={handleChat}
                  className="w-full py-2.5 text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat Directly</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRateModalOpen(true)}
                  className="w-full py-2.5 text-center text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>Rate Seller</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Books Recommendations */}
        {similarBooks.length > 0 && (
          <section className="pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Similar Books You May Like
              </h2>
              <Link
                to={`/books?category=${encodeURIComponent(book.category)}`}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View more in {book.category}
              </Link>
            </div>
            <BookGrid books={similarBooks} skeletonCount={4} />
          </section>
        )}
      </div>

      {/* Modals */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        book={book}
      />
      <MakeOfferModal
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        book={book}
      />
      <RequestExchangeModal
        isOpen={exchangeModalOpen}
        onClose={() => setExchangeModalOpen(false)}
        targetBook={book}
      />
      <RateSellerModal
        isOpen={rateModalOpen}
        onClose={() => setRateModalOpen(false)}
        seller={book?.seller}
        book={book}
        onSuccess={() => {
          bookApi.getBookById(id).then((b) => b && setBook(b));
        }}
      />
    </div>
  );
}

export default BookDetailsPage;
