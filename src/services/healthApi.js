/**
 * Health Check & Keep-Alive Service
 * Pings backend health endpoints to prevent cold starts on Render / cloud hosts.
 */

const RAW_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000';

const API_BASE_URL = RAW_API_BASE_URL
  .replace(/\/+$/, '')
  .replace(/\/api\/v1$/, '');

export const healthApi = {
  /**
   * Pings the backend health endpoint.
   * Completely non-blocking and failsafe — never throws errors to callers.
   */
  async ping() {
    try {
      const url = `${API_BASE_URL}/api/v1/health`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json().catch(() => null);
        return { ok: true, data };
      }

      // Fallback to root /health if /api/v1/health didn't respond 200
      const fallbackResponse = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        cache: 'no-store',
      });

      return {
        ok: fallbackResponse.ok,
        status: fallbackResponse.status,
      };
    } catch (err) {
      // Do not throw; background ping should never disrupt frontend UI
      return {
        ok: false,
        error: err?.message || 'Network error during health ping',
      };
    }
  },
};

export default healthApi;
