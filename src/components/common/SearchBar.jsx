import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, User, Layers, ArrowRight } from 'lucide-react';
import { LocationSelector } from './LocationSelector';
import { INITIAL_BOOKS, CATEGORIES } from '../../data/mockData';

export function SearchBar({ showLocation = true, size = 'default', className = '' }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const q = query.toLowerCase();

    // Match books
    const matchedBooks = INITIAL_BOOKS
      .filter(b => b.title.toLowerCase().includes(q))
      .slice(0, 3)
      .map(b => ({ type: 'book', title: b.title, subtitle: b.author, id: b.id }));

    // Match authors
    const matchedAuthors = Array.from(new Set(INITIAL_BOOKS.map(b => b.author)))
      .filter(a => a.toLowerCase().includes(q))
      .slice(0, 2)
      .map(a => ({ type: 'author', title: a, subtitle: 'Author' }));

    // Match categories
    const matchedCategories = CATEGORIES
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 2)
      .map(c => ({ type: 'category', title: c.name, subtitle: 'Category', id: c.id }));

    setSuggestions([...matchedBooks, ...matchedAuthors, ...matchedCategories]);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setIsFocused(false);
    navigate(`/books?query=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectSuggestion = (item) => {
    setIsFocused(false);
    if (item.type === 'book') {
      navigate(`/books/${item.id}`);
    } else if (item.type === 'author') {
      navigate(`/books?query=${encodeURIComponent(item.title)}`);
    } else if (item.type === 'category') {
      navigate(`/books?category=${encodeURIComponent(item.id)}`);
    }
  };

  const isLarge = size === 'large';

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <form
        onSubmit={handleSearch}
        className={`flex items-center w-full bg-white rounded-2xl border transition-all duration-200 shadow-xs ${
          isFocused ? 'border-blue-600 ring-3 ring-blue-500/10 shadow-md' : 'border-slate-200 hover:border-slate-300'
        } ${isLarge ? 'p-1.5 sm:p-2' : 'p-1'}`}
      >
        {showLocation && (
          <div className="hidden sm:flex items-center pl-1 pr-2 border-r border-slate-200">
            <LocationSelector />
          </div>
        )}

        <div className="flex items-center flex-1 px-3 min-w-0">
          <Search className={`text-slate-400 shrink-0 ${isLarge ? 'w-5 h-5 mr-2.5' : 'w-4 h-4 mr-2'}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search books, authors, ISBN..."
            className="w-full bg-transparent border-0 outline-none text-slate-800 placeholder-slate-400 text-sm focus:ring-0"
          />
        </div>

        <button
          type="submit"
          className={`shrink-0 flex items-center justify-center font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-xl shadow-xs cursor-pointer ${
            isLarge ? 'px-5 py-2.5 text-sm' : 'px-3.5 py-1.5 text-xs'
          }`}
        >
          <span>Search</span>
          {isLarge && <ArrowRight className="w-4 h-4 ml-1.5 hidden sm:inline" />}
        </button>
      </form>

      {/* Live search dropdown suggestions */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Quick Suggestions
          </div>
          {suggestions.map((item, idx) => (
            <button
              key={`${item.type}-${idx}`}
              type="button"
              onClick={() => handleSelectSuggestion(item)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-blue-50/60 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                {item.type === 'book' && <BookOpen className="w-3.5 h-3.5 text-blue-600" />}
                {item.type === 'author' && <User className="w-3.5 h-3.5 text-indigo-600" />}
                {item.type === 'category' && <Layers className="w-3.5 h-3.5 text-sky-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-slate-800 font-medium truncate">{item.title}</div>
                <div className="text-xs text-slate-400 truncate">{item.subtitle}</div>
              </div>
              <span className="text-[11px] font-medium text-slate-400 uppercase">
                {item.type}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
