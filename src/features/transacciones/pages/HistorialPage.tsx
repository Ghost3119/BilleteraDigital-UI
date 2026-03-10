import { useState } from 'react';
import { useHistorial } from '../../cuentas/hooks/useHistorial';
import type { TransaccionDto } from '../../cuentas/types/cuentas.types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount);
}

// ── TransaccionRow ────────────────────────────────────────────────────────────

function TransaccionRow({ t }: { t: TransaccionDto }) {
  const esIngreso = t.direccion === 'Ingreso';

  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-gray-50 last:border-0">
      {/* Icon */}
      <div className={[
        'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
        esIngreso ? 'bg-[#22C55E]/12' : 'bg-[#EF4444]/10',
      ].join(' ')}>
        {esIngreso ? (
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#22C55E" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#EF4444" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )}
      </div>

      {/* Description + date */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{t.descripcion || t.tipoMovimiento}</p>
        <p className="text-xs text-gray-400 mt-0.5">{formatDate(t.fechaHora)}</p>
      </div>

      {/* Amount */}
      <div className="text-right shrink-0">
        <p className={['text-sm font-bold', esIngreso ? 'text-[#22C55E]' : 'text-[#EF4444]'].join(' ')}>
          {esIngreso ? '+' : '-'}{formatMoney(t.monto)}
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">{t.tipoMovimiento}</p>
      </div>
    </div>
  );
}

// ── Pagination controls ───────────────────────────────────────────────────────

function PaginationBar({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50 active:scale-95 transition-all"
      >
        ← Anterior
      </button>
      <span className="text-xs text-gray-400">
        Página {page} de {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50 active:scale-95 transition-all"
      >
        Siguiente →
      </button>
    </div>
  );
}

// ── HistorialPage ─────────────────────────────────────────────────────────────

export default function HistorialPage() {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const { data, isLoading, isError, isFetching } = useHistorial(page, PAGE_SIZE);

  const items = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;
  const totalCount = data?.pagination?.totalCount ?? 0;

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="px-4 pt-8 pb-2">
        <p className="text-xs text-gray-400 uppercase tracking-widest">Billetera Digital</p>
        <h1 className="text-xl font-bold text-gray-900 mt-0.5">Historial</h1>
        {!isLoading && !isError && (
          <p className="text-xs text-gray-400 mt-1">{totalCount} movimiento{totalCount !== 1 ? 's' : ''}</p>
        )}
      </div>

      {/* Content */}
      <div className="mx-4 mt-4">
        {isError ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600">No se pudo cargar el historial. Verifica tu conexión.</p>
          </div>
        ) : isLoading ? (
          /* Skeleton */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-2 bg-gray-100 rounded w-1/2" />
                </div>
                <div className="w-16 h-3 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="#9CA3AF" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Sin movimientos</p>
              <p className="text-xs text-gray-400 mt-0.5">Tus transacciones aparecerán aquí</p>
            </div>
          </div>
        ) : (
          <div className={['bg-white rounded-2xl border border-gray-100 shadow-sm px-4 transition-opacity', isFetching ? 'opacity-60' : ''].join(' ')}>
            {items.map((t) => (
              <TransaccionRow key={t.id} t={t} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="mx-4 mt-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <PaginationBar
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>
      )}
    </div>
  );
}
