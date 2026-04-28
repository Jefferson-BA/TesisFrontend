// src/lib/axios.ts
import axios from 'axios';
import { useAuthStore } from '@/modules/auth/store/authStore';

// 1. Creamos la instancia base
export const api = axios.create({
  baseURL: 'http://localhost:3000', // La URL raíz de tu backend
  // withCredentials: true, // Descomenta esto si a futuro usas Cookies HTTP-Only en NestJS
});

// 2. Interceptor de Peticiones (Request) -> "El Mensajero"
api.interceptors.request.use(
  (config) => {
    // Obtenemos el token directamente del estado global de Zustand
    const token = useAuthStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor de Respuestas (Response) -> "El Guardia de Seguridad"
api.interceptors.response.use(
  (response) => {
    // Si la petición sale bien, simplemente la devolvemos
    return response;
  },
  (error) => {
    // Si el backend nos devuelve un 401 (No autorizado / Token caducado)
    if (error.response?.status === 401) {
      console.warn("Sesión expirada o inválida. Cerrando sesión automáticamente...");
      
      // Limpiamos el estado global
      useAuthStore.getState().logout();
      
      // Limpiamos la cookie de middleware
      document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      // Redirigimos al login si no estamos ya ahí
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);