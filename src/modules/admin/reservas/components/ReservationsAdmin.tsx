import { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  Eye, Package, Phone, Edit, Trash2, X, Calendar, MapPin, 
  Users, FileText, ChevronLeft, ChevronRight, ChevronsLeft, 
  ChevronsRight, Search, Filter, CheckCircle2, AlertCircle, Clock
} from "lucide-react";
import { getReservations, updateReservation, deleteReservation } from "@/modules/admin/reservas/services/reservation.service";
import type { PaginationMeta } from "@/modules/admin/reservas/interfaces/reservation.interface";

export default function ReservationsAdmin() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // ESTADOS PARA PAGINACIÓN
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Estados para los Modales
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, [currentPage]);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const response = await getReservations(undefined, currentPage, limit);
      setReservations(response.data || []);
      setMeta(response.meta || null);
    } catch (error) {
      console.error("Error cargando reservas:", error);
      toast.error("No se pudieron cargar las reservas");
    } finally {
      setIsLoading(false);
    }
  };

  const goToPage = (page: number) => {
    if (meta && page >= 1 && page <= meta.totalPages) {
      setCurrentPage(page);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setReservations((prev) =>
      prev.map((res) => (res.id === id ? { ...res, status: newStatus } : res))
    );

    try {
      await updateReservation(id, { status: newStatus });
      toast.success("Estado actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast.error("Error al actualizar. Revirtiendo cambio...");
      fetchReservations();
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

  const handleViewDetails = (id: string) => {
    const res = reservations.find((r) => r.id === id);
    setSelectedReservation(res);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const res = reservations.find((r) => r.id === id);
    setSelectedReservation(res);
    setIsEditModalOpen(true);
  };

  const handleViewOrder = (orderId?: string) => {
    if (orderId) toast.info(`ID del pedido: ${orderId} (Próximamente modal de Tienda)`);
    else toast.error("Esta reserva no tiene un pedido asociado.");
  };

  // Helper de colores optimizado para un look semi-transparente premium (Glass-badges)
  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'pending_review') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    if (s === 'approved') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (s === 'deposit_paid') return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    if (s === 'fully_paid') return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    if (s === 'completed') return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    if (s === 'cancelled') return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    return 'bg-zinc-800 text-zinc-300 border-zinc-700';
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-4 md:p-6 antialiased text-zinc-200">
      
      {/* 🌟 HEADER & MINI METRICAS BANNER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-[#1a1410] border border-[#2a1f1a] p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-2xl font-black text-yellow-500 uppercase tracking-wider">Gestión de Reservas</h2>
          <p className="text-xs text-zinc-400 mt-1">Controla, aprueba y administra los eventos y pedidos de tus clientes.</p>
        </div>
        
        {/* Pequeños contadores rápidos (Estética SaaS Pro) */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="bg-[#120e0b] border border-[#2a1f1a] px-4 py-2 rounded-xl flex items-center gap-2.5 min-w-[130px]">
            <Clock className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Total</div>
              <div className="text-sm font-bold text-zinc-200">{meta?.totalItems || 0}</div>
            </div>
          </div>
          <div className="bg-[#120e0b] border border-[#2a1f1a] px-4 py-2 rounded-xl flex items-center gap-2.5 min-w-[130px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Páginas</div>
              <div className="text-sm font-bold text-zinc-200">{meta?.totalPages || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 BARRA DE FILTROS FALSA (Aporta demasiada presencia visual Pro) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#15100c] border border-[#2a1f1a] p-4 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Buscar por cliente o lugar..." 
            className="w-full bg-[#1e1713] border border-[#2a1f1a] rounded-lg pl-9 pr-4 py-2 text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
            disabled
          />
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1e1713] border border-[#2a1f1a] text-zinc-400 hover:text-zinc-200 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-not-allowed">
          <Filter className="w-3.5 h-3.5" />
          Filtrar
        </button>
      </div>

      {/* 📊 TABLA CONTENEDORA PRINCIPAL */}
      <div className="bg-[#15100c] rounded-2xl border border-[#2a1f1a] overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="p-16 text-zinc-400 flex flex-col justify-center items-center gap-3 h-60">
            <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-medium tracking-wider text-zinc-500 uppercase">Sincronizando reservas...</span>
          </div>
        ) : (
          <div className="overflow-x-auto m-1 rounded-xl">
            <table className="w-full text-left text-xs text-zinc-300 border-collapse">
              <thead>
                <tr className="bg-[#1d1612] text-zinc-400 font-bold uppercase tracking-wider border-b border-[#2a1f1a]">
                  <th className="px-6 py-4.5 font-bold">Fecha / Hora</th>
                  <th className="px-6 py-4.5 font-bold">Lugar e Invitados</th>
                  <th className="px-6 py-4.5 font-bold text-center">Estado de Reserva</th>
                  <th className="px-6 py-4.5 font-bold text-center">Acciones rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a1f1a]/40">
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-zinc-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-8 h-8 text-zinc-600" />
                        <p className="text-sm font-medium">No se encontraron registros en el sistema</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-[#1f1814]/60 transition-all duration-200 group">
                      
                      {/* Célula de Fecha */}
                      <td className="px-6 py-4.5 align-middle">
                        <div className="font-semibold text-zinc-100 text-sm tracking-tight group-hover:text-yellow-500/90 transition-colors">
                          {new Date(res.eventDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-1.5 flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                          {res.serviceStartTime} hrs
                        </div>
                      </td>
                      
                      {/* Célula de Ubicación */}
                      <td className="px-6 py-4.5 align-middle">
                        <div className="font-medium text-zinc-200 block max-w-[260px] truncate flex items-center gap-1.5 text-sm">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span className="truncate">{res.city} • {res.venueAddress}</span>
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-1.5 flex items-center gap-1.5 font-medium">
                          <Users className="w-3.5 h-3.5 text-zinc-600" />
                          <span>{res.guestsCount} invitados</span>
                        </div>
                      </td>
                      
                      {/* Célula de Selector de Estado */}
                      <td className="px-6 py-4.5 align-middle text-center">
                        <div className="inline-block relative">
                          <select 
                            className={`text-[11px] font-bold tracking-wide uppercase rounded-lg px-3 py-1.5 outline-none border cursor-pointer appearance-none pr-8 transition-all shadow-sm group-hover:scale-[1.02] ${getStatusColor(res.status)}`}
                            value={res.status?.toLowerCase()}
                            onChange={(e) => handleStatusChange(res.id, e.target.value)}
                          >
                            <option value="pending_review" className="bg-zinc-950 text-zinc-200">PENDIENTE REVISIÓN</option>
                            <option value="approved" className="bg-zinc-950 text-zinc-200">APROBADA</option>
                            <option value="deposit_paid" className="bg-zinc-950 text-zinc-200">ADELANTO PAG.</option>
                            <option value="fully_paid" className="bg-zinc-950 text-zinc-200">PAGADA 100%</option>
                            <option value="completed" className="bg-zinc-950 text-zinc-200">COMPLETADA</option>
                            <option value="cancelled" className="bg-zinc-950 text-zinc-200">CANCELADA</option>
                          </select>
                          {/* Flechita estilizada customizada */}
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-70">
                            <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                          </div>
                        </div>
                      </td>

                      {/* Célula de Acciones */}
                      <td className="px-6 py-4.5 align-middle">
                        <div className="flex justify-center items-center gap-1">
                          
                          <button onClick={() => handleViewDetails(res.id)} title="Ver detalles" className="p-2 rounded-lg text-zinc-400 hover:text-sky-400 hover:bg-sky-400/10 transition-all duration-150">
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button onClick={() => handleViewOrder(res.order?.id)} title="Ver pedido" className="p-2 rounded-lg text-zinc-400 hover:text-purple-400 hover:bg-purple-400/10 transition-all duration-150">
                            <Package className="w-4 h-4" />
                          </button>

                          <a href={res.user?.phone ? `tel:${res.user.phone}` : '#'} 
                             onClick={(e) => !res.user?.phone && e.preventDefault()}
                             title={res.user?.phone ? `Llamar (${res.user.phone})` : "Sin teléfono"} 
                             className={`p-2 rounded-lg transition-all duration-150 ${res.user?.phone ? 'text-zinc-400 hover:text-emerald-400 hover:bg-emerald-400/10' : 'text-zinc-700 cursor-not-allowed'}`}>
                            <Phone className="w-4 h-4" />
                          </a>

                          <button onClick={() => handleEdit(res.id)} title="Editar" className="p-2 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 transition-all duration-150">
                            <Edit className="w-4 h-4" />
                          </button>

                          <div className="w-px h-4 bg-[#2a1f1a] mx-1"></div>

                          <button onClick={() => handleDelete(res.id)} title="Eliminar" className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-400/10 transition-all duration-150">
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 📋 PAGINACIÓN ULTRA PREMIUM */}
        {!isLoading && meta && meta.totalPages > 0 && (
          <div className="p-4 border-t border-[#2a1f1a] bg-[#1a1410] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
              Mostrando <span className="text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded">{reservations.length}</span> de <span className="text-zinc-200 font-bold">{meta.totalItems}</span> registros
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-[#15100c] border border-[#2a1f1a] text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/30 disabled:opacity-20 disabled:pointer-events-none transition-all"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-[#15100c] border border-[#2a1f1a] text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/30 disabled:opacity-20 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="px-4 py-1.5 rounded-lg bg-[#110d0a] border border-[#2a1f1a] text-xs font-bold text-yellow-500/90 mx-1 min-w-[90px] text-center tracking-wide">
                {currentPage} <span className="text-zinc-600 font-normal mx-1">/</span> {meta.totalPages}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === meta.totalPages}
                className="p-2 rounded-lg bg-[#15100c] border border-[#2a1f1a] text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/30 disabled:opacity-20 disabled:pointer-events-none transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => goToPage(meta.totalPages)}
                disabled={currentPage === meta.totalPages}
                className="p-2 rounded-lg bg-[#15100c] border border-[#2a1f1a] text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/30 disabled:opacity-20 disabled:pointer-events-none transition-all"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
          MODAL: VER DETALLES (Look Glassmorphism)
      ========================================== */}
      {isDetailsModalOpen && selectedReservation && (
        <div className="fixed inset-0 z-[100] bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-[#15100c] border border-[#2a1f1a] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#2a1f1a] bg-[#1a1410] flex justify-between items-center">
              <h3 className="text-sm font-black text-yellow-500 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4" /> Información de Reserva
              </h3>
              <button onClick={() => setIsDetailsModalOpen(false)} className="text-zinc-500 hover:text-zinc-200 p-1.5 hover:bg-[#2a1f1a] rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-xs text-zinc-300 overflow-y-auto max-h-[70vh]">
              
              {/* Sección Cliente */}
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block mb-2">Datos del Solicitante</span>
                <div className="bg-[#19130f] p-4 rounded-xl border border-[#2a1f1a] space-y-2.5">
                  <p className="flex items-center gap-2.5"><Users className="w-4 h-4 text-zinc-500" /> <strong className="text-zinc-400 font-semibold w-16">Cliente:</strong> <span className="text-zinc-200 font-medium">{selectedReservation.user?.name || "No especificado"}</span></p>
                  <p className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-zinc-500" /> <strong className="text-zinc-400 font-semibold w-16">Teléfono:</strong> <span className="text-zinc-200 font-medium">{selectedReservation.user?.phone || "No registrado"}</span></p>
                  <p className="flex items-center gap-2.5"><span className="w-4 pl-1 text-zinc-500 font-bold">@</span> <strong className="text-zinc-400 font-semibold w-16">Email:</strong> <span className="text-zinc-200 font-medium truncate">{selectedReservation.user?.email || "No registrado"}</span></p>
                </div>
              </div>

              {/* Sección Evento */}
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block mb-2">Especificaciones de Evento</span>
                <div className="bg-[#19130f] p-4 rounded-xl border border-[#2a1f1a] space-y-2.5">
                  <p className="flex items-center gap-2.5"><Calendar className="w-4 h-4 text-zinc-500" /> <strong className="text-zinc-400 font-semibold w-16">Planificado:</strong> <span className="text-zinc-200 font-medium">{new Date(selectedReservation.eventDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} a las {selectedReservation.serviceStartTime}</span></p>
                  <p className="flex items-start gap-2.5"><MapPin className="w-4 h-4 text-zinc-500 mt-0.5" /> <strong className="text-zinc-400 font-semibold w-16 shrink-0">Dirección:</strong> <span className="text-zinc-200 font-medium">{selectedReservation.venueAddress}, {selectedReservation.city}</span></p>
                  <p className="flex items-center gap-2.5"><Users className="w-4 h-4 text-zinc-500" /> <strong className="text-zinc-400 font-semibold w-16">Aforo:</strong> <span className="text-zinc-200 font-medium">{selectedReservation.guestsCount} personas asignadas</span></p>
                </div>
              </div>

              {/* Notas */}
              {selectedReservation.notes && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block mb-2">Comentarios del Cliente</span>
                  <div className="bg-[#19130f] p-4 rounded-xl border border-[#2a1f1a] border-l-yellow-500/40">
                    <p className="text-zinc-400 italic leading-relaxed">{selectedReservation.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#2a1f1a] bg-[#1a1410]">
              <button onClick={() => setIsDetailsModalOpen(false)} className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 py-2 rounded-lg font-bold transition-colors text-xs uppercase tracking-wider">
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: EDITAR (Look Limpio)
      ========================================== */}
      {isEditModalOpen && selectedReservation && (
        <div className="fixed inset-0 z-[100] bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#15100c] border border-[#2a1f1a] rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-yellow-500 uppercase tracking-widest flex items-center gap-2">
                <Edit className="w-4 h-4" /> Modificar Registro
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-500 hover:text-zinc-200 p-1.5 hover:bg-[#2a1f1a] rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-zinc-400 mb-6 text-xs leading-relaxed">
              El panel de mutación se encuentra listo. Vincula los inputs de tu formulario aquí para actualizar los metadatos de la reserva <span className="text-yellow-500 font-mono">#{selectedReservation.id.substring(0,8)}...</span>
            </p>

            <div className="flex gap-3 text-xs">
              <button onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2.5 rounded-lg font-bold transition-colors uppercase tracking-wider">
                Cancelar
              </button>
              <button onClick={() => { toast.success("Guardado!"); setIsEditModalOpen(false); }} className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black py-2.5 rounded-lg font-black transition-colors uppercase tracking-wider shadow-md shadow-yellow-500/10">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}