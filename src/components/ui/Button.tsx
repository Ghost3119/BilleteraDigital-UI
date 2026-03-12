import type { ButtonHTMLAttributes, ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

// ── Variant style map ─────────────────────────────────────────────────────────

const variantBase: Record<ButtonVariant, string> = {
  primary:
    'bg-[#1A7A4A] text-white shadow-md shadow-[#1A7A4A]/25 ' +
    'hover:bg-[#145E38] active:scale-[0.98]',
  secondary:
    'bg-[#22C55E] text-white shadow-md shadow-[#22C55E]/20 ' +
    'hover:bg-[#16A34A] active:scale-[0.98]',
  outline:
    'bg-white text-gray-700 border border-gray-300 ' +
    'hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98]',
  danger:
    'bg-[#EF4444] text-white shadow-md shadow-[#EF4444]/25 ' +
    'hover:bg-red-600 active:scale-[0.98]',
  ghost:
    'bg-[#1A7A4A]/5 text-[#1A7A4A] border border-[#1A7A4A]/30 ' +
    'hover:bg-[#1A7A4A]/10 active:scale-[0.98]',
};

const disabledStyle: Record<ButtonVariant, string> = {
  primary:   'bg-[#1A7A4A]/60 cursor-not-allowed',
  secondary: 'bg-[#22C55E]/60 cursor-not-allowed',
  outline:   'opacity-50 cursor-not-allowed',
  danger:    'bg-[#EF4444]/60 cursor-not-allowed',
  ghost:     'opacity-50 cursor-not-allowed',
};

// ── Spinner ───────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────

/**
 * Generic button atom used throughout the app.
 *
 * @example
 * <Button variant="primary" isLoading={isPending} fullWidth>
 *   Iniciar Sesión
 * </Button>
 *
 * @example
 * <Button variant="outline" onClick={handleBack}>Atrás</Button>
 */
export default function Button({
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      className={[
        'flex items-center justify-center gap-2',
        'py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest',
        'transition-all duration-200 select-none',
        fullWidth ? 'w-full' : '',
        isDisabled ? disabledStyle[variant] : variantBase[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}
