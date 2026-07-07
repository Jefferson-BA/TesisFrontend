// src/modules/user/checkout/components/PaymentReservationPage.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@/modules/user/hooks/useUser";
import { usePayOrder } from "@/modules/payments/hooks/usePayOrder";
import { createOrder } from "@/modules/admin/pedidos/services/order.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Loader2, ArrowLeft, ArrowRight, CheckCircle, CreditCard, X, Calendar, Hash } from "lucide-react";
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
  const [isDark, setIsDark] = useState(true);

  const culqiRef = useRef<any>(null);
  const processingRef = useRef(false);
  const containerId = useRef(`culqi-${Date.now()}`).current;

  // Detectar tema
  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Obtener params
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (p.get("reservationId")) setReservationId(p.get("reservationId")!);
    if (p.get("amount")) setAmount(Number(p.get("amount")));
  }, []);

  // Script Culqi
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
        buttonCardPayText: "Pagar Ahora",
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

  // ─── Sin reservationId ───
  if (!reservationId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <X className="size-10 text-muted-foreground/40" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">No se encontró la reserva</h2>
        <p className="text-muted-foreground">La información de la reserva no está disponible.</p>
        <a href="/user/profile" className="inline-flex items-center gap-2 rounded-xl bg-ember hover:brightness-110 text-char-deep px-6 py-3 font-bold transition-all">
          <ArrowLeft size={16} /> Volver a Mi Perfil
        </a>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {/* ─── COMPLETADO ─── */}
      {step === "completado" && (
        <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-[60vh] items-center justify-center">
          <div className="space-y-6 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}>
              <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="size-12 text-emerald-500" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-display font-bold text-foreground">¡Pago Exitoso!</h2>
            <p className="text-muted-foreground text-lg">Tu reserva ha sido confirmada. Redirigiendo a tu perfil...</p>
            <div className="mx-auto h-1.5 w-48 overflow-hidden rounded-full bg-muted">
              <motion.div className="h-full rounded-full bg-emerald-500" animate={{ width: "100%" }} transition={{ duration: 2.5, ease: "easeInOut" }} />
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── RESUMEN ─── */}
      {step === "resumen" && (
        <motion.div key="summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl">
            <div className="mb-8 space-y-2 text-center">
              <div className="w-14 h-14 rounded-2xl bg-ember/10 border border-ember/20 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-7 h-7 text-ember" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">Pagar Reserva</h1>
              <p className="text-muted-foreground">Revisa los detalles antes de continuar con el pago</p>
            </div>

            {/* Detalles */}
            <div className="mb-6 space-y-4 rounded-xl border border-border bg-muted/30 p-5">
              <DetailRow icon={Hash} label="Reserva" value={`RES-${reservationId.padStart(5, "0")}`} />
              <hr className="border-border" />
              <DetailRow icon={CreditCard} label="Monto a Pagar" value={`S/ ${amount.toFixed(2)}`} highlight />
            </div>

            {/* Email */}
            <div className="mb-8 rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Email de confirmación</p>
              <p className="text-sm font-medium text-foreground">{user?.email || "email@ejemplo.com"}</p>
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="/user/profile" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-bold text-muted-foreground transition-colors hover:border-ember/30 hover:text-foreground">
                <ArrowLeft size={16} /> Volver
              </a>
              <button onClick={handleContinuar} disabled={isCreatingOrder}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ember to-amber-600 px-6 py-3 font-bold text-char-deep shadow-lg transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-70">
                {isCreatingOrder ? <Loader2 className="size-5 animate-spin" /> : <CreditCard className="size-5" />}
                {isCreatingOrder ? "Preparando..." : "Confirmar y Pagar"}
                <ArrowRight className="size-5" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-emerald-500" /> Pago seguro procesado por Culqi
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── PAGO ─── */}
      {step === "pago" && (
        <div className={cn("fixed inset-0 top-[80px] z-40 flex flex-col", isDark ? "bg-[#0b0806]" : "bg-stone-50")}>
          <div className={cn("flex shrink-0 items-center justify-between border-b px-6 py-4 backdrop-blur-sm", isDark ? "border-[#3d2c1f] bg-[#140d0b]/95" : "border-stone-200 bg-white/95")}>
            <button onClick={() => { culqiRef.current?.close(); setStep("resumen"); setOrderId(""); }}
              className={cn("inline-flex items-center gap-2 text-sm transition-colors", isDark ? "text-zinc-400 hover:text-white" : "text-stone-500 hover:text-stone-900")}>
              <ArrowLeft size={16} /> Volver
            </button>
            <div className="text-right">
              <p className={cn("text-xs", isDark ? "text-zinc-500" : "text-stone-400")}>Monto a pagar</p>
              <p className="text-lg font-bold text-ember">S/ {amount.toFixed(2)}</p>
            </div>
          </div>
          <div id={containerId} className="flex-1 overflow-auto" style={{ display: "flex", flexDirection: "column" }} />

          <AnimatePresence>
            {isBackendProcessing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md">
                <div className="mx-4 max-w-sm rounded-2xl border border-ember/20 bg-card p-8 text-center shadow-2xl">
                  <Loader2 className="mx-auto mb-4 size-12 animate-spin text-ember" />
                  <h3 className="mb-2 text-xl font-bold text-foreground">Validando Transacción</h3>
                  <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-ember to-amber-600"
                      animate={{ width: ["0%", "100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                  </div>
                  <p className="text-sm text-muted-foreground">No cierres esta ventana.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}

const DetailRow = ({ icon: Icon, label, value, highlight }: { icon: any; label: string; value: string; highlight?: boolean }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon size={14} />
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </div>
    <span className={cn("font-bold", highlight ? "text-2xl font-black text-ember font-mono" : "text-foreground font-mono text-sm")}>{value}</span>
  </div>
);

export default function PaymentReservationPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaymentReservationContent />
    </QueryClientProvider>
  );
}