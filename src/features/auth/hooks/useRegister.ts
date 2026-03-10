import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../services/authService';
import type { RegistrarUsuarioRequest } from '../types/auth.types';

/**
 * useRegister — wraps the registration mutation.
 * On success, redirects to /login so the user can sign in with their new account.
 */
export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegistrarUsuarioRequest) => registrarUsuario(data),

    onSuccess: () => {
      navigate('/login', { replace: true, state: { registrado: true } });
    },
  });
}
