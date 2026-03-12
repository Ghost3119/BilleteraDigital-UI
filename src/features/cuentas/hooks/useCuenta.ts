import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultarSaldo, crearCuenta, getMisCuentas } from '../services/cuentasService';
import type { CuentaResponse } from '../types/cuentas.types';

// ── Query key factory ─────────────────────────────────────────────────────────

export const cuentaKeys = {
  misCuentas: () => ['cuentas', 'mias'] as const,
  saldo: (id: string) => ['cuentas', id, 'saldo'] as const,
};

// ── useMisCuentas ─────────────────────────────────────────────────────────────

/**
 * Fetches the first page (up to 50) of accounts belonging to the authenticated
 * user. The `select` transform unwraps the PagedResponse so consumers receive
 * a plain CuentaResponse[] — no call-site changes required.
 */
export function useMisCuentas() {
  return useQuery({
    queryKey: cuentaKeys.misCuentas(),
    queryFn: () => getMisCuentas(),
    select: (response): CuentaResponse[] => {
      // Happy path: interceptor fired and wrapped the body into PagedResponse.
      if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
        return response.data;
      }
      // Fallback: interceptor did not fire (X-Pagination header absent or failed to parse),
      // response.data came back as the raw CuentaResponse[] array.
      const raw = response as unknown;
      return Array.isArray(raw) ? (raw as CuentaResponse[]) : [];
    },
  });
}

// ── useSaldo ──────────────────────────────────────────────────────────────────

/**
 * Fetches the balance for a given account id.
 * Returns disabled state when no id is provided.
 */
export function useSaldo(cuentaId: string) {
  return useQuery({
    queryKey: cuentaKeys.saldo(cuentaId),
    queryFn: () => consultarSaldo(cuentaId),
    enabled: !!cuentaId,
  });
}

// ── useCrearCuenta ────────────────────────────────────────────────────────────

/**
 * Mutation to create the user's account on first login.
 * Invalidates misCuentas so the dashboard refetches automatically.
 */
export function useCrearCuenta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearCuenta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cuentaKeys.misCuentas() });
    },
  });
}
