import { Utensils, Loader2, Minus, Plus } from "lucide-react";
import { StepHeader } from "../components/WizardUI";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import type { Product } from "@/modules/user/menu/interfaces/product.interface";

export const Step2Menu = ({ products, isLoading }: { products: Product[]; isLoading: boolean }) => {
  const { cart, addToCart, removeFromCart } = useCartStore();

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 text-amber-500">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      <p className="text-xs uppercase tracking-widest font-bold animate-pulse">Cargando carta...</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <StepHeader icon={<Utensils className="w-4 h-4"/>} title="Menú Premium" sub="Seleccione los servicios gastronómicos." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {products.map((p) => {
          const inCart = cart.find((i) => i.id === p.id);
          const imgSrc = (p as any).imageUrl || (p as any).image;

          return (
            <div key={p.id} className={`rounded-xl overflow-hidden border transition-colors ${inCart ? "border-amber-500 bg-zinc-900" : "border-zinc-800 bg-zinc-900/50"}`}>
              {imgSrc && (
                <div className="h-32 overflow-hidden relative">
                  <img src={imgSrc} alt={p.name} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-amber-500 text-xs font-bold rounded">
                    S/ {Number(p.price).toFixed(2)}
                  </div>
                </div>
              )}
              <div className="p-4 flex flex-col gap-2">
                <h4 className="text-sm font-serif text-zinc-200 truncate">{p.name}</h4>
                <p className="text-[10px] text-zinc-400 line-clamp-2">{p.description}</p>
                <div className="mt-2 pt-3 border-t border-zinc-800/50">
                  {inCart ? (
                    <div className="flex items-center justify-between">
                      <button type="button" onClick={() => removeFromCart(p.id)} className="p-1.5 rounded-md bg-zinc-800 text-amber-500 hover:bg-zinc-700"><Minus className="w-4 h-4"/></button>
                      <span className="text-sm font-bold text-amber-500">{inCart.quantity}</span>
                      <button type="button" onClick={() => addToCart({ id: p.id, name: p.name, price: Number(p.price) })} className="p-1.5 rounded-md bg-amber-500 text-black hover:bg-amber-400"><Plus className="w-4 h-4"/></button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => addToCart({ id: p.id, name: p.name, price: Number(p.price) })} className="w-full py-2 rounded-lg text-xs font-bold uppercase tracking-widest border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black transition-colors">
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