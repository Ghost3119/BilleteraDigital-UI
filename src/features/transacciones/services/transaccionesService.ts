import apiClient from '../../../config/axiosClient';
import type { TransaccionDto } from '../../cuentas/types/cuentas.types';
import type { PagedResponse } from '../../../types/api.types';

/**
 * Obtiene el historial paginado de transacciones para una cuenta concreta.
 * GET /api/v1/Cuentas/{cuentaId}/transacciones?pageNumber=1&pageSize=15
 *
 * The Axios response interceptor automatically wraps the JSON array body
 * together with the X-Pagination header into a PagedResponse<TransaccionDto>.
 */
export async function getTransacciones(
  cuentaId: string,
  pageNumber = 1,
  pageSize = 15,
): Promise<PagedResponse<TransaccionDto>> {
  const res = await apiClient.get<PagedResponse<TransaccionDto>>(
    `/Cuentas/${cuentaId}/transacciones`,
    { params: { pageNumber, pageSize } },
  );
  return res.data;
}
