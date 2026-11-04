import { extractRole } from '@/lib/auth-utils';
import { sessionUserSchema } from '@/modules/auth/types/auth.types';
import type { SessionUser } from '@/modules/auth/types/auth.types';
import { api } from '@/api/axios';

export const getUsers = async () => {
  const res = await api.get('/users');
  return res.data;
};

export const updateUser = async (
  id: string | number,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    password?: string;
  },
) => {
  const res = await api.patch(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: string | number) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

export const updateOwnProfile = async (data: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}) => {
  const response = await api.patch<SessionUser>('/users/profile', data);
  return sessionUserSchema.parse({
    ...response.data,
    role: extractRole(response.data),
  });
};
