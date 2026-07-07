// src/modules/user/carrito/components/CartPage.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import { cn } from "@/lib/utils";

const API_URL = "http://localhost:3000";

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
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);
  const serviceFee = cart.length > 0 ? subtotal * 0.10 : 0; // 10% servicio
  const total = subtotal + serviceFee;

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
    toast.success("Carrito vaciado");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <a
            href="/menu"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-ember text-sm transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Continuar comprando
          </a>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mt-4">
            Tu Carrito
          </h1>
          <p className="text-muted-foreground mt-2">
            {cart.length} producto{cart.length !== 1 ? "s" : ""} seleccionado{cart.length !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-10">
        
        {/* Lista de productos */}
        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-6 shadow-sm">
              <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-muted-foreground">Tu carrito está vacío</h2>
                <p className="text-muted-foreground/60 text-sm mt-1">Agrega productos desde nuestro menú</p>
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
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={cn(
                    "rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-300 shadow-sm",
                    "bg-[#fffdf9] border-[#e0d5c5] dark:bg-[#0d0907]/95 dark:border-[#2d2016]",
                    "border hover:border-ember/30 hover:shadow-md"
                  )}
                >
                  {/* Imagen */}
                  <div className="w-full sm:w-24 h-40 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                    <img
                      src={getImageUrl(item)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x400/1a1210/d8b892?text=Sin+Imagen";
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-display font-bold text-foreground truncate">{item.name}</h2>
                    <p className="text-ember/70 text-[10px] uppercase tracking-widest font-semibold mt-0.5">
                      {item.category || "Especial"}
                    </p>

                    {/* Controles */}
                    <div className="mt-3 flex items-center border border-border rounded-xl w-fit overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-3 py-2 hover:bg-ember/10 hover:text-ember transition-colors disabled:opacity-30 text-muted-foreground"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-bold bg-muted/50 py-2 text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-2 hover:bg-ember/10 hover:text-ember transition-colors text-muted-foreground"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Precio + Eliminar */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
                    <button
                      onClick={() => { removeFromCart(item.id); toast.success("Producto eliminado"); }}
                      className="text-red-500/60 hover:text-red-500 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        S/ {Number(item.price).toFixed(2)} c/u
                      </p>
                      <p className="text-xl sm:text-2xl font-black text-ember font-mono">
                        S/ {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Vaciar carrito */}
              <div className="flex justify-end">
                {!showClearConfirm ? (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-2 text-red-500/50 hover:text-red-500 text-sm transition-colors py-2 px-3 rounded-lg hover:bg-red-500/5"
                  >
                    <Trash2 size={16} /> Vaciar carrito
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-2">
                    <AlertTriangle size={14} className="text-red-500" />
                    <span className="text-xs text-red-500 font-medium">¿Estás seguro?</span>
                    <button onClick={handleClearCart} className="text-xs font-bold text-red-500 hover:text-red-400 ml-2">Sí, vaciar</button>
                    <button onClick={() => setShowClearConfirm(false)} className="text-xs text-muted-foreground hover:text-foreground ml-1">Cancelar</button>
                  </div>
                )}
              </div>
            </AnimatePresence>
          )}
        </div>

        {/* Resumen (sidebar) */}
        {cart.length > 0 && (
          <aside className={cn(
            "rounded-2xl p-6 sm:p-8 h-fit lg:sticky lg:top-8 space-y-6 shadow-lg",
            "bg-[#fffdf9] border-[#e0d5c5] dark:bg-[#0d0907]/95 dark:border-[#2d2016]",
            "border"
          )}>
            <h2 className="text-2xl font-display font-bold text-foreground">Resumen</h2>

            <div className="space-y-3 text-sm">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-muted-foreground">
                  <span className="truncate max-w-[200px]">{item.quantity}x {item.name}</span>
                  <span className="font-medium shrink-0">S/ {(Number(item.price) * Number(item.quantity)).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr className="border-border" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Servicio (10%)</span>
                <span className="text-xs flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-500" /> S/ {serviceFee.toFixed(2)}
                </span>
              </div>
            </div>

            <hr className="border-border" />

            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground text-sm">Total</span>
              <span className="text-3xl font-black text-ember font-mono">S/ {total.toFixed(2)}</span>
            </div>

            <a
              href="/checkout"
              className="block text-center w-full bg-ember hover:brightness-110 text-char-deep font-bold py-4 rounded-xl transition-all active:scale-[0.98] relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,color-mix(in_oklch,white_50%,transparent)_50%,transparent_70%)] animate-shimmer" />
              <span className="relative">Proceder al Checkout</span>
            </a>

            <p className="text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1.5">
              <ShieldCheck size={12} className="text-emerald-500" />
              Pago seguro procesado por Culqi
            </p>
          </aside>
        )}
      </section>
    </div>
  );
}