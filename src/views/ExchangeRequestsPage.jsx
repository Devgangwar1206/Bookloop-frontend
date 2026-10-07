import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Loader2 } from 'lucide-react';

import { exchangeApi } from '../services/exchangeApi';
import { chatApi } from '../services/chatApi';
import { ExchangeCard } from '../components/cards/ExchangeCard';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

import { useAuth } from '../context/AuthContext';

export function ExchangeRequestsPage() {
  const { user } = useAuth();
  const currentUserId = user?.id
    ? String(user.id)
    : (typeof window !== 'undefined' ? localStorage.getItem('userId') : '');

  const [exchanges, setExchanges] = useState([]);
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'received' | 'sent'
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadExchanges = async () => {
      try {
        setLoading(true);

        const data = await exchangeApi.getExchangeRequests();

        if (isMounted) {
          setExchanges(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to load exchange requests:', error);

        if (isMounted) {
          setExchanges([]);

          addToast(
            error?.message || 'Failed to load exchange requests',
            'error'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadExchanges();

    return () => {
      isMounted = false;
    };
  }, [addToast]);

  const handleAccept = async (exchangeId) => {
    try {
      setActionLoading(`accept-${exchangeId}`);

      const updated = await exchangeApi.respondToExchange(
        exchangeId,
        'ACCEPTED'
      );

      setExchanges((prev) =>
        prev.map((exchange) =>
          exchange.id === exchangeId
            ? {
                ...exchange,
                ...(updated || {}),
                status: 'ACCEPTED',
              }
            : exchange
        )
      );

      addToast(
        'Book swap accepted! Connect via Chat to arrange the exchange.',
        'success'
      );
    } catch (error) {
      console.error('Failed to accept exchange:', error);

      addToast(
        error?.message || 'Failed to accept exchange',
        'error'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (exchangeId) => {
    try {
      setActionLoading(`reject-${exchangeId}`);

      const updated = await exchangeApi.respondToExchange(
        exchangeId,
        'REJECTED'
      );

      setExchanges((prev) =>
        prev.map((exchange) =>
          exchange.id === exchangeId
            ? {
                ...exchange,
                ...(updated || {}),
                status: 'REJECTED',
              }
            : exchange
        )
      );

      addToast(
        'Exchange proposal declined',
        'info'
      );
    } catch (error) {
      console.error('Failed to reject exchange:', error);

      addToast(
        error?.message || 'Failed to reject exchange',
        'error'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (exchangeId) => {
    try {
      setActionLoading(`cancel-${exchangeId}`);

      const updated = await exchangeApi.respondToExchange(
        exchangeId,
        'CANCELLED'
      );

      setExchanges((prev) =>
        prev.map((exchange) =>
          exchange.id === exchangeId
            ? {
                ...exchange,
                ...(updated || {}),
                status: 'CANCELLED',
              }
            : exchange
        )
      );

      addToast(
        'Exchange proposal cancelled',
        'info'
      );
    } catch (error) {
      console.error('Failed to cancel exchange:', error);

      addToast(
        error?.message || 'Failed to cancel exchange',
        'error'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleChat = async (exchange) => {
    try {
      const isRequester =
        currentUserId && String(exchange.requesterId) === String(currentUserId);

      const partner = isRequester
        ? { id: exchange.ownerId, name: exchange.ownerName }
        : { id: exchange.requesterId, name: exchange.requesterName };

      const chat = await chatApi.startOrGetChatWithSeller(
        {
          id: exchange.requestedBookId,
          title: exchange.requestedBookTitle,
          price: 0,
        },
        partner
      );

      navigate(`/chat/${chat.id}`);
    } catch (error) {
      console.error('Failed to open exchange chat:', error);
      navigate('/chat');
    }
  };

  const displayedExchanges = exchanges.filter((ex) => {
    if (filterTab === 'received') {
      return !currentUserId || String(ex.requesterId) !== String(currentUserId);
    }
    if (filterTab === 'sent') {
      return currentUserId && String(ex.requesterId) === String(currentUserId);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <ArrowLeftRight className="w-3.5 h-3.5" />

            <span>Community Book Swaps</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Book Exchange Requests
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Swap books with fellow readers without paying money
          </p>
        </div>

        {/* Clean filter tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Swaps ({exchanges.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('received')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              filterTab === 'received'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Received Swaps
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('sent')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              filterTab === 'sent'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Sent Proposals
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
          </div>
        ) : displayedExchanges.length === 0 ? (
          <EmptyState
            type="exchanges"
            title={
              filterTab === 'sent'
                ? 'No sent exchange proposals'
                : filterTab === 'received'
                ? 'No swap proposals received'
                : 'No exchange requests yet'
            }
            description="When members propose to trade one of their books for yours, you can review their offer here."
          />
        ) : (
          <div className="space-y-4">
            {displayedExchanges.map((exchange) => (
              <ExchangeCard
                key={exchange.id}
                exchange={exchange}
                currentUserId={currentUserId}
                onAccept={handleAccept}
                onReject={handleReject}
                onCancel={handleCancel}
                onChat={handleChat}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default ExchangeRequestsPage;