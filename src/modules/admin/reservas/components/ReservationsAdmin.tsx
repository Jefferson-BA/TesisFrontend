import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, Package, Phone, Edit, Trash2, X, Calendar, MapPin, Users, FileText, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Utensils } from "lucide-react";
import { getReservations, updateReservation, deleteReservation } from "@/modules/admin/reservas/services/reservation.service";
import type { PaginationMeta } from "@/modules/admin/reservas/interfaces/reservation.interface";

// 🔥 DICCIONARIO DE ESTILOS REUTILIZABLES (Dinámico para Modo Claro/Oscuro)
const THEME = {
  modalOverlay: "fixed inset-0 z-[100] bg-black/60 dark:bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm",
  modalContainer: "bg-card text-card-foreground border border-border rounded-xl shadow-2xl flex flex-col",
  modalHeader: "p-6 border-b border-border bg-muted/30 flex justify-between items-center",
  modalCloseBtn: "text-muted-foreground hover:text-foreground transition-colors",
  tableTh: "px-6 py-5 border-b border-border font-bold",
  tableTd: "px-6 py-4 align-middle",
  paginationBtn: "p-1.5 rounded bg-secondary border border-border text-muted-foreground hover:text-primary hover:border-primary/50 disabled:opacity-30 disabled:pointer-events-none transition-colors",
  actionBtnBase: "p-2 rounded-md transition-colors",
  infoCard: "bg-muted/30 p-4 rounded-lg border border-border flex flex-col gap-2"
};

export default function ReservationsAdmin() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Paginación
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Modales
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [modalOrderItems, setModalOrderItems] = useState<any[]>([]);

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
    if (meta && page >= 1 && page <= meta.totalPages) setCurrentPage(page);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setReservations((prev) =>
      prev.map((res) => (res.id === id ? { ...res, status: newStatus } : res))
    );
    try {
      await updateReservation(id, { status: newStatus });
      toast.success("Estado actualizado correctamente");
    } catch (error) {
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
    setSelectedReservation(reservations.find((r) => r.id === id));
    setIsEditModalOpen(true);
  };

  const handleViewOrder = (res: any) => {
    const items = res.items || res.order?.items || [];
    if (items.length > 0) {
      setModalOrderItems(items);
      setIsOrderModalOpen(true);
    } else {
      toast.error("Esta reserva no contiene platos o productos registrados.");
    }
  };

  // Colores de estado adaptables a claro/oscuro
  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'pending_review') return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border-yellow-500/20';
    if (s === 'approved') return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border-emerald-500/20';
    if (s === 'deposit_paid') return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20';
    if (s === 'fully_paid') return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
    if (s === 'completed') return 'bg-blue-500/10 text-blue-700 dark:text-blue-500 border-blue-500/20';
    if (s === 'cancelled') return 'bg-red-500/10 text-red-700 dark:text-red-500 border-red-500/20';
    return 'bg-secondary text-secondary-foreground border-border';
  };

  return (
    <>
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
          <h2 className="text-xl font-black text-primary uppercase tracking-wide">Gestión de Reservas</h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-muted-foreground flex justify-center items-center h-40">Cargando reservas...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-foreground">
              <thead className="bg-secondary text-xs uppercase text-secondary-foreground font-bold">
                <tr>
                  <th className={THEME.tableTh}>Fecha / Hora</th>
                  <th className={THEME.tableTh}>Lugar e Invitados</th>
                  <th className={`${THEME.tableTh} text-center`}>Estado</th>
                  <th className={`${THEME.tableTh} text-center`}>Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a1f1a]/40">
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      No hay reservas registradas aún.
                    </td>
                  </tr>
                ) : (
                  reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-muted/50 transition-colors border-b border-border group">
                      <td className={THEME.tableTd}>
                        <div className="font-bold text-foreground text-base">
                          {new Date(res.eventDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" /> {res.serviceStartTime}
                        </div>
                      </td>

                      <td className={THEME.tableTd}>
                        <div className="font-medium text-foreground block max-w-[220px] truncate flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> {res.city} - {res.venueAddress}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> {res.guestsCount} personas
                        </div>
                      </td>

                      <td className={`${THEME.tableTd} text-center`}>
                        <select
                          className={`text-xs font-bold rounded-md px-3 py-1.5 outline-none border cursor-pointer transition-all hover:brightness-110 ${getStatusColor(res.status)}`}
                          value={res.status}
                          onChange={(e) => handleStatusChange(res.id, e.target.value)}
                        >
                          <option value="pending_review" className="bg-background text-foreground">PENDIENTE REVISIÓN</option>
                          <option value="approved" className="bg-background text-foreground">APROBADA</option>
                          <option value="deposit_paid" className="bg-background text-foreground">ADELANTO PAG.</option>
                          <option value="fully_paid" className="bg-background text-foreground">PAGADA 100%</option>
                          <option value="completed" className="bg-background text-foreground">COMPLETADA</option>
                          <option value="cancelled" className="bg-background text-foreground">CANCELADA</option>
                        </select>
                      </td>

                      <td className={THEME.tableTd}>
                        <div className="flex justify-center items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleViewDetails(res.id)} title="Ver detalles completos" className={`${THEME.actionBtnBase} text-muted-foreground hover:text-cyan-500 hover:bg-cyan-500/10`}>
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleViewOrder(res)} title="Ver pedidos" className={`${THEME.actionBtnBase} text-muted-foreground hover:text-purple-500 hover:bg-purple-500/10`}>
                            <Package className="w-4 h-4" />
                          </button>
                          <a
                            href={res.user?.phone ? `https://wa.me/${res.user.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`¡Hola ${res.user.name || ''}! Te saluda el equipo administrativo. Nos comunicamos contigo respecto a tu reserva para el día ${new Date(res.eventDate).toLocaleDateString()}.`)}` : '#'}
                            target="_blank" rel="noopener noreferrer" onClick={(e) => !res.user?.phone && e.preventDefault()}
                            title={res.user?.phone ? `Enviar WhatsApp a ${res.user.phone}` : "No hay teléfono registrado"}
                            className={`${THEME.actionBtnBase} ${res.user?.phone ? 'text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10' : 'text-muted-foreground/30 cursor-not-allowed'}`}
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                          <button onClick={() => handleEdit(res.id)} title="Editar reserva" className={`${THEME.actionBtnBase} text-muted-foreground hover:text-primary hover:bg-primary/10`}>
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(res.id)} title="Eliminar definitivamente" className={`${THEME.actionBtnBase} text-muted-foreground hover:text-destructive hover:bg-destructive/10`}>
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

        {/* FOOTER DE PAGINACIÓN */}
        {!isLoading && meta && meta.totalPages > 0 && (
          <div className="p-4 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Mostrando <span className="text-primary font-bold">{reservations.length}</span> de <span className="text-foreground font-bold">{meta.totalItems}</span> reservas
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => goToPage(1)} disabled={currentPage === 1} className={THEME.paginationBtn}><ChevronsLeft className="w-4 h-4" /></button>
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className={THEME.paginationBtn}><ChevronLeft className="w-4 h-4" /></button>
              <div className="px-3 py-1.5 rounded bg-background border border-primary/20 text-xs font-bold text-primary mx-1 min-w-[80px] text-center">
                {currentPage} / {meta.totalPages}
              </div>
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === meta.totalPages} className={THEME.paginationBtn}><ChevronRight className="w-4 h-4" /></button>
              <button onClick={() => goToPage(meta.totalPages)} disabled={currentPage === meta.totalPages} className={THEME.paginationBtn}><ChevronsRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: RESUMEN DE PLATOS */}
      {isOrderModalOpen && (
        <div className={THEME.modalOverlay}>
          <div className={`${THEME.modalContainer} w-full max-w-2xl animate-in fade-in zoom-in-95 duration-150`}>
            <div className={THEME.modalHeader}>
              <h3 className="text-sm font-black text-primary uppercase flex items-center gap-2 tracking-wider">
                <Utensils className="w-4 h-4" /> Resumen de Platos Solicitados
              </h3>
              <button onClick={() => setIsOrderModalOpen(false)} className={THEME.modalCloseBtn}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="border-b border-border text-[10px] uppercase text-muted-foreground tracking-wider font-bold">
                  <tr>
                    <th className="pb-3 text-muted-foreground font-bold">Comida / Producto</th>
                    <th className="pb-3 text-muted-foreground font-bold">Categoría</th>
                    <th className="pb-3 text-muted-foreground font-bold text-center">Precio Unit.</th>
                    <th className="pb-3 text-muted-foreground font-bold text-center">Unidades</th>
                    <th className="pb-3 text-muted-foreground font-bold text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="text-foreground divide-y divide-border">
                  {modalOrderItems.map((item: any, index: number) => {
                    const itemQty = item.quantity || item.qty || 1;
                    const itemPrice = Number(item.price || item.product?.price || 0);
                    return (
                      <tr key={item.id || index} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 font-bold text-foreground text-sm">{item.name || item.product?.name || item.foodName || "Plato sin nombre"}</td>
                        <td className="py-4 text-muted-foreground">
                          <span className="px-2.5 py-0.5 bg-secondary text-secondary-foreground rounded-md text-[10px] border border-border">
                            {item.category || item.product?.category?.name || "Comida"}
                          </span>
                        </td>
                        <td className="py-4 text-center font-mono text-muted-foreground">S/ {itemPrice.toFixed(2)}</td>
                        <td className="py-4 text-center"><span className="font-black text-primary text-sm">x{itemQty}</span></td>
                        <td className="py-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">S/ {Number(item.subtotal || (itemQty * itemPrice)).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-border bg-muted/30 flex justify-end">
              <div className="text-right">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider mr-3">Total Carrito:</span>
                <span className="text-lg font-mono font-black text-primary">
                  S/ {modalOrderItems.reduce((acc, item) => acc + (Number(item.subtotal) || ((item.quantity || 1) * Number(item.price || 0))), 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VER DETALLES */}
      {isDetailsModalOpen && selectedReservation && (
        <div className={THEME.modalOverlay}>
          <div className={`${THEME.modalContainer} w-full max-w-lg`}>
            <div className={THEME.modalHeader}>
              <h3 className="text-lg font-black text-primary uppercase flex items-center gap-2">
                <FileText className="w-5 h-5" /> Detalles de la Reserva
              </h3>
              <button onClick={() => setIsDetailsModalOpen(false)} className={THEME.modalCloseBtn}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4 text-sm text-foreground">
              <div className={THEME.infoCard}>
                <p className="flex items-center gap-2"><Users className="w-4 h-4 text-muted-foreground" /> <strong>Cliente:</strong> {selectedReservation.user?.name || "No disponible"}</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /> <strong>Teléfono:</strong> {selectedReservation.user?.phone || "No disponible"}</p>
                <p className="flex items-center gap-2"><strong className="pl-6">Email:</strong> {selectedReservation.user?.email || "No disponible"}</p>
              </div>
              <div className={THEME.infoCard}>
                <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /> <strong>Fecha:</strong> {new Date(selectedReservation.eventDate).toLocaleDateString()} a las {selectedReservation.serviceStartTime}</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /> <strong>Dirección:</strong> {selectedReservation.venueAddress}, {selectedReservation.city}</p>
                <p className="flex items-center gap-2"><Users className="w-4 h-4 text-muted-foreground" /> <strong>Invitados:</strong> {selectedReservation.guestsCount} personas</p>
              </div>
              {selectedReservation.notes && (
                <div className={THEME.infoCard}>
                  <strong className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4 text-muted-foreground" /> Notas del cliente:</strong>
                  <p className="text-muted-foreground italic pl-6">{selectedReservation.notes}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-border bg-muted/30">
              <button onClick={() => setIsDetailsModalOpen(false)} className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
                Cerrar Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR */}
      {isEditModalOpen && selectedReservation && (
        <div className={THEME.modalOverlay}>
          <div className={`${THEME.modalContainer} p-6 max-w-md w-full`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-primary uppercase flex items-center gap-2">
                <Edit className="w-5 h-5" /> Editar Reserva
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className={THEME.modalCloseBtn}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-muted-foreground mb-6 text-sm">
              Conecta tu formulario aquí para editar la dirección, hora o notas de la reserva #{selectedReservation.id}.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 rounded-lg font-bold transition-colors">
                Cancelar
              </button>
              <button onClick={() => { toast.success("Guardado!"); setIsEditModalOpen(false); }} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg font-bold transition-colors">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}