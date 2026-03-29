import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ACCESS_TOKEN_KEY } from './config/axiosClient';
import AppLayout from './layouts/AppLayout';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import DashboardPage from './features/cuentas/pages/DashboardPage';
import TransferirPage from './features/transacciones/pages/TransferirPage';
import HistorialPage from './features/transacciones/pages/HistorialPage';
import PerfilPage from './features/perfil/pages/PerfilPage';
import SoportePage from './features/soport/pages/SoportePage';


// ── Placeholder stubs — used only for routes not yet implemented ──────────────

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
    element: <LoginPage />,
  },
  {
    path: '/registro',
    element: <RegisterPage />,
  },
  {
    path: '/recuperar-contrasena',
    element: <Placeholder name="RecuperarContrasenaPage" />,
  },

  // ── Protected shell (AppLayout with TabBar) ──────────────────────────────
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/inicio" replace /> },
      { path: 'inicio',     element: <DashboardPage /> },
      { path: 'transferir', element: <TransferirPage /> },
      { path: 'historial',  element: <HistorialPage /> },
      { path: 'perfil',     element: <PerfilPage /> },
      { path: 'soporte',     element: <SoportePage /> },
    ],
  },

  // ── Fallback ─────────────────────────────────────────────────────────────
  { path: '*', element: <Navigate to="/login" replace /> },
]);

export default router;
