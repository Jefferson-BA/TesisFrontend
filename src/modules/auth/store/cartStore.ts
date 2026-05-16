import { create } from "zustand";

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

const getCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
};

const saveCartToStorage = (cart: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

export const useCartStore = create<CartStore>((set) => ({
  cart: getCartFromStorage(),

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((p) => p.id === product.id);

      let updatedCart: CartItem[];

      if (existing) {
        updatedCart = state.cart.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      } else {
        updatedCart = [...state.cart, { ...product, quantity: 1 }];
      }

      saveCartToStorage(updatedCart);
      return { cart: updatedCart };
    }),

  removeFromCart: (id) =>
    set((state) => {
      const updatedCart = state.cart.filter((p) => p.id !== id);
      saveCartToStorage(updatedCart);
      return { cart: updatedCart };
    }),

  clearCart: () => {
    saveCartToStorage([]);
    return set({ cart: [] });
  },

  updateQuantity: (id, quantity) =>
    set((state) => {
      const updatedCart = state.cart
        .map((p) =>
          p.id === id
            ? { ...p, quantity: Math.max(1, quantity) }
            : p
        );

      saveCartToStorage(updatedCart);
      return { cart: updatedCart };
    }),
}));