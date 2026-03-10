import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import InputField from '../../../components/ui/InputField';
import PasswordInput from '../../../components/ui/PasswordInput';
import type { AxiosError } from 'axios';

// ── Helper ────────────────────────────────────────────────────────────────────

function parseApiError(error: unknown): string {
  const axiosErr = error as AxiosError<{ error?: string; title?: string; errors?: Record<string, string[]> }>;
  if (axiosErr?.response?.data?.error) return axiosErr.response.data.error;
  if (axiosErr?.response?.data?.title) return axiosErr.response.data.title;
  if (axiosErr?.response?.status === 409) return 'Este correo ya está registrado.';
  return 'Ocurrió un error. Intenta de nuevo.';
}

// ── Logo (shared look with LoginForm) ─────────────────────────────────────────

function BilleteraLogo() {
  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <div className="w-16 h-16 rounded-full bg-[#1A7A4A] flex items-center justify-center shadow-lg shadow-[#1A7A4A]/30">
        <span className="text-white text-3xl font-bold leading-none">$</span>
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Billetera Digital</h1>
        <p className="text-sm text-gray-500 mt-0.5">Crea tu cuenta gratuita</p>
      </div>
    </div>
  );
}

// ── Main form component ───────────────────────────────────────────────────────

export default function RegisterForm() {
  const [nombre, setNombre]         = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirmar, setConfirmar]   = useState('');

  const [nombreError, setNombreError]       = useState('');
  const [emailError, setEmailError]         = useState('');
  const [passwordError, setPasswordError]   = useState('');
  const [confirmarError, setConfirmarError] = useState('');

  const { mutate: doRegister, isPending, isError, error } = useRegister();

  // ── Validation ─────────────────────────────────────────────────────────────

  function validate(): boolean {
    let valid = true;

    if (!nombre.trim()) {
      setNombreError('El nombre es obligatorio.');
      valid = false;
    } else if (nombre.trim().length < 2) {
      setNombreError('Mínimo 2 caracteres.');
      valid = false;
    } else {
      setNombreError('');
    }

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

    if (!confirmar) {
      setConfirmarError('Confirma tu contraseña.');
      valid = false;
    } else if (confirmar !== password) {
      setConfirmarError('Las contraseñas no coinciden.');
      valid = false;
    } else {
      setConfirmarError('');
    }

    return valid;
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    doRegister({ nombre: nombre.trim(), email: email.trim().toLowerCase(), password });
  }

  return (
    <div className="flex flex-col w-full">
      <BilleteraLogo />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── API error banner ─────────────────────────────────────────────── */}
        {isError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700">{parseApiError(error)}</p>
          </div>
        )}

        {/* ── Nombre ─────────────────────────────────────────────────────────── */}
        <InputField
          label="Nombre completo"
          type="text"
          placeholder="Juan Pérez"
          value={nombre}
          onChange={(e) => { setNombre(e.target.value); if (nombreError) setNombreError(''); }}
          error={nombreError}
          autoComplete="name"
          disabled={isPending}
        />

        {/* ── Email ──────────────────────────────────────────────────────────── */}
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

        {/* ── Password ────────────────────────────────────────────────────────── */}
        <PasswordInput
          label="Contraseña"
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(''); }}
          error={passwordError}
          autoComplete="new-password"
          disabled={isPending}
        />

        {/* ── Confirmar password ──────────────────────────────────────────────── */}
        <PasswordInput
          label="Confirmar contraseña"
          placeholder="Repite tu contraseña"
          value={confirmar}
          onChange={(e) => { setConfirmar(e.target.value); if (confirmarError) setConfirmarError(''); }}
          error={confirmarError}
          autoComplete="new-password"
          disabled={isPending}
        />

        {/* ── CTA ─────────────────────────────────────────────────────────────── */}
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
              Creando cuenta…
            </span>
          ) : (
            'Crear Cuenta'
          )}
        </button>

        {/* ── Back to login ───────────────────────────────────────────────────── */}
        <p className="text-center text-sm text-gray-500 mt-1">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-[#1A7A4A] font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>

      </form>
    </div>
  );
}
