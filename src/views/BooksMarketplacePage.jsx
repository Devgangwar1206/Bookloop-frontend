
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterSidebar } from '../components/marketplace/FilterSidebar';
import { FilterModal } from '../components/marketplace/FilterModal';
import { BookGrid } from '../components/cards/BookGrid';
import { bookApi } from '../services/bookApi';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  RotateCcw
} from 'lucide-react';

export function BooksMarketplacePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read filters from URL.
  // IMPORTANT: Do not automatically apply selectedLocation here.
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    condition: searchParams.get('condition') || 'all',
    listingType: searchParams.get('listingType') || 'all',
    transaction: searchParams.get('transaction') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    city: searchParams.get('city') || 'all',
    radius: searchParams.get('radius') || '25 km',
    language: searchParams.get('language') || 'all',
    delivery: searchParams.get('delivery') || 'all',
    verifiedOnly: searchParams.get('verified') === 'true',
    sortBy: searchParams.get('sortBy') || 'relevance',
    query: searchParams.get('query') || ''
  });

  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync all filters whenever URL query parameters change.
  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || 'all',
      condition: searchParams.get('condition') || 'all',
      listingType: searchParams.get('listingType') || 'all',
      transaction: searchParams.get('transaction') || 'all',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      city: searchParams.get('city') || 'all',
      radius: searchParams.get('radius') || '25 km',
      language: searchParams.get('language') || 'all',
      delivery: searchParams.get('delivery') || 'all',
      verifiedOnly: searchParams.get('verified') === 'true',
      sortBy: searchParams.get('sortBy') || 'relevance',
      query: searchParams.get('query') || ''
    });
  }, [searchParams]);

  // Load marketplace books whenever filters change.
  useEffect(() => {
    let isMounted = true;

    setLoading(true);

    bookApi.getAllBooks(filters)
      .then((res) => {
        if (isMounted) {
          setBooks(res.books || []);
          setTotal(res.total || 0);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to query marketplace books', err);

        if (isMounted) {
          setBooks([]);
          setTotal(0);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      category: 'all',
      condition: 'all',
      listingType: 'all',
      transaction: 'all',
      minPrice: '',
      maxPrice: '',
      city: 'all',
      radius: '25 km',
      language: 'all',
      delivery: 'all',
      verifiedOnly: false,
      sortBy: 'relevance',
      query: ''
    };

    setFilters(resetFilters);
    setSearchParams({});
  };

  // Check whether any filter is currently active.
  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.condition !== 'all' ||
    filters.listingType !== 'all' ||
    filters.transaction !== 'all' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.city !== 'all' ||
    filters.language !== 'all' ||
    filters.delivery !== 'all' ||
    filters.verifiedOnly ||
    filters.query !== '';

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Heading & Search strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-slate-200">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Books for Sale & Exchange
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing{' '}
              <strong className="text-slate-800 font-semibold">
                {total} listings
              </strong>{' '}
              available across reader shelves
              {filters.city && filters.city !== 'all'
                ? ` in ${filters.city}`
                : ''}
            </p>
          </div>

          {/* Quick search input */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />

              <input
                type="text"
                placeholder="Filter by title, author, ISBN..."
                value={filters.query}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    query: e.target.value
                  })
                }
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs transition-all"
              />
            </div>

            {/* Mobile filter button trigger */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl shadow-2xs text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Marketplace Grid: Filters Sidebar + Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Right Main Column: Sorting Bar & Book Grid */}
          <main className="lg:col-span-9 space-y-6">

            {/* Sorting & Active filter chips */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />

                <span className="font-semibold text-slate-800">
                  Sort by:
                </span>

                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      sortBy: e.target.value
                    })
                  }
                  className="bg-transparent text-xs font-semibold text-slate-900 border-0 outline-none cursor-pointer focus:ring-0"
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="nearest">Nearest First</option>
                  <option value="best-rated">Best Rated Sellers</option>
                </select>
              </div>

              {/* Reset if active filters */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear applied filters</span>
                </button>
              )}
            </div>

            {/* Book listings grid with generous card container size */}
            <BookGrid
              books={books}
              loading={loading}
              skeletonCount={6}
              className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              emptyType="books"
              emptyTitle="No books match these filters"
              emptyDescription="Try clearing some filter tags, broadening your radius, or checking another category."
            />
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <FilterModal
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={total}
      />
    </div>
  );
}

export default BooksMarketplacePage;