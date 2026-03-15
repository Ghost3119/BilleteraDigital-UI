import type { TransaccionDto } from '../../cuentas/types/cuentas.types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(amount);
}

// ── TransactionRow ────────────────────────────────────────────────────────────

interface TransactionRowProps {
  t: TransaccionDto;
}

/**
 * Single row in the transaction history list.
 *
 * Layout (left → right):
 *   [icon]  tipoMovimiento (bold)       +/- monto (colored)
 *           descripcion (gray, optional)
 *           fechaHora (gray)
 *
 * Colors driven exclusively by `t.direccion`:
 *   "Ingreso" → green-100 bg / green-600 icon & amount / "+" prefix
 *   "Egreso"  → red-100   bg / red-500   icon & amount / "−" prefix
 */
export default function TransactionRow({ t }: TransactionRowProps) {
  const esIngreso = t.direccion === 'Ingreso';

  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-gray-50 last:border-0">

      {/* ── Direction icon ───────────────────────────────────────────────────── */}
      <div
        className={[
          'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
          esIngreso ? 'bg-green-100' : 'bg-red-100',
        ].join(' ')}
      >
        {esIngreso ? (
          /* Arrow pointing up — income */
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5 text-green-600"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        ) : (
          /* Arrow pointing down — expense */
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5 text-red-500"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )}
      </div>

      {/* ── Title + description + date ───────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Primary: movement type — always present, always bold */}
        <p className="text-sm font-semibold text-gray-800 truncate">
          {t.tipoMovimiento}
        </p>
        {/* Secondary line: description when it carries meaningful content */}
        {t.descripcion && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{t.descripcion}</p>
        )}
        {/* Date always shown below */}
        <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(t.fechaHora)}</p>
      </div>

      {/* ── Amount ──────────────────────────────────────────────────────────── */}
      <div className="text-right shrink-0">
        <p
          className={[
            'text-sm font-bold',
            esIngreso ? 'text-green-600' : 'text-red-500',
          ].join(' ')}
        >
          {esIngreso ? '+' : '−'}{formatMoney(t.monto)}
        </p>
      </div>

    </div>
  );
}
