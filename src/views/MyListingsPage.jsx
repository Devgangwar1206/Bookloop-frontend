import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import {
  PlusCircle,
  Eye,
  Heart,
  Trash2,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  Search,
  ExternalLink,
  BookOpen,
  Loader2,
} from 'lucide-react';

import { bookApi } from '../services/bookApi';
import { useToast } from '../context/ToastContext';

export function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Tracks which action is currently running
  const [loadingAction, setLoadingAction] = useState(null);

  const { addToast } = useToast();

  // =====================================================
  // LOAD MY LISTINGS
  // =====================================================

  const loadListings = useCallback(async () => {
    try {
      setLoading(true);

      // services/bookApi.js
      // getMyBooks() -> GET /books/my
      const data = await bookApi.getMyBooks();

      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(
        'Failed to load listings:',
        err
      );

      setListings([]);

      addToast(
        err?.message ||
          'Failed to load your listings',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // =====================================================
  // LOAD WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  // =====================================================
  // CHANGE LISTING STATUS
  // =====================================================

  const handleStatusChange = async (id, status) => {
    const actionKey = `status-${id}`;

    try {
      setLoadingAction(actionKey);

      // services/bookApi.js
      // updateBookStatus(id, status)
      const updatedBook =
        await bookApi.updateBookStatus(
          id,
          status
        );

      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id
            ? {
                ...listing,
                ...(updatedBook || {}),
                status,
              }
            : listing
        )
      );

      addToast(
        `Listing status updated to ${status}`,
        'success'
      );
    } catch (err) {
      console.error(
        'Failed to update listing status:',
        err
      );

      addToast(
        err?.message ||
          'Failed to update listing status',
        'error'
      );
    } finally {
      setLoadingAction(null);
    }
  };

  // =====================================================
  // DELETE LISTING
  // =====================================================

  const handleDelete = async (id) => {
    const actionKey = `delete-${id}`;

    try {
      setLoadingAction(actionKey);

      // services/bookApi.js
      // deleteBook(id) -> DELETE /books/{id}
      await bookApi.deleteBook(id);

      setListings((prev) =>
        prev.filter(
          (listing) => listing.id !== id
        )
      );

      setDeletingId(null);

      addToast(
        'Listing deleted successfully',
        'info'
      );
    } catch (err) {
      console.error(
        'Failed to delete listing:',
        err
      );

      addToast(
        err?.message ||
          'Failed to delete listing',
        'error'
      );
    } finally {
      setLoadingAction(null);
    }
  };

  // =====================================================
  // FILTER LISTINGS
  // =====================================================

  const filteredListings = listings.filter(
    (listing) => {
      const matchesTab =
        activeTab === 'All'
          ? true
          : listing.status?.toLowerCase() ===
            activeTab.toLowerCase();

      const search =
        searchQuery.trim().toLowerCase();

      const matchesQuery =
        !search ||
        listing.title
          ?.toLowerCase()
          .includes(search) ||
        listing.author
          ?.toLowerCase()
          .includes(search);

      return matchesTab && matchesQuery;
    }
  );

  // =====================================================
  // TAB COUNTS
  // =====================================================

  const tabCounts = {
    All: listings.length,

    Active: listings.filter(
      (listing) =>
        listing.status?.toLowerCase() ===
        'active'
    ).length,

    Sold: listings.filter(
      (listing) =>
        listing.status?.toLowerCase() ===
        'sold'
    ).length,

    Paused: listings.filter(
      (listing) =>
        listing.status?.toLowerCase() ===
        'paused'
    ).length,
  };

  // =====================================================
  // PAGE UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">

          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <BookOpen className="w-4 h-4" />

              <span>
                Seller Inventory
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              My Book Listings
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track live buyer interest, mark sold books,
              or adjust prices anytime
            </p>
          </div>

          <Link
            to="/sell"
            className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />

            <span>
              List a New Book
            </span>
          </Link>
        </div>

        {/* =================================================
            FILTER TOOLBAR
        ================================================= */}

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">

          {/* STATUS TABS */}

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">

            {[
              {
                id: 'All',
                label: 'All Books',
                color: 'bg-indigo-600 text-white',
              },
              {
                id: 'Active',
                label: 'Active',
                color: 'bg-emerald-600 text-white',
              },
              {
                id: 'Sold',
                label: 'Sold',
                color: 'bg-purple-600 text-white',
              },
              {
                id: 'Paused',
                label: 'Paused',
                color: 'bg-slate-700 text-white',
              },
            ].map((tab) => {
              const isActive =
                activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? `${tab.color} shadow-xs`
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>
                    {tab.label}
                  </span>

                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tabCounts[tab.id] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* SEARCH */}

          <div className="relative w-full sm:w-72">

            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />

            <input
              type="text"
              placeholder="Search your bookshelf..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
            />
          </div>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div className="space-y-3">

            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse"
              />
            ))}

          </div>

        ) : filteredListings.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4 shadow-xs">

            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto text-indigo-600">
              <BookOpen className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                {activeTab === 'All'
                  ? 'No books listed yet'
                  : `No ${activeTab.toLowerCase()} listings`}
              </h3>

              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
                {activeTab === 'All'
                  ? 'List your pre-loved college textbooks, novels, or competitive exam guides in under 60 seconds.'
                  : `You do not have any books categorized under "${activeTab}".`}
              </p>
            </div>

            {activeTab === 'All' && (
              <Link
                to="/sell"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />

                <span>
                  List Your First Book
                </span>
              </Link>
            )}
          </div>

        ) : (

          /* =================================================
             LISTINGS
          ================================================= */

          <div className="space-y-3">

            {filteredListings.map((item) => {

              const bookImage =
                item.images?.[0] ||
                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=160&auto=format&fit=crop&q=80';

              const isConfirmingDelete =
                deletingId === item.id;

              const statusLoading =
                loadingAction ===
                `status-${item.id}`;

              const deleteLoading =
                loadingAction ===
                `delete-${item.id}`;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden w-full"
                >

                  {/* =================================================
                     BOOK INFO
                  ================================================= */}

                  <div className="flex items-start gap-3 sm:gap-4 w-full min-w-0 flex-1">

                    <img
                      src={bookImage}
                      alt={item.title || 'Book'}
                      className="w-16 h-22 sm:w-20 sm:h-26 object-cover rounded-xl border border-slate-200 shadow-2xs shrink-0"
                    />

                    <div className="min-w-0 flex-1">

                      {/* STATUS / CATEGORY / CONDITION */}

                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">

                        <span
                          className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md border ${
                            item.status === 'Active'
                              ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                              : item.status === 'Sold'
                              ? 'text-purple-800 bg-purple-50 border-purple-200'
                              : 'text-slate-700 bg-slate-100 border-slate-200'
                          }`}
                        >
                          {item.status || 'Active'}
                        </span>

                        <span className="text-xs text-indigo-700 bg-indigo-50 font-semibold px-2 py-0.5 rounded-md border border-indigo-100">
                          {item.category || 'General'}
                        </span>

                        {item.condition && (
                          <span className="text-xs text-slate-500 hidden xs:inline">
                            Condition:{' '}
                            <strong className="text-slate-700 font-medium">
                              {item.condition}
                            </strong>
                          </span>
                        )}
                      </div>

                      {/* TITLE */}

                      <Link
                        to={`/books/${item.id}`}
                        className="font-serif font-bold text-slate-900 text-sm sm:text-base md:text-lg hover:text-indigo-600 block line-clamp-2 break-words mt-1 transition-colors leading-snug"
                        title={item.title || 'Book'}
                      >
                        {item.title ||
                          'Untitled Book'}
                      </Link>

                      {/* AUTHOR */}

                      <p className="text-xs text-slate-600 truncate">
                        by{' '}
                        {item.author ||
                          'Independent Author'}
                      </p>

                      {/* PRICE / VIEWS / SAVES */}

                      <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-500 mt-2 flex-wrap">

                        <span className="font-bold text-slate-950 font-sans text-sm">
                          ₹{item.price ?? 0}
                        </span>

                        <span className="text-slate-300">
                          ·
                        </span>

                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />

                          <span>
                            {item.views ?? 0} views
                          </span>
                        </span>

                        <span className="text-slate-300">
                          ·
                        </span>

                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500" />

                          <span>
                            {item.favoritesCount ?? 0} saves
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                     ACTIONS
                  ================================================= */}

                  <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-wrap">

                    {/* VIEW */}

                    <Link
                      to={`/books/${item.id}`}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                      title="View listing"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />

                      <span className="hidden sm:inline">
                        View
                      </span>
                    </Link>

                    {/* MARK SOLD */}

                    {item.status !== 'Sold' && (
                      <button
                        type="button"
                        disabled={statusLoading}
                        onClick={() =>
                          handleStatusChange(
                            item.id,
                            'Sold'
                          )
                        }
                        className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        title="Mark this book as sold"
                      >
                        {statusLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />

                            <span>
                              Saving...
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />

                            <span>
                              Mark Sold
                            </span>
                          </>
                        )}
                      </button>
                    )}

                    {/* PAUSE / RESUME */}

                    {item.status !== 'Sold' && (
                      <button
                        type="button"
                        disabled={statusLoading}
                        onClick={() =>
                          handleStatusChange(
                            item.id,
                            item.status ===
                              'Active'
                              ? 'Paused'
                              : 'Active'
                          )
                        }
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                          item.status ===
                          'Active'
                            ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200'
                            : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                        }`}
                        title={
                          item.status ===
                          'Active'
                            ? 'Temporarily pause listing'
                            : 'Resume listing'
                        }
                      >
                        {statusLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />

                            <span>
                              Updating...
                            </span>
                          </>
                        ) : item.status ===
                          'Active' ? (
                          <>
                            <PauseCircle className="w-3.5 h-3.5" />

                            <span className="hidden sm:inline">
                              Pause
                            </span>
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-3.5 h-3.5" />

                            <span>
                              Activate
                            </span>
                          </>
                        )}
                      </button>
                    )}

                    {/* DELETE */}

                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-xl border border-rose-200">

                        <button
                          type="button"
                          disabled={deleteLoading}
                          onClick={() =>
                            handleDelete(
                              item.id
                            )
                          }
                          className="px-2 py-1 text-[11px] font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {deleteLoading ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />

                              <span>
                                Deleting...
                              </span>
                            </>
                          ) : (
                            'Confirm'
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={deleteLoading}
                          onClick={() =>
                            setDeletingId(null)
                          }
                          className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={
                          loadingAction !== null
                        }
                        onClick={() =>
                          setDeletingId(
                            item.id
                          )
                        }
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyListingsPage;