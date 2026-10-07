import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Heart, 
  MessageSquare, 
  ShoppingBag, 
  Package, 
  Tag, 
  ArrowLeftRight, 
  Search 
} from 'lucide-react';

const TYPE_CONFIG = {
  books: {
    icon: BookOpen,
    title: 'No books found',
    description: 'We couldn’t find any books matching your criteria. Try adjusting your filters or location radius.',
    ctaText: 'Browse All Books',
    ctaLink: '/books'
  },
  favorites: {
    icon: Heart,
    title: 'Your bookshelf is empty',
    description: 'Save books you’re interested in and find them here later when you are ready to buy or exchange.',
    ctaText: 'Discover Books',
    ctaLink: '/books'
  },
  chats: {
    icon: MessageSquare,
    title: 'No conversations yet',
    description: 'When you message a book owner or someone reaches out to buy your book, conversations appear here.',
    ctaText: 'Find Books Near You',
    ctaLink: '/books'
  },
  orders: {
    icon: ShoppingBag,
    title: 'No orders or purchases yet',
    description: 'Keep track of your book purchases, delivery status, and pickup arrangements right here.',
    ctaText: 'Start Shopping',
    ctaLink: '/books'
  },
  listings: {
    icon: Tag,
    title: 'No books listed for sale',
    description: 'Turn your unused books into cash or swap with readers nearby. Listing takes less than 2 minutes!',
    ctaText: 'Sell a Book Now',
    ctaLink: '/sell'
  },
  offers: {
    icon: Package,
    title: 'No price offers received',
    description: 'When potential buyers negotiate or make an offer on your listed books, they will appear here.',
    ctaText: 'Manage My Listings',
    ctaLink: '/dashboard/listings'
  },
  exchanges: {
    icon: ArrowLeftRight,
    title: 'No exchange requests',
    description: 'Swap your books with fellow community members without spending money. Propose an exchange on any listing!',
    ctaText: 'Explore Exchangeable Books',
    ctaLink: '/books?transaction=Exchange'
  },
  search: {
    icon: Search,
    title: 'No matching books found',
    description: 'Try searching by author name, exact title, ISBN number, or browse by categories.',
    ctaText: 'Reset Search',
    ctaLink: '/books'
  }
};

export function EmptyState({ type = 'books', title, description, ctaText, ctaLink, onCtaClick }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.books;
  const Icon = config.icon;
  const heading = title || config.title;
  const desc = description || config.description;
  const btnText = ctaText || config.ctaText;
  const link = ctaLink || config.ctaLink;

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 max-w-md mx-auto my-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>
      
      <h3 className="text-xl font-serif font-semibold text-slate-900 mb-2">
        {heading}
      </h3>
      
      <p className="text-sm text-slate-600 leading-relaxed mb-6">
        {desc}
      </p>

      {onCtaClick ? (
        <button
          onClick={onCtaClick}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
        >
          {btnText}
        </button>
      ) : (
        <Link
          to={link}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          {btnText}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
