import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../../config/axiosClient';
import type { LoginConEmailRequest } from '../types/auth.types';

/**
 * useLogin — wraps the login mutation with token persistence and navigation.
 *
 * Usage:
 *   const { mutate, isPending, isError, error } = useLogin();
 *   mutate({ email, password });
 */
export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginConEmailRequest) => login(data),

    onSuccess: (tokenResponse) => {
      // Persist tokens for the Axios request interceptor and future sessions.
      localStorage.setItem(ACCESS_TOKEN_KEY, tokenResponse.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, tokenResponse.refreshToken);

      // Navigate to the dashboard — replace so the user can't back-navigate to login.
      navigate('/inicio', { replace: true });
    },

    // onError is intentionally omitted here: the component reads `isError`
    // and `error` directly from the mutation object for inline error display.
  });
}
