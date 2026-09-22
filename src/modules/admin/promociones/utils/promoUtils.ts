// src/modules/admin/promociones/utils/promoUtils.ts

import type { Promotion } from '../interfaces/promotion.interface';

/**
 * Calcula el precio con descuento según la lógica del plan.
 * @param price  Precio original del producto
 * @param promo  Promoción a aplicar
 * @param qty    Cantidad (solo relevante para buy_x_get_discount)
 */
export function calcDiscountedPrice(
  price: number,
  promo: Promotion,
  qty: number = 1
): number {
  switch (promo.discountType) {
    case 'percentage':
      return price * (1 - promo.discountValue / 100);

    case 'fixed_amount':
      return Math.max(0, price - promo.discountValue);

    case 'buy_x_get_discount':
      if (qty >= (promo.minQuantity ?? 2)) {
        return price * (1 - promo.discountValue / 100);
      }
      return price;

    default:
      return price;
  }
}

/**
 * Retorna la etiqueta legible del descuento para badges/ribbons.
 * Ej. "20% OFF", "S/ 15 OFF", "2x1 · 30% OFF"
 */
export function getPromoLabel(promo: Promotion): string {
  switch (promo.discountType) {
    case 'percentage':
      return `${promo.discountValue}% OFF`;
    case 'fixed_amount':
      return `S/ ${promo.discountValue} OFF`;
    case 'buy_x_get_discount':
      return `${promo.minQuantity ?? 2}x1 · ${promo.discountValue}% OFF`;
    default:
      return 'OFERTA';
  }
}

/**
 * Determina si una promo aplica a un producto dado.
 * Compara por producto, categoría, o si aplica a "all".
 */
export function promoAppliesToProduct(
  promo: Promotion,
  productId: string,
  categoryId?: string
): boolean {
  if (promo.applyTo === 'all') return true;
  if (promo.applyTo === 'product' && promo.product?.id === productId) return true;
  if (promo.applyTo === 'category' && categoryId && promo.category?.id === categoryId) return true;
  return false;
}

/**
 * De una lista de promos activas, retorna la primera que aplica a un producto.
 */
export function findPromoForProduct(
  promos: Promotion[],
  productId: string,
  categoryId?: string
): Promotion | undefined {
  return promos.find((p) => promoAppliesToProduct(p, productId, categoryId));
}

/**
 * Formato de fechas vigentes para UI de usuario.
 * Ej. "Del 1 al 31 de octubre"
 */
export function formatPromoDates(startDate: string, endDate: string): string {
  const locale = 'es-PE';
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');

  const startMonth = start.toLocaleDateString(locale, { month: 'long' });
  const endMonth = end.toLocaleDateString(locale, { month: 'long' });

  if (startMonth === endMonth) {
    return `Del ${start.getDate()} al ${end.getDate()} de ${startMonth}`;
  }

  return `${start.getDate()} ${startMonth} – ${end.getDate()} ${endMonth}`;
}
