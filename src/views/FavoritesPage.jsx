import React, { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { bookApi } from '../services/bookApi';
import { useMarketplace } from '../context/MarketplaceContext';
import { BookCard } from '../components/cards/BookCard';
import { EmptyState } from '../components/common/EmptyState';

export function FavoritesPage() {
  const { favorites, toggleFavorite } = useMarketplace();
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    bookApi.getFavorites()
      .then((favs) => {
        if (isMounted) {
          setSavedBooks(Array.isArray(favs) ? favs : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load wishlist:', err);
        if (isMounted) {
          setSavedBooks([]);
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
              <Heart className="w-3.5 h-3.5 fill-rose-600" />
              <span>Saved Bookshelf</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              My Saved Books ({savedBooks.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Books you have bookmarked for purchase or exchange negotiation
            </p>
          </div>
        </div>

        {savedBooks.length === 0 ? (
          <EmptyState
            type="favorites"
            title="Your saved bookshelf is empty"
            description="Click the heart icon on any book across BookLoop to track listings and contact sellers later."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {savedBooks.map((book) => (
              <div key={book.id} className="relative group">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default FavoritesPage;
