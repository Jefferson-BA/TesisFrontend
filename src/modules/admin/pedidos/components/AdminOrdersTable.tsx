// src/modules/admin/pedidos/components/AdminOrdersTable.tsx
import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "@/modules/admin/pedidos/services/order.service";
import OrderReservationFilter from "./OrderReservationFilter";
import ReservationDetailCard from "./ReservationDetailCard";
import { 
  ShoppingBag, User, MapPin, Calendar, CreditCard, 
  Layers, Loader2, ClipboardX, CheckCircle, Clock, Truck, XCircle 
} from "lucide-react";

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadOrders = async (reservationId?: string | number) => {
    setLoading(true);
    try {
      const data = await getOrders(reservationId);
      setOrders(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReservationChange = (reservation: any | null) => {
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

  // Función auxiliar para renderizar los Badges de Estado Premium
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmado":
        return { bg: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: <CheckCircle className="w-3 h-3" /> };
      case "entregado":
        return { bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: <Truck className="w-3 h-3" /> };
      case "cancelado":
        return { bg: "bg-rose-500/10 text-rose-400 border-rose-500/20", icon: <XCircle className="w-3 h-3" /> };
      default: // Pendiente
        return { bg: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: <Clock className="w-3 h-3" /> };
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full relative">
      {/* Luces de fondo decorativas */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* --- ENCABEZADO DE CONTROL --- */}
      <div className="p-6 rounded-2xl border border-zinc-900 bg-gradient-to-r from-[#110c0a] to-[#090605] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-zinc-100 tracking-wide">Panel de Despacho</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Control logístico y trazabilidad de catering en tiempo real.</p>
          </div>
        </div>
        <div className="bg-[#0e0a08] p-1 rounded-xl border border-zinc-800/60">
          <OrderReservationFilter onSelectReservation={handleReservationChange} />
        </div>
      </div>

      {/* --- DETALLES DE RESERVA --- */}
      {selectedReservation && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <ReservationDetailCard reservation={selectedReservation} />
        </div>
      )}

      {/* --- TABLA DE PEDIDOS ESTILIZADA --- */}
      <div className="rounded-2xl border border-zinc-900 bg-gradient-to-b from-[#110c0a] to-[#090605] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
        <div className="overflow-x-auto min-w-full block">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Sincronizando Órdenes...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center text-center space-y-3">
              <ClipboardX className="w-8 h-8 text-zinc-700" />
              <p className="text-sm text-zinc-400 font-medium">No se encontraron registros de órdenes.</p>
              <p className="text-xs text-zinc-600 max-w-xs">Prueba seleccionando otro filtro o agrega una nueva reserva al sistema.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs text-zinc-300">
              <thead className="bg-[#070504] text-[10px] uppercase text-zinc-500 tracking-widest font-black border-b border-zinc-900">
                <tr>
                  <th className="px-5 py-4 font-bold">ID</th>
                  <th className="px-5 py-4 font-bold flex items-center gap-2"><User className="w-3 h-3" /> Cliente</th>
                  <th className="px-5 py-4 font-bold"><MapPin className="w-3 h-3 inline mr-1" /> Logística de Entrega</th>
                  <th className="px-5 py-4 font-bold"><Calendar className="w-3 h-3 inline mr-1" /> Evento</th>
                  <th className="px-5 py-4 font-bold text-right"><CreditCard className="w-3 h-3 inline mr-1" /> Inversión</th>
                  <th className="px-5 py-4 font-bold text-center"><Layers className="w-3 h-3 inline mr-1" /> Estado Logístico</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-900/60">
                {orders.map((order) => {
                  const statusInfo = getStatusStyle(order.status || "Pendiente");
                  return (
                    <tr key={order.id} className="hover:bg-zinc-900/30 transition-all duration-200 group">
                      {/* ID Omitido en Mono */}
                      <td className="px-5 py-4 font-mono text-yellow-500/80 font-black tracking-wider">
                        #{order.id}
                      </td>
                      
                      {/* Cliente (Información Unificada Verticalmente) */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-bold text-zinc-200 text-sm group-hover:text-yellow-500 transition-colors">
                          {order.fullName || order.customerName || order.name || "Sin nombre"}
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">{order.email || order.customerEmail || "Sin correo"}</div>
                        <div className="text-[10px] text-zinc-600 font-medium mt-0.5">{order.phone || order.customerPhone || "Sin teléfono"}</div>
                      </td>
                      
                      {/* Logística (Direcciones Compactas con Tooltip nativo) */}
                      <td className="px-5 py-4 max-w-[220px]">
                        <div className="text-zinc-300 font-medium truncate" title={order.address || order.eventAddress}>
                          {order.address || order.eventAddress || "Sin dirección"}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1.5">
                          <span className="bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-400 font-bold uppercase tracking-wide border border-zinc-800/60">
                            {order.city || "Lima"}
                          </span>
                          {order.postalCode && <span className="text-zinc-600">CP: {order.postalCode}</span>}
                        </div>
                      </td>
                      
                      {/* Fecha y Notas */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-semibold text-zinc-300">{order.eventDate || "Fecha no fijada"}</div>
                        {order.notes || order.specialNotes ? (
                          <p className="text-[11px] text-amber-600/70 italic mt-1 max-w-[140px] truncate" title={order.notes || order.specialNotes}>
                            📝 {order.notes || order.specialNotes}
                          </p>
                        ) : (
                          <span className="text-[10px] text-zinc-600 italic mt-1 block">Sin observaciones</span>
                        )}
                      </td>
                      
                      {/* Total Financiero y Método */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="text-sm font-black text-zinc-100 font-mono">
                          S/ {Number(order.total || 0).toFixed(2)}
                        </div>
                        <span className="inline-block text-[9px] font-black uppercase tracking-wider text-zinc-500 bg-zinc-950/80 px-1.5 py-0.5 rounded border border-zinc-900 mt-1">
                          {order.paymentMethod || "Garantía"}
                        </span>
                      </td>
                      
                      {/* Control de Estado Custom Integrado en Badge */}
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        <div className="relative inline-block text-left">
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-bold uppercase text-[10px] tracking-wider transition-all bg-[#0e0a08] ${statusInfo.bg}`}>
                            {statusInfo.icon}
                            <select
                              value={order.status || "Pendiente"}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="bg-transparent text-current font-bold outline-none cursor-pointer pr-1 appearance-none webkit-appearance-none focus:ring-0 border-none p-0"
                            >
                              <option value="Pendiente" className="bg-[#0e0a08] text-zinc-300">Pendiente</option>
                              <option value="Confirmado" className="bg-[#0e0a08] text-zinc-300">Confirmado</option>
                              <option value="Entregado" className="bg-[#0e0a08] text-zinc-300">Entregado</option>
                              <option value="Cancelado" className="bg-[#0e0a08] text-zinc-300">Cancelado</option>
                            </select>
                            <span className="text-[8px] opacity-60 ml-0.5">▼</span>
                          </div>
                        </div>
                      </td>
                    </tr>
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