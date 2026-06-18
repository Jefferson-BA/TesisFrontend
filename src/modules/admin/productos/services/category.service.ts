import { api } from "@/api/axios";

export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

export const createCategory = async (data: any) => {
  const res = await api.post("/categories", data);
  return res.data;
};

export const deleteCategory = async (id: string) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};