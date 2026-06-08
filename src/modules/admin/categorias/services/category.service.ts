import { api as axios } from '@/api/axios';
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../interfaces/category.interface';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await axios.get('/categories'); // Asegúrate que este endpoint coincida con tu backend
    return response.data;
  },

  create: async (data: CreateCategoryDTO): Promise<Category> => {
    const response = await axios.post('/categories', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCategoryDTO): Promise<Category> => {
    const response = await axios.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/categories/${id}`);
  }
};