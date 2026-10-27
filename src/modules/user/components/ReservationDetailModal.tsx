// src/modules/user/components/ReservationDetailModal.tsx

"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Calendar, Clock, MapPin, Users, Utensils, CreditCard,
  FileText, CheckCircle, AlertCircle, XCircle, ShieldCheck,
  ShoppingBag, Sparkles, ArrowRight, User, Mail, Phone,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getProducts } from "@/modules/admin/productos/services/product.service";
import { getOrders } from "@/modules/admin/pedidos/services/order.service";

const API_URL = "http://localhost:3000";

const getImageUrl = (url?: string) => {
  if (!url) return "https://placehold.co/400x400/1a1210/d8b892?text=Sin+Imagen";
  return url.startsWith("http") ? url : `${API_URL}/${url.replace(/^\//, "")}`;
};

const STATUS_META: Record<
  string,
  { label: string; icon: LucideIcon; badgeClass: string; circleClass: string }
> = {
  pending_review: {
    label: "Pendiente de Revisión",
    icon: Clock,
    badgeClass: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    circleClass: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  approved: {
    label: "Aprobada para Pago",
    icon: AlertCircle,
    badgeClass: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    circleClass: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  fully_paid: {
    label: "Pagada / Confirmada",
    icon: CheckCircle,
    badgeClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    circleClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  completed: {
    label: "Evento Concluido",
    icon: CheckCircle,
    badgeClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    circleClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  cancelled: {
    label: "Reserva Cancelada",
    icon: XCircle,
    badgeClass: "bg-red-500/10 text-red-500 border-red-500/20",
    circleClass: "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

const DEFAULT_STATUS_META = {
  label: "Desconocido",
  icon: Clock,
  badgeClass: "bg-muted text-muted-foreground border-border",
  circleClass: "bg-muted text-muted-foreground border-border",
};

const PAYMENT_LABELS: Record<string, string> = {
  card: "Tarjeta de Crédito / Débito (Culqi)",
  yape: "Yape / Transferencia BCP",
  plin: "Plin / Transferencia",
  cash: "Efectivo / Presencial",
};

interface ReservationDetailModalProps {
  open: boolean;
  onClose: () => void;
  reservation: any;
  currentUser?: any;
}

export const ReservationDetailModal = ({
  open,
  onClose,
  reservation,
  currentUser,
}: ReservationDetailModalProps) => {
  const [catalog, setCatalog] = useState<any[]>([]);
  const [fetchedOrderItems, setFetchedOrderItems] = useState<any[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Escuchar tecla escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Cargar información complementaria (catálogo y pedidos vinculados si hace falta)
  useEffect(() => {
    if (!open || !reservation) return;

    let isMounted = true;
    const initialItems = reservation.items || reservation.order?.items || [];

    const loadExtraData = async () => {
      setIsLoadingDetails(true);
      try {
        const promises: Promise<any>[] = [];

        // 1. Catálogo si faltan datos de productos
        const needsCatalog = initialItems.some(
          (it: any) => !it.name && !it.product?.name && it.productId
        );
        if (needsCatalog && catalog.length === 0) {
          promises.push(
            getProducts().then((res) => {
              if (isMounted) {
                const prods = Array.isArray(res) ? res : res?.data || [];
                setCatalog(prods);
              }
            }).catch(() => {})
          );
        }

        // 2. Si la reserva no trae items directos, consultar orders con reservationId
        if (initialItems.length === 0 && reservation.id) {
          promises.push(
            getOrders(reservation.id).then((ordersRes) => {
              if (isMounted) {
                const list = Array.isArray(ordersRes) ? ordersRes : ordersRes?.data || [];
                if (list.length > 0 && list[0]?.items) {
                  setFetchedOrderItems(list[0].items);
                }
              }
            }).catch(() => {})
          );
        }

        await Promise.all(promises);
      } finally {
        if (isMounted) setIsLoadingDetails(false);
      }
    };

    loadExtraData();

    return () => {
      isMounted = false;
    };
  }, [open, reservation]);

  // Resolver lista final de productos
  const resolvedItems = useMemo(() => {
    if (!reservation) return [];
    const baseItems = reservation.items && reservation.items.length > 0
      ? reservation.items
      : reservation.order?.items && reservation.order.items.length > 0
        ? reservation.order.items
        : fetchedOrderItems;

    return baseItems.map((item: any) => {
      // Si el item ya tiene producto anidado
      const prod = item.product || catalog.find((c) => String(c.id) === String(item.productId));
      const name = item.name || prod?.name || item.foodName || `Producto #${item.productId || item.id}`;
      const category = prod?.category?.name || prod?.category || item.category || "Catering";
      const imageUrl = prod?.imageUrl || prod?.image || item.imageUrl || item.image;
      const unitPrice = Number(item.price ?? prod?.price ?? 0);
      const quantity = Number(item.quantity ?? item.qty ?? 1);
      const subtotal = Number(item.subtotal ?? (unitPrice * quantity));

      return {
        id: item.id || item.productId,
        name,
        category,
        imageUrl,
        unitPrice,
        quantity,
        subtotal,
      };
    });
  }, [reservation, catalog, fetchedOrderItems]);

  if (!reservation) return null;

  const statusMeta = STATUS_META[reservation.status?.toLowerCase()] || DEFAULT_STATUS_META;
  const StatusIcon = statusMeta.icon;

  const formattedEventDate = reservation.eventDate ? (() => {
    try {
      const parts = String(reservation.eventDate).split("T")[0].split("-");
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString("es-PE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      return new Date(reservation.eventDate).toLocaleDateString("es-PE");
    } catch {
      return String(reservation.eventDate);
    }
  })() : "Fecha pendiente";

  const totalCalculated = resolvedItems.reduce((acc: number, it: any) => acc + it.subtotal, 0);
  const finalTotal = Number(reservation.totalAmount || (totalCalculated > 0 ? totalCalculated : 0));

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-reserva-titulo"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden z-10 my-auto",
              "bg-[#fffdf9] border-[#e0d5c5] dark:bg-[#0d0907] dark:border-[#2d2016]",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border shrink-0", statusMeta.circleClass)}>
                  <StatusIcon size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 id="modal-reserva-titulo" className="text-xl font-display font-bold text-foreground">
                      Detalle de Reserva
                    </h2>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                      RES-{String(reservation.id).padStart(5, "0")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Información general y resumen de los servicios solicitados
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={cn("hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border", statusMeta.badgeClass)}>
                  {statusMeta.label}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar ventana de detalles"
                  className="w-9 h-9 rounded-xl bg-card hover:bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body (scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 text-foreground">
              {/* Badge móvil */}
              <div className="sm:hidden flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
                <span className="text-xs text-muted-foreground font-medium">Estado de la reserva:</span>
                <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", statusMeta.badgeClass)}>
                  {statusMeta.label}
                </span>
              </div>

              {/* Grid 1: Datos del Evento + Titular */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tarjeta: Datos del Evento */}
                <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <Calendar className="w-4 h-4 text-ember" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Datos del Evento
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Fecha programada</span>
                        <span className="capitalize font-medium text-foreground">{formattedEventDate}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Hora de inicio</span>
                        <span className="font-medium text-foreground">{reservation.serviceStartTime || "12:00 PM"}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Aforo estimado</span>
                        <span className="font-medium text-foreground">{reservation.guestsCount ? `${reservation.guestsCount} invitados` : "No especificado"}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Lugar / Ubicación</span>
                        <span className="font-medium text-foreground">
                          {reservation.venueAddress || "Dirección pendiente"}
                          {reservation.city ? `, ${reservation.city}` : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tarjeta: Titular y Pago */}
                <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <User className="w-4 h-4 text-ember" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Titular y Modalidad
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <User className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Cliente / Titular</span>
                        <span className="font-medium text-foreground">
                          {reservation.user?.name || reservation.customerName || currentUser?.name || "Cliente Registrado"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Correo electrónico</span>
                        <span className="font-medium text-foreground truncate max-w-[200px]">
                          {reservation.user?.email || reservation.customerEmail || currentUser?.email || "No registrado"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Teléfono de contacto</span>
                        <span className="font-medium text-foreground">
                          {reservation.user?.phone || reservation.customerPhone || currentUser?.phone || "No especificado"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Método de garantía / pago</span>
                        <span className="font-medium text-ember font-semibold">
                          {PAYMENT_LABELS[reservation.paymentMethod?.toLowerCase()] || reservation.paymentMethod || "Tarjeta (Culqi)"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas del Cliente si existen */}
              {(reservation.notes || reservation.additionalNotes) && (
                <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <FileText className="w-3.5 h-3.5 text-ember" />
                    Notas o requerimientos especiales
                  </div>
                  <p className="text-xs text-muted-foreground italic pl-5 leading-relaxed">
                    "{reservation.notes || reservation.additionalNotes}"
                  </p>
                </div>
              )}

              {/* Sección: Menú y Productos Adquiridos */}
              <div className="rounded-xl border border-border bg-card/60 overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-ember" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Menú y Platos Seleccionados ({resolvedItems.length})
                    </h3>
                  </div>
                  <span className="text-[11px] text-muted-foreground">Propuesta gastronómica</span>
                </div>

                <div className="p-4">
                  {isLoadingDetails ? (
                    <div className="py-8 text-center text-muted-foreground text-xs animate-pulse">
                      Cargando detalles de los productos...
                    </div>
                  ) : resolvedItems.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground text-xs space-y-2">
                      <ShoppingBag className="w-8 h-8 text-muted-foreground/30 mx-auto" />
                      <p>No se encontraron productos desglosados en el registro.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {resolvedItems.map((item: any, idx: number) => (
                        <div
                          key={`${item.id}-${idx}`}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-muted/20 hover:border-ember/30 transition-colors"
                        >
                          {/* Miniatura */}
                          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-muted border border-border/50">
                            <img
                              src={getImageUrl(item.imageUrl)}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/400x400/1a1210/d8b892?text=Sin+Imagen";
                              }}
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-display font-bold text-foreground truncate">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                              <span className="text-[10px] uppercase font-semibold text-ember/80">
                                {item.category}
                              </span>
                              <span>·</span>
                              <span className="font-mono">S/ {item.unitPrice.toFixed(2)} c/u</span>
                            </div>
                          </div>

                          {/* Cantidad y Subtotal */}
                          <div className="text-right shrink-0">
                            <span className="inline-block text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded mr-2 font-mono">
                              x{item.quantity}
                            </span>
                            <span className="font-mono font-bold text-foreground text-sm">
                              S/ {item.subtotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Resumen de Importes */}
                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Subtotal estimado de platos:</span>
                      <span className="font-mono font-medium text-foreground">
                        S/ {totalCalculated.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline pt-2 border-t border-border">
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Total de la Reserva
                      </span>
                      <span className="text-2xl font-black text-ember font-mono">
                        S/ {finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-border bg-muted/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" />
                Reserva procesada bajo estándares de calidad DeParraSpitz
              </p>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-colors cursor-pointer"
                >
                  Cerrar
                </button>

                {reservation.status === "approved" && (
                  <a
                    href={`/user/pagar-reserva?reservationId=${reservation.id}&amount=${finalTotal.toFixed(2)}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-ember hover:brightness-110 text-char-deep text-xs font-bold rounded-xl transition-all shadow-md shadow-amber-500/10 cursor-pointer"
                  >
                    <CreditCard size={14} /> Pagar Reserva <ArrowRight size={14} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
