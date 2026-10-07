import apiClient from './apiClient';


export async function createOffer(offerData) {

  return apiClient('/offers', {
    method: 'POST',
    body: JSON.stringify(offerData),
  });

}


export async function getSentOffers() {

  return apiClient('/offers/sent');

}


export async function getReceivedOffers() {

  return apiClient('/offers/received');

}


export async function updateOfferStatus(
  offerId,
  status
) {

  return apiClient(
    `/offers/${offerId}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }
  );

}