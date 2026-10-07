import apiClient from './apiClient';


export async function createOrder(orderData) {

  return apiClient('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });

}


export async function getMyOrders() {

  return apiClient('/orders/my');

}


export async function getSellerOrders() {

  return apiClient('/orders/seller');

}


export async function getOrderById(orderId) {

  return apiClient(`/orders/${orderId}`);

}


export async function updateOrderStatus(
  orderId,
  status
) {

  return apiClient(
    `/orders/${orderId}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }
  );

}


export async function cancelOrder(orderId) {

  return apiClient(
    `/orders/${orderId}/cancel`,
    {
      method: 'PATCH',
    }
  );

}