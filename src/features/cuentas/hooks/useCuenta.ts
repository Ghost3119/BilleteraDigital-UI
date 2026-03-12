import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultarSaldo, crearCuenta, getMisCuentas } from '../services/cuentasService';

// ── Query key factory ─────────────────────────────────────────────────────────

export const cuentaKeys = {
  misCuentas: () => ['cuentas', 'mias'] as const,
  saldo: (id: string) => ['cuentas', id, 'saldo'] as const,
};

// ── useMisCuentas ─────────────────────────────────────────────────────────────

/**
 * Fetches all accounts belonging to the authenticated user.
 * Replaces the localStorage-based pattern for resolving the active cuentaId.
 */
export function useMisCuentas() {
  return useQuery({
    queryKey: cuentaKeys.misCuentas(),
    queryFn: getMisCuentas,
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
