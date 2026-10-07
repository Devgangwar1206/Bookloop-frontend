import apiClient from './apiClient';


// =====================================================
// GET ALL BOOKS
// =====================================================

export async function getBooks() {
  return apiClient('/books');
}


// =====================================================
// GET SINGLE BOOK
// =====================================================

export async function getBookById(id) {
  return apiClient(`/books/${id}`);
}


// =====================================================
// GET MY BOOKS
// =====================================================

export async function getMyBooks() {
  return apiClient('/books/my');
}


// =====================================================
// SEARCH + FILTER
// =====================================================

export async function searchBooks(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      value !== 'all'
    ) {
      query.append(key, value);
    }
  });

  const queryString = query.toString();

  return apiClient(
    queryString
      ? `/books/search?${queryString}`
      : '/books/search'
  );
}


// =====================================================
// POPULAR BOOKS
// =====================================================

export async function getPopularBooks() {
  return apiClient('/books/popular');
}


// =====================================================
// LATEST BOOKS
// =====================================================

export async function getLatestBooks() {
  return apiClient('/books/latest');
}


// =====================================================
// BOOKS NEAR YOU
// =====================================================

export async function getBooksNearYou(city = 'Noida') {
  return apiClient(
    `/books/near-you?city=${encodeURIComponent(city)}`
  );
}


// =====================================================
// CREATE BOOK
// =====================================================

export async function createBook(bookData) {
  return apiClient('/books', {
    method: 'POST',
    body: JSON.stringify(bookData),
  });
}


// Compatibility name for existing frontend
export const createBookListing = createBook;


// =====================================================
// UPDATE BOOK
// =====================================================

export async function updateBook(id, bookData) {
  return apiClient(`/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bookData),
  });
}


// =====================================================
// DELETE BOOK
// =====================================================

export async function deleteBook(id) {
  return apiClient(`/books/${id}`, {
    method: 'DELETE',
  });
}


// =====================================================
// UPDATE BOOK STATUS
// =====================================================

export async function updateBookStatus(id, status) {
  return apiClient(`/books/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({
      status,
    }),
  });
}


// =====================================================
// FAVORITE - ADD
// =====================================================

export async function addFavorite(bookId) {
  return apiClient(`/books/${bookId}/favorite`, {
    method: 'POST',
  });
}


// =====================================================
// FAVORITE - REMOVE
// =====================================================

export async function removeFavorite(bookId) {
  return apiClient(`/books/${bookId}/favorite`, {
    method: 'DELETE',
  });
}


// =====================================================
// FAVORITE - CHECK
// =====================================================

export async function isFavorite(bookId) {
  return apiClient(`/books/${bookId}/favorite`);
}


// =====================================================
// MY FAVORITES
// =====================================================

export async function getMyFavorites() {
  return apiClient('/users/me/favorites');
}


// =====================================================
// FAVORITES COUNT
// =====================================================

export async function getFavoriteCount(bookId) {
  return apiClient(
    `/books/${bookId}/favorites/count`
  );
}


// =====================================================
// EXPORT OBJECT
// =====================================================

export const bookApi = {
  getBooks,
  getBookById,
  getMyBooks,
  searchBooks,

  getPopularBooks,
  getLatestBooks,
  getBooksNearYou,

  createBook,
  createBookListing,

  updateBook,
  deleteBook,
  updateBookStatus,

  addFavorite,
  removeFavorite,
  isFavorite,
  getMyFavorites,
  getFavoriteCount,
};

export default bookApi;