import apiClient from '../../../config/axiosClient';
import type { CuentaResponse, SaldoResponse, TransaccionDto } from '../types/cuentas.types';
import type { PagedResponse } from '../../../types/api.types';

/**
 * Devuelve todas las cuentas del usuario autenticado.
 * GET /api/v1/Cuentas/mias
 */
export async function getMisCuentas(): Promise<CuentaResponse[]> {
  const res = await apiClient.get<CuentaResponse[]>('/Cuentas/mias');
  return res.data;
}

/**
 * Crea una nueva cuenta para el usuario autenticado.
 * POST /api/v1/Cuentas
 */
export async function crearCuenta(): Promise<CuentaResponse> {
  const res = await apiClient.post<CuentaResponse>('/Cuentas');
  return res.data;
}

/**
 * Consulta el saldo de una cuenta.
 * GET /api/v1/Cuentas/{id}/saldo
 */
export async function consultarSaldo(cuentaId: string): Promise<SaldoResponse> {
  const res = await apiClient.get<SaldoResponse>(`/Cuentas/${cuentaId}/saldo`);
  return res.data;
}

/**
 * Obtiene el historial paginado de transacciones de una cuenta.
 * GET /api/v1/Cuentas/{id}/transacciones
 *
 * The Axios interceptor wraps the array + X-Pagination header into PagedResponse<TransaccionDto>.
 */
export async function obtenerHistorial(
  cuentaId: string,
  pageNumber = 1,
  pageSize = 10,
  filtersBase64?: string,
): Promise<PagedResponse<TransaccionDto>> {
  const params: Record<string, string | number> = { pageNumber, pageSize };
  if (filtersBase64) params.filtersBase64 = filtersBase64;

  const res = await apiClient.get<PagedResponse<TransaccionDto>>(
    `/Cuentas/${cuentaId}/transacciones`,
    { params },
  );

  return res.data;
}

