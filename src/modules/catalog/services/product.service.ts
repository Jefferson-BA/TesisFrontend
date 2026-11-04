import { api } from '@/api/axios';
import type { Product } from '../interfaces/product.interface';
export interface ProductPayload {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  isAvailable?: boolean;
  isActive?: boolean;
}
export const getProducts = async (): Promise<Product[]> => {
  const products: Product[] = [];
  let page = 1;
  let pages: number;
  do {
    const { data } = await api.get<
      Product[] | { data: Product[]; meta: { totalPages: number } }
    >('/products', { params: { limit: 100, page } });
    const items = Array.isArray(data) ? data : data.data;
    if (!Array.isArray(items))
      throw new Error('Respuesta de productos inválida');
    products.push(...items);
    pages = Array.isArray(data) ? 1 : Math.max(1, data.meta.totalPages);
    page++;
  } while (page <= pages);
  return products;
};
export const createProduct = async (data: ProductPayload): Promise<Product> =>
  (
    await api.post<Product>('/products', {
      ...data,
      imageUrl: data.imageUrl?.trim() || undefined,
    })
  ).data;
export const updateProduct = async (
  id: string,
  data: Partial<ProductPayload>,
): Promise<Product> =>
  (
    await api.patch<Product>(`/products/${id}`, {
      ...data,
      imageUrl: data.imageUrl?.trim() || undefined,
    })
  ).data;
export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};
