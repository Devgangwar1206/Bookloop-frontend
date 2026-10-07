// Seller & Business Account API Service
import { apiClient } from '../api/apiClient';
import { bookApi } from './bookApi';
import { offerApi } from './offerApi';
import { exchangeApi } from './exchangeApi';
import { chatApi } from './chatApi';

const PRO_INVENTORY_STORAGE_KEY = 'bookloop_pro_inventory';

function loadStoredInventory() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(PRO_INVENTORY_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load pro inventory', e);
  }
  return [];
}

function persistInventory(inv) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(PRO_INVENTORY_STORAGE_KEY, JSON.stringify(inv));
    }
  } catch (e) {}
}

let businessInventory = loadStoredInventory();
let followedSellers = new Set();

export const sellerApi = {
  async getSellerById(sellerId) {
    try {
      if (sellerId && !String(sellerId).startsWith('s-')) {
        const profile = await apiClient(`/books/seller/${sellerId}/profile`);
        if (profile) {
          return {
            ...profile,
            isFollowed: followedSellers.has(String(sellerId))
          };
        }
      }
    } catch (e) {
      console.warn('Could not fetch seller profile from backend, using default', e);
    }

    return {
      id: sellerId,
      name: 'Community Reader',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      rating: 4.8,
      reviewsCount: 1,
      verified: true,
      memberSince: 'March 2024',
      totalListings: 1,
      soldCount: 0,
      responseRate: '< 15 mins',
      location: 'Noida, UP',
      isFollowed: followedSellers.has(String(sellerId))
    };
  },

  async getSellerListings(sellerId) {
    try {
      if (sellerId && !String(sellerId).startsWith('s-')) {
        const books = await apiClient(`/books/seller/${sellerId}`);
        if (Array.isArray(books)) {
          return books;
        }
      }
    } catch (e) {
      console.warn('Could not fetch seller books from backend', e);
    }
    return [];
  },

  async getSellerProfile(sellerId) {
    try {
      if (!sellerId || sellerId === 's-1' || sellerId === 'me') {
        const currentUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (currentUserStr) {
          try {
            const u = JSON.parse(currentUserStr);
            if (u.id) sellerId = u.id;
          } catch (e) {}
        }
      }

      const [seller, books] = await Promise.all([
        this.getSellerById(sellerId),
        this.getSellerListings(sellerId)
      ]);

      return {
        ...seller,
        books
      };
    } catch (e) {
      console.error('Failed to load seller profile', e);
      return {
        id: sellerId,
        name: 'Seller Profile',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        rating: 4.8,
        reviewsCount: 0,
        books: []
      };
    }
  },

  async getMyListings() {
    return bookApi.getMyBooks();
  },

  async getSellerMetrics() {
    try {
      const [myBooksRes, offersRes, exchangesRes, unreadChatsRes] = await Promise.allSettled([
        bookApi.getMyBooks(),
        offerApi.getReceivedOffers(),
        exchangeApi.getExchangeRequests(),
        chatApi.getUnreadCount()
      ]);

      const booksList = myBooksRes.status === 'fulfilled' && Array.isArray(myBooksRes.value) ? myBooksRes.value : [];
      const offersList = offersRes.status === 'fulfilled' && Array.isArray(offersRes.value) ? offersRes.value : [];
      const exchangesList = exchangesRes.status === 'fulfilled' && Array.isArray(exchangesRes.value) ? exchangesRes.value : [];
      const messagesCount = unreadChatsRes.status === 'fulfilled' && typeof unreadChatsRes.value === 'number' ? unreadChatsRes.value : 0;

      const activeListings = booksList.filter(b => !b.status || b.status.toLowerCase() === 'active').length;
      const soldBooks = booksList.filter(b => b.status && b.status.toLowerCase() === 'sold').length;
      const totalViews = booksList.reduce((sum, b) => sum + (Number(b.views) || 0), 0);
      const pendingOffers = offersList.filter(o => !o.status || o.status.toUpperCase() === 'PENDING').length;
      const pendingExchanges = exchangesList.filter(e => !e.status || e.status.toUpperCase() === 'PENDING').length;

      return {
        activeListings,
        views: totalViews,
        messages: messagesCount,
        offersReceived: pendingOffers,
        soldBooks,
        exchangeRequests: pendingExchanges
      };
    } catch (e) {
      console.warn('Failed to calculate seller metrics', e);
      return {
        activeListings: 0,
        views: 0,
        messages: 0,
        offersReceived: 0,
        soldBooks: 0,
        exchangeRequests: 0
      };
    }
  },

  async getMetrics() {
    return this.getSellerMetrics();
  },

  async toggleFollowSeller(sellerId) {
    let isFollowed = false;
    if (followedSellers.has(String(sellerId))) {
      followedSellers.delete(String(sellerId));
      isFollowed = false;
    } else {
      followedSellers.add(String(sellerId));
      isFollowed = true;
    }
    return Promise.resolve({ isFollowed });
  },

  async getBusinessInventory() {
    try {
      // 1. Fetch real listed books from user's account
      const myBooks = await bookApi.getMyBooks();
      const realBooks = Array.isArray(myBooks) ? myBooks : [];

      // 2. Map real books to inventory structure
      const mappedInventory = realBooks.map((b) => {
        const price = Number(b.price || b.originalPrice || 0);
        const mrp = Number(b.originalPrice || Math.round(price * 1.3));
        const discount = mrp > price ? `${Math.round(((mrp - price) / mrp) * 100)}%` : '15%';

        return {
          id: b.id,
          sku: `SKU-${String(b.id).padStart(4, '0')}`,
          title: b.title,
          author: b.author || 'Author',
          isbn: b.isbn || 'N/A',
          publisher: b.publisher || 'Publisher',
          edition: b.edition || 'Standard Edition',
          price: price,
          mrp: mrp,
          discount: discount,
          stock: b.status === 'Sold' ? 0 : 1,
          condition: b.condition || 'Used - Good',
          soldCount: b.status === 'Sold' ? 1 : 0,
          category: b.category || 'General',
          shipping: b.delivery || 'Free Delivery',
          image: Array.isArray(b.images) && b.images.length > 0 ? b.images[0] : null
        };
      });

      // 3. Combine with locally added bookstore inventory (avoiding duplicate IDs)
      const stored = loadStoredInventory();
      const combined = [...mappedInventory];
      stored.forEach((item) => {
        if (!combined.some((c) => String(c.id) === String(item.id))) {
          combined.push(item);
        }
      });

      businessInventory = combined;

      // 4. Calculate real business stats
      const totalBooks = combined.reduce((acc, b) => acc + (Number(b.stock) || 0), 0);
      const totalSales = combined.reduce((acc, b) => acc + (Number(b.soldCount) || 0), 0);
      const revenue = combined.reduce((acc, b) => acc + ((Number(b.soldCount) || 0) * (Number(b.price) || 0)), 0);
      const totalViews = realBooks.reduce((acc, b) => acc + (Number(b.views) || 0), 0);

      const stats = {
        totalBooks: totalBooks.toLocaleString(),
        totalSales: totalSales.toLocaleString(),
        revenue: `₹${revenue.toLocaleString()}`,
        orders: totalSales,
        views: totalViews > 0 ? `${totalViews}` : '0'
      };

      return {
        stats,
        inventory: combined
      };
    } catch (err) {
      console.error('Failed to load business inventory from backend', err);
      return {
        stats: { totalBooks: '0', totalSales: '0', revenue: '₹0', orders: 0, views: '0' },
        inventory: []
      };
    }
  },

  async addBusinessBook(bookData) {
    const price = Number(bookData.price) || 0;
    const mrp = Number(bookData.mrp) || Math.round(price * 1.3);
    const calculatedDiscount = mrp > price ? `${Math.round(((mrp - price) / mrp) * 100)}%` : (bookData.discount ? `${bookData.discount}%` : '15%');

    // 1. Create real book in backend database
    let createdBackendBook = null;
    try {
      createdBackendBook = await bookApi.createBook({
        title: bookData.title,
        author: bookData.author || 'Publisher Stock',
        price: price,
        originalPrice: mrp,
        category: bookData.category || 'Academic',
        condition: bookData.condition || 'Brand New',
        description: `Publisher stock SKU: ${bookData.sku || 'SKU-PRO'}`,
        transactionType: 'SELL',
        city: 'Noida',
        delivery: bookData.shipping || 'Free Delivery'
      });
    } catch (err) {
      console.warn('Backend createBook failed for business book, using local fallback:', err);
    }

    const newBook = {
      id: createdBackendBook?.id || `pro-inv-${Date.now()}`,
      sku: bookData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      title: bookData.title,
      author: bookData.author || 'Publisher Stock',
      isbn: bookData.isbn || '978-0000000000',
      publisher: bookData.publisher || 'Direct Publishing',
      edition: bookData.edition || 'Current Edition',
      price: price,
      mrp: mrp,
      discount: calculatedDiscount,
      stock: Number(bookData.stock) || 1,
      condition: bookData.condition || 'Brand New',
      soldCount: 0,
      category: bookData.category || 'Academic',
      shipping: bookData.shipping || 'Free Express Delivery'
    };

    const stored = loadStoredInventory();
    const updated = [newBook, ...stored];
    persistInventory(updated);

    return newBook;
  },

  async updateStock(id, newStock) {
    const stored = loadStoredInventory();
    const updated = stored.map(item => {
      if (String(item.id) === String(id)) {
        return { ...item, stock: Math.max(0, Number(newStock)) };
      }
      return item;
    });
    persistInventory(updated);
    return updated.find(i => String(i.id) === String(id));
  },

  async deleteInventoryItem(id) {
    // If it is a real book listing, also delete from backend
    if (typeof id === 'number' || !String(id).startsWith('pro-inv-')) {
      try {
        await bookApi.deleteListing(id);
      } catch (e) {
        console.warn('Could not delete listing from backend:', e);
      }
    }
    const stored = loadStoredInventory();
    const updated = stored.filter(item => String(item.id) !== String(id));
    persistInventory(updated);
    return { success: true };
  }
};

export default sellerApi;
