// ── Spinner ───────────────────────────────────────────────────────────────────

interface SpinnerProps {
  /** Tailwind size class, defaults to w-6 h-6 */
  size?: string;
  /** Tailwind color class, defaults to text-[#1A7A4A] */
  color?: string;
}

/**
 * Standalone animated spinner atom.
 *
 * @example
 * <Spinner />
 * <Spinner size="w-4 h-4" color="text-white" />
 */
export default function Spinner({ size = 'w-6 h-6', color = 'text-[#1A7A4A]' }: SpinnerProps) {
  return (
    <svg
      className={`${size} ${color} animate-spin`}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Cargando…"
      role="status"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
