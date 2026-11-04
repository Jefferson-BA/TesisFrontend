import type { Reservation } from '@/modules/reservations/interfaces/reservation.interface';
import { QueryProvider } from '@/components/shared/QueryProvider';
// src/modules/user/components/UserOrders.tsx

import { cn } from '@/lib/utils';
import { getUserReservations } from '@/modules/reservations/services/reservation.service';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  FileText,
  MapPin,
  Smartphone,
  Users,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { ReservationDetailModal } from './ReservationDetailModal';

type ReservationStatus =
  | 'pending_review'
  | 'approved'
  | 'fully_paid'
  | 'completed'
  | 'cancelled'
  | string;

const STATUS_FLOW: ReservationStatus[] = [
  'pending_review',
  'approved',
  'fully_paid',
  'completed',
];

// Única fuente de verdad por estado: antes el color del ícono-círculo y el del
// badge se decidían en dos lugares distintos y podían no coincidir.
const STATUS_META: Record<
  string,
  { label: string; icon: LucideIcon; badgeClass: string; circleClass: string }
> = {
  pending_review: {
    label: 'Pendiente',
    icon: Clock,
    badgeClass: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    circleClass: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  },
  approved: {
    label: 'Aprobada',
    icon: AlertCircle,
    badgeClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    circleClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  fully_paid: {
    label: 'Pagada',
    icon: CheckCircle,
    badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    circleClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  completed: {
    label: 'Completada',
    icon: CheckCircle,
    badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    circleClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  cancelled: {
    label: 'Cancelada',
    icon: XCircle,
    badgeClass: 'bg-red-500/10 text-red-500 border-red-500/20',
    circleClass: 'bg-red-500/10 text-red-500 border-red-500/20',
  },
};

const DEFAULT_STATUS_META = {
  label: 'Desconocido',
  icon: Clock,
  badgeClass: 'bg-muted text-muted-foreground border-border',
  circleClass: 'bg-muted text-muted-foreground border-border',
};

const getStatusMeta = (status: ReservationStatus) =>
  STATUS_META[status?.toLowerCase()] || DEFAULT_STATUS_META;

const PAYMENT_METHODS: Record<
  string,
  { icon: LucideIcon; label: string; color: string }
> = {
  card: { icon: CreditCard, label: 'Tarjeta (Culqi)', color: 'text-ember' },
  yape: { icon: Smartphone, label: 'Yape', color: 'text-purple-500' },
  plin: { icon: Smartphone, label: 'Plin', color: 'text-teal-500' },
  cash: { icon: DollarSign, label: 'Efectivo', color: 'text-emerald-500' },
};

const ITEMS_PER_PAGE = 5;

function UserOrdersContent() {
  const { user } = useUser();
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: reservations = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Reservation[]>({
    queryKey: ['user-reservations', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const res = await getUserReservations();
      return Array.isArray(res) ? res : [];
    },
    refetchInterval: 10000,
  });

  const totalPages = Math.max(
    1,
    Math.ceil(reservations.length / ITEMS_PER_PAGE),
  );
  const paginatedReservations = reservations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const getStatusIndex = (status: ReservationStatus) =>
    STATUS_FLOW.indexOf(status?.toLowerCase());

  const renderPaymentMethod = (method: string) => {
    const m = PAYMENT_METHODS[method?.toLowerCase()] || {
      icon: CreditCard,
      label: method || 'No especificado',
      color: 'text-muted-foreground',
    };
    const Icon = m.icon;
    return (
      <span
        className={cn('flex items-center gap-1 text-xs font-medium', m.color)}
      >
        <Icon className="w-3.5 h-3.5" /> {m.label}
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground">
          Mis Reservas e Historial
        </h2>
        <span className="text-xs text-muted-foreground">
          {reservations.length} reservas
        </span>
      </div>

      {isError ? (
        <div role="alert">
          No se pudo cargar tu historial.{' '}
          <button onClick={() => void refetch()} className="underline">
            Reintentar
          </button>
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : reservations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 border-2 border-dashed border-border rounded-xl"
        >
          <Calendar className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">
            Aún no tienes reservas registradas.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {paginatedReservations.map((res, i) => {
            const statusIdx = getStatusIndex(res.status);
            const isExpanded = expandedId === res.id;
            const meta = getStatusMeta(res.status);
            const StatusIcon = meta.icon;

            return (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className={cn(
                  'rounded-xl border transition-all duration-300 overflow-hidden',
                  'bg-muted/30 border-border hover:border-ember/30',
                  isExpanded && 'border-ember/30 shadow-lg',
                )}
              >
                {/* Cabecera */}
                <div className="relative w-full flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-3 text-left">
                  <button
                    type="button"
                    className="absolute inset-0 w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ember"
                    onClick={() => setExpandedId(isExpanded ? null : res.id)}
                    aria-label={`Mostrar detalles de reserva RES-${String(res.id).padStart(5, '0')}`}
                    aria-expanded={isExpanded}
                    aria-controls={`reservation-details-${res.id}`}
                  />
                  <div className="relative pointer-events-none flex items-center gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center border',
                        meta.circleClass,
                      )}
                    >
                      <StatusIcon size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground font-mono text-sm">
                        RES-{String(res.id).padStart(5, '0')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {res.eventDate &&
                          new Date(res.eventDate).toLocaleDateString(
                            'es-PE',
                          )}{' '}
                        · {res.guestsCount ?? '?'} invitados
                      </p>
                    </div>
                  </div>

                  <div className="relative pointer-events-none flex items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReservation(res);
                        setIsModalOpen(true);
                      }}
                      title="Ver detalle completo"
                      aria-label={`Ver detalle completo de reserva ${res.id}`}
                      className="relative z-10 pointer-events-auto p-1.5 rounded-lg bg-card hover:bg-muted text-muted-foreground hover:text-ember border border-border/70 hover:border-ember/40 transition-colors cursor-pointer"
                    >
                      <Eye size={15} />
                    </button>
                    <span
                      className={cn(
                        'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                        meta.badgeClass,
                      )}
                    >
                      {meta.label}
                    </span>
                    <span className="font-bold text-ember text-sm">
                      S/ {Number(res.totalAmount || 0).toFixed(2)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-muted-foreground" />
                    ) : (
                      <ChevronDown
                        size={16}
                        className="text-muted-foreground"
                      />
                    )}
                  </div>
                </div>

                {/* Detalles expandidos */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      id={`reservation-details-${res.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                        {/* Timeline de estado */}
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                            Flujo de Estado
                          </p>
                          <div className="flex items-center gap-1">
                            {STATUS_FLOW.map((status, idx) => {
                              const done = statusIdx >= idx;
                              const isCancelled = res.status === 'cancelled';
                              return (
                                <div
                                  key={status}
                                  className="flex-1 flex items-center"
                                >
                                  <div
                                    className={cn(
                                      'w-3 h-3 rounded-full shrink-0',
                                      isCancelled
                                        ? 'bg-red-500'
                                        : done
                                          ? 'bg-emerald-500'
                                          : 'bg-muted-foreground/30',
                                    )}
                                  />
                                  {idx < STATUS_FLOW.length - 1 && (
                                    <div
                                      className={cn(
                                        'flex-1 h-0.5 mx-1',
                                        isCancelled
                                          ? 'bg-red-500/30'
                                          : done
                                            ? 'bg-emerald-500'
                                            : 'bg-muted-foreground/20',
                                      )}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between mt-1.5">
                            {STATUS_FLOW.map((status) => (
                              <span
                                key={status}
                                className="text-[9px] text-muted-foreground"
                              >
                                {STATUS_META[status].label}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Detalles */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <DetailRow
                            icon={MapPin}
                            label="Dirección"
                            value={res.venueAddress || 'No especificada'}
                          />
                          <DetailRow
                            icon={Users}
                            label="Invitados"
                            value={String(res.guestsCount ?? '?')}
                          />
                          <DetailRow
                            icon={Calendar}
                            label="Fecha"
                            value={
                              res.eventDate
                                ? new Date(res.eventDate).toLocaleDateString(
                                    'es-PE',
                                  )
                                : 'No definida'
                            }
                          />
                          <DetailRow
                            icon={Clock}
                            label="Hora"
                            value={res.serviceStartTime || 'No definida'}
                          />
                          <DetailRow
                            icon={MapPin}
                            label="Ciudad"
                            value={res.city || 'No especificada'}
                          />
                        </div>

                        {/* Método de pago */}
                        <div className="flex items-center gap-2 pt-2 border-t border-border">
                          <span className="text-xs text-muted-foreground">
                            Método de pago:
                          </span>
                          {renderPaymentMethod(res.paymentMethod || 'card')}
                        </div>

                        {/* Notas */}
                        {res.notes && (
                          <div className="flex items-start gap-2 pt-2 border-t border-border">
                            <FileText
                              size={14}
                              className="text-muted-foreground shrink-0 mt-0.5"
                            />
                            <p className="text-xs text-muted-foreground">
                              {res.notes}
                            </p>
                          </div>
                        )}

                        {/* Acciones: Ver detalle completo + Pagar si está aprobada */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedReservation(res);
                              setIsModalOpen(true);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold rounded-xl border border-border hover:border-ember/40 transition-all cursor-pointer"
                          >
                            <Eye size={14} className="text-ember" />
                            Ver detalle completo
                          </button>

                          {res.status === 'approved' && (
                            <a
                              href={`/user/pagar-reserva?reservationId=${res.id}&amount=${Number(res.totalAmount || 0).toFixed(2)}`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-ember hover:brightness-110 text-char-deep text-xs font-bold rounded-xl transition-all shadow-sm"
                            >
                              <CreditCard size={14} /> Pagar Reserva{' '}
                              <ArrowRight size={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Página anterior"
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              aria-current={currentPage === i + 1 ? 'page' : undefined}
              className={cn(
                'w-8 h-8 rounded-lg text-xs font-bold transition-all',
                currentPage === i + 1
                  ? 'bg-ember text-char-deep'
                  : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Página siguiente"
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Modal de Detalle Completo de la Reserva */}
      <ReservationDetailModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
        currentUser={user}
      />
    </div>
  );
}

const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-2">
    <Icon size={14} className="text-muted-foreground shrink-0" />
    <span className="text-xs text-muted-foreground">{label}:</span>
    <span className="text-xs text-foreground font-medium truncate">
      {value}
    </span>
  </div>
);

export default function UserOrders() {
  return (
    <QueryProvider>
      <UserOrdersContent />
    </QueryProvider>
  );
}
