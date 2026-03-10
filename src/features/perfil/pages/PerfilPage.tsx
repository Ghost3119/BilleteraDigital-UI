import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, CUENTA_ID_KEY } from '../../../config/axiosClient';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Decode a JWT payload without a library (base64url → JSON). */
function decodeJwtPayload(token: string): Record<string, string> | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// ── Row component ─────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 py-3.5 border-b border-gray-50 last:border-0">
      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">{label}</span>
      <span className="text-sm font-medium text-gray-800 break-all">{value}</span>
    </div>
  );
}

// ── PerfilPage ────────────────────────────────────────────────────────────────

export default function PerfilPage() {
  const navigate = useNavigate();

  const token = localStorage.getItem(ACCESS_TOKEN_KEY) ?? '';
  const cuentaId = localStorage.getItem(CUENTA_ID_KEY) ?? '';
  const payload = token ? decodeJwtPayload(token) : null;

  // ASP.NET Core maps: sub → ClaimTypes.NameIdentifier, unique_name → name, email → email
  const nombre = payload?.['unique_name'] ?? payload?.['name'] ?? '—';
  const email  = payload?.['email'] ?? '—';

  function handleLogout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(CUENTA_ID_KEY);
    navigate('/login', { replace: true });
  }

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="px-4 pt-8 pb-2">
        <p className="text-xs text-gray-400 uppercase tracking-widest">Billetera Digital</p>
        <h1 className="text-xl font-bold text-gray-900 mt-0.5">Mi perfil</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mt-6 gap-2">
        <div className="w-20 h-20 rounded-full bg-[#1A7A4A] flex items-center justify-center shadow-lg shadow-[#1A7A4A]/30">
          <span className="text-3xl font-bold text-white uppercase">
            {nombre !== '—' ? nombre.charAt(0) : '?'}
          </span>
        </div>
        <p className="text-base font-bold text-gray-900">{nombre}</p>
        <p className="text-xs text-gray-400">{email}</p>
      </div>

      {/* Info card */}
      <div className="mx-4 mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm px-5">
        <InfoRow label="Nombre" value={nombre} />
        <InfoRow label="Correo electrónico" value={email} />
        {cuentaId && <InfoRow label="ID de cuenta" value={cuentaId} />}
      </div>

      {/* Copy account ID — useful for sharing */}
      {cuentaId && (
        <div className="mx-4 mt-3">
          <button
            onClick={() => navigator.clipboard.writeText(cuentaId)}
            className="w-full py-3 rounded-xl border border-[#1A7A4A]/30 text-sm font-semibold text-[#1A7A4A] bg-[#1A7A4A]/5 hover:bg-[#1A7A4A]/10 active:scale-[0.98] transition-all"
          >
            Copiar ID de cuenta
          </button>
        </div>
      )}

      {/* Logout */}
      <div className="mx-4 mt-4">
        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-xl bg-[#EF4444] text-white text-sm font-bold uppercase tracking-widest shadow-md shadow-[#EF4444]/25 hover:bg-red-600 active:scale-[0.98] transition-all"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
