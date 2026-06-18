import { create } from "zustand";

export type Promo = {
  id: string;
  title: string;
  discount: string;
  description: string;
  active: boolean;
};

type PromoStore = {
  promos: Promo[];
  addPromo: (promo: Promo) => void;
  removePromo: (id: string) => void;
};

const getInitialPromos = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("promos") || "[]");
  }

  return [];
};

export const usePromoStore = create<PromoStore>((set) => ({
  promos: getInitialPromos(),

  addPromo: (promo) =>
    set((state) => {
      const updated = [...state.promos, promo];

      if (typeof window !== "undefined") {
        localStorage.setItem("promos", JSON.stringify(updated));
      }

      return { promos: updated };
    }),

  removePromo: (id) =>
    set((state) => {
      const updated = state.promos.filter((p) => p.id !== id);

      if (typeof window !== "undefined") {
        localStorage.setItem("promos", JSON.stringify(updated));
      }

      return { promos: updated };
    }),
}));