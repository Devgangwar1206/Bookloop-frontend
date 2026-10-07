const RAW_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000';

const API_BASE_URL = RAW_API_BASE_URL
  .replace(/\/+$/, '')
  .replace(/\/api\/v1$/, '');

export async function apiClient(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;

  const apiEndpoint = cleanEndpoint.startsWith('/api/v1')
    ? cleanEndpoint.substring('/api/v1'.length)
    : cleanEndpoint;

  const url = `${API_BASE_URL}/api/v1${apiEndpoint}`;

  const token =
    typeof window !== 'undefined'
      ? (
          localStorage.getItem('token') ||
          localStorage.getItem('accessToken') ||
          localStorage.getItem('jwt')
        )
      : null;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';

    let data = null;

    if (contentType.includes('application/json')) {
      data = await response.json().catch(() => null);
    } else {
      data = await response.text().catch(() => null);
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
        data?.error ||
        (typeof data === 'string' && data) ||
        `API Error: ${response.status}`
      );
    }

    return data;

  } catch (err) {
    console.error(
      `[BookLoop API] ${endpoint}`,
      err
    );

    throw err;
  }
}

export default apiClient;