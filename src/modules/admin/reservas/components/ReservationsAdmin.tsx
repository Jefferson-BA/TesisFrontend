import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, Package, Phone, Edit, Trash2, X, Calendar, MapPin, Users, FileText, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Utensils } from "lucide-react";
import { getReservations, updateReservation, deleteReservation } from "@/modules/admin/reservas/services/reservation.service";
import type { PaginationMeta } from "@/modules/admin/reservas/interfaces/reservation.interface";

export default function ReservationsAdmin() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 ESTADOS PARA PAGINACIÓN
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Estados para los Modales
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 🔥 ESTADOS PARA EL MODAL DE TIENDA / CARRITO
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [modalOrderItems, setModalOrderItems] = useState<any[]>([]);

  useEffect(() => {
    fetchReservations();
  }, [currentPage]); // Se vuelve a ejecutar si cambia la página

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
    window.location.href = `/admin/pedidos?reservationId=${id}`;
  };

  const handleEdit = (id: string) => {
    const res = reservations.find((r) => r.id === id);
    setSelectedReservation(res);
    setIsEditModalOpen(true);
  };

  // 🔥 ACCIÓN ACTUALIZADA PARA ABRIR EL MODAL DEL CARRITO
  const handleViewOrder = (res: any) => {
    const items = res.items || res.order?.items || [];
    if (items.length > 0) {
      setModalOrderItems(items);
      setIsOrderModalOpen(true);
    } else {
      toast.error("Esta reserva no contiene platos o productos registrados.");
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'pending_review') return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    if (s === 'approved') return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (s === 'deposit_paid') return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    if (s === 'fully_paid') return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (s === 'completed') return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    if (s === 'cancelled') return 'bg-red-500/10 text-red-500 border-red-500/20';
    return 'bg-zinc-800 text-zinc-300 border-zinc-700';
  };

  return (
    <>
      <div className="bg-[#15100c] rounded-xl border border-[#2a1f1a] overflow-hidden shadow-xl">
        <div className="p-6 border-b border-[#2a1f1a] flex justify-between items-center bg-[#1a1410]">
          <h2 className="text-xl font-black text-yellow-500 uppercase tracking-wide">Gestión de Reservas</h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-zinc-400 flex justify-center items-center h-40">Cargando reservas...</div>
        ) : (
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
                        <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {res.serviceStartTime}
                        </div>
                      </td>

                      <td className="px-6 py-4 align-middle">
                        <div className="font-medium text-zinc-200 block max-w-[220px] truncate flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                          {res.city} - {res.venueAddress}
                        </div>
                        <div className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          {res.guestsCount} personas
                        </div>
                      </td>

                      <td className="px-6 py-4 align-middle text-center">
                        <select
                          className={`text-xs font-bold rounded-md px-3 py-1.5 outline-none border cursor-pointer transition-all hover:brightness-110 ${getStatusColor(res.status)}`}
                          value={res.status}
                          onChange={(e) => handleStatusChange(res.id, e.target.value)}
                        >
                          <option value="pending_review" className="bg-zinc-900 text-zinc-100">PENDIENTE REVISIÓN</option>
                          <option value="approved" className="bg-zinc-900 text-zinc-100">APROBADA</option>
                          <option value="deposit_paid" className="bg-zinc-900 text-zinc-100">ADELANTO PAG.</option>
                          <option value="fully_paid" className="bg-zinc-900 text-zinc-100">PAGADA 100%</option>
                          <option value="completed" className="bg-zinc-900 text-zinc-100">COMPLETADA</option>
                          <option value="cancelled" className="bg-zinc-900 text-zinc-100">CANCELADA</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 align-middle">
                        <div className="flex justify-center items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">

                          <button onClick={() => handleViewDetails(res.id)} title="Ver detalles completos" className="p-2 rounded-md text-zinc-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>

                          <button onClick={() => handleViewOrder(res)} title="Ver pedidos" className="p-2 rounded-md text-zinc-400 hover:text-purple-400 hover:bg-purple-400/10 transition-colors">
                            <Package className="w-4 h-4" />
                          </button>

                          {/* Botón de WhatsApp con mensaje personalizado */}
                          <a
                            href={
                              res.user?.phone
                                ? `https://wa.me/${res.user.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                  `¡Hola ${res.user.name || ''}! Te saluda el equipo administrativo. Nos comunicamos contigo respecto a tu reserva para el día ${new Date(res.eventDate).toLocaleDateString()}.`
                                )}`
                                : '#'
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => !res.user?.phone && e.preventDefault()}
                            title={res.user?.phone ? `Enviar WhatsApp a ${res.user.phone}` : "No hay teléfono registrado"}
                            className={`p-2 rounded-md transition-colors ${res.user?.phone
                                ? 'text-zinc-400 hover:text-emerald-400 hover:bg-emerald-400/10'
                                : 'text-zinc-700 cursor-not-allowed'
                              }`}
                          >
                            <Phone className="w-4 h-4" />
                          </a>

                          <button onClick={() => handleEdit(res.id)} title="Editar reserva" className="p-2 rounded-md text-zinc-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>

                          <button onClick={() => handleDelete(res.id)} title="Eliminar definitivamente" className="p-2 rounded-md text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-colors">
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

        {/* 🔥 FOOTER DE PAGINACIÓN */}
        {!isLoading && meta && meta.totalPages > 0 && (
          <div className="p-4 border-t border-[#2a1f1a] bg-[#1a1410] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
              Mostrando <span className="text-yellow-500 font-bold">{reservations.length}</span> de <span className="text-zinc-300 font-bold">{meta.totalItems}</span> reservas
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded bg-[#211814] border border-[#2a1f1a] text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/30 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Primera página"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded bg-[#211814] border border-[#2a1f1a] text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/30 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-3 py-1.5 rounded bg-[#15100c] border border-yellow-500/20 text-xs font-bold text-yellow-500 mx-1 min-w-[80px] text-center">
                {currentPage} / {meta.totalPages}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === meta.totalPages}
                className="p-1.5 rounded bg-[#211814] border border-[#2a1f1a] text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/30 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Página siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => goToPage(meta.totalPages)}
                disabled={currentPage === meta.totalPages}
                className="p-1.5 rounded bg-[#211814] border border-[#2a1f1a] text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/30 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Última página"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
          🔥 NUEVO MODAL: RESUMEN DE PLATOS SOLICITADOS
      ========================================== */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#15100c] border border-[#2a1f1a] rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-[#2a1f1a] bg-[#1a1410] flex justify-between items-center">
              <h3 className="text-sm font-black text-yellow-500 uppercase flex items-center gap-2 tracking-wider">
                <Utensils className="w-4 h-4" /> Resumen de Platos Solicitados
              </h3>
              <button onClick={() => setIsOrderModalOpen(false)} className="text-zinc-500 hover:text-zinc-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="border-b border-[#2a1f1a] text-[10px] uppercase text-zinc-500 tracking-wider font-bold">
                  <tr>
                    <th className="pb-3 text-zinc-400 font-bold">Comida / Producto</th>
                    <th className="pb-3 text-zinc-400 font-bold">Categoría</th>
                    <th className="pb-3 text-zinc-400 font-bold text-center">Precio Unit.</th>
                    <th className="pb-3 text-zinc-400 font-bold text-center">Unidades</th>
                    <th className="pb-3 text-zinc-400 font-bold text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300 divide-y divide-[#2a1f1a]/30">
                  {modalOrderItems.map((item: any, index: number) => {
                    const itemName = item.name || item.product?.name || item.foodName || "Plato sin nombre";
                    const itemCategory = item.category || item.product?.category?.name || "Comida";
                    const itemQty = item.quantity || item.qty || 1;
                    const itemPrice = Number(item.price || item.product?.price || 0);
                    const itemSubtotal = Number(item.subtotal || (itemQty * itemPrice));

                    return (
                      <tr key={item.id || index} className="hover:bg-[#1a1410] transition-colors">
                        <td className="py-4 font-bold text-zinc-100 text-sm">{itemName}</td>
                        <td className="py-4 text-zinc-500">
                          <span className="px-2.5 py-0.5 bg-[#211814] rounded-md text-[10px] border border-[#2a1f1a]">
                            {itemCategory}
                          </span>
                        </td>
                        <td className="py-4 text-center font-mono text-zinc-400">
                          S/ {itemPrice.toFixed(2)}
                        </td>
                        <td className="py-4 text-center">
                          <span className="font-black text-yellow-500 text-sm">x{itemQty}</span>
                        </td>
                        <td className="py-4 text-right font-mono font-bold text-emerald-400/90">
                          S/ {itemSubtotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-[#2a1f1a] bg-[#1a1410] flex justify-end">
              <div className="text-right">
                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider mr-3">Total Carrito:</span>
                <span className="text-lg font-mono font-black text-yellow-500">
                  S/ {modalOrderItems.reduce((acc, item) => acc + (Number(item.subtotal) || ((item.quantity || 1) * Number(item.price || 0))), 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: VER DETALLES
      ========================================== */}
      {isDetailsModalOpen && selectedReservation && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#15100c] border border-[#2a1f1a] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#2a1f1a] bg-[#1a1410] flex justify-between items-center">
              <h3 className="text-lg font-black text-yellow-500 uppercase flex items-center gap-2">
                <FileText className="w-5 h-5" /> Detalles de la Reserva
              </h3>
              <button onClick={() => setIsDetailsModalOpen(false)} className="text-zinc-500 hover:text-zinc-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-zinc-300">
              <div className="bg-[#1a1410] p-4 rounded-lg border border-[#2a1f1a] flex flex-col gap-2">
                <p className="flex items-center gap-2"><Users className="w-4 h-4 text-zinc-500" /> <strong className="text-zinc-100">Cliente:</strong> {selectedReservation.user?.name || "No disponible"}</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-zinc-500" /> <strong className="text-zinc-100">Teléfono:</strong> {selectedReservation.user?.phone || "No disponible"}</p>
                <p className="flex items-center gap-2"><strong className="text-zinc-100 pl-6">Email:</strong> {selectedReservation.user?.email || "No disponible"}</p>
              </div>

              <div className="bg-[#1a1410] p-4 rounded-lg border border-[#2a1f1a] flex flex-col gap-2">
                <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-zinc-500" /> <strong className="text-zinc-100">Fecha:</strong> {new Date(selectedReservation.eventDate).toLocaleDateString()} a las {selectedReservation.serviceStartTime}</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-zinc-500" /> <strong className="text-zinc-100">Dirección:</strong> {selectedReservation.venueAddress}, {selectedReservation.city}</p>
                <p className="flex items-center gap-2"><Users className="w-4 h-4 text-zinc-500" /> <strong className="text-zinc-100">Invitados:</strong> {selectedReservation.guestsCount} personas</p>
              </div>

              {selectedReservation.notes && (
                <div className="bg-[#1a1410] p-4 rounded-lg border border-[#2a1f1a]">
                  <strong className="text-zinc-100 flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-zinc-500" /> Notas del cliente:
                  </strong>
                  <p className="text-zinc-400 italic pl-6">{selectedReservation.notes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-[#2a1f1a] bg-[#1a1410]">
              <button onClick={() => setIsDetailsModalOpen(false)} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
                Cerrar Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: EDITAR
      ========================================== */}
      {isEditModalOpen && selectedReservation && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#15100c] border border-[#2a1f1a] rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-yellow-500 uppercase flex items-center gap-2">
                <Edit className="w-5 h-5" /> Editar Reserva
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-500 hover:text-zinc-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-zinc-400 mb-6 text-sm">
              Conecta tu formulario aquí para editar la dirección, hora o notas de la reserva #{selectedReservation.id}.
            </p>

            <div className="flex gap-3">
              <button onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg font-bold transition-colors">
                Cancelar
              </button>
              <button onClick={() => { toast.success("Guardado!"); setIsEditModalOpen(false); }} className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black py-2 rounded-lg font-bold transition-colors">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}