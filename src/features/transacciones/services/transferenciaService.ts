import apiClient from '../../../config/axiosClient';
import type { RealizarTransferenciaRequest, TransferenciaResponse } from '../types/transferencias.types';

/**
 * Realiza una transferencia entre cuentas.
 * POST /api/v1/Cuentas/transferencias
 */
export async function realizarTransferencia(
  data: RealizarTransferenciaRequest,
): Promise<TransferenciaResponse> {
  const res = await apiClient.post<TransferenciaResponse>('/Cuentas/transferencias', data);
  return res.data;
}
