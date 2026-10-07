// Offers & Price Negotiation API Service

import { apiClient } from '../api/apiClient';

const FALLBACK_BOOK_IMAGE =
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80';

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80';

function normalizeOffer(offer) {
  if (!offer) {
    return offer;
  }

  return {
    ...offer,

    // Backend sends nested buyer/book objects
    buyer: {
      id: offer.buyer?.id,
      name: offer.buyer?.name || 'Unknown User',
      avatar: offer.buyer?.avatar || FALLBACK_AVATAR,
      location: offer.buyer?.location || 'India',
    },

    book: {
      id: offer.book?.id,
      title: offer.book?.title || 'Book',
      originalPrice: Number(
        offer.book?.originalPrice ?? 0
      ),
      image:
        offer.book?.image ||
        FALLBACK_BOOK_IMAGE,
    },

    offerPrice: Number(
      offer.offerPrice ?? offer.amount ?? 0
    ),

    counterPrice:
      offer.counterPrice != null
        ? Number(offer.counterPrice)
        : null,

    message:
      offer.message ||
      'No message provided',

    date:
      offer.date ||
      formatDate(offer.createdAt),

    status: normalizeStatus(
      offer.status
    ),
  };
}

function normalizeStatus(status) {
  if (!status) {
    return 'Pending';
  }

  const value =
    String(status).toUpperCase();

  switch (value) {
    case 'PENDING':
      return 'Pending';

    case 'ACCEPTED':
      return 'Accepted';

    case 'REJECTED':
      return 'Rejected';

    case 'COUNTERED':
      return 'Countered';

    case 'CANCELLED':
      return 'Cancelled';

    default:
      return status;
  }
}

function formatDate(date) {
  if (!date) {
    return 'Recently';
  }

  try {
    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    );
  } catch {
    return 'Recently';
  }
}

export const offerApi = {

  // =========================================================
  // GET RECEIVED OFFERS
  // =========================================================

  async getOffersReceived() {

    const data =
      await apiClient('/offers/received');

    return Array.isArray(data)
      ? data.map(normalizeOffer)
      : [];
  },

  // =========================================================
  // GET SENT OFFERS
  // =========================================================

  async getOffersSent() {

    const data =
      await apiClient('/offers/sent');

    return Array.isArray(data)
      ? data.map(normalizeOffer)
      : [];
  },

  // =========================================================
  // GET OFFERS
  //
  // Kept for compatibility with old code.
  // =========================================================

  async getOffers() {
    return this.getOffersReceived();
  },

  // =========================================================
  // MAKE OFFER
  // =========================================================

  async makeOffer(
    book,
    offerPrice,
    message
  ) {

    const payload = {
      bookId: book.id,
      amount: Number(offerPrice),
      message:
        message ||
        `I would like to offer ₹${offerPrice} for this book.`,
      parentOfferId: null,
    };

    const data =
      await apiClient('/offers', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

    return normalizeOffer(data);
  },

  // =========================================================
  // ACCEPT / REJECT
  // =========================================================

  async respondToOffer(
    offerId,
    status
  ) {

    const data =
      await apiClient(
        `/offers/${offerId}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            status,
          }),
        }
      );

    return normalizeOffer(data);
  },

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  async updateOfferStatus(
    offerId,
    status
  ) {

    return this.respondToOffer(
      offerId,
      status
    );
  },

  // =========================================================
  // COUNTER OFFER
  // =========================================================

  async counterOffer(
    offerId,
    counterPrice,
    bookId = null
  ) {
    let resolvedBookId = bookId;

    if (!resolvedBookId) {
      const offers = await this.getOffersReceived();
      const originalOffer = offers.find(
        offer => String(offer.id) === String(offerId)
      );
      resolvedBookId = originalOffer?.book?.id;
    }

    if (!resolvedBookId) {
      throw new Error('Original offer book not found');
    }

    const payload = {
      bookId: Number(resolvedBookId),
      amount: Number(counterPrice),
      message: `Seller countered with ₹${counterPrice}.`,
      parentOfferId: Number(offerId),
    };

    const data = await apiClient('/offers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return normalizeOffer(data);
  },
};

export default offerApi;