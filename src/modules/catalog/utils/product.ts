import type { Product } from '../interfaces/product.interface';
export function getCategoryName(product: Product, fallback = 'Especial') {
  return typeof product.category === 'object'
    ? product.category.name
    : product.category || fallback;
}
export function getCategoryId(product: Product) {
  return (
    product.categoryId ??
    (typeof product.category === 'object' ? product.category.id : undefined)
  );
}
