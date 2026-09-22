export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  stock?: number;
  isAvailable?: boolean;
  image?: string;
  imageUrl?: string;
  category?: string | { id: string; name: string };
  categoryId?: string;
  isPromo?: boolean;
}