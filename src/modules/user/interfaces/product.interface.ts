export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  stock: number;
  image?: string;
  category?: string;
  isPromo?: boolean;
}