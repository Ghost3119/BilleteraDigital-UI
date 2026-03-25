import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { PaginationMeta, PagedResponse } from '../types/api.types';

// ── Constants ─────────────────────────────────────────────────────────────────

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5112/api/v1';
export const ACCESS_TOKEN_KEY = 'billetera_access_token';
export const REFRESH_TOKEN_KEY = 'billetera_refresh_token';
export const CUENTA_ID_KEY = 'billetera_cuenta_id';

// ── Axios instance ────────────────────────────────────────────────────────────

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

// ── Request Interceptor ───────────────────────────────────────────────────────
// Automatically attaches the stored JWT to every outgoing request.

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor ──────────────────────────────────────────────────────
// Two responsibilities:
//   1. Parse the X-Pagination header (set by the backend on list endpoints)
//      and merge it into `response.data` as a `PagedResponse<T>` shape so
//      React Query hooks can read pagination metadata without extra work.
//   2. On 401 responses, clear stored tokens and redirect to /login so the
//      user is never stuck with a stale/expired session silently.

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const paginationHeader = response.headers['x-pagination'];

    if (paginationHeader) {
      // The backend serialises pagination as JSON in the X-Pagination header.
      // e.g.: {"totalCount":42,"pageSize":10,"pageNumber":1,"totalPages":5}
      try {
        const pagination: PaginationMeta = JSON.parse(paginationHeader);

        // Wrap: { data: originalBody, pagination: meta }
        const paged: PagedResponse<unknown> = {
          data: Array.isArray(response.data) ? response.data : [],
          pagination,
        };
        response.data = paged;
      } catch {
        // Malformed header — leave response.data untouched.
        console.warn('[apiClient] Failed to parse X-Pagination header:', paginationHeader);
      }
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — wipe credentials and force re-login.
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);

      // Avoid importing the router here (circular dep risk); use location.
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
