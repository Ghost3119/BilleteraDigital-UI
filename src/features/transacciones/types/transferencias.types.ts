/**
 * transferencias.types.ts — co-located with the transacciones feature slice.
 * Mirrors the backend DTOs from BilleteraDigital.Application.UseCases.Transferencia.
 */

export interface RealizarTransferenciaRequest {
  cuentaOrigenId: string;
  /** Email address or account number (long) of the recipient. */
  destinatario: string;
  monto: number;
  descripcion: string;
}

export interface TransferenciaResponse {
  transaccionId: string;
  cuentaOrigenId: string;
  cuentaDestinoId: string;
  monto: number;
  saldoOrigenResultante: number;
  fechaHora: string;
  descripcion: string;
}
