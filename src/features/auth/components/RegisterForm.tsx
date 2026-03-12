import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import InputField from '../../../components/ui/InputField';
import PasswordInput from '../../../components/ui/PasswordInput';
import Button from '../../../components/ui/Button';
import AlertBanner from '../../../components/ui/AlertBanner';
import { parseApiError } from '../../../utils/parseApiError';
import type { AxiosError } from 'axios';

// ── Helper — auth-specific fallback ──────────────────────────────────────────

function parseRegisterError(error: unknown): string {
  const axiosErr = error as AxiosError;
  if (axiosErr?.response?.status === 409) return 'Este correo ya está registrado.';
  return parseApiError(error);
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
        {isError && <AlertBanner variant="error" message={parseRegisterError(error)} />}

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
        <Button
          type="submit"
          variant="primary"
          isLoading={isPending}
          fullWidth
          className="mt-1"
        >
          {isPending ? 'Creando cuenta…' : 'Crear Cuenta'}
        </Button>

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
