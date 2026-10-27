// src/modules/user/checkout/components/CheckoutPage.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { CulqiPayment } from "@/modules/payments/components/CulqiPayment";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import { getActivePromotions } from "@/modules/admin/promociones/services/promotion.service";
import { useUser } from "@/modules/user/hooks/useUser";
import { CreditCard, ShieldCheck, ShoppingBag, ArrowLeft, Loader2, Receipt, Flame, Tag } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api/axios";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const cart = useCartStore((s) => s.cart);
  const clearCart = useCartStore((s) => s.clearCart);
  const syncPromotions = useCartStore((s) => s.syncPromotions);
  const { user } = useUser();

  const [isCulqiOpen, setIsCulqiOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const isCreatingOrderRef = useRef(false);

  useEffect(() => {
    getActivePromotions()
      .then((promos) => {
        if (Array.isArray(promos)) {
          syncPromotions(promos);
        }
      })
      .catch(() => {});
  }, [syncPromotions]);

  const rawSubtotal = cart.reduce((acc, item) => {
    const base = item.originalPrice !== undefined ? Number(item.originalPrice) : Number(item.price);
    return acc + base * Number(item.quantity);
  }, 0);

  const subtotal = cart.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);
  const discountSavings = Math.max(0, rawSubtotal - subtotal);
  const serviceFee = subtotal * 0.10;
  const totalAmount = subtotal + serviceFee;

  const handleSuccess = () => {
    clearCart();
    setIsCulqiOpen(false);
    setOrderId("");
    toast.success("¡Pago exitoso! Redirigiendo a tu perfil...");
    setTimeout(() => { window.location.href = "/user/profile"; }, 2000);
  };

  const handlePagarClick = async () => {
    // Candado sincrónico inmediato para evitar doble petición de creación de orden
    if (isCreatingOrderRef.current || isCreatingOrder) {
      console.warn("⚠️ Petición de orden ya en progreso.");
      return;
    }

    try {
      isCreatingOrderRef.current = true;
      setIsCreatingOrder(true);
      toast.loading("Preparando tu orden...", { id: "create-order" });

      const orderPayload = {
        paymentMethod: "CREDIT_CARD",
        items: cart.map((item) => ({
          productId: item.id,
          quantity: Math.floor(Number(item.quantity)),
        })),
      };

      const response = await api.post("/orders", orderPayload);
      const realOrderId = response.data?.id;
      if (!realOrderId) throw new Error("El servidor no devolvió el ID de la orden.");

      toast.success("Orden creada, abriendo pasarela...", { id: "create-order" });
      setOrderId(realOrderId);
      setIsCulqiOpen(true);
    } catch (error: any) {
      const msg = error.response?.data?.message || "No se pudo generar la orden.";
      toast.error(Array.isArray(msg) ? msg[0] : msg, { id: "create-order" });
    } finally {
      setIsCreatingOrder(false);
      isCreatingOrderRef.current = false;
    }
  };

  // ─── Carrito vacío ───
  if (cart.length === 0 && !orderId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 px-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-muted-foreground/30" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground">No hay productos en tu carrito</h2>
        <p className="text-muted-foreground">Agrega productos desde el menú antes de hacer checkout</p>
        <a href="/menu" className="inline-flex items-center gap-2 px-6 py-3 bg-ember hover:brightness-110 text-char-deep font-bold rounded-xl transition-all active:scale-[0.98]">
          <ArrowLeft size={16} /> Ir al Menú
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      {/* Resumen de orden */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl">
        <div className="text-center space-y-2 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-ember/10 border border-ember/20 flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-7 h-7 text-ember" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Completar Pago</h1>
          <p className="text-muted-foreground">Estás a un paso de confirmar tu evento</p>
        </div>

        {/* Items */}
        <div className="mb-6 space-y-3 rounded-xl border border-border bg-muted/30 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Productos</p>
          {cart.map((item) => {
            const hasDiscount = !!(item.originalPrice && item.originalPrice > item.price);
            const unitOriginal = item.originalPrice !== undefined ? Number(item.originalPrice) : Number(item.price);
            const unitFinal = Number(item.price);
            const qty = Number(item.quantity);

            return (
              <div key={item.id} className="flex justify-between items-start text-sm py-1 border-b border-border/40 last:border-none">
                <div className="flex-1 truncate mr-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-foreground truncate font-medium">{qty}x {item.name}</span>
                    {item.promoLabel && (
                      <span className="inline-flex items-center gap-0.5 bg-amber-500 text-black px-1.5 py-0.2 rounded-full font-black text-[9px] uppercase tracking-wider shrink-0">
                        <Flame size={9} strokeWidth={3} />
                        {item.promoLabel}
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      <span className="line-through text-muted-foreground/60 mr-1 font-mono">S/ {unitOriginal.toFixed(2)}</span>
                      <span className="text-amber-500 font-semibold font-mono">S/ {unitFinal.toFixed(2)} c/u</span>
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  {hasDiscount && (
                    <span className="block text-[10px] text-muted-foreground/60 line-through font-mono">
                      S/ {(unitOriginal * qty).toFixed(2)}
                    </span>
                  )}
                  <span className={cn("font-mono font-bold", hasDiscount ? "text-amber-500" : "text-foreground")}>
                    S/ {(unitFinal * qty).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Totales */}
        <div className="mb-6 space-y-2 rounded-xl border border-border bg-muted/20 p-5">
          {discountSavings > 0 ? (
            <>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal regular</span>
                <span className="font-mono line-through text-muted-foreground/70">S/ {rawSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Tag size={13} /> Descuento aplicado
                </span>
                <span className="font-mono font-bold">- S/ {discountSavings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-foreground">
                <span className="font-semibold">Subtotal con descuento</span>
                <span className="font-semibold font-mono">S/ {subtotal.toFixed(2)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-medium text-foreground font-mono">S/ {subtotal.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Servicio (10%)</span>
            <span className="font-medium text-foreground font-mono">S/ {serviceFee.toFixed(2)}</span>
          </div>
          <hr className="border-border my-2" />
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-bold text-foreground">Total</span>
            <span className="text-3xl font-black text-ember font-mono">S/ {totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Email */}
        <div className="mb-8 rounded-xl border border-border bg-muted/20 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Confirmaremos tu pedido en</p>
          <p className="text-sm font-medium text-foreground">{user?.email || "email@ejemplo.com"}</p>
        </div>

        {/* Botón de pago */}
        {!orderId && (
          <>
            <button
              type="button"
              onClick={handlePagarClick}
              disabled={isCreatingOrder}
              className={cn(
                "w-full flex items-center justify-center gap-2 bg-ember hover:brightness-110 text-char-deep font-bold py-4 rounded-xl transition-all active:scale-[0.98] relative overflow-hidden group",
                isCreatingOrder && "opacity-60 cursor-not-allowed pointer-events-none"
              )}
            >
              {!isCreatingOrder && <span className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,color-mix(in_oklch,white_50%,transparent)_50%,transparent_70%)] animate-shimmer" />}
              {isCreatingOrder ? <Loader2 className="w-5 h-5 relative z-10 animate-spin" /> : <CreditCard className="w-5 h-5 relative z-10" />}
              <span className="relative z-10">{isCreatingOrder ? "Preparando pago..." : "Pagar de Forma Segura"}</span>
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Pago encriptado y procesado por Culqi
            </div>
          </>
        )}

        {/* Culqi */}
        {orderId && (
          <CulqiPayment
            orderId={orderId}
            amount={totalAmount}
            userEmail={user?.email || "email@ejemplo.com"}
            isOpen={isCulqiOpen}
            onClose={() => {
              setIsCulqiOpen(false);
              setOrderId("");
            }}
            onSuccessCallback={handleSuccess}
          />
        )}
      </motion.div>
    </div>
  );
}