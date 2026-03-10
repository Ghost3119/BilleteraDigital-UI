/**
 * Auth-specific TypeScript interfaces co-located with the auth feature slice.
 * These mirror the backend DTOs exactly (camelCase JSON deserialization).
 */

// ── Requests ──────────────────────────────────────────────────────────────────

/** Body sent to POST /api/v1/Auth/token */
export interface LoginConEmailRequest {
  email: string;
  password: string;
}

/** Body sent to POST /api/v1/Auth/refresh */
export interface RefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}

// ── Responses ─────────────────────────────────────────────────────────────────

/** Response from POST /api/v1/Auth/token and POST /api/v1/Auth/refresh */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiraEn: string;
  tipo: string;
}

// ── Registration ──────────────────────────────────────────────────────────────

/** Body sent to POST /api/v1/Usuarios */
export interface RegistrarUsuarioRequest {
  nombre: string;
  email: string;
  password: string;
}

/** Response from POST /api/v1/Usuarios */
export interface UsuarioRegistradoResponse {
  id: string;
  nombre: string;
  email: string;
  fechaRegistro: string;
}
