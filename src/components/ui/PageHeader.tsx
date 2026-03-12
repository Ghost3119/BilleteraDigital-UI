import type { ReactNode } from 'react';

// ── PageHeader ────────────────────────────────────────────────────────────────

interface PageHeaderProps {
  /** Small uppercase label above the title, e.g. "Billetera Digital" */
  subtitle?: string;
  /** Main page title */
  title: string;
  /** Optional node rendered on the right side of the title row */
  action?: ReactNode;
}

/**
 * Consistent page header used on every app screen.
 *
 * @example
 * <PageHeader subtitle="Billetera Digital" title="Historial" />
 *
 * @example
 * <PageHeader
 *   subtitle="Billetera Digital"
 *   title="Dashboard"
 *   action={<Button variant="ghost" onClick={handleSettings}>⚙</Button>}
 * />
 */
export default function PageHeader({
  subtitle = 'Billetera Digital',
  title,
  action,
}: PageHeaderProps) {
  return (
    <div className="px-4 pt-8 pb-2">
      <p className="text-xs text-gray-400 uppercase tracking-widest">{subtitle}</p>
      <div className="flex items-center justify-between mt-0.5">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
