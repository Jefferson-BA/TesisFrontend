import { useAuthStore } from '@/modules/auth/store/authStore';
import axios from 'axios';

// El servidor Astro a?ade el JWT desde una cookie HttpOnly. El navegador nunca lo lee.
export const api = axios.create({ baseURL: '/api/backend', timeout: 35000 });
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof window !== 'undefined'
    ) {
      useAuthStore.getState().clearSession();
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register'
      ) {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  },
);

export const publicApi = axios.create({
  baseURL: import.meta.env.PUBLIC_API_URL || '/api/backend',
  timeout: 35000,
});
