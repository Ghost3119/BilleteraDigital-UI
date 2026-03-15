import { useState, useEffect } from 'react';
import { useMisCuentas } from '../../cuentas/hooks/useCuenta';
import { useTransacciones } from '../hooks/useTransacciones';
import type { CuentaResponse } from '../../cuentas/types/cuentas.types';
import TransactionRow from '../components/TransactionRow';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import AlertBanner from '../../../components/ui/AlertBanner';
import PageHeader from '../../../components/ui/PageHeader';

// ── AccountSwitcher ───────────────────────────────────────────────────────────

/**
 * Horizontal scrollable strip of account pills.
 * Only rendered when the user has 2 or more accounts so single-account users
 * never see unnecessary chrome.
 */
function AccountSwitcher({
  cuentas,
  activaId,
  onSelect,
}: {
  cuentas: CuentaResponse[];
  activaId: string;
  onSelect: (id: string) => void;
}) {
  if (cuentas.length <= 1) return null;

  return (
    <div className="mt-3 mb-1">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-4">
        Cuenta
      </p>
      <div
        role="tablist"
        aria-label="Seleccionar cuenta"
        className="w-full flex overflow-x-auto gap-3 px-4 pb-2 snap-x scrollbar-hide"
      >
        {cuentas.map((c) => {
          const isActive = c.id === activaId;
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(c.id)}
              className={[
                'shrink-0 snap-center flex flex-col items-start px-3 py-2.5 rounded-xl border text-left',
                'transition-all duration-150 text-xs w-[140px]',
                isActive
                  ? 'bg-[#1A7A4A] border-[#1A7A4A] text-white shadow-md shadow-[#1A7A4A]/20'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-[#1A7A4A]/40',
              ].join(' ')}
            >
              <span
                className={[
                  'font-semibold truncate w-full',
                  isActive ? 'text-white' : 'text-gray-800',
                ].join(' ')}
              >
                {c.nombreTitular}
              </span>
              <span
                className={[
                  'font-mono mt-0.5',
                  isActive ? 'text-white/80' : 'text-gray-400',
                ].join(' ')}
              >
                ···{c.numeroCuenta.toString().slice(-4)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── SkeletonList ──────────────────────────────────────────────────────────────

function SkeletonList({ rows = 6 }: { rows?: number }) {
  return (
    <Card padding="none" className="divide-y divide-gray-50">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3.5 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="h-3 bg-gray-100 rounded w-3/4" />
            <div className="h-2 bg-gray-100 rounded w-1/2" />
          </div>
          <div className="shrink-0 space-y-1.5 text-right">
            <div className="h-3 bg-gray-100 rounded w-16" />
            <div className="h-2 bg-gray-100 rounded w-10 ml-auto" />
          </div>
        </div>
      ))}
    </Card>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-8 h-8"
          stroke="#9CA3AF"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-600">Sin movimientos</p>
        <p className="text-xs text-gray-400 mt-0.5">Tus transacciones aparecerán aquí</p>
      </div>
    </div>
  );
}

// ── HistorialPage ─────────────────────────────────────────────────────────────

const PAGE_SIZE = 15;

export default function HistorialPage() {
  // ── Task 1: Account context ──────────────────────────────────────────────────
  const { data: cuentas, isLoading: cuentasLoading } = useMisCuentas();

  const [cuentaActivaId, setCuentaActivaId] = useState<string | null>(null);

  // Default to the first account once the list arrives
  useEffect(() => {
    if (cuentas && cuentas.length > 0 && cuentaActivaId === null) {
      setCuentaActivaId(cuentas[0].id);
    }
  }, [cuentas, cuentaActivaId]);

  // Reset page to 1 whenever the user switches accounts
  const [page, setPage] = useState(1);
  const prevCuentaId = cuentaActivaId;
  function handleSelectCuenta(id: string) {
    if (id !== prevCuentaId) setPage(1);
    setCuentaActivaId(id);
  }

  // ── Task 2: Transactions query ────────────────────────────────────────────────
  const { data, isLoading: txLoading, isError, isFetching } = useTransacciones(
    cuentaActivaId,
    page,
    PAGE_SIZE,
  );

  const items      = data?.items      ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;
  const totalCount = data?.pagination?.totalCount ?? 0;

  const isLoading = cuentasLoading || txLoading;

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="pb-8">
      <PageHeader
        title="Historial"
        action={
          !isLoading && !isError && totalCount > 0
            ? (
              <span className="text-xs text-gray-400">
                {totalCount} movimiento{totalCount !== 1 ? 's' : ''}
              </span>
            )
            : undefined
        }
      />

      {/* ── Account switcher (only shown with 2+ accounts) ──────────────────── */}
      {!cuentasLoading && cuentas && cuentaActivaId && (
        <AccountSwitcher
          cuentas={cuentas}
          activaId={cuentaActivaId}
          onSelect={handleSelectCuenta}
        />
      )}

      {/* ── Content area ─────────────────────────────────────────────────────── */}
      <div className="mx-4 mt-4">
        {isError ? (
          <AlertBanner
            variant="error"
            message="No se pudo cargar el historial. Verifica tu conexión."
          />
        ) : isLoading ? (
          <SkeletonList />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          /* ── Transaction list ─────────────────────────────────────────────── */
          <Card
            padding="none"
            className={[
              'px-4 transition-opacity duration-150',
              isFetching ? 'opacity-60' : '',
            ].join(' ')}
          >
            {/* Subtle inline spinner during page transitions */}
            {isFetching && (
              <div className="flex justify-center py-2">
                <Spinner size="w-4 h-4" />
              </div>
            )}
            {items.map((t) => (
              <TransactionRow key={t.id} t={t} />
            ))}
          </Card>
        )}
      </div>

      {/* ── Pagination controls ───────────────────────────────────────────────── */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="mx-4 mt-3">
          <Card padding="none">
            <div className="flex items-center justify-between px-4 py-3">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 text-sm font-medium"
              >
                ← Anterior
              </Button>
              <span className="text-xs text-gray-400">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 text-sm font-medium"
              >
                Siguiente →
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
