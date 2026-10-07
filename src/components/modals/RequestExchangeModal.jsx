import React, { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { exchangeApi } from '../../services/exchangeApi';
import { bookApi } from '../../services/bookApi';
import { useToast } from '../../context/ToastContext';
import { ArrowLeftRight, BookOpen, Loader2 } from 'lucide-react';

export function RequestExchangeModal({
  isOpen,
  onClose,
  targetBook
}) {
  const [myBooks, setMyBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [message, setMessage] = useState('');

  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const loadMyBooks = async () => {
      try {
        setLoadingBooks(true);

        const books = await bookApi.getMyBooks();

        if (isMounted) {
          setMyBooks(
            Array.isArray(books) ? books : []
          );
        }
      } catch (error) {
        console.error(
          'Failed to load your books:',
          error
        );

        if (isMounted) {
          setMyBooks([]);

          addToast(
            error?.message ||
              'Failed to load your books',
            'error'
          );
        }
      } finally {
        if (isMounted) {
          setLoadingBooks(false);
        }
      }
    };

    loadMyBooks();

    return () => {
      isMounted = false;
    };
  }, [isOpen, addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBookId) {
      addToast(
        'Please select a book to offer',
        'error'
      );
      return;
    }

    if (!targetBook?.id) {
      addToast(
        'Requested book information is missing',
        'error'
      );
      return;
    }

    setLoading(true);

    try {
      await exchangeApi.requestExchange(
        targetBook,
        selectedBookId,
        message
      );

      addToast(
        `Exchange proposal sent to ${
          targetBook.seller?.name || 'book owner'
        }!`,
        'success'
      );

      setSelectedBookId('');
      setMessage('');
      onClose();

    } catch (error) {
      console.error(
        'Failed to submit exchange request:',
        error
      );

      addToast(
        error?.message ||
          'Failed to submit exchange request',
        'error'
      );

    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    setSelectedBookId('');
    setMessage('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Request a Book Exchange (Swap)"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {/* Target Book */}
        {targetBook && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">

            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              You want to swap for:
            </div>

            <div className="font-serif font-semibold text-slate-900 text-sm mb-1">
              {targetBook.title}
            </div>

            <div className="text-xs text-slate-500">
              Listed by {targetBook.seller?.name}
              {' · '}
              Condition: {targetBook.condition}
            </div>

            {targetBook.exchangePreferences && (
              <div className="mt-2 text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                <strong>Seller note:</strong>{' '}
                {targetBook.exchangePreferences}
              </div>
            )}

          </div>
        )}

        {/* My Book */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Select your book to offer *
          </label>

          {loadingBooks ? (
            <div className="flex items-center gap-2 p-3 border border-slate-200 rounded-xl text-sm text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading your books...
            </div>
          ) : myBooks.length === 0 ? (
            <div className="p-3 border border-amber-200 bg-amber-50 rounded-xl text-xs text-amber-800">
              You don't have any books listed yet.
              Please list a book first before requesting an exchange.
            </div>
          ) : (
            <select
              value={selectedBookId}
              onChange={(e) =>
                setSelectedBookId(e.target.value)
              }
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              required
            >
              <option value="">
                Select a book
              </option>

              {myBooks.map((book) => (
                <option
                  key={book.id}
                  value={book.id}
                >
                  {book.title}
                  {book.condition
                    ? ` — ${book.condition}`
                    : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Message for the owner (Optional)
          </label>

          <textarea
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            rows={3}
            placeholder="Explain why this swap is great, meetup availability, etc."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        {/* Actions */}
        <div className="pt-3 flex items-center justify-end gap-2">

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              loading ||
              loadingBooks ||
              !selectedBookId ||
              myBooks.length === 0
            }
            className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ArrowLeftRight className="w-3.5 h-3.5" />
            )}

            <span>
              {loading
                ? 'Submitting...'
                : 'Send Exchange Request'}
            </span>
          </button>

        </div>

      </form>
    </Modal>
  );
}

export default RequestExchangeModal;