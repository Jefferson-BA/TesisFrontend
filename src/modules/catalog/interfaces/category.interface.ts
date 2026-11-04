export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
export interface CreateCategoryDTO {
  name: string;
  description?: string;
}
export type UpdateCategoryDTO = Partial<CreateCategoryDTO>;
