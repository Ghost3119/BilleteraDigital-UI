import { useQuery } from '@tanstack/react-query';
import { getTransacciones } from '../services/transaccionesService';
import type { TransaccionDto } from '../../cuentas/types/cuentas.types';
import type { PagedResponse } from '../../../types/api.types';

// ── Query key factory ─────────────────────────────────────────────────────────

export const transaccionesKeys = {
  list: (cuentaId: string, page: number, pageSize: number) =>
    ['cuentas', cuentaId, 'transacciones', page, pageSize] as const,
};

// ── useTransacciones ──────────────────────────────────────────────────────────

/**
 * Fetches a paginated page of transactions for the given account.
 *
 * The query is disabled while `cuentaId` is null/empty so React Query never
 * fires a request with an invalid URL.
 *
 * The `select` transform unwraps the PagedResponse (produced by the Axios
 * interceptor) into a plain `{ items, pagination }` shape so callers don't
 * need to know about the interceptor contract.
 */
export function useTransacciones(
  cuentaId: string | null,
  pageNumber = 1,
  pageSize = 15,
) {
  return useQuery({
    queryKey: transaccionesKeys.list(cuentaId ?? '', pageNumber, pageSize),
    queryFn: () => getTransacciones(cuentaId!, pageNumber, pageSize),
    enabled: !!cuentaId,
    select: (response: PagedResponse<TransaccionDto>) => {
      // Happy path: interceptor ran → response is PagedResponse<TransaccionDto>
      if (
        response &&
        typeof response === 'object' &&
        'data' in response &&
        Array.isArray(response.data)
      ) {
        return {
          items: response.data,
          pagination: response.pagination,
        };
      }
      // Fallback: interceptor didn't fire → raw TransaccionDto[]
      const raw = response as unknown;
      return {
        items: Array.isArray(raw) ? (raw as TransaccionDto[]) : [],
        pagination: null,
      };
    },
  });
}
