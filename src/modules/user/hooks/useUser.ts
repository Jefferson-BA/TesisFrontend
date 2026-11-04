import { extractRole } from '@/lib/auth-utils';
import { getErrorMessage } from '@/lib/errors';
import { useAuthStore } from '@/modules/auth/store/authStore';
import type { SessionUser } from '@/modules/auth/types/auth.types';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const useUser = () => {
  const user = useAuthStore((state) => state.user);
  const loadingUser = useAuthStore((state) => state.loading);
  const sessionError = useAuthStore((state) => state.error);
  useEffect(() => {
    const syncSession = () => {
      void useAuthStore.getState().loadSession();
    };
    syncSession();
    window.addEventListener('focus', syncSession);
    return () => window.removeEventListener('focus', syncSession);
  }, []);
  const setUser = (next: SessionUser) => useAuthStore.getState().setUser(next);
  const updateLocalUser = (data: Partial<SessionUser>) => {
    const current = useAuthStore.getState().user;
    if (current) setUser({ ...current, ...data });
  };
  const logout = async () => {
    try {
      await useAuthStore.getState().logout();
      window.location.assign('/login');
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          'No se pudo cerrar la sesión. Intenta de nuevo.',
        ),
      );
    }
  };
  const role = extractRole(user);
  return {
    user,
    role,
    setUser,
    updateLocalUser,
    logout,
    loadingUser,
    sessionError,
    isLoggedIn: !!user,
    isAdmin: role === 'admin' || role === 'superadmin',
    isSuperAdmin: role === 'superadmin',
  };
};
