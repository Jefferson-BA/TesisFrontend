import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartStore {
  cart: CartItem[];

  addToCart: (product: CartItem) => void;

  removeFromCart: (id: string) => void;

  clearCart: () => void;

  increaseQuantity: (id: string) => void;

  decreaseQuantity: (id: string) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: [],

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((p) => p.id === product.id);

      if (existing) {
        return {
          cart: state.cart.map((p) =>
            p.id === product.id
              ? { ...p, quantity: p.quantity + 1 }
              : p
          ),
        };
      }

      return {
        cart: [...state.cart, { ...product, quantity: 1 }],
      };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((p) => p.id !== id),
    })),

  clearCart: () => set({ cart: [] }),

  increaseQuantity: (id) =>
    set((state) => ({
      cart: state.cart.map((p) =>
        p.id === id
          ? { ...p, quantity: p.quantity + 1 }
          : p
      ),
    })),

  decreaseQuantity: (id) =>
    set((state) => ({
      cart: state.cart.map((p) =>
        p.id === id && p.quantity > 1
          ? { ...p, quantity: p.quantity - 1 }
          : p
      ),
    })),
}));