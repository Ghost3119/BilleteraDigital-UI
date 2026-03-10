import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import InputField from '../../../components/ui/InputField';
import PasswordInput from '../../../components/ui/PasswordInput';
import type { AxiosError } from 'axios';

// ── Helper — extract a human-readable error message from an Axios error ───────
function parseApiError(error: unknown): string {
  const axiosErr = error as AxiosError<{ error?: string; title?: string }>;
  if (axiosErr?.response?.data?.error) return axiosErr.response.data.error;
  if (axiosErr?.response?.data?.title) return axiosErr.response.data.title;
  if (axiosErr?.response?.status === 401) return 'Correo o contraseña incorrectos.';
  return 'Ocurrió un error. Intenta de nuevo.';
}

// ── Logo ──────────────────────────────────────────────────────────────────────

function BilleteraLogo() {
  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      {/* Green circular logo with "$" — matches the mockup's teal-green circle */}
      <div className="w-16 h-16 rounded-full bg-[#1A7A4A] flex items-center justify-center shadow-lg shadow-[#1A7A4A]/30">
        <span className="text-white text-3xl font-bold leading-none">$</span>
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Billetera Digital</h1>
        <p className="text-sm text-gray-500 mt-0.5">Inicia sesión para continuar</p>
      </div>
    </div>
  );
}

// ── Main form component ───────────────────────────────────────────────────────

export default function LoginForm() {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [remember, setRemember]   = useState(false);

  // Inline field-level validation errors
  const [emailError, setEmailError]       = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { mutate: doLogin, isPending, isError, error } = useLogin();

  // ── Client-side validation ────────────────────────────────────────────────

  function validate(): boolean {
    let valid = true;

    if (!email.trim()) {
      setEmailError('El correo es obligatorio.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Ingresa un correo válido.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('La contraseña es obligatoria.');
      valid = false;
    } else if (password.length < 8) {
      setPasswordError('Mínimo 8 caracteres.');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  }

  // ── Submit handler ────────────────────────────────────────────────────────

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    doLogin({ email: email.trim().toLowerCase(), password });
  }

  return (
    <div className="flex flex-col w-full">
      <BilleteraLogo />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── API error banner ───────────────────────────────────────────── */}
        {isError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700">{parseApiError(error)}</p>
          </div>
        )}

        {/* ── Email field ────────────────────────────────────────────────── */}
        <InputField
          label="Correo electrónico"
          type="email"
          placeholder="usuario@correo.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
          error={emailError}
          autoComplete="email"
          inputMode="email"
          disabled={isPending}
        />

        {/* ── Password field ─────────────────────────────────────────────── */}
        <PasswordInput
          label="Contraseña"
          placeholder="••••••••"
          value={password}
          onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(''); }}
          error={passwordError}
          autoComplete="current-password"
          disabled={isPending}
        />

        {/* ── Recordarme + Olvidé contraseña row ────────────────────────── */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#1A7A4A] accent-[#1A7A4A] cursor-pointer"
            />
            <span className="text-sm text-gray-600">Recordarme</span>
          </label>
          <Link
            to="/recuperar-contrasena"
            className="text-sm text-[#1A7A4A] hover:text-[#145E38] hover:underline transition-colors"
          >
            Olvidé contraseña
          </Link>
        </div>

        {/* ── Primary CTA — INICIAR SESIÓN ──────────────────────────────── */}
        <button
          type="submit"
          disabled={isPending}
          className={[
            'w-full py-3.5 rounded-xl text-white text-sm font-bold uppercase tracking-widest',
            'transition-all duration-200 mt-1',
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
              Iniciando sesión…
            </span>
          ) : (
            'Iniciar Sesión'
          )}
        </button>

        {/* ── Divider ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">o</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* ── Secondary CTA — CREAR CUENTA NUEVA ───────────────────────── */}
        <Link
          to="/registro"
          className={[
            'w-full py-3.5 rounded-xl border border-gray-300 text-center',
            'text-sm font-semibold text-gray-700 uppercase tracking-widest',
            'hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98]',
            'transition-all duration-200',
          ].join(' ')}
        >
          Crear Cuenta Nueva
        </Link>

      </form>
    </div>
  );
}
