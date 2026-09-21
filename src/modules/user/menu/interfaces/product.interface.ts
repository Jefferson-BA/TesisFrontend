export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  stock?: number;
  isAvailable?: boolean;
  image?: string;
  category?: string;
  isPromo?: boolean;
}