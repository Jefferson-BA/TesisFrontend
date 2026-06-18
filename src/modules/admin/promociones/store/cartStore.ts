import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  image?: string;
  category?: string;
}

interface CartStore {
  cart: CartItem[];

  addToCart: (product: Omit<CartItem, "quantity">) => void;

  removeFromCart: (id: string) => void;

  clearCart: () => void;

  updateQuantity: (id: string, quantity: number) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],

      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find(
            (p) => p.id === product.id
          );

          let updatedCart: CartItem[];

          if (existing) {
            updatedCart = state.cart.map((p) =>
              p.id === product.id
                ? {
                    ...p,
                    quantity: p.quantity + 1,
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
          cart: state.cart.filter((p) => p.id !== id),
        })),

      clearCart: () =>
        set({
          cart: [],
        }),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((p) =>
            p.id === id
              ? {
                  ...p,
                  quantity: Math.max(1, quantity),
                }
              : p
          ),
        })),
    }),
    {
      // 🔥 Nombre del localStorage
      name: "deparraspitz-cart-storage",
    }
  )
);