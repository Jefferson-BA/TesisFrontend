// src/modules/user/checkout/components/CheckoutPage.tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CulqiPayment } from "@/modules/payments/components/CulqiPayment";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import { useUser } from "@/modules/user/hooks/useUser";
import { CreditCard, ShieldCheck, ShoppingBag, ArrowLeft, Loader2, Receipt } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api/axios";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const cart = useCartStore((s) => s.cart);
  const clearCart = useCartStore((s) => s.clearCart);
  const { user } = useUser();

  const [isCulqiOpen, setIsCulqiOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);
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
    try {
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
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-foreground truncate flex-1">{item.quantity}x {item.name}</span>
              <span className="text-muted-foreground ml-4 font-mono">S/ {(Number(item.price) * Number(item.quantity)).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Totales */}
        <div className="mb-6 space-y-2 rounded-xl border border-border bg-muted/20 p-5">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-medium text-foreground">S/ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Servicio (10%)</span>
            <span className="font-medium text-foreground">S/ {serviceFee.toFixed(2)}</span>
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
            <button onClick={handlePagarClick} disabled={isCreatingOrder}
              className="w-full flex items-center justify-center gap-2 bg-ember hover:brightness-110 text-char-deep font-bold py-4 rounded-xl transition-all active:scale-[0.98] relative overflow-hidden group disabled:opacity-70">
              {!isCreatingOrder && <span className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,color-mix(in_oklch,white_50%,transparent)_50%,transparent_70%)] animate-shimmer" />}
              {isCreatingOrder ? <Loader2 className="w-5 h-5 relative z-10 animate-spin" /> : <CreditCard className="w-5 h-5 relative z-10" />}
              <span className="relative z-10">{isCreatingOrder ? "Preparando..." : "Pagar de Forma Segura"}</span>
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
            onClose={() => setIsCulqiOpen(false)}
            onSuccessCallback={handleSuccess}
          />
        )}
      </motion.div>
    </div>
  );
}