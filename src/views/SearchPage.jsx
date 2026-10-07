import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, BookOpen, Sparkles, Filter, ArrowRight } from 'lucide-react';
import { bookApi } from '../services/bookApi';
import { BookGrid } from '../components/cards/BookGrid';
import { CATEGORIES } from '../data/mockData';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('query') || searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = searchParams.get('query') || searchParams.get('q') || '';
    const cat = searchParams.get('category') || 'all';
    setSearchQuery(q);
    setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    bookApi.getAllBooks({
      query: searchQuery,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
    })
      .then((res) => {
        if (isMounted) {
          setBooks(res?.books || []);
          setTotal(res?.total || 0);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to query search books', err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [searchQuery, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({
      query: searchQuery.trim(),
      ...(selectedCategory !== 'all' ? { category: selectedCategory } : {})
    });
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setSearchParams({
      ...(searchQuery.trim() ? { query: searchQuery.trim() } : {}),
      ...(catId !== 'all' ? { category: catId } : {})
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Header Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Search Marketplace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-3">
              Find Your Next Book or Study Material
            </h1>
            <p className="text-indigo-200 text-sm sm:text-base mb-6">
              Search across thousands of textbooks, novels, competitive exam guides, and exchange offers near you.
            </p>

            {/* Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by book title, author, subject, or ISBN..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 font-medium focus:outline-hidden focus:ring-4 focus:ring-indigo-400/50 shadow-md text-sm sm:text-base"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {searchQuery ? (
                <>Results for &ldquo;<span className="text-indigo-600">{searchQuery}</span>&rdquo;</>
              ) : (
                'All Available Books'
              )}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Found {total} book{total === 1 ? '' : 's'} matching your search
            </p>
          </div>

          <Link
            to={`/books${searchQuery ? `?query=${encodeURIComponent(searchQuery)}` : ''}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 transition-colors shadow-xs w-fit"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Open Advanced Filters & Map</span>
          </Link>
        </div>

        {/* Book Grid */}
        <BookGrid
          books={books}
          loading={loading}
          emptyMessage={
            searchQuery
              ? `No books found matching "${searchQuery}". Try different keywords or browse all categories.`
              : 'No books available at the moment.'
          }
        />
      </div>
    </div>
  );
}
