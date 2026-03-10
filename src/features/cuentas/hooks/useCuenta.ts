import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultarSaldo, crearCuenta } from '../services/cuentasService';
import { CUENTA_ID_KEY } from '../../../config/axiosClient';

// ── Query key factory ─────────────────────────────────────────────────────────

export const cuentaKeys = {
  saldo: (id: string) => ['cuentas', id, 'saldo'] as const,
};

// ── useSaldo ──────────────────────────────────────────────────────────────────

/**
 * Fetches the balance for the stored account.
 * Returns `null` if no cuentaId is stored (user hasn't created an account yet).
 */
export function useSaldo() {
  const cuentaId = localStorage.getItem(CUENTA_ID_KEY) ?? '';

  return useQuery({
    queryKey: cuentaKeys.saldo(cuentaId),
    queryFn: () => consultarSaldo(cuentaId),
    enabled: !!cuentaId,
  });
}

// ── useCrearCuenta ────────────────────────────────────────────────────────────

/**
 * Mutation to create the user's account on first login.
 * Stores the returned cuentaId in localStorage and invalidates saldo queries.
 */
export function useCrearCuenta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearCuenta,
    onSuccess: (cuenta) => {
      localStorage.setItem(CUENTA_ID_KEY, cuenta.id);
      queryClient.invalidateQueries({ queryKey: ['cuentas'] });
    },
  });
}
