// src/modules/admin/pedidos/components/AdminOrdersTable.tsx
import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "@/modules/admin/pedidos/services/order.service";
import OrderReservationFilter from "./OrderReservationFilter";
import ReservationDetailCard from "./ReservationDetailCard";

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadOrders = async (reservationId?: string | number) => {
    setLoading(true);
    try {
      const data = await getOrders(reservationId);
      
      // 👇 LOG AGREGADO: Espiando qué devuelve el endpoint de órdenes
      console.log("📦 DATA DE ÓRDENES RECIBIDA:", data);
      
      setOrders(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error(error);
      alert("Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const handleReservationChange = (reservation: any | null) => {
    // 👇 LOG AGREGADO: Espiando qué trae el objeto de la reserva
    console.log("🔍 DATA DE LA RESERVA SELECCIONADA:", reservation);
    
    setSelectedReservation(reservation);
    loadOrders(reservation?.id);
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

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="space-y-6 w-full max-w-full">
      
      {/* Encabezado */}
      <div className="p-6 rounded-xl border border-[#2a1f1a] bg-[#15100c] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-black text-yellow-500 uppercase tracking-wide">Gestión de Pedidos</h2>
          <p className="text-xs text-zinc-400 mt-1">Control logístico y despacho automatizado por órdenes vinculadas.</p>
        </div>
        <OrderReservationFilter onSelectReservation={handleReservationChange} />
      </div>

      {/* Tarjeta de Detalles de Reserva Activa */}
      {selectedReservation && (
        <ReservationDetailCard reservation={selectedReservation} />
      )}

      {/* Tabla Completa con las 12 Columnas Originales */}
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
              <thead className="bg-[#211814] text-xs uppercase text-zinc-400 font-bold white-space-nowrap">
                <tr>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">N° Pedido</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Nombre</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Correo</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Teléfono</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Ciudad</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Dirección</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Cód. Postal</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Fecha Evento</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Notas</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Total</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a]">Método Pago</th>
                  <th className="px-4 py-4 border-b border-[#2a1f1a] text-center">Estado</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#2a1f1a]/50 text-xs">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#211814] transition-colors border-b border-[#2a1f1a]/40">
                    <td className="px-4 py-4 font-mono text-yellow-500 font-black">#{order.id}</td>
                    
                    <td className="px-4 py-4 font-bold text-zinc-100">
                      {order.fullName || order.customerName || order.name || "Sin nombre"}
                    </td>
                    
                    <td className="px-4 py-4 text-zinc-400">
                      {order.email || order.customerEmail || "Sin correo"}
                    </td>
                    
                    <td className="px-4 py-4 text-zinc-300">
                      {order.phone || order.customerPhone || "Sin teléfono"}
                    </td>
                    
                    <td className="px-4 py-4 text-zinc-300">
                      {order.city || "Sin ciudad"}
                    </td>
                    
                    <td className="px-4 py-4 text-zinc-300 max-w-[150px] truncate" title={order.address || order.eventAddress}>
                      {order.address || order.eventAddress || "Sin dirección"}
                    </td>
                    
                    <td className="px-4 py-4 text-zinc-400">
                      {order.postalCode || "Sin código"}
                    </td>
                    
                    <td className="px-4 py-4 text-zinc-400">
                      {order.eventDate || "Sin fecha"}
                    </td>
                    
                    <td className="px-4 py-4 max-w-[150px] truncate text-zinc-400" title={order.notes || order.specialNotes}>
                      {order.notes || order.specialNotes || "Sin notas"}
                    </td>
                    
                    <td className="px-4 py-4 font-bold text-zinc-100">
                      S/ {Number(order.total || 0).toFixed(2)}
                    </td>
                    
                    <td className="px-4 py-4">
                      <span className="px-2 py-0.5 font-bold uppercase rounded bg-[#211814] text-zinc-400 border border-[#2a1f1a]">
                        {order.paymentMethod || "Sin método"}
                      </span>
                    </td>
                    
                    <td className="px-4 py-4 text-center">
                      <select
                        value={order.status || "Pendiente"}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-[#1a1410] border border-[#2a1f1a] text-zinc-200 text-xs font-bold rounded-md p-1.5 focus:ring-1 focus:ring-yellow-500 outline-none cursor-pointer transition-all hover:brightness-110"
                      >
                        <option value="Pendiente" className="bg-[#15100c]">Pendiente</option>
                        <option value="Confirmado" className="bg-[#15100c]">Confirmado</option>
                        <option value="Entregado" className="bg-[#15100c]">Entregado</option>
                        <option value="Cancelado" className="bg-[#15100c]">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}