import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export function FavoriteButton({ bookId, bookTitle, className = '' }) {
  const { isFavorite, toggleFavorite } = useMarketplace();
  const [animating, setAnimating] = useState(false);
  const favorited = isFavorite(bookId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    await toggleFavorite(bookId, bookTitle);
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`relative p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
        favorited 
          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 shadow-xs' 
          : 'bg-white/90 text-stone-600 hover:text-stone-900 hover:bg-white shadow-xs'
      } ${animating ? 'scale-125' : 'scale-100'} ${className}`}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`w-4 h-4 transition-colors ${
          favorited ? 'fill-rose-500 text-rose-500' : 'stroke-[2]'
        }`}
      />
    </button>
  );
}

export default FavoriteButton;
