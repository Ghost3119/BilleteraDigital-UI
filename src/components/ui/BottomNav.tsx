import { NavLink } from 'react-router-dom';

// ── Tab definitions ───────────────────────────────────────────────────────────

const tabs = [
  {
    to: '/inicio',
    label: 'Inicio',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: '/transferir',
    label: 'Transferir',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    to: '/historial',
    label: 'Historial',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    to: '/perfil',
    label: 'Perfil',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
  to: '/soporte',
  label: 'Soporte',
  icon: (active: boolean) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-6 h-6"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.7}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 10c0-3.866-3.582-7-8-7S2 6.134 2 10c0 3.07 2.39 5.66 5.7 6.59.3.08.5.36.5.67V20l2.3-1.38c.2-.12.44-.14.66-.06.86.28 1.78.44 2.74.44 4.418 0 8-3.134 8-7z"
      />
    </svg>
    ),
  },
];

// ── BottomNav ─────────────────────────────────────────────────────────────────

/**
 * Shared bottom navigation bar rendered inside AppLayout.
 * Fixed to the bottom of the max-width viewport container.
 * Extracted here so it can be tested/imported independently of the shell layout.
 */
export default function BottomNav() {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 z-50 h-[64px] flex items-stretch shadow-[0_-2px_8px_rgba(0,0,0,0.06)]"
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            [
              'flex-1 flex flex-col items-center justify-center gap-0.5',
              'text-[10px] font-medium transition-colors duration-150 select-none',
              isActive ? 'text-[#1A7A4A]' : 'text-gray-400 hover:text-gray-600',
            ].join(' ')
          }
        >
          {({ isActive }) => (
            <>
              {tab.icon(isActive)}
              <span>{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
