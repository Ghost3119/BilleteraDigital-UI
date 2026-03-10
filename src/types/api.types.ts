/**
 * Shared API types used across the entire application.
 * Co-located here so both the Axios client and feature services
 * can import from a single source of truth.
 */

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiraEn: string;
  tipo: string;
}

export interface UsuarioRegistradoResponse {
  id: string;
  nombre: string;
  email: string;
  fechaRegistro: string;
}

// ── Cuentas ───────────────────────────────────────────────────────────────────

export interface CuentaResponse {
  id: string;
  numeroCuenta: number;
  nombreTitular: string;
  saldo: number;
  estado: 'Activa' | 'Inactiva' | 'Bloqueada';
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

// ── Transacciones ─────────────────────────────────────────────────────────────

export interface TransaccionDto {
  id: string;
  monto: number;
  saldoResultante: number;
  fechaHora: string;
  descripcion: string;
  tipoMovimiento: 'Transferencia' | 'Deposito' | 'Retiro';
  direccion: 'Ingreso' | 'Egreso';
}

export interface RealizarTransferenciaRequest {
  cuentaOrigenId: string;
  cuentaDestinoId: string;
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

// ── Pagination ────────────────────────────────────────────────────────────────

/** Metadata parsed from the X-Pagination response header. */
export interface PaginationMeta {
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}

/**
 * Wrapper that bundles a typed data array with its pagination metadata.
 * Populated by the Axios response interceptor.
 */
export interface PagedResponse<T> {
  data: T[];
  pagination: PaginationMeta | null;
}
