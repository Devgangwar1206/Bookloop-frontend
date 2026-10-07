const RAW_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000';

const API_BASE_URL =
  RAW_API_BASE_URL
    .replace(/\/+$/, '')
    .replace(/\/api\/v1$/, '');


// =========================================================
// GET JWT TOKEN
// =========================================================

function getToken() {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    localStorage.getItem('jwt')
  );
}


// =========================================================
// COMMON REQUEST FUNCTION
// =========================================================

async function request(endpoint, options = {}) {

  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers
    }
  );

  if (!response.ok) {
    if ((response.status === 401 || response.status === 403) && token) {
      try {
        const retryHeaders = { ...headers };
        delete retryHeaders.Authorization;
        const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: retryHeaders
        });
        if (retryRes.ok) {
          if (retryRes.status === 204) return null;
          return retryRes.json();
        }
      } catch (e) {
        // continue to error throwing below
      }
    }

    let message =
      `Request failed with status ${response.status}`;

    try {
      const errorData = await response.json();
      if (errorData?.message) {
        message = errorData.message;
      }
    } catch {
      // response body JSON nahi hai
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}


// =========================================================
// ADMIN API
// =========================================================

const adminApi = {

  // -------------------------------------------------------
  // ADMIN OVERVIEW
  // -------------------------------------------------------

  async getAdminOverview() {

    return request(
      '/api/v1/admin/overview',
      {
        method: 'GET'
      }
    );
  },


  // -------------------------------------------------------
  // METRICS
  // -------------------------------------------------------

  async getMetrics() {

    const data =
      await this.getAdminOverview();

    return {

      totalUsers:
        String(data.metrics?.totalUsers ?? 0),

      totalBooks:
        String(data.metrics?.totalBooks ?? 0),

      totalExchanges:
        String(data.metrics?.totalExchanges ?? 0),

      totalSalesValue:
        data.metrics?.totalSalesValue || '₹0',

      activeListings:
        String(data.metrics?.activeListings ?? 0),

      openReports:
        (data.reports || [])
          .filter(
            report =>
              report.status !== 'Resolved' &&
              report.status !== 'Dismissed'
          )
          .length
    };
  },


  // -------------------------------------------------------
  // USERS
  // -------------------------------------------------------

  async getUsers() {

    const data =
      await this.getAdminOverview();

    return data.users || [];
  },


  // -------------------------------------------------------
  // UPDATE USER STATUS
  // -------------------------------------------------------

  async updateUserStatus(
    userId,
    status
  ) {

    return request(
      `/api/v1/admin/users/${userId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          status
        })
      }
    );
  },


  // -------------------------------------------------------
  // TOGGLE USER VERIFICATION
  // -------------------------------------------------------

  async toggleUserVerification(userId) {

    return request(
      `/api/v1/admin/users/${userId}/verify`,
      {
        method: 'PATCH'
      }
    );
  },


  // -------------------------------------------------------
  // REPORTS
  // -------------------------------------------------------

  async getReports() {

    const data =
      await this.getAdminOverview();

    return data.reports || [];
  },


  // -------------------------------------------------------
  // RESOLVE REPORT
  // -------------------------------------------------------

  async resolveReport(
    reportId,
    action
  ) {

    return request(
      `/api/v1/admin/reports/${reportId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          action
        })
      }
    );
  },

  // -------------------------------------------------------
  // SUBMIT REPORT (COMMUNITY FLAGGING)
  // -------------------------------------------------------

  async submitReport({ bookId, reason, details }) {

    return request(
      '/api/v1/reports',
      {
        method: 'POST',
        body: JSON.stringify({
          bookId,
          reason,
          details
        })
      }
    );
  }

};


// =========================================================
// EXPORTS
// =========================================================

export { adminApi };

export default adminApi;