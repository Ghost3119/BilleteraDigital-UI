import { useMutation, useQueryClient } from '@tanstack/react-query';
import { realizarTransferencia } from '../services/transferenciaService';
import type { RealizarTransferenciaRequest } from '../types/transferencias.types';

/**
 * useTransferencia — mutation hook to submit a transfer.
 * On success, invalidates saldo + historial queries so the dashboard refreshes.
 */
export function useTransferencia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RealizarTransferenciaRequest) => realizarTransferencia(data),
    onSuccess: () => {
      // Invalidate all cuenta queries (saldo + historial) so they refetch.
      queryClient.invalidateQueries({ queryKey: ['cuentas'] });
    },
  });
}
