import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home, Search } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8" />
      </div>
      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
        404 Page Not Found
      </span>
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1 mb-2">
        This Chapter Doesn't Exist
      </h1>
      <p className="text-slate-600 text-sm max-w-sm mb-6">
        The book listing or page you are looking for might have been removed, sold, or is temporarily unavailable.
      </p>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold shadow-xs hover:bg-blue-700 flex items-center gap-1.5 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/books"
          className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Browse Books</span>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
