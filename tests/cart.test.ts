import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CartItem } from '@/modules/cart/store/cartStore';
import type { Promotion } from '@/modules/promotions/interfaces/promotion.interface';
import { calcDiscountedPrice } from '@/modules/promotions/utils/promoUtils';

let store: (typeof import('@/modules/cart/store/cartStore'))['useCartStore'];
const storage = new Map<string, string>();
beforeAll(async () => {
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  });
  store = (await import('@/modules/cart/store/cartStore')).useCartStore;
});
beforeEach(() => {
  store.setState({ cart: [] });
});
const product: CartItem = {
  id: 'product-1',
  name: 'Buffet',
  price: 80,
  originalPrice: 100,
  quantity: 2,
  discountType: 'percentage',
  discountValue: 20,
  promoLabel: '20% OFF',
};
const promotion: Promotion = {
  id: 1,
  title: 'Oferta',
  description: '',
  discountType: 'percentage',
  discountValue: 10,
  applyTo: 'all',
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  isActive: true,
};

describe('carrito y promociones', () => {
  it('restaura el precio cuando no queda ninguna promoción activa', () => {
    store.setState({ cart: [product] });
    store.getState().syncPromotions([]);
    expect(store.getState().cart[0]).toMatchObject({
      price: 100,
      quantity: 2,
      discountType: undefined,
      promoLabel: undefined,
    });
  });
  it('elimina etiquetas de una promoción aunque el precio no haya cambiado', () => {
    store.setState({
      cart: [
        {
          ...product,
          price: 100,
          discountType: 'buy_x_get_discount',
          minQuantity: 3,
        },
      ],
    });
    store.getState().syncPromotions([]);
    expect(store.getState().cart[0].discountType).toBeUndefined();
  });
  it('recalcula sobre el precio original sin acumular descuentos', () => {
    store.setState({ cart: [product] });
    store.getState().syncPromotions([promotion]);
    store.getState().syncPromotions([promotion]);
    expect(store.getState().cart[0].price).toBe(90);
  });
  it('aplica y retira el descuento por cantidad al cruzar el mínimo', () => {
    store.setState({
      cart: [
        { ...product, discountType: 'buy_x_get_discount', minQuantity: 3 },
      ],
    });
    store.getState().updateQuantity(product.id, 3);
    expect(store.getState().cart[0].price).toBe(80);
    store.getState().updateQuantity(product.id, 2);
    expect(store.getState().cart[0].price).toBe(100);
  });
  it('rechaza cantidades no finitas y conserva cantidades enteras positivas', () => {
    store.setState({ cart: [product] });
    store.getState().updateQuantity(product.id, NaN);
    expect(store.getState().cart[0].quantity).toBe(2);
    store.getState().updateQuantity(product.id, 2.9);
    expect(store.getState().cart[0].quantity).toBe(2);
    store.getState().updateQuantity(product.id, -1);
    expect(store.getState().cart[0].quantity).toBe(1);
  });
  it('coincide con el redondeo del servidor y nunca genera precios negativos', () => {
    expect(
      calcDiscountedPrice(19.99, { ...promotion, discountValue: 15 }),
    ).toBe(16.99);
    expect(calcDiscountedPrice(10, { ...promotion, discountValue: 150 })).toBe(
      0,
    );
    expect(
      calcDiscountedPrice(10, {
        ...promotion,
        discountType: 'fixed_amount',
        discountValue: 20,
      }),
    ).toBe(0);
  });
});
