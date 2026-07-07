import { api } from "@/api/axios";

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const updateUser = async (
  id: string | number,
  data: any
) => {
  const res = await api.patch(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (
  id: string | number
) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

export const updateOwnProfile = async (data: { name: string; email: string; phone?: string; address?: string }) => {
  const response = await api.patch("/users/profile", data); 
  return response.data;
};