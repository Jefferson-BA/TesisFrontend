// src/modules/user/menu/components/MenuModal.tsx

import { X, ShoppingCart, Flame, Tag, ShieldCheck, Clock, Users } from "lucide-react";
import { formatPrice } from "./AnimatedPrice";
import type { Product } from "../interfaces/product.interface";
import type { Promotion } from "@/modules/admin/promociones/interfaces/promotion.interface";
import { findPromoForProduct, getPromoLabel, calcDiscountedPrice } from "@/modules/admin/promociones/utils/promoUtils";
import { cn } from "@/lib/utils";

interface MenuModalProps {
  selected: Product | null;
  activePromos?: Promotion[];
  onClose: () => void;
  onConfirm: () => void;
}

export const MenuModal = ({ selected, activePromos = [], onClose, onConfirm }: MenuModalProps) => {
  if (!selected) return null;

  // Resolve category ID
  const categoryId: string | undefined =
    (selected as any).categoryId ??
    (typeof (selected as any).category === "object" && (selected as any).category !== null
      ? (selected as any).category?.id
      : undefined);

  // Find applicable promotion
  const applicablePromo = findPromoForProduct(activePromos, selected.id, categoryId);
  const promoLabel = applicablePromo ? getPromoLabel(applicablePromo) : null;

  const originalPrice = Number(selected.price);
  const discountedPrice = applicablePromo
    ? calcDiscountedPrice(originalPrice, applicablePromo)
    : null;

  const savings = discountedPrice !== null ? originalPrice - discountedPrice : 0;

  const categoryName =
    typeof (selected as any).category === "object" && (selected as any).category !== null
      ? (selected as any).category?.name
      : (selected as any).category;

  const isAvailable = (selected as any).isAvailable !== false && (selected as any).stock !== 0;

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/60 dark:bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full max-w-4xl rounded-2xl overflow-hidden md:grid md:grid-cols-12 animate-fade-in-scale",
          "bg-[#fffdf9] border-[#e0d5c5] dark:bg-char-deep dark:border-char",
          "border shadow-2xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 w-9 h-9 bg-card/80 hover:bg-ember hover:text-char-deep text-muted-foreground rounded-xl flex items-center justify-center border border-border transition-colors"
          aria-label="Cerrar"
        >
          <X size={15} />
        </button>

        {/* Image column */}
        <div className="md:col-span-5 h-64 md:h-auto overflow-hidden relative">
          <img
            src={(selected as any).imageUrl || "https://placehold.co/600x400"}
            alt={selected.name}
            className="w-full h-full object-cover"
          />
          {/* Promo ribbon over image */}
          {applicablePromo && promoLabel && (
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-amber-500 text-black px-3 py-1.5 rounded-full font-black text-sm shadow-lg shadow-amber-500/40 uppercase tracking-wide">
              <Flame size={12} strokeWidth={3} />
              {promoLabel}
            </div>
          )}
          {/* Unavailable overlay */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-red-600 text-white text-sm font-black px-4 py-2 rounded-xl uppercase tracking-widest">
                No Disponible
              </span>
            </div>
          )}
        </div>

        {/* Info column */}
        <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh] md:max-h-none">
          <div className="space-y-4">
            {/* Category + quality badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-ember text-[10px] font-black tracking-widest uppercase">
                {categoryName || "Especial"}
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/10">
                <ShieldCheck size={9} /> Alta Cocina
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display leading-tight">
              {selected.name}
            </h2>

            {/* Price block */}
            <div className="space-y-1">
              {discountedPrice !== null ? (
                <div className="space-y-1">
                  {/* Savings callout */}
                  <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-black px-3 py-1.5 rounded-full">
                    <Tag size={11} />
                    ¡Ahorras {formatPrice(savings)} con esta promo!
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-amber-500 font-mono">
                      {formatPrice(discountedPrice)}
                    </span>
                    <span className="text-lg text-muted-foreground line-through font-mono">
                      {formatPrice(originalPrice)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-3xl font-black text-ember font-mono">{formatPrice(originalPrice)}</p>
              )}
            </div>

            {/* Promo details */}
            {applicablePromo && (
              <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-700 dark:text-amber-300 space-y-1">
                <p className="font-bold flex items-center gap-1.5"><Flame size={11} /> Promoción activa: {applicablePromo.title}</p>
                <p className="text-muted-foreground">{applicablePromo.description}</p>
              </div>
            )}

            {/* Description */}
            <div className="space-y-1">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">Descripción</p>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                {(selected as any).description || "Insumos premium para banquetes y eventos corporativos. Preparado con técnicas de alta cocina y los mejores ingredientes seleccionados."}
              </p>
            </div>

            {/* Extra details grid */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              {(selected as any).preparationTime && (
                <div className="flex items-center gap-2 p-2.5 bg-muted/40 rounded-xl border border-border/50">
                  <Clock size={13} className="text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Preparación</p>
                    <p className="text-xs font-semibold text-foreground">{(selected as any).preparationTime} min</p>
                  </div>
                </div>
              )}
              {(selected as any).minPeople && (
                <div className="flex items-center gap-2 p-2.5 bg-muted/40 rounded-xl border border-border/50">
                  <Users size={13} className="text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Min. personas</p>
                    <p className="text-xs font-semibold text-foreground">{(selected as any).minPeople} pers.</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 p-2.5 bg-muted/40 rounded-xl border border-border/50">
                <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Estado</p>
                  <p className={cn("text-xs font-bold", isAvailable ? "text-emerald-600 dark:text-emerald-400" : "text-red-500")}>
                    {isAvailable ? "Disponible" : "Agotado"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-5 border-t border-border mt-5">
            <button
              onClick={onConfirm}
              disabled={!isAvailable}
              className="w-full h-12 font-bold uppercase tracking-widest text-xs rounded-xl bg-ember hover:brightness-110 text-char-deep active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              <ShoppingCart size={14} />
              {isAvailable ? "Confirmar cotización" : "No disponible"}
            </button>
            {discountedPrice !== null && (
              <p className="text-center text-[10px] text-muted-foreground mt-2">
                Precio con descuento promocional aplicado
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};