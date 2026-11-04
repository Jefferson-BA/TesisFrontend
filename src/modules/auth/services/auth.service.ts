import { api } from '@/api/axios';
import axios from 'axios';
import type { LoginFormData, RegisterFormData } from '../schemas/auth.schema';
import type { SessionResponse } from '../types/auth.types';

export type SignupPayload = Omit<RegisterFormData, 'confirmPassword'>;
export const authService = {
  login: async (data: LoginFormData): Promise<SessionResponse> => {
    const response = await axios.post<SessionResponse>('/api/session', data, {
      timeout: 35000,
    });
    if (!response.data.user)
      throw new Error('El servidor no devolvi? una sesión válida');
    return response.data;
  },
  signup: async (data: SignupPayload) => {
    const response = await api.post<{ message: string }>('/auth/signup', data);
    return response.data;
  },
  getProfile: async (): Promise<SessionResponse> => {
    const { data } = await axios.get<SessionResponse>('/api/session', {
      timeout: 35000,
    });
    return data;
  },
};
