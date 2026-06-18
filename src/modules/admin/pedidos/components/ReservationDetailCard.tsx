import { Calendar, MapPin, Users, Phone, User, Mail, FileText, Bookmark } from "lucide-react";
import type { Reservation } from "@/modules/admin/reservas/interfaces/reservation.interface";

interface ReservationDetailCardProps {
  reservation: Reservation; // Cambiado de 'any' a nuestro tipo limpio
}

export default function ReservationDetailCard({ reservation }: ReservationDetailCardProps) {
  console.log("Datos que llegan a la tarjeta:", reservation);
  const getStatusBadge = (status: string) => {
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
    <div className="w-full rounded-xl border border-yellow-500/30 bg-[#1a1410] p-5 shadow-lg animate-fadeIn">
      <div className="flex items-center gap-2 mb-4 border-b border-[#2a1f1a] pb-2">
        <Bookmark className="w-4 h-4 text-yellow-500" />
        <h3 className="text-xs font-black text-yellow-500 uppercase tracking-wider">
          Monitoreo y Ubicación del Servicio Personalizado
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        
        {/* Datos de Cuenta del Cliente */}
        <div className="bg-[#15100c] p-3 rounded-lg border border-[#2a1f1a] space-y-1">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-tight flex items-center gap-1">
            <User className="w-3 h-3 text-yellow-500" /> Cuenta Registrada
          </p>
          <p className="text-zinc-100 font-bold truncate">
            {reservation.user?.name || reservation.customerName || reservation.clientName || "No disponible"}
          </p>
          <p className="text-xs text-zinc-400 truncate flex items-center gap-1">
            <Mail className="w-3 h-3 text-zinc-500" /> {reservation.user?.email || reservation.customerEmail || "Sin correo electrónico"}
          </p>
          
          {/* CAMBIO AQUÍ: Se eliminó el condicional de envoltura y se añadieron fallbacks robustos */}
          <p className="text-xs text-zinc-400 flex items-center gap-1">
            <Phone className="w-3 h-3 text-zinc-500" />{" "}
            {reservation.phone || 
             reservation.user?.phone || 
             reservation.customerPhone || 
             reservation.clientPhone || 
             "Sin teléfono"}
          </p>
        </div>

        {/* Ubicación Geográfica */}
        <div className="bg-[#15100c] p-3 rounded-lg border border-[#2a1f1a]">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-tight flex items-center gap-1">
            <MapPin className="w-3 h-3 text-yellow-500" /> Destino de Entrega
          </p>
          <p className="text-zinc-100 font-bold mt-1 truncate">
            {reservation.city || "Sin Ciudad"}
          </p>
          <p className="text-xs text-zinc-400 truncate" title={reservation.venueAddress}>
            {reservation.venueAddress || "Dirección no provista"}
          </p>
        </div>

        {/* Cronograma */}
        <div className="bg-[#15100c] p-3 rounded-lg border border-[#2a1f1a]">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-tight flex items-center gap-1">
            <Calendar className="w-3 h-3 text-yellow-500" /> Cronograma del Evento
          </p>
          <p className="text-zinc-100 font-bold mt-1">
            {reservation.eventDate ? new Date(reservation.eventDate).toLocaleDateString() : "-"}
          </p>
          <p className="text-xs text-zinc-400 mt-0.5">
            Hora: {reservation.serviceStartTime || "Por confirmar"}
          </p>
        </div>

        {/* Capacidad y Estados */}
        <div className="bg-[#15100c] p-3 rounded-lg border border-[#2a1f1a] flex flex-col justify-between">
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-tight flex items-center gap-1">
              <Users className="w-3 h-3 text-yellow-500" /> Magnitud
            </p>
            <p className="text-zinc-200 font-semibold mt-0.5 text-xs">
              {reservation.guestsCount || 0} invitados asignados
            </p>
          </div>
          <div className="mt-2">
            <span className={`inline-block text-[10px] font-black uppercase tracking-wider rounded border px-2 py-0.5 ${getStatusBadge(reservation.status)}`}>
              {reservation.status?.replace('_', ' ') || "PENDIENTE"}
            </span>
          </div>
        </div>
      </div>

      {/* Notas */}
      {(reservation.notes) && (
        <div className="mt-3 bg-[#211814] p-3 rounded-lg border border-[#2a1f1a] text-xs text-zinc-400">
          <span className="text-yellow-500 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 mb-1">
            <FileText className="w-3 h-3" /> Requerimientos Especiales:
          </span>
          <p className="italic">"{reservation.notes}"</p>
        </div>
      )}
    </div>
  );
}