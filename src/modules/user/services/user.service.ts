import { api } from "@/api/axios";

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const updateUser = async (id: number, data: any) => {
  const res = await api.patch(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};