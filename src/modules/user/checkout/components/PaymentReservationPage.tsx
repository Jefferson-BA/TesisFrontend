// src/modules/user/checkout/components/PaymentReservationPage.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@/modules/user/hooks/useUser";
import { usePayOrder } from "@/modules/payments/hooks/usePayOrder";
import { createOrder } from "@/modules/admin/pedidos/services/order.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Loader2, ArrowLeft, ArrowRight, CheckCircle, CreditCard, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    CulqiCheckout: any;
  }
}

const queryClient = new QueryClient();

function PaymentReservationContent() {
  const { user } = useUser();
  const { mutate: payOrder } = usePayOrder();

  const [step, setStep] = useState<"resumen" | "pago" | "completado">("resumen");
  const [orderId, setOrderId] = useState("");
  const [reservationId, setReservationId] = useState("");
  const [amount, setAmount] = useState(0);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isCulqiReady, setIsCulqiReady] = useState(false);
  const [isBackendProcessing, setIsBackendProcessing] = useState(false);
  const [isDark, setIsDark] = useState(true); // 🔥 Detección de tema

  const culqiRef = useRef<any>(null);
  const processingRef = useRef(false);
  const containerId = useRef(`culqi-${Date.now()}`).current;

  // ─── Detectar tema ───
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // ─── Obtener params ───
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (p.get("reservationId")) setReservationId(p.get("reservationId")!);
    if (p.get("amount")) setAmount(Number(p.get("amount")));
  }, []);

  // ─── Script Culqi ───
  useEffect(() => {
    if (document.getElementById("culqi-checkout-js")) { setIsCulqiReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://js.culqi.com/checkout-js";
    s.id = "culqi-checkout-js";
    s.async = true;
    s.onload = () => setIsCulqiReady(true);
    document.body.appendChild(s);
    return () => { culqiRef.current?.close(); };
  }, []);

  useEffect(() => {
    if (step === "pago" && orderId && isCulqiReady) setTimeout(openCulqi, 200);
  }, [step, orderId, isCulqiReady]);

  // ─── Handlers ───
  const handleContinuar = async () => {
    try {
      setIsCreatingOrder(true);
      toast.loading("Preparando orden...", { id: "order" });
      const res = await createOrder({ reservationId: Number(reservationId) });
      const id = res?.id || res?.data?.id || res?.orderId;
      if (!id) throw new Error("No se generó la orden");
      toast.success("Orden lista", { id: "order" });
      setOrderId(String(id));
      setStep("pago");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Error", { id: "order" });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handlePayment = (tokenId: string) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setIsBackendProcessing(true);
    culqiRef.current?.close();
    toast.loading("Procesando pago...", { id: "pay", duration: Infinity });
    payOrder(
      { orderId, tokenId, email: user?.email || "cliente@email.com", amount },
      {
        onSuccess: () => {
          setTimeout(() => {
            toast.success("¡Pago exitoso!", { id: "pay" });
            setIsBackendProcessing(false);
            setStep("completado");
            processingRef.current = false;
            setTimeout(() => location.replace("/user/profile"), 2500);
          }, 1500);
        },
        onError: (e: any) => {
          toast.error(e.response?.data?.message || "Error", { id: "pay" });
          setIsBackendProcessing(false);
          processingRef.current = false;
        },
      }
    );
  };

  const openCulqi = () => {
    if (!window.CulqiCheckout || !orderId) return;
    const pk = import.meta.env.PUBLIC_CULQI_KEY;
    if (!pk) { toast.error("Falta llave pública"); return setStep("resumen"); }

    const methods = { tarjeta: true, yape: true, billetera: false, bancaMovil: false, agente: false, cuotealo: false };

    culqiRef.current = new window.CulqiCheckout(pk, {
      settings: { title: "DeParraSpitz", currency: "PEN", amount: Math.round(amount * 100) },
      client: { email: user?.email || "cliente@email.com" },
      options: { lang: "auto", installments: false, modal: false, container: `#${containerId}`, paymentMethods: methods, paymentMethodsSort: Object.keys(methods) },
      appearance: {
        theme: isDark ? "dark" : "default",
        hiddenCulqiLogo: true, menuType: "sidebar",
        buttonCardPayText: `Pagar`,
        defaultStyle: { bannerColor: "#C9974A", buttonBackground: "#C9974A", menuColor: "#C9974A", linksColor: "#C9974A", buttonTextColor: isDark ? "#FFF" : "#1a1a1a", priceColor: "#C9974A" },
      },
    });

    culqiRef.current.culqi = () => {
      if (culqiRef.current.token) handlePayment(culqiRef.current.token.id);
      else if (culqiRef.current.order) { culqiRef.current.close(); setStep("completado"); setTimeout(() => location.replace("/user/profile"), 2500); }
      else if (culqiRef.current.error) { toast.error(culqiRef.current.error.user_message); culqiRef.current.close(); }
    };

    culqiRef.current.open();
  };

  // ─── Vistas ───
  if (!reservationId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <X className="size-10 text-red-400/50" />
        <h2 className="text-2xl font-bold">No se encontró la reserva</h2>
        <a href="/user/profile" className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 font-bold text-white hover:bg-amber-700 transition-colors">
          <ArrowLeft size={16} /> Volver a Mi Perfil
        </a>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {step === "completado" && (
        <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-[60vh] items-center justify-center">
          <div className="space-y-4 text-center">
            <CheckCircle className="mx-auto size-16 text-emerald-500" />
            <h2 className="text-2xl font-bold">¡Pago Exitoso!</h2>
            <p className="text-zinc-400">Redirigiendo a tu perfil...</p>
            <div className="mx-auto h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full rounded-full bg-emerald-500" animate={{ width: "100%" }} transition={{ duration: 2.5, ease: "easeInOut" }} />
            </div>
          </div>
        </motion.div>
      )}

      {step === "resumen" && (
        <motion.div key="summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
            <div className="mb-8 space-y-2 text-center">
              <h1 className="font-display text-3xl font-bold">Pagar Reserva</h1>
              <p className="text-muted-foreground">Revisa los detalles antes de continuar</p>
            </div>
            <div className="mb-6 space-y-4 rounded-xl border border-char bg-char/40 p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Reserva</p>
                <p className="mt-1 font-mono text-2xl font-bold">RES-{reservationId.padStart(5, "0")}</p>
              </div>
              <div className="border-t border-char pt-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Monto a Pagar</p>
                <p className="font-mono text-4xl font-black text-ember">S/ {amount.toFixed(2)}</p>
              </div>
            </div>
            <div className="mb-8 rounded-xl border border-char bg-char/20 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Email</p>
              <p className="text-sm font-medium text-white/80">{user?.email || "email@ejemplo.com"}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="/user/profile" className="inline-flex items-center justify-center gap-2 rounded-xl border border-char px-6 py-3 text-sm font-bold text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white">
                <ArrowLeft size={16} /> Volver
              </a>
              <button onClick={handleContinuar} disabled={isCreatingOrder}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-3 font-bold text-white shadow-lg transition-all hover:from-amber-700 hover:to-amber-800 active:scale-[0.98] disabled:opacity-70">
                {isCreatingOrder ? <Loader2 className="size-5 animate-spin" /> : <CreditCard className="size-5" />}
                {isCreatingOrder ? "Preparando..." : "Confirmar y Pagar"}
                <ArrowRight className="size-5" />
              </button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-zinc-500">
              <ShieldCheck className="size-3.5 text-emerald-500/70" /> Pago seguro procesado por Culqi
            </div>
          </div>
        </motion.div>
      )}

      {step === "pago" && (
        <div className={cn(
          "fixed inset-0 top-[80px] z-40 flex flex-col",
          isDark ? "bg-[#0b0806]" : "bg-stone-50"
        )}>
          <div className={cn(
            "flex shrink-0 items-center justify-between border-b px-6 py-4 backdrop-blur-sm",
            isDark ? "border-[#3d2c1f] bg-[#140d0b]/95" : "border-stone-200 bg-white/95"
          )}>
            <button 
              onClick={() => { culqiRef.current?.close(); setStep("resumen"); setOrderId(""); }}
              className={cn("inline-flex items-center gap-2 text-sm transition-colors", isDark ? "text-zinc-400 hover:text-white" : "text-stone-500 hover:text-stone-900")}
            >
              <ArrowLeft size={16} /> Volver
            </button>
            <div className="text-right">
              <p className={cn("text-xs", isDark ? "text-zinc-500" : "text-stone-400")}>Monto</p>
              <p className="text-lg font-bold text-ember">S/ {amount.toFixed(2)}</p>
            </div>
          </div>
          <div id={containerId} className="flex-1 overflow-auto" style={{ display: "flex", flexDirection: "column" }} />
          
          <AnimatePresence>
            {isBackendProcessing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md">
                <div className="mx-4 max-w-sm rounded-2xl border border-amber-500/30 bg-neutral-900 p-8 text-center shadow-2xl">
                  <Loader2 className="mx-auto mb-4 size-12 animate-spin text-amber-500" />
                  <h3 className="mb-2 text-xl font-bold text-white">Validando Transacción</h3>
                  <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600"
                      animate={{ width: ["0%", "100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                  </div>
                  <p className="text-sm text-zinc-400">No cierres esta ventana.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function PaymentReservationPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaymentReservationContent />
    </QueryClientProvider>
  );
}