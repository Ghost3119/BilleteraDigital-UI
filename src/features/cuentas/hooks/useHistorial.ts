import { useQuery } from '@tanstack/react-query';
import { obtenerHistorial } from '../services/cuentasService';
import { CUENTA_ID_KEY } from '../../../config/axiosClient';

export const historialKeys = {
  list: (id: string, page: number, filters?: string) =>
    ['cuentas', id, 'transacciones', page, filters] as const,
};

/**
 * Fetches a paginated page of transactions for the stored account.
 */
export function useHistorial(pageNumber = 1, pageSize = 10, filtersBase64?: string) {
  const cuentaId = localStorage.getItem(CUENTA_ID_KEY) ?? '';

  return useQuery({
    queryKey: historialKeys.list(cuentaId, pageNumber, filtersBase64),
    queryFn: () => obtenerHistorial(cuentaId, pageNumber, pageSize, filtersBase64),
    enabled: !!cuentaId,
  });
}
