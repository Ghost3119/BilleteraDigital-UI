/**
 * cuentas.types.ts — co-located with the cuentas feature slice.
 * Mirrors the backend DTOs from BilleteraDigital.Application.UseCases.Cuenta.
 */

export interface CuentaResponse {
  id: string;
  numeroCuenta: number;
  nombreTitular: string;
  saldo: number;
  estado: string;
  fechaCreacion: string;
  fechaUltimaOperacion: string | null;
}

export interface SaldoResponse {
  cuentaId: string;
  numeroCuenta: number;
  nombreTitular: string;
  saldo: number;
  consultadoEn: string;
}

export interface TransaccionDto {
  id: string;
  monto: number;
  saldoResultante: number;
  fechaHora: string;
  descripcion: string;
  tipoMovimiento: string;
  /** "Ingreso" | "Egreso" from the perspective of the queried account */
  direccion: 'Ingreso' | 'Egreso';
}

export interface PaginationMeta {
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}
