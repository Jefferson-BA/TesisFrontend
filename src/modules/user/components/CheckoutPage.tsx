import { useEffect, useState } from "react";
import { CulqiPayment } from "@/modules/payments/components/CulqiPayment";
import { CreditCard, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [isCulqiOpen, setIsCulqiOpen] = useState(false); // 🔥 ESTADO CLAVE

  useEffect(() => {
    // 1. Capturamos los datos de la URL que mandó UserOrders.tsx
    const params = new URLSearchParams(window.location.search);
    const id = params.get("orderId");
    const totalAmount = params.get("total");

    if (id && totalAmount) {
      setOrderId(id);
      setTotal(Number(totalAmount));
    }
  }, []);

  const handleSuccessRedirect = () => {
    // 2. Redirigimos al perfil después del éxito
    window.location.href = "/user/profile";
  };

  if (!orderId) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9974A]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="bg-white dark:bg-[#140d0b] border border-stone-200 dark:border-[#3d2c1f] rounded-2xl p-8 shadow-xl text-center">
        <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-white mb-2">
          Completar Pago
        </h1>
        <p className="text-stone-500 dark:text-zinc-400 mb-8">
          Estás a un paso de confirmar tu evento.
        </p>

        <div className="bg-stone-50 dark:bg-[#0a0705] border border-stone-200 dark:border-[#3d2c1f] rounded-xl p-6 mb-8 text-left">
          <p className="text-sm text-stone-500 uppercase tracking-wider font-bold mb-1">
            Resumen de Orden #{orderId.toString().padStart(5, '0')}
          </p>
          <p className="text-4xl font-black text-amber-600 dark:text-yellow-500">
            S/ {total.toFixed(2)}
          </p>
        </div>

        {/* 🔥 EL BOTÓN QUE ACTIVA EL MODAL */}
        <button
          onClick={() => setIsCulqiOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-stone-900 font-bold py-4 rounded-xl transition-all shadow-lg"
        >
          <CreditCard className="w-5 h-5" />
          Pagar de Forma Segura
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Pagos encriptados y procesados de forma segura por Culqi.</span>
        </div>

        <CulqiPayment
          orderId={orderId}
          amount={total}
          userEmail="jeffeson123xd@gmail.com" // Idealmente sacado de tu auth context
          isOpen={isCulqiOpen}
          onClose={() => setIsCulqiOpen(false)}
          onSuccessCallback={handleSuccessRedirect}
        />
      </div>
    </div>
  );
}