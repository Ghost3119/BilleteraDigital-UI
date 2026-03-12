import { useState } from 'react';
import { useMisCuentas, useCrearCuenta } from '../../cuentas/hooks/useCuenta';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatNumeroCuenta(n: number): string {
  // Format as: 0000-0000-0000-XXXX
  const s = n.toString().padStart(16, '0');
  return `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}-${s.slice(12)}`;
}

// ── BalanceCard ───────────────────────────────────────────────────────────────

function BalanceCard({
  saldo,
  numeroCuenta,
  nombreTitular,
  isLoading,
}: {
  saldo: number;
  numeroCuenta: number;
  nombreTitular: string;
  isLoading: boolean;
}) {
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <div className="mx-4 mt-6 rounded-2xl bg-gradient-to-br from-[#1A7A4A] to-[#145E38] p-5 text-white shadow-lg shadow-[#1A7A4A]/30">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-white/70 uppercase tracking-widest font-medium">Saldo disponible</p>
          <p className="text-sm font-semibold mt-0.5 truncate max-w-[180px]">{nombreTitular}</p>
        </div>
        <button
          onClick={() => setBalanceVisible((v) => !v)}
          className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
          aria-label={balanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'}
        >
          {balanceVisible ? (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          )}
        </button>
      </div>

      {/* Balance amount */}
      <div className="mb-4">
        {isLoading ? (
          <div className="h-10 w-40 bg-white/20 rounded-lg animate-pulse" />
        ) : (
          <p className="text-4xl font-bold tracking-tight">
            {balanceVisible ? formatMoney(saldo) : '••••••'}
          </p>
        )}
      </div>

      {/* Account number */}
      <div className="border-t border-white/20 pt-3">
        <p className="text-[11px] text-white/60 uppercase tracking-widest">N° de cuenta</p>
        <p className="text-sm font-mono font-medium mt-0.5 tracking-wider">
          {isLoading ? '---- ---- ---- ----' : formatNumeroCuenta(numeroCuenta)}
        </p>
      </div>
    </div>
  );
}

// ── QuickActions ──────────────────────────────────────────────────────────────

function QuickActions() {
  const actions = [
    {
      label: 'Transferir',
      to: '/transferir',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="#1A7A4A" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
    {
      label: 'Historial',
      to: '/historial',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="#1A7A4A" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      label: 'Perfil',
      to: '/perfil',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="#1A7A4A" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mx-4 mt-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Acciones rápidas</p>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => (
          <a
            key={action.to}
            href={action.to}
            className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#1A7A4A]/20 active:scale-95 transition-all duration-150"
          >
            <div className="w-11 h-11 rounded-full bg-[#1A7A4A]/8 flex items-center justify-center">
              {action.icon}
            </div>
            <span className="text-xs font-medium text-gray-700">{action.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ── NoAccount ─────────────────────────────────────────────────────────────────

function NoAccount() {
  const { mutate: crear, isPending, isError } = useCrearCuenta();

  return (
    <div className="mx-4 mt-10 flex flex-col items-center text-center gap-4">
      <div className="w-20 h-20 rounded-full bg-[#1A7A4A]/10 flex items-center justify-center">
        <span className="text-4xl font-bold text-[#1A7A4A]">$</span>
      </div>
      <div>
        <p className="text-lg font-bold text-gray-800">Aún no tienes cuenta</p>
        <p className="text-sm text-gray-500 mt-1">Crea tu cuenta gratuita para empezar a operar.</p>
      </div>
      {isError && (
        <p className="text-xs text-red-500">Error al crear la cuenta. Intenta de nuevo.</p>
      )}
      <button
        onClick={() => crear()}
        disabled={isPending}
        className={[
          'w-full max-w-[260px] py-3.5 rounded-xl text-white text-sm font-bold uppercase tracking-widest',
          'transition-all duration-200',
          isPending
            ? 'bg-[#1A7A4A]/60 cursor-not-allowed'
            : 'bg-[#1A7A4A] hover:bg-[#145E38] active:scale-[0.98] shadow-md shadow-[#1A7A4A]/25',
        ].join(' ')}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Creando…
          </span>
        ) : (
          'Crear mi cuenta'
        )}
      </button>
    </div>
  );
}

// ── DashboardPage ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: cuentas, isLoading, isError } = useMisCuentas();

  const cuenta = cuentas?.[0];
  const hasCuenta = !isLoading && !!cuenta;
  const noAccount = !isLoading && (!cuentas || cuentas.length === 0);

  if (noAccount) {
    return (
      <div className="pb-8">
        <div className="px-4 pt-8 pb-2">
          <p className="text-xs text-gray-400 uppercase tracking-widest">Billetera Digital</p>
          <h1 className="text-xl font-bold text-gray-900 mt-0.5">Bienvenido</h1>
        </div>
        <NoAccount />
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="px-4 pt-8 pb-2 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Billetera Digital</p>
          <h1 className="text-xl font-bold text-gray-900 mt-0.5">
            {isLoading ? 'Cargando…' : cuenta?.nombreTitular ?? 'Mi cuenta'}
          </h1>
        </div>
        {/* Notification bell placeholder */}
        <button className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm text-gray-400">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>

      {isError ? (
        <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">No se pudo cargar la cuenta. Verifica tu conexión.</p>
        </div>
      ) : (
        <BalanceCard
          saldo={hasCuenta ? cuenta!.saldo : 0}
          numeroCuenta={hasCuenta ? cuenta!.numeroCuenta : 0}
          nombreTitular={hasCuenta ? cuenta!.nombreTitular : ''}
          isLoading={isLoading}
        />
      )}

      <QuickActions />
    </div>
  );
}
