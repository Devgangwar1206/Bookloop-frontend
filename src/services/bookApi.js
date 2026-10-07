// services/bookApi.js

import apiClient from '../api/apiClient';


// ========================================
// NORMALIZE BACKEND BOOK → FRONTEND BOOK
// ========================================

function normalizeBook(book) {

  if (!book) {
    return book;
  }

  return {
    ...book,

    // Backend uses transactionType
    // Frontend BookCard uses transaction
    transaction:
      book.transactionType || book.transaction,

    // Keep favorites count safe
    favoritesCount:
      book.favoritesCount || 0,

    // Keep images safe
    images:
      book.images || [],

    // Keep seller safe
    seller:
      book.seller || null
  };
}


// ========================================
// EXCLUDE CURRENT USER'S OWN LISTINGS
// ========================================

function getCurrentUserInfo() {
  if (typeof window === 'undefined') return { currentUserId: null, currentEmail: null };
  let currentUserId = localStorage.getItem('userId') || localStorage.getItem('id') || null;
  let currentEmail = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const parsed = JSON.parse(userStr);
      if (parsed?.email) currentEmail = String(parsed.email).trim().toLowerCase();
      if (!currentUserId && parsed?.id) currentUserId = String(parsed.id);
    }
  } catch (e) {}
  return { currentUserId: currentUserId ? String(currentUserId) : null, currentEmail };
}

export function filterOutUserOwnBooks(books) {
  if (!Array.isArray(books)) return books;
  const { currentUserId, currentEmail } = getCurrentUserInfo();
  if (!currentUserId && !currentEmail) return books;

  return books.filter((book) => {
    if (!book) return false;
    const sellerId = book.seller?.id !== undefined && book.seller?.id !== null ? String(book.seller.id) : null;
    const sellerEmail = book.seller?.email ? String(book.seller.email).trim().toLowerCase() : null;

    if (currentUserId && sellerId && sellerId === currentUserId) {
      return false;
    }
    if (currentEmail && sellerEmail && sellerEmail === currentEmail) {
      return false;
    }
    return true;
  });
}


// ========================================
// GET ALL MARKETPLACE BOOKS
// ========================================

export async function getAllBooks(filters = {}) {

  const hasFilters =
    (filters.category &&
      filters.category !== 'all') ||

    (filters.condition &&
      filters.condition !== 'all') ||

    (filters.minPrice !== undefined &&
      filters.minPrice !== '') ||

    (filters.maxPrice !== undefined &&
      filters.maxPrice !== '') ||

    (filters.city &&
      filters.city !== 'all' &&
      filters.city !== 'All Cities') ||

    (filters.language &&
      filters.language !== 'all') ||

    (filters.delivery &&
      filters.delivery !== 'all') ||

    (filters.transaction &&
      filters.transaction !== 'all') ||

    (filters.listingType &&
      filters.listingType !== 'all') ||

    Boolean(filters.verifiedOnly) ||

    Boolean(filters.query);


  // ========================================
  // NO FILTERS
  // GET /books
  // ========================================

  if (!hasFilters) {

    const response =
  await apiClient('/books');

const rawBooks =
  (Array.isArray(response)
    ? response
    : (response?.books || [])
  ).map(normalizeBook);

    const books = filterOutUserOwnBooks(rawBooks);

    return {
      books,
      total: books.length
    };
  }


  // ========================================
  // FILTERS
  // GET /books/search
  // ========================================

  const query =
    new URLSearchParams();


  // ========================================
  // SEARCH TEXT
  // ========================================

  if (filters.query) {

    query.append(
      'keyword',
      filters.query
    );
  }


  // ========================================
  // CATEGORY
  // ========================================

  if (
    filters.category &&
    filters.category !== 'all'
  ) {

    query.append(
      'category',
      filters.category
    );
  }


  // ========================================
  // CONDITION
  // ========================================

  if (
    filters.condition &&
    filters.condition !== 'all'
  ) {

    query.append(
      'condition',
      filters.condition
    );
  }


  // ========================================
  // MINIMUM PRICE
  // ========================================

  if (
    filters.minPrice !== undefined &&
    filters.minPrice !== ''
  ) {

    query.append(
      'minPrice',
      filters.minPrice
    );
  }


  // ========================================
  // MAXIMUM PRICE
  // ========================================

  if (
    filters.maxPrice !== undefined &&
    filters.maxPrice !== ''
  ) {

    query.append(
      'maxPrice',
      filters.maxPrice
    );
  }


  // ========================================
  // CITY
  // ========================================

 if ( 
  filters.city && 
  filters.city !== 'all' && 
  filters.city !== 'All Cities' 
) { 

  const cityName = filters.city
    .split(',')[0]
    .trim();

  if (cityName) {
    query.append(
      'city',
      cityName
    );
  }
}


  // ========================================
  // TRANSACTION TYPE
  // ========================================

  if (
    filters.transaction &&
    filters.transaction !== 'all'
  ) {

    query.append(
      'transactionType',
      filters.transaction
    );
  }


  // ========================================
  // LANGUAGE
  // ========================================

  if (
    filters.language &&
    filters.language !== 'all'
  ) {

    query.append(
      'language',
      filters.language
    );
  }


  // ========================================
  // DELIVERY
  // ========================================

  if (
    filters.delivery &&
    filters.delivery !== 'all'
  ) {

    query.append(
      'delivery',
      filters.delivery
    );
  }


  // ========================================
  // LISTING TYPE
  // ========================================

  if (
    filters.listingType &&
    filters.listingType !== 'all'
  ) {

    query.append(
      'listingType',
      filters.listingType
    );
  }


  // ========================================
  // VERIFIED SELLER
  // ========================================

  if (filters.verifiedOnly) {

    query.append(
      'verifiedOnly',
      'true'
    );
  }


  // ========================================
  // SORT
  // Frontend → Backend
  // ========================================

  if (
    filters.sortBy === 'price-low'
  ) {

    query.append(
      'sort',
      'price_asc'
    );

  } else if (
    filters.sortBy === 'price-high'
  ) {

    query.append(
      'sort',
      'price_desc'
    );

  } else {

    // newest + relevance
    query.append(
      'sort',
      'newest'
    );
  }


  // ========================================
  // CALL BACKEND
  // ========================================

  const response =
    await apiClient(
      `/books/search?${query.toString()}`
    );


  // Backend returns List<BookResponse>
  const rawBooks =
    (response || [])
      .map(normalizeBook);

  const books =
    filterOutUserOwnBooks(rawBooks);

  return {
    books,
    total: books.length
  };
}


// ========================================
// GET SINGLE BOOK
// ========================================

export async function getBookById(id) {

  const book =
    await apiClient(`/books/${id}`);

  return normalizeBook(book);
}


// ========================================
// GET MY BOOKS
// ========================================

export async function getMyBooks() {

  const books =
    await apiClient('/books/my');

  return (books || [])
    .map(normalizeBook);
}


// ========================================
// SEARCH BOOKS
// ========================================

export async function searchBooks(
  params = {}
) {

  const query =
    new URLSearchParams();


  // ========================================
  // KEYWORD
  // ========================================

  if (params.keyword) {

    query.append(
      'keyword',
      params.keyword
    );
  }


  // ========================================
  // CATEGORY
  // ========================================

  if (params.category) {

    query.append(
      'category',
      params.category
    );
  }


  // ========================================
  // CONDITION
  // ========================================

  if (params.condition) {

    query.append(
      'condition',
      params.condition
    );
  }


  // ========================================
  // MIN PRICE
  // ========================================

  if (
    params.minPrice !== undefined &&
    params.minPrice !== ''
  ) {

    query.append(
      'minPrice',
      params.minPrice
    );
  }


  // ========================================
  // MAX PRICE
  // ========================================

  if (
    params.maxPrice !== undefined &&
    params.maxPrice !== ''
  ) {

    query.append(
      'maxPrice',
      params.maxPrice
    );
  }


  // ========================================
  // CITY
  // ========================================

  if (params.city) {

    query.append(
      'city',
      params.city
    );
  }


  // ========================================
  // TRANSACTION TYPE
  // ========================================

  if (params.transactionType) {

    query.append(
      'transactionType',
      params.transactionType
    );
  }


  // ========================================
  // LANGUAGE
  // ========================================

  if (params.language) {

    query.append(
      'language',
      params.language
    );
  }


  // ========================================
  // DELIVERY
  // ========================================

  if (params.delivery) {

    query.append(
      'delivery',
      params.delivery
    );
  }


  // ========================================
  // LISTING TYPE
  // ========================================

  if (
    params.listingType &&
    params.listingType !== 'all'
  ) {

    query.append(
      'listingType',
      params.listingType
    );
  }


  // ========================================
  // VERIFIED ONLY
  // ========================================

  if (params.verifiedOnly) {

    query.append(
      'verifiedOnly',
      'true'
    );
  }


  // ========================================
  // SORT
  // ========================================

  if (params.sort) {

    query.append(
      'sort',
      params.sort
    );
  }


  // ========================================
  // CALL BACKEND
  // ========================================

  const response =
    await apiClient(
      `/books/search?${query.toString()}`
    );

  const rawBooks =
    (response || [])
      .map(normalizeBook);

  return filterOutUserOwnBooks(rawBooks);
}


// ========================================
// CREATE BOOK
// ========================================

export async function createBook(
  bookData
) {

  const book =
    await apiClient('/books', {
      method: 'POST',
      body: JSON.stringify(bookData)
    });

  return normalizeBook(book);
}


// ========================================
// UPDATE BOOK
// ========================================

export async function updateBook(
  id,
  bookData
) {

  const book =
    await apiClient(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData)
    });

  return normalizeBook(book);
}


// ========================================
// DELETE BOOK
// ========================================

export async function deleteBook(id) {

  return apiClient(
    `/books/${id}`,
    {
      method: 'DELETE'
    }
  );
}


// ========================================
// UPDATE BOOK STATUS
// ========================================

export async function updateBookStatus(
  id,
  status
) {

  const book =
    await apiClient(
      `/books/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          status
        })
      }
    );

  return normalizeBook(book);
}


// ========================================
// FAVORITE TOGGLE
// ========================================

export async function toggleFavorite(
  bookId
) {

  try {

    const current =
      await apiClient(
        `/books/${bookId}/favorite`
      );


    // Backend returns true
    // when current user already favorited it

    if (current === true) {

      await apiClient(
        `/books/${bookId}/favorite`,
        {
          method: 'DELETE'
        }
      );

      return {
        favorited: false
      };
    }


    // Not favorite → add favorite

    await apiClient(
      `/books/${bookId}/favorite`,
      {
        method: 'POST'
      }
    );

    return {
      favorited: true
    };

  } catch (error) {

    console.error(
      'Favorite toggle failed:',
      error
    );

    throw error;
  }
}


// ========================================
// GET MY FAVORITES
// ========================================

export async function getFavorites() {

  const books =
    await apiClient(
      '/users/me/favorites'
    );

  return (books || [])
    .map(normalizeBook);
}


// ========================================
// GET POPULAR BOOKS
// ========================================

export async function getPopularBooks() {

  const response =
    await apiClient(
      '/books/popular'
    );

  const rawBooks =
    (response || [])
      .map(normalizeBook);

  return filterOutUserOwnBooks(rawBooks);
}


// ========================================
// GET BOOKS NEAR YOU
// ========================================

export async function getBooksNearYou(
  location = 'Noida, UP'
) {

  const city =
    location
      ?.split(',')[0]
      ?.trim();


  // If city is not available,
  // return all books instead of
  // sending an invalid request.

  if (!city) {

    const response =
      await apiClient('/books');

    const rawBooks =
      (response?.books || [])
        .map(normalizeBook);

    return filterOutUserOwnBooks(rawBooks);
  }


  const response =
    await apiClient(
      `/books/near-you?city=${encodeURIComponent(city)}`
    );

  const rawBooks =
    (response || [])
      .map(normalizeBook);

  return filterOutUserOwnBooks(rawBooks);
}


// ========================================
// GET LATEST BOOKS
// ========================================

export async function getLatestBooks() {

  const response =
    await apiClient(
      '/books/latest'
    );

  const rawBooks =
    (response || [])
      .map(normalizeBook);

  return filterOutUserOwnBooks(rawBooks);
}


// ========================================
// BOOK API OBJECT
// ========================================

export const bookApi = {

  // Filter helper
  filterOutUserOwnBooks,

  // Marketplace
  getAllBooks,
  getBookById,
  getMyBooks,
  searchBooks,

  // Create / Update / Delete
  createBook,
  createBookListing: createBook,
  updateBook,
  deleteBook,
  deleteListing: deleteBook,
  updateBookStatus,
  updateListingStatus: updateBookStatus,
  getMyBooks,
  getMyListings: getMyBooks,

  // Favorites
  toggleFavorite,
  getFavorites,

  // Home page
  getPopularBooks,
  getBooksNearYou,
  getLatestBooks
};


export default bookApi;