import { clearPrivateClientState } from '@/lib/client-state';
import axios from 'axios';
import { create } from 'zustand';
import type { SessionResponse, SessionUser } from '../types/auth.types';

interface AuthState {
  user: SessionUser | null;
  loading: boolean;
  error: string | null;
  setUser: (user: SessionUser) => void;
  loadSession: () => Promise<void>;
  clearSession: () => void;
  logout: () => Promise<void>;
}
let pendingSession: Promise<void> | null = null;
let revision = 0;
const sessionApi = axios.create({ baseURL: '/api', timeout: 35000 });

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,
  setUser: (user) => {
    revision++;
    set({ user, loading: false, error: null });
  },
  loadSession: () => {
    if (typeof window !== 'undefined') {
      try {
        for (const key of ['auth-storage', 'token', 'user'])
          window.localStorage.removeItem(key);
      } catch {
        /* El almacenamiento puede estar bloqueado. */
      }
    }
    if (pendingSession) return pendingSession;
    const startedAt = revision;
    pendingSession = (async () => {
      try {
        const { data } = await sessionApi.get<SessionResponse>('/session');
        if (startedAt === revision) {
          const current = get().user;
          if (!data.user && current) get().clearSession();
          else
            set({
              user: data.user ? { ...current, ...data.user } : null,
              error: null,
            });
        }
      } catch (error) {
        if (startedAt === revision) {
          if (axios.isAxiosError(error) && error.response?.status === 401)
            get().clearSession();
          else
            set({ error: 'No se pudo verificar la sesión. Intenta de nuevo.' });
        }
      } finally {
        if (startedAt === revision) set({ loading: false });
        pendingSession = null;
      }
    })();
    return pendingSession;
  },
  clearSession: () => {
    revision++;
    clearPrivateClientState();
    set({ user: null, loading: false, error: null });
  },
  logout: async () => {
    // No afirmar que se cerró la sesión si el servidor no eliminó la cookie.
    await sessionApi.delete('/session');
    get().clearSession();
  },
}));
