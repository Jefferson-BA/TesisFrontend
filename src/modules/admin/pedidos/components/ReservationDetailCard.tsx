import { Calendar, MapPin, Users, Phone, User, Mail, FileText, Bookmark } from "lucide-react";
import type { Reservation } from "@/modules/admin/reservas/interfaces/reservation.interface";

interface ReservationDetailCardProps {
  reservation: Reservation;
}

export default function ReservationDetailCard({ reservation }: ReservationDetailCardProps) {
  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'pending_review') return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20';
    if (s === 'approved' || s === 'active') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    if (s === 'deposit_paid') return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
    if (s === 'fully_paid') return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
    if (s === 'completed') return 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20';
    if (s === 'cancelled') return 'bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20';
    return 'bg-muted text-muted-foreground border-border';
  };

  const renderFormattedDate = (dateStr: string) => {
    if (!dateStr) return "Por confirmar";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      if (dateStr.length <= 10) {
        return dateStr.split("-").reverse().join("/");
      }
      return date.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full rounded-xl border border-primary/20 bg-card p-5 shadow-2xl animate-fadeIn backdrop-blur-sm transition-colors">
      
      <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
        <Bookmark className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-black text-primary uppercase tracking-wider">
          Monitoreo y Ubicación del Servicio Personalizado
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        
        {/* Datos de Cuenta del Cliente */}
        <div className="bg-muted/50 p-3 rounded-lg border border-border flex flex-col justify-center space-y-1 min-h-[85px]">
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-wider flex items-center gap-1 mb-1">
            <User className="w-3 h-3 text-primary" /> Cuenta Registrada
          </p>
          <p className="text-foreground font-bold truncate text-sm">
            {reservation.user?.name || reservation.customerName || reservation.clientName || "Jefferson"}
          </p>
          <p className="text-xs text-muted-foreground truncate flex items-center gap-1 font-mono">
            <Mail className="w-2.5 h-2.5 opacity-70" /> {reservation.user?.email || reservation.customerEmail || "jeffeson123xd@gmail.com"}
          </p>
          <p className="text-xs text-primary flex items-center gap-1 font-mono font-bold">
            <Phone className="w-2.5 h-2.5 opacity-80" />{" "}
            {reservation.phone && reservation.phone !== "Sin teléfono" ? reservation.phone : "123123123"}
          </p>
        </div>

        {/* Ubicación Geográfica */}
        <div className="bg-muted/50 p-3 rounded-lg border border-border flex flex-col justify-center min-h-[85px]">
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-wider flex items-center gap-1 mb-1">
            <MapPin className="w-3 h-3 text-primary" /> Destino de Entrega
          </p>
          <p className="text-foreground font-bold capitalize text-sm">
            {reservation.city || "Lima"}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5" title={reservation.venueAddress}>
            {reservation.venueAddress || "Dirección no provista"}
          </p>
        </div>

        {/* Cronograma */}
        <div className="bg-muted/50 p-3 rounded-lg border border-border flex flex-col justify-center min-h-[85px]">
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-wider flex items-center gap-1 mb-1">
            <Calendar className="w-3 h-3 text-primary" /> Cronograma del Evento
          </p>
          <p className="text-primary font-extrabold text-sm font-mono">
            {renderFormattedDate(reservation.eventDate)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hora: <span className="font-mono text-foreground font-bold">{reservation.serviceStartTime || "12:00"}</span>
          </p>
        </div>

        {/* Capacidad y Estados */}
        <div className="bg-muted/50 p-3 rounded-lg border border-border flex flex-col justify-between min-h-[85px]">
          <div>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3 h-3 text-primary" /> Magnitud
            </p>
            <p className="text-foreground font-bold mt-0.5 text-xs">
              {reservation.guestsCount || 0} invitados asignados
            </p>
          </div>
          <div className="mt-1">
            <span className={`inline-block text-[9px] font-black uppercase tracking-widest rounded border px-2 py-0.5 shadow-sm ${getStatusBadge(reservation.status)}`}>
              {reservation.status?.replace('_', ' ') || "PENDING REVIEW"}
            </span>
          </div>
        </div>
      </div>

      {/* Notas */}
      {reservation.notes && (
        <div className="mt-3 bg-muted p-3 rounded-lg border border-border text-xs text-muted-foreground">
          <span className="text-primary font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 mb-1">
            <FileText className="w-3 h-3" /> Requerimientos Especiales del Evento:
          </span>
          <p className="italic text-foreground font-medium">"{reservation.notes}"</p>
        </div>
      )}
    </div>
  );
}