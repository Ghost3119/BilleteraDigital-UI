import type { AxiosError } from 'axios';

// ── parseApiError ─────────────────────────────────────────────────────────────

/**
 * Extracts a human-readable message from an Axios error response.
 *
 * The API returns errors in two shapes:
 *   - `{ error: string }` — domain/business errors
 *   - `{ title: string }` — ASP.NET Core ProblemDetails
 *
 * @param error        The unknown error thrown by Axios / TanStack Query
 * @param fallback     Optional message returned when no API message is found
 * @returns            A display-ready error string
 *
 * @example
 * import { parseApiError } from '../../../utils/parseApiError';
 * // ...
 * {isError && <AlertBanner variant="error" message={parseApiError(error)} />}
 */
export function parseApiError(
  error: unknown,
  fallback = 'Ocurrió un error. Intenta de nuevo.',
): string {
  const axiosErr = error as AxiosError<{ error?: string; title?: string }>;
  if (axiosErr?.response?.data?.error) return axiosErr.response.data.error;
  if (axiosErr?.response?.data?.title) return axiosErr.response.data.title;
  return fallback;
}
