import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag } from 'lucide-react';
import { offerApi } from '../services/offerApi';
import { chatApi } from '../services/chatApi';
import { OfferCard } from '../components/cards/OfferCard';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

export function OffersPage() {
  const [activeTab, setActiveTab] = useState('received');
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const loadOffers = async (tab) => {
    try {
      setLoading(true);
      const data = tab === 'received'
        ? await offerApi.getOffersReceived()
        : await offerApi.getOffersSent();
      setOffers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load offers:', err);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers(activeTab);
  }, [activeTab]);

  const handleAccept = async (offerId) => {
    try {
      await offerApi.respondToOffer(offerId, 'ACCEPTED');
      setOffers(offers.map(o => o.id === offerId ? { ...o, status: 'Accepted' } : o));
      addToast(
        activeTab === 'sent'
          ? 'Counter offer accepted! Order created successfully.'
          : 'Offer accepted! You can coordinate pickup in Chat.',
        'success'
      );
    } catch (err) {
      addToast(err?.message || 'Failed to accept offer', 'error');
    }
  };

  const handleReject = async (offerId) => {
    try {
      await offerApi.respondToOffer(offerId, 'REJECTED');
      setOffers(offers.map(o => o.id === offerId ? { ...o, status: 'Rejected' } : o));
      addToast('Offer declined', 'info');
    } catch (err) {
      addToast(err?.message || 'Failed to decline offer', 'error');
    }
  };

  const handleCancel = async (offerId) => {
    try {
      await offerApi.respondToOffer(offerId, 'CANCELLED');
      setOffers(offers.map(o => o.id === offerId ? { ...o, status: 'Cancelled' } : o));
      addToast('Offer proposal cancelled', 'info');
    } catch (err) {
      addToast(err?.message || 'Failed to cancel offer', 'error');
    }
  };

  const handleCounter = async (offerId, counterPrice) => {
    try {
      const targetOffer = offers.find(o => o.id === offerId);
      await offerApi.counterOffer(offerId, counterPrice, targetOffer?.book?.id);
      setOffers(offers.map(o => o.id === offerId ? { ...o, status: 'Countered', counterPrice } : o));
      addToast(`Counter offer of ₹${counterPrice} sent to buyer!`, 'success');
    } catch (err) {
      addToast(err?.message || 'Failed to send counter offer', 'error');
    }
  };

  const handleChat = async (offer) => {
    try {
      const isSent = activeTab === 'sent';
      const partnerUser = isSent
        ? { id: offer.seller?.id || offer.otherUserId, name: offer.seller?.name || 'Seller', avatar: offer.seller?.avatar }
        : { id: offer.buyer?.id, name: offer.buyer?.name, avatar: offer.buyer?.avatar };

      const chat = await chatApi.startOrGetChatWithSeller(
        { id: offer.book.id, title: offer.book.title, price: offer.offerPrice },
        partnerUser
      );
      navigate(`/chat/${chat.id}`);
    } catch (err) {
      navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <Tag className="w-3.5 h-3.5" />
            <span>Negotiation Center</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Price Offers & Deals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review buyer bids, accept deals, counter-offer, or track your sent offers
          </p>
        </div>

        {/* Clean tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'received'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Offers Received (As Seller)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'sent'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Offers Sent (As Buyer)
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">
            Loading offers...
          </div>
        ) : offers.length === 0 ? (
          <EmptyState
            type="offers"
            title={activeTab === 'received' ? 'No price offers received yet' : 'No price offers sent yet'}
            description={
              activeTab === 'received'
                ? 'When buyers negotiate on your listed books, their offers will appear here for review.'
                : 'When you place a price bargain on another seller\'s book, track its progress right here.'
            }
          />
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                isSent={activeTab === 'sent'}
                onAccept={handleAccept}
                onReject={handleReject}
                onCancel={handleCancel}
                onCounter={handleCounter}
                onChat={handleChat}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default OffersPage;
