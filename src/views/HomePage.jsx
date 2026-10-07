import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  ArrowLeftRight, 
  ShoppingBag, 
  Sparkles, 
  MapPin, 
  MessageSquare, 
  Star, 
  CheckCircle2,
  PlusCircle,
  GraduationCap,
  Award,
  Cpu,
  Activity,
  Bookmark,
  Feather,
  Smile,
  Compass,
  FileText,
  Layers
} from 'lucide-react';
import { SearchBar } from '../components/common/SearchBar';
import { BookCard } from '../components/cards/BookCard';
import { BookGrid } from '../components/cards/BookGrid';
import { Modal } from '../components/common/Modal';
import { CATEGORIES } from '../data/mockData';
import { bookApi } from '../services/bookApi';
import { useMarketplace } from '../context/MarketplaceContext';

const ICON_MAP = {
  BookOpen,
  GraduationCap,
  Award,
  Cpu,
  Activity,
  Bookmark,
  Feather,
  Smile,
  Compass,
  Sparkles,
  FileText,
  Layers
};

export function HomePage() {
  const [popularBooks, setPopularBooks] = useState([]);
  const [nearBooks, setNearBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewBook, setQuickViewBook] = useState(null);
  const { selectedLocation } = useMarketplace();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [pop, near] = await Promise.all([
          bookApi.getPopularBooks(),
          bookApi.getBooksNearYou(selectedLocation)
        ]);
        if (isMounted) {
          setPopularBooks(pop.slice(0, 8));
          setNearBooks(near.slice(0, 4));
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load homepage books', err);
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [selectedLocation]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ==================================================
          HERO SECTION
          ================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-slate-50 to-slate-50 pt-10 sm:pt-16 pb-12 sm:pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Headlines & Search */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Give Every Book <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600 italic font-serif">Another Chapter.</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Buy, sell and exchange pre-loved textbooks, competitive guides, and bestselling novels from readers near you. Save money and pass stories forward.
              </p>

              {/* Large Marketplace Search Bar */}
              <div className="pt-2 max-w-2xl mx-auto lg:mx-0">
                <SearchBar size="large" showLocation={true} />
              </div>

              {/* Action Buttons with distinct purposeful colors */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2 w-full max-w-md mx-auto lg:mx-0">
                <Link
                  to="/books"
                  className="px-6 py-3 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 text-center"
                >
                  <span>Explore All Books</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/sell"
                  className="px-6 py-3 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 text-center"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-100" />
                  <span>Sell a Book in 60s</span>
                </Link>
              </div>

              {/* Trust micro metrics */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero Listing Fees</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Direct Local Meetups</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Verified Readers & Sellers</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual book composition */}
                <div className="relative rounded-3xl p-4 bg-gradient-to-tr from-indigo-100/60 via-blue-50/40 to-emerald-100/40 border border-slate-200/80 shadow-xl backdrop-blur-xs">
                  <img
                    src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80"
                    alt="Stack of books on a wooden table"
                    className="w-full h-80 sm:h-96 object-cover rounded-2xl shadow-md"
                  />
                  
                  {/* Floating badge 1: Exchange card */}
                  <div className="absolute -bottom-3 sm:-bottom-4 left-2 sm:-left-4 bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-2 sm:gap-3 animate-in fade-in zoom-in duration-300 max-w-[85%] sm:max-w-none">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-200/60">
                      <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Exchange Ready</div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500">Swap books with 0 platform fees</div>
                    </div>
                  </div>

                  {/* Floating badge 2: Verified Seller */}
                  <div className="absolute -top-3 sm:-top-4 right-2 sm:-right-4 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-1.5 sm:gap-2.5 max-w-[85%] sm:max-w-none">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <div className="text-xs font-semibold text-slate-800">
                      Nearby in {selectedLocation}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          QUICK CATEGORIES
          ================================================== */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Explore by Category
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                From academic coursebooks to popular fiction and competitive exam guides
              </p>
            </div>
            <Link
              to="/books"
              className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = ICON_MAP[cat.icon] || BookOpen;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => navigate(`/books?category=${encodeURIComponent(cat.name)}`)}
                  className="group flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50/70 hover:bg-indigo-600 border border-slate-200/80 hover:border-indigo-600 transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-1"
                >
                  <div className="w-11 h-11 rounded-xl bg-white group-hover:bg-white/20 text-indigo-600 group-hover:text-white flex items-center justify-center transition-colors mb-2.5 shadow-2xs ring-1 ring-slate-100 group-hover:ring-transparent">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-white transition-colors line-clamp-1">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-slate-500 group-hover:text-indigo-100 transition-colors mt-0.5 font-medium">
                    {cat.count} listings
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================================================
          LOCATION BASED MARKETPLACE: BOOKS NEAR YOU
          ================================================== */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Location Based Marketplace</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Books Near You ({selectedLocation})
            </h2>
          </div>
          <Link
            to={`/books?city=${encodeURIComponent(selectedLocation)}`}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All Nearby</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <BookGrid
          books={nearBooks}
          loading={loading}
          skeletonCount={4}
          onQuickView={setQuickViewBook}
        />
      </section>

      {/* ==================================================
          BUY / SELL / EXCHANGE 3 FEATURE CARDS
          ================================================== */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              More Than Just Buying
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              BookLoop empowers readers with 3 simple ways to keep literature in motion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Buy Books Card */}
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center mb-5">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
                  BUY BOOKS
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  "Find the books you need at prices that make sense." Access rare editions, student textbooks, and popular fiction at up to 70% off retail prices.
                </p>
              </div>
              <Link
                to="/books"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline"
              >
                <span>Browse Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Sell Books Card */}
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 flex items-center justify-center mb-5">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
                  SELL BOOKS
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  "Have books you no longer need? List them in minutes." Snap a photo, set your price, and deal directly with genuine readers without middleman commissions.
                </p>
              </div>
              <Link
                to="/sell"
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:underline"
              >
                <span>Sell a Book Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Exchange Books Card */}
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center mb-5">
                  <ArrowLeftRight className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
                  EXCHANGE BOOKS
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  "Swap your old books with someone looking for yours." Enjoy endless reading without spending money. Discover other readers with matching book tastes.
                </p>
              </div>
              <Link
                to="/books?transaction=exchange"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:underline"
              >
                <span>Explore Book Swaps</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          POPULAR BOOKS
          ================================================== */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 mb-8">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              Curated Community Shelf
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Popular Books Across BookLoop
            </h2>
          </div>
          <Link
            to="/books?sortBy=newest"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <BookGrid
          books={popularBooks}
          loading={loading}
          skeletonCount={8}
          onQuickView={setQuickViewBook}
        />
      </section>

      {/* ==================================================
          HOW IT WORKS (4 STEPS)
          ================================================== */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              How BookLoop Works
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Simple, transparent, and direct trading in four easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Find a Book',
                desc: 'Search by title, author, category, or filter by your city radius to find books near your home or college.'
              },
              {
                step: '02',
                title: 'Chat with Seller',
                desc: 'Directly message the owner or bookstore, ask questions about book condition, and negotiate fair prices.'
              },
              {
                step: '03',
                title: 'Buy or Exchange',
                desc: 'Meet safely at a public landmark like a Metro gate or opt for courier shipping according to your preference.'
              },
              {
                step: '04',
                title: 'Read & Repeat',
                desc: 'Enjoy your book, rate your fellow reader, and when you are finished, relist it to give it another life.'
              }
            ].map((s) => (
              <div
                key={s.step}
                className="relative bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="font-serif text-3xl font-bold text-blue-600 mb-3">
                    {s.step}
                  </div>
                  <h3 className="font-serif font-bold text-slate-900 text-lg mb-2">
                    {s.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          TRUST SECTION: BUY WITH CONFIDENCE
          ================================================== */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Buy with Confidence
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Safety and transparency built into every interaction
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: 'Verified Sellers', desc: 'Govt ID & phone verified accounts', icon: ShieldCheck },
              { title: 'Secure Chat', desc: 'No phone numbers shared until you decide', icon: MessageSquare },
              { title: 'Seller Ratings', desc: 'Honest reviews from real local buyers', icon: Star },
              { title: 'Report Listings', desc: 'Active moderation and zero-scam policy', icon: CheckCircle2 },
              { title: 'Safe Marketplace', desc: 'Guidance for safe public meetups', icon: Sparkles },
              { title: 'Clear Condition', desc: 'High-res photos and transparent notes', icon: BookOpen }
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-white rounded-2xl p-4 border border-slate-200 text-center shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif font-bold text-slate-900 text-sm mb-1">
                    {f.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================================================
          LARGE BOTTOM CTA
          ================================================== */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
            <BookOpen className="w-7 h-7" />
          </div>
          
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Got Books Sitting on Your Shelf?
          </h2>
          
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Turn your old books into money or exchange them for something new. Join thousands of readers in your city who trade books every day on BookLoop.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/sell"
              className="px-8 py-3.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition-all"
            >
              Sell Your Book
            </Link>
            <Link
              to="/books"
              className="px-8 py-3.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs border border-white/20 transition-all"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewBook && (
        <Modal
          isOpen={!!quickViewBook}
          onClose={() => setQuickViewBook(null)}
          title="Quick Book Preview"
          maxWidth="max-w-2xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="aspect-[4/5] bg-slate-100 rounded-xl overflow-hidden">
              <img
                src={quickViewBook.images?.[0]}
                alt={quickViewBook.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {quickViewBook.condition}
                </span>
                <h3 className="font-serif font-bold text-slate-900 text-lg mt-2">
                  {quickViewBook.title}
                </h3>
                <p className="text-xs text-slate-600 mb-3">
                  by {quickViewBook.author}
                </p>
                <div className="text-2xl font-bold text-slate-900 font-sans mb-3">
                  ₹{quickViewBook.price}
                  {quickViewBook.negotiable && (
                    <span className="text-xs text-slate-500 font-normal ml-2">
                      (Price Negotiable)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {quickViewBook.description}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Link
                  to={`/books/${quickViewBook.id}`}
                  className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default HomePage;
