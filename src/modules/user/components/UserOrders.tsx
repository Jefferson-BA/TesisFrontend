import { useState } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { getUserReservations } from "../../admin/pedidos/services/order.service";
import {
  Clock,
  CheckCircle,
  CreditCard,
  XCircle,
  AlertCircle,
  ArrowRight,
  Smartphone,
  DollarSign,
  Calendar,
} from "lucide-react";

// Importaciones para el flujo de pago directo
import { CulqiPayment } from "../../payments/components/CulqiPayment";
import { useUser } from "../hooks/useUser";
import { createOrder } from "../../admin/pedidos/services/order.service";
import { toast } from "sonner";

// Instanciamos el cliente local de React Query aislado para Astro
const localQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

function UserOrdersContent() {
  // Estados para manejar el modal de pago de Culqi
  const [selectedOrderForPayment, setSelectedOrderForPayment] =
    useState<any>(null);
  const [isCulqiOpen, setIsCulqiOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | number | null>(
    null,
  );
  // Extraemos el usuario para mandarle su correo a Culqi
  const { user } = useUser();

  const {
    data: reservations = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["user-reservations"],
    queryFn: async () => {
      const res = await getUserReservations();
      return Array.isArray(res) ? res : res?.data || [];
    },
    refetchInterval: 7000,
  });

  const handleProcessPayment = async (reservation: any) => {
    // Si ya estamos procesando algo, ignoramos el clic
    if (processingId) return;

    try {
      setProcessingId(reservation.id); // Bloqueamos la UI
      toast.loading("Generando orden segura...", { id: "prep-payment" });

      const payload = { reservationId: Number(reservation.id) };
      const orderResponse = await createOrder(payload);
      const orderId =
        orderResponse?.id ||
        orderResponse?.data?.id ||
        orderResponse?.orderId ||
        orderResponse?.data?.orderId;

      if (!orderId)
        throw new Error("El backend no devolvió un ID de orden válido.");

      toast.dismiss("prep-payment");
      setSelectedOrderForPayment({ ...reservation, id: orderId });
      setIsCulqiOpen(true);
    } catch (error: any) {
      console.error("Error al preparar el pago:", error);
      const apiMessage =
        error.response?.data?.message ||
        "Hubo un problema al inicializar el pago.";
      toast.error(`Error: ${apiMessage}`, { id: "prep-payment" });
    } finally {
      // Pase lo que pase, liberamos el botón al final
      setProcessingId(null);
    }
  };

  const renderPaymentMethod = (method: string) => {
    switch (method?.toLowerCase()) {
      case "card":
        return (
          <span className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5" /> Tarjeta (Culqi)
          </span>
        );
      case "yape":
        return (
          <span className="flex items-center gap-1 text-purple-600 font-bold">
            <Smartphone className="w-3.5 h-3.5" /> Yape
          </span>
        );
      case "plin":
        return (
          <span className="flex items-center gap-1 text-teal-500 font-bold">
            <Smartphone className="w-3.5 h-3.5" /> Plin
          </span>
        );
      case "cash":
        return (
          <span className="flex items-center gap-1 text-emerald-600">
            <DollarSign className="w-3.5 h-3.5" /> Efectivo
          </span>
        );
      default:
        return (
          <span className="capitalize">{method || "No especificado"}</span>
        );
    }
  };

  const renderStatusUI = (res: any) => {
    const normalizedStatus = res.status?.toLowerCase() || "pending_review";

    switch (normalizedStatus) {
      case "pending_review":
        return {
          badge:
            "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
          icon: <Clock className="w-4 h-4" />,
          text: "Esperando aprobación de fecha",
          action: null,
        };
      // En la parte de renderStatusUI, caso "approved":
      case "approved":
        return {
          badge:
            "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
          icon: <AlertCircle className="w-4 h-4" />,
          text: "Fecha Aprobada - Pendiente de Pago",
          action: (
            <a
              href={`/user/pagar-reserva?reservationId=${res.id}&amount=${Number(res.totalAmount).toFixed(2)}`}
              className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg bg-gradient-to-r from-[#C9974A] to-[#b38137] hover:from-[#b38137] hover:to-[#966b2d] hover:shadow-amber-500/20"
            >
              <CreditCard className="w-4 h-4" />
              Pagar Reserva
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          ),
        };
      case "fully_paid":
        return {
          badge:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          icon: <CheckCircle className="w-4 h-4" />,
          text: "Reserva Confirmada y Pagada",
          action: null,
        };
      case "completed":
        return {
          badge:
            "bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/20",
          icon: <Calendar className="w-4 h-4" />,
          text: "Evento Finalizado",
          action: null,
        };
      case "cancelled":
        return {
          badge:
            "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
          icon: <XCircle className="w-4 h-4" />,
          text: "Reserva Cancelada",
          action: null,
        };
      default:
        return {
          badge:
            "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
          icon: <Clock className="w-4 h-4" />,
          text: normalizedStatus,
          action: null,
        };
    }
  };

  return (
    <div className="bg-white dark:bg-[#140d0b] border border-stone-200 dark:border-[#3d2c1f] rounded-2xl p-6 sm:p-8 transition-colors duration-500 shadow-sm relative">
      <h2 className="text-2xl font-serif font-bold mb-6 text-stone-900 dark:text-white">
        Mis Reservas e Historial
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9974A]"></div>
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-stone-200 dark:border-[#3d2c1f] rounded-xl">
          <p className="text-stone-500 dark:text-zinc-400">
            Aún no tienes solicitudes de reserva registradas.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((res: any) => {
            const statusUI = renderStatusUI(res);

            return (
              <div
                key={res.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border border-stone-200 dark:border-[#3d2c1f] rounded-xl p-5 transition-all duration-300 hover:border-amber-400/50 dark:hover:border-yellow-500/30 bg-stone-50/50 dark:bg-[#0a0705]/50 hover:shadow-md"
              >
                <div className="space-y-2 mb-4 sm:mb-0">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-lg text-stone-900 dark:text-white font-mono">
                      RES-{res.id.toString().padStart(5, "0")}
                    </p>
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${statusUI.badge}`}
                    >
                      {statusUI.icon}
                      {statusUI.text}
                    </span>
                  </div>

                  <div className="text-sm text-stone-600 dark:text-zinc-400 space-y-1">
                    <div className="text-stone-800 dark:text-zinc-200 flex gap-2">
                      <span>Método propuesto:</span>
                      <span className="font-medium">
                        {renderPaymentMethod(res.paymentMethod)}
                      </span>
                    </div>
                    <p className="text-base mt-2">
                      Monto a liquidar:{" "}
                      <span className="font-bold text-amber-600 dark:text-yellow-500">
                        S/ {Number(res.totalAmount).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col justify-end items-end">
                  {statusUI.action}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE PAGO: Se invoca directamente aquí, sin recargar página ni tocar carrito */}
      {selectedOrderForPayment && (
        <CulqiPayment
          orderId={selectedOrderForPayment.id}
          amount={Number(selectedOrderForPayment.totalAmount)}
          userEmail={user?.email || "usuario@ejemplo.com"}
          isOpen={isCulqiOpen}
          onClose={() => setIsCulqiOpen(false)}
          onSuccessCallback={() => {
            setIsCulqiOpen(false);
            refetch(); // Recarga las reservas para actualizar el estado visualmente
            alert("¡Pago exitoso! Tu reserva ha sido confirmada.");
          }}
        />
      )}
    </div>
  );
}

export default function UserOrders() {
  return (
    <QueryClientProvider client={localQueryClient}>
      <UserOrdersContent />
    </QueryClientProvider>
  );
}
