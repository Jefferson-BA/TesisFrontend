// src/modules/user/reservas/steps/Step2Menu.tsx

import { Utensils, Loader2, Minus, Plus } from "lucide-react";
import { StepHeader } from "../components/WizardUI";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import type { Product } from "@/modules/user/menu/interfaces/product.interface";
import { cn } from "@/lib/utils";

export const Step2Menu = ({ products, isLoading }: { products: Product[]; isLoading: boolean }) => {
  const { cart, addToCart, removeFromCart } = useCartStore();

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 text-ember">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      <p className="text-xs uppercase tracking-widest font-bold animate-pulse">Cargando carta...</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <StepHeader icon={<Utensils className="w-4 h-4" />} title="Menú Premium" sub="Seleccione los servicios gastronómicos." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {products.map((p) => {
          const inCart = cart.find((i) => i.id === p.id);
          const imgSrc = (p as any).imageUrl || (p as any).image;

          return (
            <div
              key={p.id}
              className={cn(
                "rounded-xl overflow-hidden border transition-colors",
                inCart
                  ? "border-ember bg-ember/5 dark:bg-zinc-900"
                  : "border-border bg-card dark:bg-zinc-900/50 dark:border-zinc-800"
              )}
            >
              {imgSrc && (
                <div className="h-32 overflow-hidden relative">
                  <img src={imgSrc} alt={p.name} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-ember text-xs font-bold rounded">
                    S/ {Number(p.price).toFixed(2)}
                  </div>
                </div>
              )}
              <div className="p-4 flex flex-col gap-2">
                <h4 className="text-sm font-serif text-foreground truncate">{p.name}</h4>
                <p className="text-[10px] text-muted-foreground line-clamp-2">{p.description}</p>
                <div className="mt-2 pt-3 border-t border-border dark:border-zinc-800/50">
                  {inCart ? (
                    <div className="flex items-center justify-between">
                      <button type="button" onClick={() => removeFromCart(p.id)} className="p-1.5 rounded-md bg-muted text-ember hover:bg-border dark:bg-zinc-800">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-bold text-ember">{inCart.quantity}</span>
                      <button type="button" onClick={() => addToCart({ id: p.id, name: p.name, price: Number(p.price) })} className="p-1.5 rounded-md bg-ember text-char-deep hover:brightness-110">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addToCart({ id: p.id, name: p.name, price: Number(p.price) })}
                      className="w-full py-2 rounded-lg text-xs font-bold uppercase tracking-widest border border-ember/30 text-ember hover:bg-ember hover:text-char-deep transition-colors"
                    >
                      Agregar
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};