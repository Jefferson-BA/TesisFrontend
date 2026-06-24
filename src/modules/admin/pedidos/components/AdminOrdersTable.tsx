import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "@/modules/admin/pedidos/services/order.service";
import OrderReservationFilter from "./OrderReservationFilter";
import ReservationDetailCard from "./ReservationDetailCard";
import { ChevronDown, ChevronRight, Utensils, Receipt } from "lucide-react";

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | number | null>(null);

  const loadOrders = async (reservationId?: string | number) => {
    setLoading(true);
    try {
      const data = await getOrders(reservationId);
      const ordersList = Array.isArray(data) ? data : data.data || [];
      setOrders(ordersList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reservationId = params.get("reservationId");
    if (reservationId) {
      loadOrders(reservationId);
    } else {
      loadOrders();
    }
  }, []);

  const handleReservationChange = (reservation: any | null) => {
    setSelectedReservation(reservation);
    loadOrders(reservation?.id);
    setExpandedOrderId(null);
  };

  const handleStatusChange = async (orderId: string | number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el estado del pedido");
    }
  };

  const toggleRow = (orderId: string | number) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase() || "pendiente";
    if (s.includes("pend")) return "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/30";
    if (s.includes("conf") || s.includes("aprob")) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    if (s.includes("entreg")) return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
    if (s.includes("canc")) return "bg-rose-500/10 text-rose-600 dark:text-rose-500 border-rose-500/30";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="p-6 rounded-xl border border-border bg-card flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl transition-colors">
        <div>
          <h2 className="text-xl font-black text-primary uppercase tracking-wide">Gestión de Pedidos</h2>
          <p className="text-xs text-muted-foreground mt-1">Control logístico y despacho automatizado por órdenes vinculadas.</p>
        </div>
        <div className="bg-[#0e0a08] p-1 rounded-xl border border-zinc-800/60">
          <OrderReservationFilter onSelectReservation={handleReservationChange} />
        </div>
      </div>

      {selectedReservation && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <ReservationDetailCard reservation={selectedReservation} />
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xl transition-colors">
        <div className="overflow-x-auto min-w-full block">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground font-medium animate-pulse">
              Sincronizando flujos con la base de datos...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground font-medium">
              No se encontraron registros de órdenes en esta selección.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm text-foreground">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-bold whitespace-nowrap border-b border-border">
                <tr>
                  <th className="px-4 py-4 w-10"></th>
                  <th className="px-4 py-4">N° Pedido</th>
                  <th className="px-4 py-4">Nombre</th>
                  <th className="px-4 py-4">Correo</th>
                  <th className="px-4 py-4">Teléfono</th>
                  <th className="px-4 py-4">Ciudad</th>
                  <th className="px-4 py-4">Dirección</th>
                  <th className="px-4 py-4">Fecha Evento</th>
                  <th className="px-4 py-4">Notas</th>
                  <th className="px-4 py-4">Total</th>
                  <th className="px-4 py-4">Método Pago</th>
                  <th className="px-4 py-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {orders.map((order) => {
                  const userRel = order.reservation?.user || {};
                  const clientName = order.fullName || order.customerName || userRel.name || "Jefferson";
                  const clientEmail = order.email || order.customerEmail || userRel.email || "jeffeson123xd@gmail.com";
                  const rawPhone = order.phone || order.customerPhone || userRel.phone;
                  const clientPhone = rawPhone && rawPhone !== "No disponible" ? rawPhone : "123123123";

                  const hasAddressPipe = order.shippingAddress?.includes("|");
                  const cleanAddress = hasAddressPipe ? order.shippingAddress.split(" | ")[0] : (order.address || order.shippingAddress);
                  const parsedNotes = hasAddressPipe && order.shippingAddress.includes("Notas:")
                    ? order.shippingAddress.split("Notas: ")[1]
                    : (order.notes || "Sin notas");

                  const isExpanded = expandedOrderId === order.id;
                  const orderItems = order.items || [];

                  return (
                    <React.Fragment key={order.id}>
                      <tr
                        className={`transition-colors cursor-pointer ${isExpanded ? "bg-muted/30" : "hover:bg-muted/50"}`}
                        onClick={() => toggleRow(order.id)}
                      >
                        <td className="px-4 py-4 text-muted-foreground">
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-primary" /> : <ChevronRight className="w-4 h-4" />}
                        </td>
                        <td className="px-4 py-4 font-mono text-primary font-black">#{order.id}</td>
                        <td className="px-4 py-4 font-bold text-foreground">{clientName}</td>
                        <td className="px-4 py-4 text-muted-foreground font-mono text-[11px]">{clientEmail}</td>
                        <td className="px-4 py-4 text-foreground font-mono">{clientPhone}</td>
                        <td className="px-4 py-4 text-foreground capitalize">{order.city || order.reservation?.city || "Lima"}</td>
                        <td className="px-4 py-4 text-foreground max-w-[160px] truncate" title={order.shippingAddress || order.address}>
                          {cleanAddress || "Sin dirección"}
                        </td>
                        <td className="px-4 py-4 text-muted-foreground font-mono">
                          {order.eventDate || order.reservation?.eventDate || "Por confirmar"}
                        </td>
                        <td className="px-4 py-4 max-w-[140px] truncate text-muted-foreground italic" title={parsedNotes}>
                          {parsedNotes}
                        </td>
                        <td className="px-4 py-4 font-bold text-foreground font-mono">
                          S/ {Number(order.total || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-0.5 font-bold uppercase rounded bg-muted text-primary border border-border text-[10px] tracking-wider">
                            {order.paymentMethod || "yape"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={order.status?.toUpperCase() || "PENDIENTE"}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`border text-xs font-black rounded-md p-1.5 focus:ring-1 focus:ring-ring outline-none cursor-pointer transition-all hover:brightness-110 ${getStatusStyle(order.status)}`}
                          >
                            <option value="PENDIENTE" className="bg-background text-amber-500">Pendiente</option>
                            <option value="APROBADA" className="bg-background text-blue-500">Aprobada (Lista para pago)</option>
                            <option value="PAGADA" className="bg-background text-emerald-500">Pagada</option>
                            <option value="CANCELADA" className="bg-background text-rose-500">Cancelada</option>
                          </select>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-muted/10 border-b border-border">
                          <td colSpan={12} className="p-6">
                            <div className="bg-card rounded-xl border border-border p-5 shadow-inner">
                              <h4 className="text-primary text-xs font-black uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Utensils className="w-4 h-4" /> Resumen de Platos Solicitados
                              </h4>
                              {orderItems.length > 0 ? (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-left border-collapse">
                                    <thead className="border-b border-border text-[10px] uppercase text-muted-foreground">
                                      <tr>
                                        <th className="pb-2 font-bold">Comida / Producto</th>
                                        <th className="pb-2 font-bold">Categoría</th>
                                        <th className="pb-2 font-bold text-center">Precio Unit.</th>
                                        <th className="pb-2 font-bold text-center">Unidades</th>
                                        <th className="pb-2 font-bold text-right">Subtotal</th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-xs text-foreground divide-y divide-border/50">
                                      {orderItems.map((item: any, index: number) => {
                                        const itemName = item.name || "Plato sin nombre";
                                        const itemCategory = item.category || "Comida";
                                        const itemQty = item.quantity || 1;
                                        const itemPrice = Number(item.price || 0);
                                        const itemSubtotal = Number(item.subtotal || (itemQty * itemPrice));

                                        return (
                                          <tr key={item.id || index} className="hover:bg-muted/50 transition-colors">
                                            <td className="py-3 font-medium">{itemName}</td>
                                            <td className="py-3">
                                              <span className="px-2 py-0.5 bg-muted rounded-md text-[10px] border border-border text-muted-foreground">
                                                {itemCategory}
                                              </span>
                                            </td>
                                            <td className="py-3 text-center font-mono text-muted-foreground">
                                              S/ {itemPrice.toFixed(2)}
                                            </td>
                                            <td className="py-3 text-center">
                                              <span className="font-bold text-primary">x{itemQty}</span>
                                            </td>
                                            <td className="py-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                              S/ {itemSubtotal.toFixed(2)}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="text-muted-foreground text-xs italic flex items-center gap-2 py-2">
                                  <Receipt className="w-4 h-4 opacity-50" />
                                  No hay detalle de productos registrado en esta orden.
                                </div>
                              )}
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
    </div>
  );
}