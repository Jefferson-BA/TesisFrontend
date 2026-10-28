import React, { useEffect, useState, useMemo } from "react";
import {
  getOrders,
  updateOrderStatus,
  getActiveAdminReservations,
} from "@/modules/admin/pedidos/services/order.service";
import OrderReservationFilter from "./OrderReservationFilter";
import ReservationDetailCard from "./ReservationDetailCard";
import type { Reservation } from "@/modules/admin/reservas/interfaces/reservation.interface";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronRight,
  Utensils,
  Receipt,
  Calendar,
  Clock,
  Users,
  MapPin,
  Printer,
  ChefHat,
  FileText,
  X,
  ExternalLink,
  RotateCcw,
} from "lucide-react";

// ESTADOS OPERATIVOS PARA COCINA CENTRAL
type KitchenOrderStatus =
  | "PENDIENTE"
  | "EN_COCINA"
  | "LISTO_DESPACHO"
  | "ENTREGADO"
  | "CANCELADA";

const ORDER_STATUS_CONFIG: Record<
  KitchenOrderStatus,
  {
    label: string;
    sublabel: string;
    badgeStyle: string;
    selectStyle: string;
  }
> = {
  PENDIENTE: {
    label: "Pendiente",
    sublabel: "Esperando confirmación",
    badgeStyle:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    selectStyle:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  EN_COCINA: {
    label: "En Cocina",
    sublabel: "En preparación por cocina",
    badgeStyle:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
    selectStyle:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
  },
  LISTO_DESPACHO: {
    label: "Listo para Despacho",
    sublabel: "Empaquetado para transporte",
    badgeStyle:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    selectStyle:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  ENTREGADO: {
    label: "Entregado",
    sublabel: "Servido en local del evento",
    badgeStyle:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    selectStyle:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  CANCELADA: {
    label: "Cancelada",
    sublabel: "Orden anulada",
    badgeStyle:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    selectStyle:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
  },
};

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | number | null>(null);

  // Modales
  const [modalReservation, setModalReservation] = useState<Reservation | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [printingOrder, setPrintingOrder] = useState<any | null>(null);
  const [isConsolidatedPrint, setIsConsolidatedPrint] = useState<boolean>(false);

  // Carga de pedidos
  const loadOrders = async (reservationId?: string | number) => {
    setLoading(true);
    try {
      const data = await getOrders(reservationId);
      const ordersList = Array.isArray(data) ? data : data.data || [];
      setOrders(ordersList);
    } catch (error) {
      console.error("Error al cargar órdenes:", error);
      toast.error("Error al sincronizar pedidos de cocina");
    } finally {
      setLoading(false);
    }
  };

  // Carga de reservas activas para enriquecer órdenes y cross-linking
  const loadReservations = async () => {
    try {
      const data = await getActiveAdminReservations();
      const list: Reservation[] = Array.isArray(data) ? data : data.data || [];
      setReservations(list);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
    }
  };

  useEffect(() => {
    loadReservations();
    const params = new URLSearchParams(window.location.search);
    const reservationId = params.get("reservationId");
    if (reservationId) {
      loadOrders(reservationId);
    } else {
      loadOrders();
    }
  }, []);

  // Diccionario indexado de reservas por ID
  const reservationsMap = useMemo(() => {
    const map = new Map<string, Reservation>();
    reservations.forEach((r) => {
      if (r.id) map.set(String(r.id), r);
    });
    return map;
  }, [reservations]);

  // Resolver la reserva vinculada a una orden
  const getLinkedReservation = (order: any): Reservation | null => {
    if (order.reservation && order.reservation.id) {
      return order.reservation;
    }
    const orderResId = order.reservationId || order.reservation?.id;
    if (orderResId && reservationsMap.has(String(orderResId))) {
      return reservationsMap.get(String(orderResId)) || null;
    }
    if (order.id) {
      const found = reservations.find(
        (r: any) =>
          (r.order?.id && String(r.order.id) === String(order.id)) ||
          (r.orders &&
            r.orders.some((o: any) => String(o.id) === String(order.id)))
      );
      if (found) return found;
    }
    if (selectedReservation) {
      return selectedReservation;
    }
    return null;
  };

  const handleReservationChange = (reservation: Reservation | null) => {
    setSelectedReservation(reservation);
    loadOrders(reservation?.id);
    setExpandedOrderId(null);

    // Actualizar URL sin recargar
    const url = new URL(window.location.href);
    if (reservation?.id) {
      url.searchParams.set("reservationId", String(reservation.id));
    } else {
      url.searchParams.delete("reservationId");
    }
    window.history.replaceState({}, "", url.toString());
  };

  const handleStatusChange = async (
    orderId: string | number,
    newStatus: string
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      const conf = ORDER_STATUS_CONFIG[newStatus as KitchenOrderStatus];
      toast.success(
        `Pedido #${orderId} actualizado a: ${conf?.label || newStatus}`
      );
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar el estado del pedido");
    }
  };

  const toggleRow = (orderId: string | number) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  // Normalizador de estados
  const normalizeStatus = (status: string): KitchenOrderStatus => {
    if (!status) return "PENDIENTE";
    const s = status.toUpperCase().trim();
    if (s === "PENDING" || s === "PENDIENTE") return "PENDIENTE";
    if (
      s === "EN_COCINA" ||
      s === "IN_KITCHEN" ||
      s === "PAID" ||
      s === "PAGADA" ||
      s === "APROBADA"
    )
      return "EN_COCINA";
    if (
      s === "LISTO_DESPACHO" ||
      s === "READY" ||
      s === "SHIPPED" ||
      s === "DESPACHADO"
    )
      return "LISTO_DESPACHO";
    if (s === "ENTREGADO" || s === "DELIVERED" || s === "COMPLETED")
      return "ENTREGADO";
    if (s === "CANCELADA" || s === "CANCELLED" || s === "FAILED")
      return "CANCELADA";
    return "PENDIENTE";
  };

  const getStatusStyle = (status: string) => {
    const norm = normalizeStatus(status);
    return ORDER_STATUS_CONFIG[norm]?.selectStyle || "bg-muted text-muted-foreground border-border";
  };

  const formatDisplayDate = (dateStr?: string) => {
    if (!dateStr || dateStr === "No disponible") return "Por confirmar";
    try {
      const parts = dateStr.split("T")[0].split("-");
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  // Disparar modal de comanda para un pedido específico
  const handleOpenPrintOrder = (order: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPrintingOrder(order);
    setIsConsolidatedPrint(false);
    setIsPrintModalOpen(true);
  };

  // Disparar comanda consolidada
  const handleOpenPrintConsolidated = () => {
    if (orders.length === 0) {
      toast.error("No hay pedidos en la selección actual para consolidar.");
      return;
    }
    setPrintingOrder(null);
    setIsConsolidatedPrint(true);
    setIsPrintModalOpen(true);
  };

  // Consolidación de platos de todos los pedidos actuales
  const consolidatedItems = useMemo(() => {
    if (!isConsolidatedPrint) return [];
    const map = new Map<
      string,
      {
        name: string;
        category: string;
        baseUnits: number;
        totalPortions: number;
        ordersCount: number;
      }
    >();

    orders.forEach((ord) => {
      const ordRes = getLinkedReservation(ord);
      const pax = Number(ordRes?.guestsCount || ord.guestsCount || 1) || 1;
      const items = ord.items || [];

      items.forEach((item: any) => {
        const key = item.productId || item.name || "item";
        const qty = Number(item.quantity || 1);
        const portions = qty * pax;

        if (map.has(key)) {
          const curr = map.get(key)!;
          curr.baseUnits += qty;
          curr.totalPortions += portions;
          curr.ordersCount += 1;
        } else {
          map.set(key, {
            name: item.name || "Plato sin nombre",
            category: item.category || "Plato Principal",
            baseUnits: qty,
            totalPortions: portions,
            ordersCount: 1,
          });
        }
      });
    });

    return Array.from(map.values());
  }, [orders, isConsolidatedPrint, reservationsMap, selectedReservation]);

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* ESTILOS PARA MODO IMPRESIÓN (WINDOW.PRINT) */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #kitchen-production-ticket, #kitchen-production-ticket * {
            visibility: visible !important;
          }
          #kitchen-production-ticket {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: auto !important;
            padding: 18mm !important;
            margin: 0 !important;
            background: white !important;
            color: #0f172a !important;
            box-shadow: none !important;
            border: none !important;
            display: block !important;
            z-index: 99999 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* CABECERA PRINCIPAL: COMANDA DE PRODUCCIÓN */}
      <div className="p-6 rounded-xl border border-border bg-card flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-xl transition-colors">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-primary uppercase tracking-wide">
                Comanda de Producción de Cocina Central
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                Catering & Buffets
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Despacho operativo, calculadora de porciones por comensal (PAX) y vinculación directa con reservas.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={handleOpenPrintConsolidated}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md cursor-pointer hover:shadow-primary/20 active:scale-95"
            title="Generar resumen de producción consolidado para el jefe de cocina"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Comanda del Chef</span>
          </button>

          <div className="bg-muted/40 p-1.5 rounded-xl border border-border">
            <OrderReservationFilter
              selectedReservationId={selectedReservation?.id}
              onSelectReservation={handleReservationChange}
            />
          </div>
        </div>
      </div>

      {/* TARJETA DE RESERVA SELECCIONADA (FILTRADA) */}
      {selectedReservation && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300 relative group">
          <div className="flex items-center justify-between bg-primary/10 border-t border-x border-primary/30 px-4 py-2 rounded-t-xl text-xs font-bold text-primary">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Filtrando comanda para la Reserva #{selectedReservation.id}
            </span>
            <button
              onClick={() => handleReservationChange(null)}
              className="inline-flex items-center gap-1 text-[11px] hover:underline text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Mostrar todos los pedidos
            </button>
          </div>
          <ReservationDetailCard reservation={selectedReservation} />
        </div>
      )}

      {/* TABLA PRINCIPAL DE PEDIDOS / COMANDAS */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xl transition-colors">
        <div className="overflow-x-auto min-w-full block">
          {loading ? (
            <div className="p-16 text-center text-muted-foreground font-medium animate-pulse flex flex-col items-center justify-center gap-3">
              <ChefHat className="w-8 h-8 text-primary animate-bounce" />
              <span>Sincronizando flujos de producción de cocina central...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground font-medium flex flex-col items-center justify-center gap-3">
              <Receipt className="w-8 h-8 opacity-40" />
              <span>No se encontraron registros de órdenes en esta selección.</span>
              {selectedReservation && (
                <button
                  onClick={() => handleReservationChange(null)}
                  className="text-xs text-primary font-bold hover:underline cursor-pointer"
                >
                  Ver todos los pedidos disponibles
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm text-foreground">
              <thead className="bg-muted/50 text-[11px] uppercase text-muted-foreground font-bold whitespace-nowrap border-b border-border">
                <tr>
                  <th className="px-3 py-4 w-10 text-center"></th>
                  <th className="px-4 py-4">N° Pedido / Reserva</th>
                  <th className="px-4 py-4">Cliente & Contacto</th>
                  <th className="px-4 py-4">Fecha Evento & Salida</th>
                  <th className="px-4 py-4 text-center">PAX (Invitados)</th>
                  <th className="px-4 py-4">Destino de Montaje</th>
                  <th className="px-4 py-4">Notas de Cocina</th>
                  <th className="px-4 py-4 text-right">Total</th>
                  <th className="px-4 py-4 text-center">Estado de Cocina</th>
                  <th className="px-4 py-4 text-center">Comanda</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {orders.map((order) => {
                  const linkedRes = getLinkedReservation(order);
                  const userRel = linkedRes?.user || order.reservation?.user || {};

                  const clientName =
                    order.fullName ||
                    order.customerName ||
                    userRel.name ||
                    linkedRes?.customerName ||
                    linkedRes?.clientName ||
                    "Cliente sin registrar";

                  const clientEmail =
                    order.email ||
                    order.customerEmail ||
                    userRel.email ||
                    linkedRes?.customerEmail ||
                    "Sin correo";

                  const rawPhone =
                    order.phone ||
                    order.customerPhone ||
                    userRel.phone ||
                    linkedRes?.phone ||
                    linkedRes?.customerPhone;
                  const clientPhone =
                    rawPhone && rawPhone !== "No disponible" && rawPhone !== "Sin teléfono"
                      ? rawPhone
                      : "Sin teléfono";

                  const hasAddressPipe = order.shippingAddress?.includes("|");
                  const cleanAddress = hasAddressPipe
                    ? order.shippingAddress.split(" | ")[0]
                    : order.address || order.shippingAddress || linkedRes?.venueAddress;

                  const parsedNotes =
                    hasAddressPipe && order.shippingAddress.includes("Notas:")
                      ? order.shippingAddress.split("Notas: ")[1]
                      : order.notes ||
                        linkedRes?.notes ||
                        (linkedRes as any)?.additionalNotes ||
                        "Sin notas especiales";

                  const eventDate =
                    order.eventDate && order.eventDate !== "No disponible"
                      ? order.eventDate
                      : linkedRes?.eventDate || "Por confirmar";

                  const serviceStartTime =
                    linkedRes?.serviceStartTime ||
                    order.serviceStartTime ||
                    order.reservation?.serviceStartTime ||
                    "12:00 PM";

                  const guestsCount = Number(
                    linkedRes?.guestsCount ||
                      order.guestsCount ||
                      order.reservation?.guestsCount ||
                      1
                  );
                  const safeGuests = guestsCount > 0 ? guestsCount : 1;

                  const reservationId =
                    linkedRes?.id || order.reservationId || order.reservation?.id;

                  const isExpanded = expandedOrderId === order.id;
                  const orderItems = order.items || [];

                  // Suma total de porciones calculadas para esta orden
                  const totalCalculatedPortions = orderItems.reduce(
                    (acc: number, it: any) =>
                      acc + (Number(it.quantity) || 1) * safeGuests,
                    0
                  );

                  return (
                    <React.Fragment key={order.id}>
                      <tr
                        className={`transition-colors cursor-pointer select-none ${
                          isExpanded
                            ? "bg-muted/40 border-l-4 border-l-primary"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => toggleRow(order.id)}
                      >
                        {/* Expand Icon */}
                        <td className="px-3 py-4 text-center text-muted-foreground">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-primary" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </td>

                        {/* N° Pedido & Vinculación a Reserva */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1.5">
                            <span className="font-mono text-primary font-black text-sm flex items-center gap-1">
                              #{order.id}
                            </span>
                            {reservationId ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (linkedRes) {
                                    setModalReservation(linkedRes);
                                  } else {
                                    handleReservationChange({
                                      id: String(reservationId),
                                    } as any);
                                  }
                                }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-150 cursor-pointer w-fit group"
                                title="Ver tarjeta completa de la reserva vinculada"
                              >
                                <Calendar className="w-3 h-3 text-primary group-hover:text-primary-foreground" />
                                <span>Reserva #{reservationId}</span>
                              </button>
                            ) : (
                              <span className="text-[10px] font-mono text-muted-foreground italic">
                                Venta Directa
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Cliente & Contacto */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground truncate max-w-[170px]">
                              {clientName}
                            </span>
                            <span className="text-muted-foreground font-mono text-[11px] truncate max-w-[170px]">
                              {clientEmail}
                            </span>
                            <span className="text-foreground/80 font-mono text-[11px]">
                              {clientPhone}
                            </span>
                          </div>
                        </td>

                        {/* Fecha Evento & Hora Salida */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-mono font-bold text-foreground flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-primary" />
                              {formatDisplayDate(eventDate)}
                            </span>
                            <span className="text-muted-foreground text-[11px] flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              Salida: <strong className="text-foreground">{serviceStartTime}</strong>
                            </span>
                          </div>
                        </td>

                        {/* PAX (Invitados) Destacado */}
                        <td className="px-4 py-4 text-center">
                          <div className="inline-flex flex-col items-center justify-center px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                            <span className="text-xs font-black flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {safeGuests}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider font-bold opacity-80">
                              Invitados
                            </span>
                          </div>
                        </td>

                        {/* Destino de Montaje */}
                        <td className="px-4 py-4 max-w-[180px]">
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground capitalize flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-primary shrink-0" />
                              {order.city || linkedRes?.city || "Lima"}
                            </span>
                            <span
                              className="text-muted-foreground text-[11px] truncate mt-0.5"
                              title={cleanAddress || "Sin dirección"}
                            >
                              {cleanAddress || "Sin dirección provista"}
                            </span>
                          </div>
                        </td>

                        {/* Notas de Cocina */}
                        <td className="px-4 py-4 max-w-[150px]">
                          <p
                            className="text-muted-foreground italic truncate text-[11px]"
                            title={parsedNotes}
                          >
                            {parsedNotes}
                          </p>
                        </td>

                        {/* Total */}
                        <td className="px-4 py-4 text-right font-mono font-bold text-foreground">
                          S/ {Number(order.total || 0).toFixed(2)}
                        </td>

                        {/* Estado de Cocina (Selector Operativo) */}
                        <td
                          className="px-4 py-4 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={normalizeStatus(order.status)}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className={`border text-[11px] font-black rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-ring outline-none cursor-pointer transition-all hover:brightness-105 shadow-xs ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {Object.entries(ORDER_STATUS_CONFIG).map(
                              ([key, config]) => (
                                <option
                                  key={key}
                                  value={key}
                                  className="bg-background text-foreground font-semibold"
                                >
                                  {config.label} ({config.sublabel})
                                </option>
                              )
                            )}
                          </select>
                        </td>

                        {/* Botón Imprimir Comanda Individual */}
                        <td
                          className="px-4 py-4 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={(e) => handleOpenPrintOrder(order, e)}
                            className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground border border-border hover:border-primary/50 transition-colors shadow-xs cursor-pointer"
                            title="Imprimir comanda para cocina"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>

                      {/* DESGLOSE EXPANDIDO: FICHA DE MONTAJE Y COMANDA DE PRODUCCIÓN */}
                      {isExpanded && (
                        <tr className="bg-muted/10 border-b border-border">
                          <td colSpan={10} className="p-4 sm:p-6">
                            <div className="bg-card rounded-xl border border-border p-5 shadow-inner space-y-5">
                              {/* Tarjetas de Logística de Montaje */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {/* Cronograma */}
                                <div className="bg-muted/40 p-3 rounded-lg border border-border flex items-start gap-3">
                                  <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
                                    <Calendar className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground">
                                      Fecha & Hora de Servicio
                                    </p>
                                    <p className="font-bold text-foreground text-xs mt-0.5 font-mono">
                                      {formatDisplayDate(eventDate)}
                                    </p>
                                    <p className="text-[11px] text-primary font-mono font-semibold">
                                      Despacho: {serviceStartTime}
                                    </p>
                                  </div>
                                </div>

                                {/* Factor Escala PAX */}
                                <div className="bg-muted/40 p-3 rounded-lg border border-border flex items-start gap-3">
                                  <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
                                    <Users className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground">
                                      Escala de Invitados (PAX)
                                    </p>
                                    <p className="font-bold text-foreground text-xs mt-0.5">
                                      {safeGuests} comensales
                                    </p>
                                    <span className="inline-block px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[9px] font-bold uppercase mt-1">
                                      Multiplicador x{safeGuests}
                                    </span>
                                  </div>
                                </div>

                                {/* Dirección de Montaje */}
                                <div className="bg-muted/40 p-3 rounded-lg border border-border flex items-start gap-3">
                                  <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
                                    <MapPin className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground">
                                      Punto de Montaje / Local
                                    </p>
                                    <p className="font-bold text-foreground text-xs mt-0.5 capitalize truncate">
                                      {order.city || linkedRes?.city || "Lima"}
                                    </p>
                                    <p
                                      className="text-[11px] text-muted-foreground truncate mt-0.5"
                                      title={cleanAddress}
                                    >
                                      {cleanAddress}
                                    </p>
                                  </div>
                                </div>

                                {/* Cross-Linking & Comanda */}
                                <div className="bg-muted/40 p-3 rounded-lg border border-border flex flex-col justify-between">
                                  <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                                      <ChefHat className="w-3 h-3 text-primary" /> Ficha de Cocina
                                    </p>
                                    <p className="text-[11px] text-foreground font-semibold mt-1">
                                      {reservationId ? `Vinculado a Reserva #${reservationId}` : "Pedido autónomo"}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    {reservationId && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (linkedRes) setModalReservation(linkedRes);
                                          else handleReservationChange({ id: String(reservationId) } as any);
                                        }}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border text-[10px] font-bold transition-colors cursor-pointer"
                                      >
                                        <ExternalLink className="w-3 h-3" /> Ficha Reserva
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleOpenPrintOrder(order)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] font-bold transition-colors cursor-pointer shadow-xs"
                                    >
                                      <Printer className="w-3 h-3" /> Imprimir Comanda
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Indicaciones especiales de la orden */}
                              {parsedNotes && parsedNotes !== "Sin notas especiales" && (
                                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                                  <FileText className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                                  <div>
                                    <strong className="uppercase font-black text-[10px] tracking-wider block">
                                      Indicaciones Especiales para el Chef / Despacho:
                                    </strong>
                                    <p className="italic mt-0.5">"{parsedNotes}"</p>
                                  </div>
                                </div>
                              )}

                              {/* Tabla de Platos con Calculadora de Porciones por Invitados (PAX) */}
                              <div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
                                  <h4 className="text-primary text-xs font-black uppercase tracking-wider flex items-center gap-2">
                                    <Utensils className="w-4 h-4" /> Desglose de Producción para Cocina Central
                                  </h4>
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border font-mono text-[11px]">
                                      PAX del Evento: <strong className="text-primary font-bold">{safeGuests} comensales</strong>
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold text-[11px]">
                                      Total Producción: {totalCalculatedPortions} porciones
                                    </span>
                                  </div>
                                </div>

                                {orderItems.length > 0 ? (
                                  <div className="overflow-x-auto mt-3">
                                    <table className="w-full text-left border-collapse">
                                      <thead className="border-b border-border text-[10px] uppercase text-muted-foreground">
                                        <tr>
                                          <th className="pb-2 font-bold">Plato / Preparación</th>
                                          <th className="pb-2 font-bold">Categoría</th>
                                          <th className="pb-2 font-bold text-center">Unidades Pedidas</th>
                                          <th className="pb-2 font-bold text-center">Multiplicador PAX</th>
                                          <th className="pb-2 font-bold text-center text-primary bg-primary/5 px-2 rounded-t">
                                            Total Porciones a Preparar (Cocina)
                                          </th>
                                          <th className="pb-2 font-bold text-right">Precio Unit.</th>
                                          <th className="pb-2 font-bold text-right">Subtotal</th>
                                        </tr>
                                      </thead>
                                      <tbody className="text-xs text-foreground divide-y divide-border/50">
                                        {orderItems.map((item: any, index: number) => {
                                          const itemName = item.name || "Plato sin nombre";
                                          const itemCategory = item.category || "Plato Principal";
                                          const itemQty = Number(item.quantity || 1);
                                          const itemPrice = Number(item.price || 0);
                                          const itemSubtotal = Number(item.subtotal || itemQty * itemPrice);
                                          const portionsToPrepare = itemQty * safeGuests;

                                          return (
                                            <tr
                                              key={item.id || index}
                                              className="hover:bg-muted/50 transition-colors"
                                            >
                                              <td className="py-3 font-bold text-foreground">
                                                {itemName}
                                              </td>
                                              <td className="py-3">
                                                <span className="px-2 py-0.5 bg-muted rounded-md text-[10px] border border-border text-muted-foreground">
                                                  {itemCategory}
                                                </span>
                                              </td>
                                              <td className="py-3 text-center font-mono font-bold">
                                                x{itemQty}
                                              </td>
                                              <td className="py-3 text-center font-mono text-muted-foreground">
                                                × {safeGuests} PAX
                                              </td>

                                              {/* CALCULADORA DE PORCIONES DESTACADA */}
                                              <td className="py-3 text-center bg-primary/5 font-mono px-3">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-black text-xs shadow-xs">
                                                  <Utensils className="w-3.5 h-3.5 text-primary" />
                                                  <span>{portionsToPrepare} porciones</span>
                                                </div>
                                              </td>

                                              <td className="py-3 text-right font-mono text-muted-foreground text-[11px]">
                                                S/ {itemPrice.toFixed(2)}
                                              </td>
                                              <td className="py-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                                S/ {itemSubtotal.toFixed(2)}
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                      <tfoot className="border-t border-border font-bold text-xs">
                                        <tr>
                                          <td colSpan={4} className="pt-3 text-muted-foreground uppercase text-[10px]">
                                            Suma Consolidada de Producción para Despacho
                                          </td>
                                          <td className="pt-3 text-center bg-primary/5 font-mono font-black text-primary text-sm">
                                            {totalCalculatedPortions} porciones
                                          </td>
                                          <td colSpan={2} className="pt-3 text-right font-mono font-black text-foreground">
                                            Total: S/ {Number(order.total || 0).toFixed(2)}
                                          </td>
                                        </tr>
                                      </tfoot>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="text-muted-foreground text-xs italic flex items-center gap-2 py-4">
                                    <Receipt className="w-4 h-4 opacity-50" />
                                    No hay detalle de platillos registrado en esta orden.
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL DE FICHA DE RESERVA (CROSS-LINKING) */}
      {modalReservation && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2 text-primary font-black uppercase text-sm">
                <Calendar className="w-5 h-5" />
                <span>Detalle Completo de Reserva #{modalReservation.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setModalReservation(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ReservationDetailCard reservation={modalReservation} />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  handleReservationChange(modalReservation);
                  setModalReservation(null);
                }}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer shadow-xs"
              >
                Filtrar comanda por esta reserva
              </button>
              <button
                type="button"
                onClick={() => setModalReservation(null)}
                className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground text-xs font-bold transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL / VISTA IMPRIMIBLE: COMANDA PARA JEFE DE COCINA */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Cabecera del Modal (No se imprime) */}
            <div className="p-4 border-b border-border bg-muted/40 flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                  {isConsolidatedPrint
                    ? "Vista Previa: Comanda Consolidada de Cocina"
                    : `Vista Previa: Comanda de Producción #${printingOrder?.id}`}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-black uppercase hover:bg-primary/90 transition-all cursor-pointer shadow-md hover:shadow-primary/30"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Comanda</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenedor del documento imprimible */}
            <div className="p-6 overflow-y-auto flex-1 bg-white text-slate-900 dark:bg-card dark:text-card-foreground">
              <div
                id="kitchen-production-ticket"
                className="space-y-6 max-w-3xl mx-auto p-4 sm:p-6 bg-white text-slate-900 border border-slate-200 rounded-xl shadow-xs"
              >
                {/* Membrete Oficial de Cocina Central */}
                <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-slate-950 flex items-center gap-2">
                      COMANDA DE PRODUCCIÓN - COCINA CENTRAL
                    </h1>
                    <p className="text-xs uppercase font-bold text-slate-600 mt-0.5 tracking-wider">
                      Catering, Buffets & Eventos Gastronómicos Especiales
                    </p>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <p className="font-bold text-slate-900">
                      Fecha Impresión: {new Date().toLocaleDateString("es-PE")}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Hora: {new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>

                {/* Datos de Montaje y Despacho del Evento */}
                {!isConsolidatedPrint && printingOrder ? (
                  (() => {
                    const printRes = getLinkedReservation(printingOrder);
                    const safePax = Number(printRes?.guestsCount || printingOrder.guestsCount || 1) || 1;
                    const printEventDate = printRes?.eventDate || printingOrder.eventDate || "Por confirmar";
                    const printServiceTime = printRes?.serviceStartTime || printingOrder.serviceStartTime || "12:00 PM";
                    const printAddress = printRes?.venueAddress || printingOrder.shippingAddress || printingOrder.address || "Dirección no provista";
                    const printNotes = printRes?.notes || (printRes as any)?.additionalNotes || printingOrder.notes || "Sin especificaciones especiales.";

                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">N° Pedido</span>
                            <span className="font-mono font-black text-sm text-slate-900">#{printingOrder.id}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Reserva Vinculada</span>
                            <span className="font-mono font-bold text-slate-900">
                              {printRes?.id ? `#${printRes.id}` : "Venta Directa"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Fecha Evento</span>
                            <span className="font-bold text-slate-900">{formatDisplayDate(printEventDate)}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Hora Despacho</span>
                            <span className="font-bold text-slate-900">{printServiceTime}</span>
                          </div>

                          <div className="col-span-2">
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Cliente / Teléfono</span>
                            <span className="font-bold text-slate-900">
                              {printingOrder.fullName || printRes?.customerName || "Cliente"} ({printingOrder.phone || printRes?.phone || "S/T"})
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Destino de Montaje</span>
                            <span className="font-bold text-slate-900 truncate block">
                              {printAddress} ({printingOrder.city || printRes?.city || "Lima"})
                            </span>
                          </div>
                        </div>

                        {/* Banner de Invitados Asignados (PAX) */}
                        <div className="p-3 bg-slate-100 border-l-4 border-slate-900 rounded-r-lg flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-black tracking-wider text-slate-600 block">
                              Escala de Producción Asignada
                            </span>
                            <span className="text-xl font-black text-slate-950 font-mono">
                              {safePax} INVITADOS (PAX)
                            </span>
                          </div>
                          <div className="text-right text-xs text-slate-600 font-medium">
                            Multiplicador de Cocina: <strong>x{safePax} porciones base</strong>
                          </div>
                        </div>

                        {/* Notas e Indicaciones para el Chef */}
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                          <strong className="uppercase font-black text-[10px] tracking-wider block text-amber-950 mb-0.5">
                            Indicaciones Especiales y Requerimientos de Cocina:
                          </strong>
                          <p className="italic">{printNotes}</p>
                        </div>

                        {/* Tabla de Platillos y Porciones */}
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                            Lista Detallada de Producción de Platillos
                          </h4>
                          <table className="w-full text-left border-collapse text-xs border border-slate-300">
                            <thead>
                              <tr className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-300">
                                <th className="p-2 border-r border-slate-300">#</th>
                                <th className="p-2 border-r border-slate-300">Platillo / Preparación</th>
                                <th className="p-2 border-r border-slate-300">Categoría</th>
                                <th className="p-2 text-center border-r border-slate-300">Unid. Base</th>
                                <th className="p-2 text-center border-r border-slate-300">Escala PAX</th>
                                <th className="p-2 text-center font-black bg-slate-200 text-slate-900 border-r border-slate-300">
                                  TOTAL PORCIONES A PREPARAR
                                </th>
                                <th className="p-2 text-center">Pase Cocina</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {(printingOrder.items || []).map((item: any, idx: number) => {
                                const qty = Number(item.quantity || 1);
                                const totalP = qty * safePax;
                                return (
                                  <tr key={idx} className="hover:bg-slate-50">
                                    <td className="p-2 font-mono border-r border-slate-300 text-slate-500">
                                      {idx + 1}
                                    </td>
                                    <td className="p-2 font-bold text-slate-950 border-r border-slate-300">
                                      {item.name || "Plato sin nombre"}
                                    </td>
                                    <td className="p-2 border-r border-slate-300 text-slate-600">
                                      {item.category || "Principal"}
                                    </td>
                                    <td className="p-2 text-center font-mono border-r border-slate-300">
                                      x{qty}
                                    </td>
                                    <td className="p-2 text-center font-mono border-r border-slate-300 text-slate-600">
                                      × {safePax}
                                    </td>
                                    <td className="p-2 text-center font-mono font-black text-sm bg-slate-50 border-r border-slate-300 text-slate-950">
                                      {totalP} porciones
                                    </td>
                                    <td className="p-2 text-center">
                                      <span className="inline-block w-5 h-5 border border-slate-400 rounded-sm"></span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  /* VISTA CONSOLIDADA */
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">
                          Alcance del Reporte
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {selectedReservation
                            ? `Consolidado para Reserva #${selectedReservation.id} (${selectedReservation.guestsCount || 0} PAX)`
                            : `Consolidado Global: ${orders.length} pedidos seleccionados`}
                        </span>
                      </div>
                      <div className="text-right font-mono font-bold text-slate-900">
                        {consolidatedItems.reduce((acc, it) => acc + it.totalPortions, 0)} PORCIONES TOTALES
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                        Tabla Consolidada de Preparación en Cocina
                      </h4>
                      <table className="w-full text-left border-collapse text-xs border border-slate-300">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-300">
                            <th className="p-2 border-r border-slate-300">#</th>
                            <th className="p-2 border-r border-slate-300">Platillo / Receta</th>
                            <th className="p-2 border-r border-slate-300">Categoría</th>
                            <th className="p-2 text-center border-r border-slate-300">Órdenes</th>
                            <th className="p-2 text-center border-r border-slate-300">Unidades Base</th>
                            <th className="p-2 text-center font-black bg-slate-200 text-slate-900 border-r border-slate-300">
                              TOTAL PORCIONES A PRODUCIR
                            </th>
                            <th className="p-2 text-center">Check Jefe Cocina</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {consolidatedItems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2 font-mono border-r border-slate-300 text-slate-500">
                                {idx + 1}
                              </td>
                              <td className="p-2 font-bold text-slate-950 border-r border-slate-300">
                                {item.name}
                              </td>
                              <td className="p-2 border-r border-slate-300 text-slate-600">
                                {item.category}
                              </td>
                              <td className="p-2 text-center font-mono border-r border-slate-300">
                                {item.ordersCount}
                              </td>
                              <td className="p-2 text-center font-mono border-r border-slate-300">
                                x{item.baseUnits}
                              </td>
                              <td className="p-2 text-center font-mono font-black text-sm bg-slate-50 border-r border-slate-300 text-slate-950">
                                {item.totalPortions} porciones
                              </td>
                              <td className="p-2 text-center">
                                <span className="inline-block w-5 h-5 border border-slate-400 rounded-sm"></span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="border-t-2 border-slate-900 font-bold bg-slate-100 text-xs">
                          <tr>
                            <td colSpan={5} className="p-2 text-slate-700 uppercase">
                              Gran Total de Producción en Cocina Central:
                            </td>
                            <td className="p-2 text-center font-black text-slate-950 text-base font-mono">
                              {consolidatedItems.reduce((acc, it) => acc + it.totalPortions, 0)} porciones
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}

                {/* Bloque de Firmas de Validación Operativa */}
                <div className="pt-8 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-[10px] text-slate-600 uppercase font-bold">
                  <div className="space-y-12">
                    <div className="border-b border-slate-400 mx-4"></div>
                    <p>Jefe de Cocina Central<br /><span className="text-[9px] font-normal text-slate-500">Preparación & Calidad</span></p>
                  </div>
                  <div className="space-y-12">
                    <div className="border-b border-slate-400 mx-4"></div>
                    <p>Responsable de Empaque<br /><span className="text-[9px] font-normal text-slate-500">Control de Despacho</span></p>
                  </div>
                  <div className="space-y-12">
                    <div className="border-b border-slate-400 mx-4"></div>
                    <p>Chofer / Logística de Campo<br /><span className="text-[9px] font-normal text-slate-500">Entrega en Local</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
