import apiClient from '../../../config/axiosClient';
import type {
  LoginConEmailRequest,
  RefreshTokenRequest,
  TokenResponse,
  RegistrarUsuarioRequest,
  UsuarioRegistradoResponse,
} from '../types/auth.types';

/**
 * Auth API service.
 * All functions are plain async functions — no React hooks here.
 * They are consumed by React Query mutation hooks in ../hooks/.
 */

/**
 * Authenticate a user with email + password.
 * POST /api/v1/Auth/token
 */
export async function login(data: LoginConEmailRequest): Promise<TokenResponse> {
  const response = await apiClient.post<TokenResponse>('/Auth/token', data);
  return response.data;
}

/**
 * Rotate an expired access token using a valid refresh token.
 * POST /api/v1/Auth/refresh
 */
export async function refreshToken(data: RefreshTokenRequest): Promise<TokenResponse> {
  const response = await apiClient.post<TokenResponse>('/Auth/refresh', data);
  return response.data;
}

/**
 * Register a new user account.
 * POST /api/v1/Usuarios
 */
export async function registrarUsuario(data: RegistrarUsuarioRequest): Promise<UsuarioRegistradoResponse> {
  const response = await apiClient.post<UsuarioRegistradoResponse>('/Usuarios/registrar', data);
  return response.data;
}
