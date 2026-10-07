
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  PlusCircle,
  MessageSquare,
  Heart,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Search,
  Store,
  Shield,
  Settings,
  Layers,
  ChevronDown
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { SearchBar } from '../common/SearchBar';
import { LocationSelector } from '../common/LocationSelector';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadMessages, unreadNotifications, favorites } = useMarketplace();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const profileMenuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  /*
   * ============================================================
   * ROLE LOGIC
   * ============================================================
   *
   * Supported seller roles:
   * SELLER
   * BUSINESS
   *
   * Admin:
   * ADMIN
   *
   * Normal user:
   * USER / anything else
   */

  const role = String(user?.role || '').toUpperCase();

  const isAdmin = role === 'ADMIN';

  const isSeller =
    role === 'SELLER' ||
    role === 'BUSINESS';

  const isNormalUser =
    !isAdmin &&
    !isSeller;

  /*
   * ============================================================
   * PROFILE LABEL
   * ============================================================
   */

  const profileLabel = isAdmin
    ? 'Admin Profile'
    : isSeller
      ? 'Seller Profile'
      : 'User Profile';

  /*
   * ============================================================
   * CLOSE MENUS WHEN ROUTE CHANGES
   * ============================================================
   */

  useEffect(() => {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  /*
   * ============================================================
   * CLOSE PROFILE DROPDOWN WHEN CLICKING OUTSIDE
   * ============================================================
   */

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   *
   * Available for EVERY authenticated role:
   * USER
   * SELLER
   * ADMIN
   */

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-14 sm:h-18 gap-2 sm:gap-6">

          {/* LEFT: BookLoop Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-2.5 shrink-0 group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-all">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg sm:text-2xl text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                BookLoop
              </span>

              <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase mt-0.5 hidden sm:block">
                Buy · Sell · Exchange
              </span>
            </div>
          </Link>

          {/* CENTER: Search Bar with embedded location (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-2">
            <SearchBar size="default" />
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">

            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle mobile search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Sell a Book Primary CTA */}
            <Link
              to="/sell"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Sell a Book</span>
            </Link>

            {/* Chat Icon with Badge (Desktop/Tablet - Mobile has Chat in bottom nav) */}
            <Link
              to="/chat"
              className="relative p-1.5 sm:p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors hidden sm:block"
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />

              {unreadMessages > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-2xs">
                  {unreadMessages}
                </span>
              )}
            </Link>

            {/* Favorites Icon */}
            <Link
              to="/favorites"
              className="relative p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors hidden xs:block"
              title="Saved Books"
            >
              <Heart className="w-5 h-5" />

              {favorites.size > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.size}
                </span>
              )}
            </Link>

            {/* Notifications Icon with Badge */}
            <Link
              to="/notifications"
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors hidden sm:block"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />

              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Link>

            {/* ==================================================
                USER PROFILE / LOGIN DROPDOWN
               ================================================== */}

            {isAuthenticated ? (

              <div
                className="relative"
                ref={profileMenuRef}
              >

                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 p-1 sm:px-2 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <img
                    src={
                      user?.avatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80'
                    }
                    alt={user?.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200"
                  />

                  <span className="text-xs font-semibold text-slate-800 hidden lg:block max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>

                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
                </button>

                {profileMenuOpen && (

                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">

                    {/* User Information */}
                    <div className="px-4 py-2 border-b border-slate-100">

                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {user?.name}
                      </div>

                      <div className="text-xs text-slate-500 truncate">
                        {user?.email}
                      </div>

                    </div>

                    <div className="py-1">

                      {/* ==================================================
                          SELLER DASHBOARD
                          SELLER / BUSINESS ONLY
                         ================================================== */}

                      {!isAdmin && (
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Layers className="w-4 h-4 text-slate-400" />
                          <span>Seller Dashboard</span>
                        </Link>
                      )}

                      {/* ==================================================
                          MY BOOK LISTINGS
                          USER + SELLER
                          ADMIN ❌
                         ================================================== */}

                      {!isAdmin && (
                        <Link
                          to="/dashboard/listings"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <BookOpen className="w-4 h-4 text-slate-400" />
                          <span>My Book Listings</span>
                        </Link>
                      )}

                      {/* ==================================================
                          ORDERS & PURCHASES
                          USER + SELLER
                          ADMIN ❌
                         ================================================== */}

                      {!isAdmin && (
                        <Link
                          to="/dashboard/orders"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Layers className="w-4 h-4 text-slate-400" />
                          <span>Orders & Purchases</span>
                        </Link>
                      )}

                      {/* ==================================================
                          PROFILE
                          EVERYONE
                         ================================================== */}

                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <User className="w-4 h-4 text-slate-400" />

                        <span>
                          {profileLabel}
                        </span>
                      </Link>

                      {/* ==================================================
                          PROFESSIONAL STORE
                          SELLER / BUSINESS ONLY
                         ================================================== */}

                      {isSeller && (
                        <Link
                          to="/business"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Store className="w-4 h-4 text-slate-400" />
                          <span>Professional Store</span>
                        </Link>
                      )}

                      {/* ==================================================
                          ADMIN CONSOLE
                          ADMIN ONLY
                         ================================================== */}

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Shield className="w-4 h-4 text-slate-400" />
                          <span>Admin Console</span>
                        </Link>
                      )}

                      {/* ==================================================
                          SETTINGS
                          EVERYONE
                         ================================================== */}

                      <Link
                        to="/settings"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Settings</span>
                      </Link>

                    </div>

                    {/* ====================================================
                        LOGOUT
                        EVERY AUTHENTICATED USER
                       ==================================================== */}

                    <div className="pt-1 border-t border-slate-100">

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>

                    </div>

                  </div>
                )}

              </div>

            ) : (

              /* ============================================================
                 LOGGED OUT
                 ============================================================ */

              <div className="flex items-center gap-1 sm:gap-2">

                <Link
                  to="/login"
                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900"
                >
                  Log In
                </Link>

                <Link
                  to="/register"
                  className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-lg sm:rounded-xl hover:bg-blue-700 shadow-xs transition-colors shrink-0"
                >
                  Sign Up
                </Link>

              </div>

            )}

            {/* Mobile Hamburger Menu */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>

          </div>
        </div>

        {/* ================================================================
            MOBILE SEARCH
           ================================================================ */}

        {mobileSearchOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">

            <SearchBar size="default" />

            <div className="mt-2 flex items-center justify-between">

              <span className="text-xs text-slate-500">
                Marketplace City:
              </span>

              <LocationSelector />

            </div>

          </div>
        )}

        {/* ================================================================
            MOBILE FLYOUT NAV
           ================================================================ */}

        {mobileMenuOpen && (

          <div className="md:hidden py-4 border-t border-slate-100 space-y-3 bg-white animate-in slide-in-from-top-2 duration-200">

            {/* If unauthenticated, show quick Log In / Sign Up at top of mobile menu */}
            {!isAuthenticated && (
              <div className="flex items-center gap-2 px-2 pb-3 border-b border-slate-100">
                <Link
                  to="/login"
                  className="flex-1 text-center py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">

              <span className="text-xs font-medium text-slate-600">
                Location
              </span>

              <LocationSelector />

            </div>

            <div className="space-y-1">

              {/* Browse All Books - Everyone */}
              <Link
                to="/books"
                className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                Browse All Books
              </Link>

              {/* Sell a Book - Existing design kept */}
              <Link
                to="/sell"
                className="block px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                + Sell a Book (Quick List)
              </Link>

              {/* Favorites - Everyone */}
              <Link
                to="/favorites"
                className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                Saved Books ({favorites.size})
              </Link>

              {/* Messages - Everyone */}
              <Link
                to="/chat"
                className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                Messages {unreadMessages > 0 && `(${unreadMessages} new)`}
              </Link>

              {/* ==========================================================
                  MOBILE SELLER DASHBOARD
                  SELLER / BUSINESS ONLY
                 ========================================================== */}

              {!isAdmin && (
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
                >
                  Seller Dashboard
                </Link>
              )}

              {/* ==========================================================
                  MOBILE PROFESSIONAL STORE
                  SELLER / BUSINESS ONLY
                 ========================================================== */}

              {isSeller && (
                <Link
                  to="/business"
                  className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
                >
                  Professional Seller Portal
                </Link>
              )}

              {/* ==========================================================
                  MOBILE ADMIN CONSOLE
                  ADMIN ONLY
                 ========================================================== */}

              {isAdmin && (
                <Link
                  to="/admin"
                  className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
                >
                  Admin Console
                </Link>
              )}

            </div>

            {/* ============================================================
                MOBILE LOGOUT
                EVERY AUTHENTICATED ROLE
               ============================================================ */}

            {isAuthenticated && (
              <div className="pt-2 border-t border-slate-100">

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>

              </div>
            )}

          </div>
        )}

      </div>
    </header>
  );
}

export default Navbar;
