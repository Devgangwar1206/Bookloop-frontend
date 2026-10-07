import apiClient from './apiClient';


export async function addFavorite(bookId) {

  return apiClient(`/books/${bookId}/favorite`, {
    method: 'POST',
  });

}


export async function removeFavorite(bookId) {

  return apiClient(`/books/${bookId}/favorite`, {
    method: 'DELETE',
  });

}


export async function getMyFavorites() {

  return apiClient('/users/me/favorites');

}


export async function isFavorite(bookId) {

  return apiClient(`/books/${bookId}/favorite`);

}


export async function getFavoriteCount(bookId) {

  return apiClient(
    `/books/${bookId}/favorites/count`
  );

}