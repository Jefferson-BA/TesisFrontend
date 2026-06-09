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
      console.log("📦 DATA DE ÓRDENES ACTUALIZADA:", data);
      const ordersList = Array.isArray(data) ? data : data.data || [];
      setOrders(ordersList);
    } catch (error) {
      console.error(error);
      alert("Error al cargar pedidos");
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
    if (s.includes("pend")) return "bg-amber-500/10 text-amber-500 border-amber-500/30";
    if (s.includes("conf") || s.includes("aprob")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (s.includes("entreg")) return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    if (s.includes("canc")) return "bg-rose-500/10 text-rose-500 border-rose-500/30";
    return "bg-zinc-800 text-zinc-300 border-zinc-700";
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="p-6 rounded-xl border border-[#2a1f1a] bg-[#15100c] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-black text-yellow-500 uppercase tracking-wide">Gestión de Pedidos</h2>
          <p className="text-xs text-zinc-400 mt-1">Control logístico y despacho automatizado por órdenes vinculadas.</p>
        </div>
        <OrderReservationFilter onSelectReservation={handleReservationChange} />
      </div>

      {selectedReservation && (
        <ReservationDetailCard reservation={selectedReservation} />
      )}

      <div className="rounded-xl border border-[#2a1f1a] bg-[#15100c] overflow-hidden shadow-xl">
        <div className="overflow-x-auto min-w-full block">
          {loading ? (
            <div className="p-12 text-center text-zinc-400 font-medium animate-pulse">
              Sincronizando flujos con la base de datos...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 font-medium">
              No se encontraron registros de órdenes en esta selección.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm text-zinc-300">
              <thead className="bg-[#211814] text-xs uppercase text-zinc-400 font-bold whitespace-nowrap">
                <tr>
                  <th className="px-4 py-4 border-b border-[#2a1f1a] w-10"></th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">N° Pedido</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Nombre</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Correo</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Teléfono</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Ciudad</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Dirección</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Fecha Evento</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Notas</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Total</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Método Pago</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a] text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a1f1a]/50 text-xs">
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
                        className={`transition-colors border-b border-[#2a1f1a]/40 cursor-pointer ${isExpanded ? "bg-[#1f1712]" : "hover:bg-[#211814]"}`}
                        onClick={() => toggleRow(order.id)}
                      >
                        <td className="px-4 py-4 text-zinc-500">
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-yellow-500" /> : <ChevronRight className="w-4 h-4" />}
                        </td>
                        <td className="px-4 py-4 font-mono text-yellow-500 font-black">#{order.id}</td>
                        <td className="px-4 py-4 font-bold text-zinc-100">{clientName}</td>
                        <td className="px-4 py-4 text-zinc-400 font-mono text-[11px]">{clientEmail}</td>
                        <td className="px-4 py-4 text-zinc-300 font-mono">{clientPhone}</td>
                        <td className="px-4 py-4 text-zinc-300 capitalize">{order.city || order.reservation?.city || "Lima"}</td>
                        <td className="px-4 py-4 text-zinc-300 max-w-[160px] truncate" title={order.shippingAddress || order.address}>
                          {cleanAddress || "Sin dirección"}
                        </td>
                        <td className="px-4 py-4 text-zinc-400 font-mono">
                          {order.eventDate || order.reservation?.eventDate || "Por confirmar"}
                        </td>
                        <td className="px-4 py-4 max-w-[140px] truncate text-zinc-400 italic" title={parsedNotes}>
                          {parsedNotes}
                        </td>
                        <td className="px-4 py-4 font-bold text-zinc-100 font-mono">
                          S/ {Number(order.total || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-0.5 font-bold uppercase rounded bg-[#1a1410] text-amber-500/90 border border-[#2a1f1a] text-[10px] tracking-wider">
                            {order.paymentMethod || "yape"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={order.status || "Pendiente"}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`border text-xs font-black rounded-md p-1.5 focus:ring-1 focus:ring-yellow-500 outline-none cursor-pointer transition-all hover:brightness-110 ${getStatusStyle(order.status)}`}
                          >
                            <option value="Pendiente" className="bg-[#15100c] text-amber-500">⏳ Pendiente</option>
                            <option value="Confirmado" className="bg-[#15100c] text-emerald-400">✅ Confirmado</option>
                            <option value="Entregado" className="bg-[#15100c] text-blue-400">🚚 Entregado</option>
                            <option value="Cancelado" className="bg-[#15100c] text-rose-500">❌ Cancelado</option>
                          </select>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-[#0f0b08] border-b border-[#2a1f1a]">
                          <td colSpan={12} className="p-6">
                            <div className="bg-[#15100c] rounded-xl border border-[#2a1f1a] p-5 shadow-inner">
                              <h4 className="text-yellow-500 text-xs font-black uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Utensils className="w-4 h-4" /> Resumen de Platos Solicitados
                              </h4>
                              {orderItems.length > 0 ? (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-left border-collapse">
                                    <thead className="border-b border-[#2a1f1a] text-[10px] uppercase text-zinc-500">
                                      <tr>
                                        <th className="pb-2 font-bold">Comida / Producto</th>
                                        <th className="pb-2 font-bold">Categoría</th>
                                        <th className="pb-2 font-bold text-center">Precio Unit.</th>
                                        <th className="pb-2 font-bold text-center">Unidades</th>
                                        <th className="pb-2 font-bold text-right">Subtotal</th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-xs text-zinc-300 divide-y divide-[#2a1f1a]/30">
                                      {orderItems.map((item: any, index: number) => {
                                        const itemName = item.name || "Plato sin nombre";
                                        const itemCategory = item.category || "Comida"; 
                                        const itemQty = item.quantity || 1;
                                        const itemPrice = Number(item.price || 0);
                                        const itemSubtotal = Number(item.subtotal || (itemQty * itemPrice));

                                        return (
                                          <tr key={item.id || index} className="hover:bg-[#1a1410] transition-colors">
                                            <td className="py-3 font-medium text-zinc-200">{itemName}</td>
                                            <td className="py-3 text-zinc-500">
                                              <span className="px-2 py-0.5 bg-[#211814] rounded-md text-[10px] border border-[#2a1f1a]">
                                                {itemCategory}
                                              </span>
                                            </td>
                                            <td className="py-3 text-center font-mono text-zinc-400">
                                              S/ {itemPrice.toFixed(2)}
                                            </td>
                                            <td className="py-3 text-center">
                                              <span className="font-bold text-yellow-500">x{itemQty}</span>
                                            </td>
                                            <td className="py-3 text-right font-mono font-bold text-emerald-400/90">
                                              S/ {itemSubtotal.toFixed(2)}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="text-zinc-500 text-xs italic flex items-center gap-2 py-2">
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