import { api } from "@/api/axios";

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const deleteUser = async (id: number | string) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};