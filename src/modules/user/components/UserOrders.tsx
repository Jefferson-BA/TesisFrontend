// src/modules/user/components/UserOrders.tsx

"use client";

import { useState } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { getUserReservations } from "@/modules/user/reservas/services/reservation.service";
import {
  Clock, CheckCircle, CreditCard, XCircle, AlertCircle, Smartphone,
  DollarSign, Calendar, ChevronDown, ChevronUp, MapPin, Users, FileText, ArrowRight,
} from "lucide-react";
import { useUser } from "../hooks/useUser";
import { cn } from "@/lib/utils";

const localQueryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: true, retry: 1 } } });

const STATUS_FLOW = ["pending_review", "approved", "fully_paid", "completed"];
const STATUS_LABELS: Record<string, string> = {
  pending_review: "Pendiente",
  approved: "Aprobada",
  fully_paid: "Pagada",
  completed: "Completada",
  cancelled: "Cancelada",
};

const ITEMS_PER_PAGE = 5;

function UserOrdersContent() {
  const { user } = useUser();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ["user-reservations"],
    queryFn: async () => {
      const res = await getUserReservations();
      return Array.isArray(res) ? res : [];
    },
    refetchInterval: 10000,
  });

  // Paginación
  const totalPages = Math.ceil(reservations.length / ITEMS_PER_PAGE);
  const paginatedReservations = reservations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusIndex = (status: string) => STATUS_FLOW.indexOf(status?.toLowerCase());

  const renderPaymentMethod = (method: string) => {
    const methods: Record<string, { icon: any; label: string; color: string }> = {
      card: { icon: CreditCard, label: "Tarjeta (Culqi)", color: "text-ember" },
      yape: { icon: Smartphone, label: "Yape", color: "text-purple-500" },
      plin: { icon: Smartphone, label: "Plin", color: "text-teal-500" },
      cash: { icon: DollarSign, label: "Efectivo", color: "text-emerald-500" },
    };
    const m = methods[method?.toLowerCase()] || { icon: CreditCard, label: method || "No especificado", color: "text-muted-foreground" };
    const Icon = m.icon;
    return (
      <span className={cn("flex items-center gap-1 text-xs font-medium", m.color)}>
        <Icon className="w-3.5 h-3.5" /> {m.label}
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-bold text-foreground">Mis Reservas e Historial</h2>
        <span className="text-xs text-muted-foreground">{reservations.length} reservas</span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
          <Calendar className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">Aún no tienes reservas registradas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedReservations.map((res: any) => {
            const statusIdx = getStatusIndex(res.status);
            const isExpanded = expandedId === res.id;

            return (
              <div
                key={res.id}
                className={cn(
                  "rounded-xl border transition-all duration-300 overflow-hidden",
                  "bg-muted/30 border-border hover:border-ember/30",
                  isExpanded && "border-ember/30 shadow-lg"
                )}
              >
                {/* Cabecera */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 cursor-pointer gap-3"
                  onClick={() => setExpandedId(isExpanded ? null : res.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold",
                      res.status === "fully_paid" || res.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : res.status === "cancelled"
                          ? "bg-red-500/10 text-red-500 border border-red-500/20"
                          : "bg-ember/10 text-ember border border-ember/20"
                    )}>
                      {res.status === "fully_paid" || res.status === "completed" ? <CheckCircle size={18} /> :
                       res.status === "cancelled" ? <XCircle size={18} /> :
                       res.status === "approved" ? <AlertCircle size={18} /> : <Clock size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-foreground font-mono text-sm">
                        RES-{String(res.id).padStart(5, "0")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {res.eventDate && new Date(res.eventDate).toLocaleDateString("es-PE")} · {res.guestsCount || "?"} invitados
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      res.status === "fully_paid" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                      res.status === "approved" && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                      res.status === "pending_review" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                      res.status === "cancelled" && "bg-red-500/10 text-red-500 border-red-500/20",
                    )}>
                      {STATUS_LABELS[res.status] || res.status}
                    </span>
                    <span className="font-bold text-ember text-sm">S/ {Number(res.totalAmount || 0).toFixed(2)}</span>
                    {isExpanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                  </div>
                </div>

                {/* Detalles expandidos */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                        {/* Timeline de estado */}
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Flujo de Estado</p>
                          <div className="flex items-center gap-1">
                            {STATUS_FLOW.map((status, i) => {
                              const done = statusIdx >= i;
                              const isCancelled = res.status === "cancelled";
                              return (
                                <div key={status} className="flex-1 flex items-center">
                                  <div className={cn(
                                    "w-3 h-3 rounded-full shrink-0",
                                    isCancelled ? "bg-red-500" : done ? "bg-emerald-500" : "bg-muted-foreground/30"
                                  )} />
                                  {i < STATUS_FLOW.length - 1 && (
                                    <div className={cn(
                                      "flex-1 h-0.5 mx-1",
                                      isCancelled ? "bg-red-500/30" : done ? "bg-emerald-500" : "bg-muted-foreground/20"
                                    )} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between mt-1.5">
                            {STATUS_FLOW.map((status) => (
                              <span key={status} className="text-[9px] text-muted-foreground">{STATUS_LABELS[status]}</span>
                            ))}
                          </div>
                        </div>

                        {/* Detalles */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <DetailRow icon={MapPin} label="Dirección" value={res.venueAddress || "No especificada"} />
                          <DetailRow icon={Users} label="Invitados" value={String(res.guestsCount || "?")} />
                          <DetailRow icon={Calendar} label="Fecha" value={res.eventDate ? new Date(res.eventDate).toLocaleDateString("es-PE") : "No definida"} />
                          <DetailRow icon={Clock} label="Hora" value={res.serviceStartTime || "No definida"} />
                          {/* FALTA EXTRAER DEL BACKEND: city */}
                          <DetailRow icon={MapPin} label="Ciudad" value={res.city || "No especificada"} />
                        </div>

                        {/* Método de pago */}
                        <div className="flex items-center gap-2 pt-2 border-t border-border">
                          <span className="text-xs text-muted-foreground">Método de pago:</span>
                          {renderPaymentMethod(res.paymentMethod || "card")}
                        </div>

                        {/* Notas */}
                        {res.notes && (
                          <div className="flex items-start gap-2 pt-2 border-t border-border">
                            <FileText size={14} className="text-muted-foreground shrink-0 mt-0.5" />
                            <p className="text-xs text-muted-foreground">{res.notes}</p>
                          </div>
                        )}

                        {/* Acción: Pagar si está aprobada */}
                        {res.status === "approved" && (
                          <a
                            href={`/user/pagar-reserva?reservationId=${res.id}&amount=${Number(res.totalAmount || 0).toFixed(2)}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-ember hover:brightness-110 text-char-deep text-xs font-bold rounded-xl transition-all"
                          >
                            <CreditCard size={14} /> Pagar Reserva <ArrowRight size={14} />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={cn(
                "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                currentPage === i + 1
                  ? "bg-ember text-char-deep"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const DetailRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-center gap-2">
    <Icon size={14} className="text-muted-foreground shrink-0" />
    <span className="text-xs text-muted-foreground">{label}:</span>
    <span className="text-xs text-foreground font-medium truncate">{value}</span>
  </div>
);

export default function UserOrders() {
  return (
    <QueryClientProvider client={localQueryClient}>
      <UserOrdersContent />
    </QueryClientProvider>
  );
}