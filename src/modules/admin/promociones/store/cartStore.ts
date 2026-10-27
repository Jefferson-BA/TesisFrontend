import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Promotion } from "../interfaces/promotion.interface";
import { findPromoForProduct, calcDiscountedPrice, getPromoLabel } from "../utils/promoUtils";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountType?: string;
  discountValue?: number;
  minQuantity?: number;
  promoLabel?: string;
  promoTitle?: string;
  quantity: number;
  imageUrl?: string;
  image?: string;
  category?: string;
  categoryId?: string;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  syncPromotions: (promotions: Promotion[]) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],

      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((p) => String(p.id) === String(product.id));

          let updatedCart: CartItem[];

          if (existing) {
            const newQty = existing.quantity + 1;
            const originalPrice = product.originalPrice ?? existing.originalPrice ?? existing.price;
            const discountType = product.discountType || existing.discountType;
            const minQty = product.minQuantity || existing.minQuantity || 2;
            const discountVal = Number(product.discountValue || existing.discountValue || 0);

            let effectivePrice = product.price;
            if (discountType === "buy_x_get_discount" && originalPrice) {
              effectivePrice = newQty >= minQty ? originalPrice * (1 - discountVal / 100) : originalPrice;
            }

            updatedCart = state.cart.map((p) =>
              String(p.id) === String(product.id)
                ? {
                    ...p,
                    ...product,
                    quantity: newQty,
                    price: effectivePrice,
                    originalPrice: originalPrice,
                  }
                : p
            );
          } else {
            updatedCart = [
              ...state.cart,
              {
                ...product,
                quantity: 1,
              },
            ];
          }

          return {
            cart: updatedCart,
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((p) => String(p.id) !== String(id)),
        })),

      clearCart: () =>
        set({
          cart: [],
        }),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((p) => {
            if (String(p.id) !== String(id)) return p;
            const newQty = Math.max(1, quantity);
            let effectivePrice = p.price;

            if (p.discountType === "buy_x_get_discount" && p.originalPrice) {
              const minQty = p.minQuantity || 2;
              const discountVal = Number(p.discountValue || 0);
              effectivePrice = newQty >= minQty ? p.originalPrice * (1 - discountVal / 100) : p.originalPrice;
            }

            return {
              ...p,
              quantity: newQty,
              price: effectivePrice,
            };
          }),
        })),

      syncPromotions: (promotions) =>
        set((state) => {
          if (!promotions || promotions.length === 0) {
            return state;
          }

          const updatedCart = state.cart.map((item) => {
            const basePrice = Number(item.originalPrice ?? item.price);
            const promo = findPromoForProduct(promotions, item.id, item.categoryId);

            if (promo) {
              const discountedPrice = calcDiscountedPrice(basePrice, promo, item.quantity);
              return {
                ...item,
                originalPrice: basePrice,
                price: discountedPrice,
                discountType: promo.discountType,
                discountValue: Number(promo.discountValue),
                minQuantity: promo.minQuantity,
                promoLabel: getPromoLabel(promo),
                promoTitle: promo.title,
              };
            } else if (item.originalPrice !== undefined && item.originalPrice !== item.price) {
              // Promoción expiró o no aplica
              return {
                ...item,
                price: item.originalPrice,
                discountType: undefined,
                discountValue: undefined,
                minQuantity: undefined,
                promoLabel: undefined,
                promoTitle: undefined,
              };
            }
            return item;
          });

          return { cart: updatedCart };
        }),
    }),
    {
      // 🔥 Nombre del localStorage
      name: "deparraspitz-cart-storage",
    }
  )
);