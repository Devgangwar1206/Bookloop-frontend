import apiClient from './apiClient';


export async function registerUser(userData) {

  return apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

}


export async function loginUser(credentials) {

  const data = await apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });


  // Save JWT
  if (data?.token) {
    localStorage.setItem('token', data.token);
  }


  return data;
}


export function logoutUser() {

  localStorage.removeItem('token');

}


export async function forgotPassword(email) {

  return apiClient('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

}


export async function verifyOtp(data) {

  return apiClient('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  });

}


export async function resetPassword(data) {

  return apiClient('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });

}