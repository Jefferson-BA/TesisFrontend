export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateCategoryDTO = Omit<Category, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCategoryDTO = Partial<CreateCategoryDTO>;