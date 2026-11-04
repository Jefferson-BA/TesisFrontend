import { getDefaultRouteByRole } from '@/lib/auth-utils';
import { clearPrivateClientState } from '@/lib/client-state';
import { useMutation } from '@tanstack/react-query';
import type { LoginFormData } from '../schemas/auth.schema';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';

export const useLogin = () =>
  useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: ({ user }) => {
      if (!user) return;
      clearPrivateClientState(true);
      useAuthStore.getState().setUser(user);
      window.location.assign(getDefaultRouteByRole(user.role));
    },
  });
