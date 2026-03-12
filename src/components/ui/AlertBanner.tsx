import type { ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export type AlertVariant = 'error' | 'info' | 'success';

interface AlertBannerProps {
  variant?: AlertVariant;
  message: ReactNode;
}

// ── Variant config ────────────────────────────────────────────────────────────

const config: Record<AlertVariant, { wrapper: string; icon: string; iconPath: string }> = {
  error: {
    wrapper: 'bg-red-50 border border-red-200',
    icon: 'text-red-500',
    iconPath:
      'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z',
  },
  info: {
    wrapper: 'bg-blue-50 border border-blue-200',
    icon: 'text-blue-500',
    iconPath:
      'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z',
  },
  success: {
    wrapper: 'bg-green-50 border border-green-200',
    icon: 'text-[#22C55E]',
    iconPath: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
  },
};

// ── AlertBanner ───────────────────────────────────────────────────────────────

/**
 * Inline alert banner with icon. Replaces the duplicated red-banner pattern.
 *
 * @example
 * <AlertBanner variant="error" message={parseApiError(error)} />
 * <AlertBanner variant="success" message="Transferencia realizada." />
 */
export default function AlertBanner({ variant = 'error', message }: AlertBannerProps) {
  const { wrapper, icon, iconPath } = config[variant];

  const textColor =
    variant === 'error'
      ? 'text-red-700'
      : variant === 'success'
      ? 'text-green-700'
      : 'text-blue-700';

  return (
    <div className={`flex items-start gap-2 rounded-lg px-4 py-3 ${wrapper}`} role="alert">
      <svg
        className={`w-4 h-4 mt-0.5 shrink-0 ${icon}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path fillRule="evenodd" d={iconPath} clipRule="evenodd" />
      </svg>
      <p className={`text-sm ${textColor}`}>{message}</p>
    </div>
  );
}
