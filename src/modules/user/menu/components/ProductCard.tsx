// src/modules/user/menu/components/ProductCard.tsx

import { ShoppingCart, ShieldCheck, Flame } from "lucide-react";
import { AnimatedPrice } from "./AnimatedPrice";
import type { Product } from "../interfaces/product.interface";
import type { Promotion } from "@/modules/admin/promociones/interfaces/promotion.interface";
import { findPromoForProduct, getPromoLabel, calcDiscountedPrice } from "@/modules/admin/promociones/utils/promoUtils";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  activePromos?: Promotion[];
  onView: () => void;
  onAdd: () => void;
}

export const ProductCard = ({ product, activePromos = [], onView, onAdd }: ProductCardProps) => {
  const isAvailable = product.isAvailable !== false && (product as any).stock !== 0;

  // Resolve categoryId: either directly on product or inside category object
  const categoryId: string | undefined =
    product.categoryId ??
    (typeof product.category === 'object' && product.category !== null
      ? (product.category as { id: string; name: string }).id
      : undefined);

  // Find if any active promo applies to this product
  const applicablePromo = findPromoForProduct(activePromos, product.id, categoryId);
  const promoLabel = applicablePromo ? getPromoLabel(applicablePromo) : null;

  const originalPrice = Number(product.price);
  const discountedPrice = applicablePromo
    ? calcDiscountedPrice(originalPrice, applicablePromo)
    : null;

  return (
    <article
      className={cn(
        "group rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-500 flex flex-col h-full animate-fade-in-up relative",
        !isAvailable && "opacity-60 grayscale pointer-events-none",
        "bg-[#fffdf9] border-[#e0d5c5] dark:bg-[#0d0907]/95 dark:border-[#2d2016]",
        "border shadow-lg shadow-amber-900/5 dark:shadow-none",
        "hover:border-ember/40 hover:shadow-xl"
      )}
    >
      {/* Ribbon — No disponible */}
      {!isAvailable && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded z-20 uppercase tracking-widest shadow-lg">
          No Disponible
        </div>
      )}

      {/* Ribbon — Promo (only when available) */}
      {isAvailable && applicablePromo && promoLabel && (
        <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1">
          <div className="inline-flex items-center gap-1 bg-amber-500 text-black px-2.5 py-1 rounded-full font-black text-[10px] uppercase tracking-wider shadow-lg shadow-amber-500/40 animate-bounce-subtle">
            <Flame size={9} strokeWidth={3} />
            {promoLabel}
          </div>
        </div>
      )}

      {/* Imagen */}
      <div className="h-64 relative overflow-hidden bg-muted">
        <img
          src={(product as any).imageUrl || (product as any).image || "https://placehold.co/600x400"}
          alt={product.name}
          onClick={onView}
          className="h-full w-full object-cover cursor-pointer brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/50 via-transparent to-transparent pointer-events-none" />
        <span className="absolute top-4 left-4 bg-card/80 backdrop-blur-md border border-ember/30 text-ember text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-lg z-10">
          {typeof product.category === 'object' && product.category !== null
            ? (product.category as any).name
            : (product as any).category || "Especial"}
        </span>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/10">
            <ShieldCheck size={10} /> Alta Cocina
          </span>
          <h2
            onClick={onView}
            className="text-lg font-bold font-display text-foreground cursor-pointer hover:text-ember line-clamp-2 min-h-[52px] transition-colors"
          >
            {product.name}
          </h2>
        </div>

        <div className="pt-3 border-t border-border space-y-3">
          {/* Price display */}
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
              {discountedPrice !== null ? 'Con descuento' : 'Inversión'}
            </span>
            <div className="flex flex-col items-end">
              {/* Original price — shown struck-through when promo applies */}
              {discountedPrice !== null && (
                <span className="text-xs text-muted-foreground line-through font-mono">
                  S/ {originalPrice.toFixed(2)}
                </span>
              )}
              {/* Final price */}
              <div className={cn(
                "text-2xl font-black font-mono",
                discountedPrice !== null ? "text-amber-500" : "text-ember"
              )}>
                <AnimatedPrice value={discountedPrice !== null ? discountedPrice : originalPrice} />
              </div>
            </div>
          </div>

          <button
            disabled={!isAvailable}
            onClick={onAdd}
            className="w-full h-11 bg-ember hover:brightness-110 text-char-deep font-black uppercase tracking-widest text-[11px] rounded-xl active:scale-[0.96] transition-all flex items-center justify-center gap-2 relative overflow-hidden disabled:opacity-50"
          >
            <span className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,color-mix(in_oklch,white_50%,transparent)_50%,transparent_70%)] animate-shimmer" />
            <ShoppingCart size={13} strokeWidth={2.5} className="relative z-10" />
            <span className="relative z-10">{isAvailable ? "Agregar" : "Agotado"}</span>
          </button>
        </div>
      </div>
    </article>
  );
};