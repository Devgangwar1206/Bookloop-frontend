import apiClient from '../api/apiClient';

export const reviewApi = {
  // Create or update a review for a seller / book
  async submitReview({ sellerId, bookId, rating, comment }) {
    return apiClient('/reviews', {
      method: 'POST',
      body: JSON.stringify({
        sellerId: sellerId ? Number(sellerId) : null,
        bookId: bookId ? Number(bookId) : null,
        rating: Number(rating),
        comment: comment ? String(comment).trim() : ''
      })
    });
  },

  // Get all reviews for a seller
  async getSellerReviews(sellerId) {
    if (!sellerId) return [];
    try {
      const data = await apiClient(`/reviews/seller/${sellerId}`);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('Failed to fetch seller reviews:', err);
      return [];
    }
  },

  // Get average rating for a seller
  async getSellerRating(sellerId) {
    if (!sellerId) return 0;
    try {
      const rating = await apiClient(`/reviews/seller/${sellerId}/rating`);
      return typeof rating === 'number' ? rating : 0;
    } catch (err) {
      console.warn('Failed to fetch seller rating:', err);
      return 0;
    }
  },

  // Get reviews for a specific book
  async getBookReviews(bookId) {
    if (!bookId) return [];
    try {
      const data = await apiClient(`/reviews/book/${bookId}`);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('Failed to fetch book reviews:', err);
      return [];
    }
  }
};

export default reviewApi;
