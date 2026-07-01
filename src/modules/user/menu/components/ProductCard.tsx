import { ShoppingCart, ShieldCheck } from "lucide-react";
import { AnimatedPrice } from "./AnimatedPrice";
import type { Product } from "../interfaces/product.interface";

interface ProductCardProps {
  product: Product;
  onView: () => void;
  onAdd: () => void;
}

export const ProductCard = ({ product, onView, onAdd }: ProductCardProps) => (
  <article className="group bg-[#0d0907]/95 border border-[#2d2016] rounded-2xl overflow-hidden hover:border-ember/40 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full animate-fade-in-up">
    <div className="h-64 relative overflow-hidden bg-zinc-950">
      <img
        src={(product as any).imageUrl || "https://placehold.co/600x400"}
        alt={product.name}
        onClick={onView}
        className="h-full w-full object-cover cursor-pointer brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-ember/30 text-ember text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-lg">
        {(product as any).category?.name || (product as any).category || "Especial"}
      </span>
    </div>
    <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
          <ShieldCheck size={10} /> Alta Cocina
        </span>
        <h2 onClick={onView} className="text-lg font-bold font-display text-white cursor-pointer hover:text-ember line-clamp-2 min-h-[52px] transition-colors">
          {product.name}
        </h2>
      </div>
      <div className="pt-3 border-t border-[#2d2016]/60 space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] text-white/50 uppercase tracking-widest">Inversión</span>
          <div className="text-2xl font-black text-ember font-mono">
            <AnimatedPrice value={Number(product.price)} />
          </div>
        </div>
        <button
          onClick={onAdd}
          className="w-full h-11 bg-ember hover:brightness-110 text-char-deep font-black uppercase tracking-widest text-[11px] rounded-xl active:scale-[0.96] transition-all flex items-center justify-center gap-2 relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,color-mix(in_oklch,white_50%,transparent)_50%,transparent_70%)] animate-shimmer" />
          <ShoppingCart size={13} strokeWidth={2.5} className="relative z-10" />
          <span className="relative z-10">Agregar</span>
        </button>
      </div>
    </div>
  </article>
);