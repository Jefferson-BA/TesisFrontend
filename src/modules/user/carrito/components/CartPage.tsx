"use client";

import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";

/* ─── Misma URL del axios.ts ─── */
const API_URL = "http://localhost:3000";

/* ─── Helper: misma lógica que el menú ─── */
const getImageUrl = (item: { imageUrl?: string; image?: string }) => {
  const url = item.imageUrl || item.image;
  if (!url) return "https://placehold.co/400x400";
  return url.startsWith("http") ? url : `${API_URL}/${url.replace(/^\//, "")}`;
};

export default function CartPage() {
  const cart = useCartStore((s) => s.cart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const total = cart.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);

  return (
    <main className="min-h-screen bg-char-deep text-white">
      {/* Header */}
      <section className="border-b border-char">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <a 
            href="/menu" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-ember text-sm transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Continuar comprando
          </a>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mt-4">
            Tu Carrito
          </h1>
          <p className="text-white/50 mt-2">
            {cart.length} producto{cart.length !== 1 ? "s" : ""} seleccionado{cart.length !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-10">
        
        {/* Lista de productos */}
        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="bg-char/40 border border-char rounded-2xl p-12 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-char flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-white/20" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-white/60">Tu carrito está vacío</h2>
                <p className="text-white/30 text-sm mt-1">Agrega productos desde nuestro menú</p>
              </div>
              <a 
                href="/menu" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-ember hover:brightness-110 text-char-deep font-bold rounded-xl transition-all text-sm active:scale-[0.98]"
              >
                Explorar Menú
                <ArrowLeft size={14} className="rotate-180" />
              </a>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-[#0d0907]/95 border border-[#2d2016] hover:border-ember/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-300"
                >
                  
                  {/* Imagen */}
                  <div className="w-full sm:w-24 h-40 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-char">
                    <img
                      src={getImageUrl(item)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/400x400/1a1210/d8b892?text=Sin+Imagen";
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-display font-bold truncate">
                      {item.name}
                    </h2>
                    <p className="text-ember/70 text-[10px] uppercase tracking-widest font-semibold mt-0.5">
                      {item.category || "Especial"}
                    </p>
                    
                    {/* Controles de cantidad */}
                    <div className="mt-3 flex items-center border border-[#3d2c1f] rounded-xl w-fit overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-3 py-2 hover:bg-ember/10 hover:text-ember transition-colors disabled:opacity-30"
                        disabled={item.quantity <= 1}
                        aria-label="Reducir cantidad"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-bold bg-char/30 py-2">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-2 hover:bg-ember/10 hover:text-ember transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Precio + Eliminar */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
                    <button
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.success("Producto eliminado");
                      }}
                      className="text-red-500/60 hover:text-red-500 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="text-right">
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">
                        S/ {Number(item.price).toFixed(2)} c/u
                      </p>
                      <p className="text-xl sm:text-2xl font-black text-ember font-mono">
                        S/ {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Vaciar carrito */}
              <button
                onClick={() => {
                  clearCart();
                  toast.success("Carrito vaciado");
                }}
                className="flex items-center gap-2 text-red-500/50 hover:text-red-500 text-sm transition-colors py-2 px-3 rounded-lg hover:bg-red-500/5"
              >
                <Trash2 size={16} />
                Vaciar carrito
              </button>
            </>
          )}
        </div>

        {/* Resumen (sidebar) */}
        {cart.length > 0 && (
          <aside className="bg-[#0d0907]/95 border border-[#2d2016] rounded-2xl p-6 sm:p-8 h-fit lg:sticky lg:top-8 space-y-6">
            <h2 className="text-2xl font-display font-bold">Resumen</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Subtotal</span>
                <span className="font-semibold">S/ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Servicio de catering</span>
                <span className="text-emerald-400/80 text-xs font-semibold flex items-center gap-1">
                  <ShieldCheck size={12} />
                  Incluido
                </span>
              </div>
            </div>

            <hr className="border-[#2d2016]" />

            <div className="flex justify-between items-baseline">
              <span className="text-white/50 text-sm">Total</span>
              <span className="text-3xl font-black text-ember font-mono">
                S/ {total.toFixed(2)}
              </span>
            </div>

            <a
              href="/checkout"
              className="block text-center w-full bg-ember hover:brightness-110 text-char-deep font-bold py-4 rounded-xl transition-all active:scale-[0.98] relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,color-mix(in_oklch,white_50%,transparent)_50%,transparent_70%)] animate-shimmer" />
              <span className="relative">Proceder al Checkout</span>
            </a>

            <p className="text-center text-[10px] text-white/20 flex items-center justify-center gap-1.5">
              <ShieldCheck size={12} />
              Pago seguro garantizado • Términos y condiciones
            </p>
          </aside>
        )}
      </section>
    </main>
  );
}