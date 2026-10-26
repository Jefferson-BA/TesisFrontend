// src/api/axios.ts
import axios from 'axios';
import { useAuthStore } from '@/modules/auth/store/authStore';

// 🟢 Lee la variable de entorno de Astro o usa localhost para desarrollo
const BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

// 1. Creamos la instancia base
export const api = axios.create({
  baseURL: BASE_URL,
  // withCredentials: true, // Descomenta esto si a futuro usas Cookies HTTP-Only en NestJS
});

// 2. Interceptor de Peticiones (Request)
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

// 3. Interceptor de Respuestas (Response)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Sesión expirada o inválida. Cerrando sesión automáticamente...");
      
      // Limpiamos el estado global
      useAuthStore.getState().logout();
      
      // Limpiamos la cookie de middleware
      document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      // Redirigimos al login si estamos en el navegador
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);