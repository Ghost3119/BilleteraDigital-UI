import type { ElementType, HTMLAttributes, ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Which HTML element to render. Defaults to 'div'. */
  as?: ElementType;
  /** Inner padding preset. Defaults to 'md' (p-5). */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const paddingMap = {
  none: '',
  sm:   'p-3',
  md:   'p-5',
  lg:   'p-6',
} as const;

// ── Card ──────────────────────────────────────────────────────────────────────

/**
 * Generic surface atom — white background, rounded-2xl corners, subtle border
 * and drop shadow. Matches the card style used across all mockup screens.
 *
 * @example
 * <Card>
 *   <p>Any content</p>
 * </Card>
 *
 * @example
 * <Card as="section" padding="lg" className="mt-4">
 *   ...
 * </Card>
 */
export default function Card({
  as: Tag = 'div',
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <Tag
      className={[
        'bg-white rounded-2xl border border-gray-100 shadow-sm',
        paddingMap[padding],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </Tag>
  );
}
