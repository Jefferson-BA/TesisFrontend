import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getReservations, updateReservation, deleteReservation } from "@/modules/admin/services/reservation.service";
import type { Reservation } from "@/modules/admin/interfaces/reservation.interface";

export default function ReservationsAdmin() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await getReservations();
      const resArray = Array.isArray(data) ? data : data.data || [];
      setReservations(resArray);
      
      // 🕵️‍♂️ ESTE LOG NOS DIRÁ CÓMO VIENE EL TELÉFONO REALMENTE
      console.log("Datos que llegan del backend:", resArray);
    } catch (error) {
      console.error("Error cargando reservas:", error);
      toast.error("No se pudieron cargar las reservas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // Enviamos el nuevo estado (ahora en MAYÚSCULAS para evitar el error 500)
      await updateReservation(id, { status: newStatus });
      toast.success(`Estado actualizado a ${newStatus}`);
      fetchReservations(); 
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast.error("El backend rechazó el estado (Error 500).");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar esta reserva? Esta acción no se puede deshacer.")) return;
    try {
      await deleteReservation(id);
      toast.success("Reserva eliminada correctamente");
      fetchReservations();
    } catch (error) {
      toast.error("No se pudo eliminar la reserva");
    }
  };

  const handleEdit = (id: string) => toast.info(`Modal para editar en construcción 🛠️`);
  const handleViewDetails = (id: string) => toast.info(`Modal de detalles en construcción 🛠️`);
  
  const handleViewOrder = (orderId?: string) => {
    if (orderId) toast.info(`ID del pedido: ${orderId}`);
    else toast.error("Esta reserva no tiene pedido asociado.");
  };

  if (isLoading) return <div className="p-8 text-zinc-400 flex justify-center items-center h-40">Cargando reservas...</div>;

  return (
    <div className="bg-[#15100c] rounded-xl border border-[#2a1f1a] overflow-hidden shadow-xl">
      <div className="p-6 border-b border-[#2a1f1a] flex justify-between items-center bg-[#1a1410]">
        <h2 className="text-xl font-black text-yellow-500 uppercase tracking-wide">Gestión de Reservas</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-[#211814] text-xs uppercase text-zinc-400 font-bold">
            <tr>
              <th className="px-6 py-5 border-b border-[#2a1f1a]">Fecha / Hora</th>
              <th className="px-6 py-5 border-b border-[#2a1f1a]">Lugar e Invitados</th>
              <th className="px-6 py-5 border-b border-[#2a1f1a] text-center">Estado</th>
              <th className="px-6 py-5 border-b border-[#2a1f1a] text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                  No hay reservas registradas aún.
                </td>
              </tr>
            ) : (
              reservations.map((res) => (
                <tr key={res.id} className="hover:bg-[#211814] transition-colors border-b border-[#2a1f1a] group">
                  <td className="px-6 py-4 align-middle">
                    <div className="font-bold text-zinc-100 text-base">
                      {new Date(res.eventDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {res.serviceStartTime}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 align-middle">
                    <div className="font-medium text-zinc-200 block max-w-[220px] truncate">
                      {res.city} - {res.venueAddress}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      {res.guestsCount} personas
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 align-middle text-center">
                    <select 
                      className={`text-xs font-bold rounded-md px-3 py-1.5 outline-none border border-transparent cursor-pointer transition-all hover:brightness-110 ${
                        res.status === 'PENDING' || res.status === 'pending_review' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        res.status === 'APPROVED' || res.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        res.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        res.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-zinc-800 text-zinc-300'
                      }`}
                      value={res.status}
                      onChange={(e) => handleStatusChange(res.id, e.target.value)}
                    >
                      {/* Aquí usamos valores en MAYÚSCULAS como suele exigir el backend */}
                      <option value="PENDING" className="bg-zinc-900 text-zinc-100">Pendiente</option>
                      <option value="APPROVED" className="bg-zinc-900 text-zinc-100">Aprobar</option>
                      <option value="COMPLETED" className="bg-zinc-900 text-zinc-100">Completar</option>
                      <option value="CANCELLED" className="bg-zinc-900 text-zinc-100">Cancelar</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 align-middle">
                    {/* Botones ahora más interactivos, centrados y con fondo al pasar el mouse */}
                    <div className="flex justify-center items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      
                      <button onClick={() => handleViewDetails(res.id)} title="Ver platos y notas" className="p-2 rounded-md text-zinc-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      
                      <button onClick={() => handleViewOrder(res.order?.id)} title="Ver pedido en tienda" className="p-2 rounded-md text-zinc-400 hover:text-purple-400 hover:bg-purple-400/10 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                      </button>

                      <a href={res.user?.phone ? `tel:${res.user.phone}` : '#'} 
                         onClick={(e) => !res.user?.phone && e.preventDefault()}
                         title={res.user?.phone ? `Llamar a ${res.user.phone}` : "No hay teléfono registrado"} 
                         className={`p-2 rounded-md transition-all ${res.user?.phone ? 'text-zinc-400 hover:text-emerald-400 hover:bg-emerald-400/10' : 'text-zinc-700 cursor-not-allowed'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </a>

                      <button onClick={() => handleEdit(res.id)} title="Editar reserva" className="p-2 rounded-md text-zinc-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      </button>

                      <button onClick={() => handleDelete(res.id)} title="Eliminar definitivamente" className="p-2 rounded-md text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}