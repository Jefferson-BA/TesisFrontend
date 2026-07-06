"use client";

import { useState } from "react";
import { CulqiPayment } from "@/modules/payments/components/CulqiPayment";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import { useUser } from "@/modules/user/hooks/useUser";
import {
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api/axios"; // Importamos tu instancia de axios

export default function CheckoutPage() {
  const cart = useCartStore((s) => s.cart);
  const clearCart = useCartStore((s) => s.clearCart);
  const { user } = useUser();

  const [isCulqiOpen, setIsCulqiOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const totalAmount = cart.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0,
  );

  const handleSuccess = () => {
    clearCart();

    setIsCulqiOpen(false);
    setOrderId("");
    toast.success("¡Pago exitoso! Redirigiendo a tu perfil...");

    // Opcional: redirigir suavemente después de 2 segundos
    setTimeout(() => {
      window.location.href = "/user/profile";
    }, 2000);
  };

  const handlePagarClick = async () => {
    try {
      setIsCreatingOrder(true);
      toast.loading("Preparando tu orden...", { id: "create-order" });

      // 🔥 1. Mapeamos el carrito al DTO exacto que exige el backend
      const orderPayload = {
        // Campos opcionales (puedes conectarlos a tu formulario después)
        paymentMethod: "CREDIT_CARD",

        // El arreglo clave: mapeamos tu estado 'cart' a la estructura requerida
        items: cart.map((item) => ({
          productId: item.id, // ⚠️ IMPORTANTE: Este id debe ser el UUID de tu backend
          quantity: Math.floor(Number(item.quantity)), // Forzamos a que sea un número entero
        })),
      };

      // 🔥 2. Enviamos el payload limpio al backend
      const response = await api.post("/orders", orderPayload);

      // 3. Extraemos el UUID real de la respuesta
      const realOrderId = response.data?.id;

      if (!realOrderId) {
        throw new Error("El servidor no devolvió el ID de la orden.");
      }

      toast.success("Orden creada, abriendo pasarela...", {
        id: "create-order",
      });

      // 4. Guardamos el UUID y abrimos Culqi
      setOrderId(realOrderId);
      setIsCulqiOpen(true);
    } catch (error: any) {
      console.error("Error al crear la orden:", error);
      // Extraemos el mensaje de error del backend para saber si seguimos fallando en alguna validación
      const msg =
        error.response?.data?.message || "No se pudo generar la orden.";

      // Si el backend devuelve un arreglo de errores (típico en NestJS/Spring), lo mostramos
      const errorDetail = Array.isArray(msg) ? msg[0] : msg;
      toast.error(`Error: ${errorDetail}`, { id: "create-order" });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 px-4">
        <div className="w-20 h-20 rounded-full bg-char flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-white/20" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-white">
            No hay productos en tu carrito
          </h2>
          <p className="text-white/50 mt-2">
            Agrega productos desde el menú antes de hacer checkout
          </p>
        </div>
        <a
          href="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 bg-ember hover:brightness-110 text-char-deep font-bold rounded-xl transition-all active:scale-[0.98]"
        >
          <ArrowLeft size={16} /> Ir al Menú
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Completar Pago
          </h1>
          <p className="text-muted-foreground">
            Estás a un paso de confirmar tu evento
          </p>
        </div>

        <div className="bg-char/40 border border-char rounded-xl p-5 mb-8 space-y-4">
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
              Resumen de Orden
            </p>
            <p className="text-4xl font-black text-ember font-mono mt-1">
              S/ {totalAmount.toFixed(2)}
            </p>
          </div>
          <div className="space-y-2 pt-3 border-t border-char">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-white/70 truncate flex-1">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-white/50 ml-4 font-mono">
                  S/ {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-char/20 border border-char rounded-xl p-4 mb-8">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">
            Confirmaremos tu pedido en
          </p>
          <p className="text-white/80 text-sm font-medium">
            {user?.email || "email@ejemplo.com"}
          </p>
        </div>

        <button
          onClick={handlePagarClick}
          disabled={isCreatingOrder}
          className="w-full flex items-center justify-center gap-2 bg-ember hover:brightness-110 text-char-deep font-bold py-4 rounded-xl transition-all active:scale-[0.98] relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {!isCreatingOrder && (
            <span className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,color-mix(in_oklch,white_50%,transparent)_50%,transparent_70%)] animate-shimmer" />
          )}

          {isCreatingOrder ? (
            <Loader2 className="w-5 h-5 relative z-10 animate-spin" />
          ) : (
            <CreditCard className="w-5 h-5 relative z-10" />
          )}
          <span className="relative z-10">
            {isCreatingOrder ? "Preparando..." : "Pagar de Forma Segura"}
          </span>
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-white/30">
          <ShieldCheck className="w-4 h-4 text-emerald-500/70" /> Pagos
          encriptados y procesados por Culqi
        </div>

        {/* Solo renderizamos el componente de pago si tenemos un orderId válido */}
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
      </div>
    </div>
  );
}
