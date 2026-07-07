// src/modules/user/menu/components/MenuModal.tsx

import { X, ShoppingCart } from "lucide-react";
import { formatPrice } from "./AnimatedPrice";
import type { Product } from "../interfaces/product.interface";
import { cn } from "@/lib/utils";

interface MenuModalProps {
  selected: Product | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const MenuModal = ({ selected, onClose, onConfirm }: MenuModalProps) => {
  if (!selected) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 dark:bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div
        className={cn(
          "relative w-full max-w-4xl rounded-2xl overflow-hidden md:grid md:grid-cols-12 animate-fade-in-scale",
          "bg-[#fffdf9] border-[#e0d5c5] dark:bg-char-deep dark:border-char",
          "border shadow-2xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 w-9 h-9 bg-card/80 hover:bg-ember hover:text-char-deep text-muted-foreground rounded-xl flex items-center justify-center border border-border transition-colors"
        >
          <X size={15} />
        </button>

        <div className="md:col-span-5 h-64 md:h-[500px] overflow-hidden">
          <img
            src={(selected as any).imageUrl || "https://placehold.co/600x400"}
            alt={selected.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-ember text-[10px] font-black tracking-widest uppercase">
              {(selected as any).category?.name || (selected as any).category}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display">{selected.name}</h2>
            <p className="text-3xl font-black text-ember font-mono">{formatPrice(Number(selected.price))}</p>
            <p className="text-muted-foreground text-xs md:text-sm font-light">
              {selected.description || "Insumos premium para banquetes y eventos corporativos."}
            </p>
          </div>

          <div className="pt-4 border-t border-border mt-6">
            <button
              onClick={onConfirm}
              className="w-full h-12 font-bold uppercase tracking-widest text-xs rounded-xl bg-ember hover:brightness-110 text-char-deep active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart size={14} /> Confirmar cotización
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};