import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import InputField from '../../../components/ui/InputField';
import PasswordInput from '../../../components/ui/PasswordInput';
import Button from '../../../components/ui/Button';
import AlertBanner from '../../../components/ui/AlertBanner';
import { parseApiError } from '../../../utils/parseApiError';
import type { AxiosError } from 'axios';

// ── Helper — auth-specific fallback ──────────────────────────────────────────

function parseLoginError(error: unknown): string {
  const axiosErr = error as AxiosError;
  if (axiosErr?.response?.status === 401) return 'Correo o contraseña incorrectos.';
  return parseApiError(error);
}

// ── Logo ──────────────────────────────────────────────────────────────────────

function BilleteraLogo() {
  return (
    <div className="flex flex-col items-center gap-3 mb-6">
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

// ── LoginForm ─────────────────────────────────────────────────────────────────

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const [emailError, setEmailError]       = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { mutate: doLogin, isPending, isError, error } = useLogin();

  // ── Validation ──────────────────────────────────────────────────────────────

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

  // ── Submit ───────────────────────────────────────────────────────────────────

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    doLogin({ email: email.trim().toLowerCase(), password });
  }

  return (
    <div className="flex flex-col w-full">
      <BilleteraLogo />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* API error banner */}
        {isError && <AlertBanner variant="error" message={parseLoginError(error)} />}

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

        <PasswordInput
          label="Contraseña"
          placeholder="••••••••"
          value={password}
          onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(''); }}
          error={passwordError}
          autoComplete="current-password"
          disabled={isPending}
        />

        {/* Recordarme + Olvidé contraseña */}
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

        {/* Primary CTA */}
        <Button
          type="submit"
          variant="primary"
          isLoading={isPending}
          fullWidth
          className="mt-1"
        >
          {isPending ? 'Iniciando sesión…' : 'Iniciar Sesión'}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">o</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Secondary CTA */}
        <Button
          type="button"
          variant="outline"
          fullWidth
          onClick={() => navigate('/registro')}
        >
          Crear Cuenta Nueva
        </Button>

      </form>
    </div>
  );
}
