import { QueryClient } from '@tanstack/react-query';

/**
 * Centralised QueryClient configuration.
 *
 * Defaults chosen for a banking-style app where stale data is undesirable:
 *
 *  staleTime: 0          — balance and transaction data must always be fresh.
 *  gcTime: 5 min         — keep unused cache 5 minutes (default) to avoid
 *                          unnecessary re-fetches when navigating back.
 *  retry: 1              — retry once on failure (network blip), not 3×.
 *  refetchOnWindowFocus: true — re-validate whenever the user returns to the
 *                          tab (important for live balance updates).
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 5 * 60 * 1_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
