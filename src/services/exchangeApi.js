// Book Exchange API Service

import { apiClient } from '../api/apiClient';

export const exchangeApi = {

  // Exchanges received by current user
  async getReceivedExchanges() {
    return apiClient('/exchanges/received');
  },

  // Exchanges sent by current user
  async getSentExchanges() {
    return apiClient('/exchanges/sent');
  },

  // Get both sent + received exchanges
  async getExchangeRequests() {
    const [sent, received] = await Promise.all([
      apiClient('/exchanges/sent'),
      apiClient('/exchanges/received'),
    ]);

    return [
      ...(Array.isArray(received) ? received : []),
      ...(Array.isArray(sent) ? sent : []),
    ];
  },

  // Create exchange request
  async requestExchange(targetBook, offeredBookId, message = '') {

    if (!targetBook?.id) {
      throw new Error('Requested book ID is required');
    }

    if (!offeredBookId) {
      throw new Error('Offered book ID is required');
    }

    return apiClient('/exchanges', {
      method: 'POST',
      body: JSON.stringify({
        offeredBookId: Number(offeredBookId),
        requestedBookId: Number(targetBook.id),
        message: message.trim(),
      }),
    });
  },

  // Accept / Reject / Cancel
  async respondToExchange(exchangeId, status) {
    return apiClient(`/exchanges/${exchangeId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: status.toUpperCase(),
      }),
    });
  },

  // Alias
  async updateExchangeStatus(exchangeId, status) {
    return this.respondToExchange(exchangeId, status);
  },
};

export default exchangeApi;