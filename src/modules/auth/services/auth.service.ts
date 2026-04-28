// src/modules/auth/services/auth.service.ts
import { api } from '@/api/axios';

export const authService = {
  login: async (data: any) => {
    // Ya no necesitamos poner la URL completa, el interceptor sabe que es localhost:3000
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  signup: async (data: any) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  // Ejemplo futuro: Obtener el perfil. 
  // Fíjate que NO le pasamos el token, el interceptor lo hará por nosotros.
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};