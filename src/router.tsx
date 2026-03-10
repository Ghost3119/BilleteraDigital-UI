import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ACCESS_TOKEN_KEY } from './config/axiosClient';

// ── Lazy page stubs ───────────────────────────────────────────────────────────
// Pages will be implemented in subsequent tasks.
// Using inline components here keeps the router working without them.

const Placeholder = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center h-screen text-gray-400 text-sm">
    [{name}] — por implementar
  </div>
);

// ── Auth guard ────────────────────────────────────────────────────────────────

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// ── Router ────────────────────────────────────────────────────────────────────

const router = createBrowserRouter([
  // ── Public ──────────────────────────────────────────────────────────────
  {
    path: '/login',
    element: <Placeholder name="LoginPage" />,
  },
  {
    path: '/registro',
    element: <Placeholder name="RegistroPage" />,
  },

  // ── Protected shell (TabBar layout) ─────────────────────────────────────
  {
    path: '/',
    element: (
      <RequireAuth>
        <Placeholder name="AppLayout (TabBar)" />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/inicio" replace /> },
      { path: 'inicio',       element: <Placeholder name="DashboardPage" /> },
      { path: 'transferir',   element: <Placeholder name="TransferirPage" /> },
      { path: 'historial',    element: <Placeholder name="HistorialPage" /> },
      { path: 'perfil',       element: <Placeholder name="PerfilPage" /> },
    ],
  },

  // ── Fallback ─────────────────────────────────────────────────────────────
  { path: '*', element: <Navigate to="/login" replace /> },
]);

export default router;
