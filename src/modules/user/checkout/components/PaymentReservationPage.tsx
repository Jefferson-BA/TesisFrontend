import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Hash,
  Loader2,
  ShieldCheck,
  X,
  type LucideIcon,
} from 'lucide-react';
import { QueryProvider } from '@/components/shared/QueryProvider';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/errors';
import { useUser } from '@/modules/user/hooks/useUser';
import { getUserReservations } from '@/modules/reservations/services/reservation.service';
import {
  createOrder,
  getOrder,
  getOrders,
} from '@/modules/orders/services/order.service';
import type { Order } from '@/modules/orders/interfaces/order.interface';
import { CulqiPayment } from '@/modules/payments/components/CulqiPayment';
function PaymentReservationContent() {
  const { user } = useUser();
  const [reservationId, setReservationId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [step, setStep] = useState<'resumen' | 'pago' | 'completado'>(
    'resumen',
  );
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false);
  useEffect(() => {
    setReservationId(
      new URLSearchParams(window.location.search).get('reservationId') || '',
    );
  }, []);
  const reservations = useQuery({
    queryKey: ['user-reservations', user?.id],
    queryFn: getUserReservations,
    enabled: !!user,
  });
  const reservation = reservations.data?.find(
    (item) => String(item.id) === reservationId,
  );
  const amount = Number(order?.totalAmount ?? reservation?.totalAmount ?? 0);
  useEffect(() => {
    if (step !== 'completado') return;
    const timer = window.setTimeout(
      () => window.location.assign('/user/profile'),
      2500,
    );
    return () => window.clearTimeout(timer);
  }, [step]);
  const prepare = async () => {
    if (lock.current || !reservation || reservation.status !== 'approved')
      return;
    lock.current = true;
    setCreating(true);
    setError('');
    try {
      let current = order;
      if (!current) {
        const existing = (await getOrders(reservation.id)).find((item) =>
          ['pending', 'failed'].includes(item.status),
        );
        current = existing
          ? await getOrder(existing.id)
          : await createOrder({ reservationId: Number(reservation.id) });
      }
      if (
        !Number.isFinite(Number(current.totalAmount)) ||
        Number(current.totalAmount) <= 0
      )
        throw new Error('Importe inválido');
      setOrder(current);
      setStep('pago');
    } catch (failure) {
      setError(getErrorMessage(failure, 'No se pudo preparar la orden'));
    } finally {
      lock.current = false;
      setCreating(false);
    }
  };
  if (reservations.isPending)
    return (
      <div
        role="status"
        className="flex min-h-[60vh] items-center justify-center text-muted-foreground"
      >
        Cargando tu reserva...
      </div>
    );
  if (reservations.isError)
    return (
      <div
        role="alert"
        className="mx-auto max-w-2xl px-4 py-12 text-center text-destructive"
      >
        No se pudo cargar tu reserva.{' '}
        <button
          className="underline"
          onClick={() => void reservations.refetch()}
        >
          Reintentar
        </button>
      </div>
    );
  if (!reservation)
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <X className="size-10 text-muted-foreground/40" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          No se encontró la reserva
        </h2>
        <p className="text-muted-foreground">
          La información de la reserva no está disponible.
        </p>
        <a
          href="/user/profile"
          className="inline-flex items-center gap-2 rounded-xl bg-ember hover:brightness-110 text-char-deep px-6 py-3 font-bold transition-all"
        >
          <ArrowLeft size={16} /> Volver a Mi Perfil
        </a>
      </div>
    );
  return (
    <AnimatePresence mode="wait">
      {/* ─── COMPLETADO ─── */}
      {step === 'completado' && (
        <motion.div
          key="done"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex min-h-[60vh] items-center justify-center"
        >
          <div className="space-y-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            >
              <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="size-12 text-emerald-500" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-display font-bold text-foreground">
              ¡Pago Exitoso!
            </h2>
            <p className="text-muted-foreground text-lg">
              Tu reserva ha sido confirmada. Redirigiendo a tu perfil...
            </p>
            <div className="mx-auto h-1.5 w-48 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── RESUMEN ─── */}
      {step === 'resumen' && (
        <motion.div
          key="summary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl px-4 py-12 sm:px-6"
        >
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl">
            <div className="mb-8 space-y-2 text-center">
              <div className="w-14 h-14 rounded-2xl bg-ember/10 border border-ember/20 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-7 h-7 text-ember" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Pagar Reserva
              </h1>
              <p className="text-muted-foreground">
                Revisa los detalles antes de continuar con el pago
              </p>
            </div>

            {error && (
              <p role="alert" className="mb-5 text-destructive">
                {error}
              </p>
            )}
            {reservation.status !== 'approved' && (
              <p role="status" className="mb-5 text-muted-foreground">
                Esta reserva todavía no admite pagos.
              </p>
            )}
            {/* Detalles */}
            <div className="mb-6 space-y-4 rounded-xl border border-border bg-muted/30 p-5">
              <DetailRow
                icon={Hash}
                label="Reserva"
                value={`RES-${reservationId.padStart(5, '0')}`}
              />
              <hr className="border-border" />
              <DetailRow
                icon={CreditCard}
                label="Monto a Pagar"
                value={`S/ ${amount.toFixed(2)}`}
                highlight
              />
            </div>

            {/* Email */}
            <div className="mb-8 rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Email de confirmación
              </p>
              <p className="text-sm font-medium text-foreground">
                {user?.email || '—'}
              </p>
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/user/profile"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-bold text-muted-foreground transition-colors hover:border-ember/30 hover:text-foreground"
              >
                <ArrowLeft size={16} /> Volver
              </a>
              <button
                type="button"
                onClick={() => void prepare()}
                disabled={creating || reservation.status !== 'approved'}
                className={cn(
                  'inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ember to-amber-600 px-6 py-3 font-bold text-char-deep shadow-lg transition-all hover:brightness-110 active:scale-[0.98]',
                  creating &&
                    'opacity-60 cursor-not-allowed pointer-events-none',
                )}
              >
                {creating ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <CreditCard className="size-5" />
                )}
                {creating ? 'Preparando pago...' : 'Confirmar y Pagar'}
                <ArrowRight className="size-5" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-emerald-500" /> Pago seguro
              procesado por Culqi
            </div>
          </div>
        </motion.div>
      )}

      {step === 'pago' && order && user && (
        <CulqiPayment
          presentation="fullscreen"
          orderId={order.id}
          amount={Number(order.totalAmount)}
          userEmail={user.email}
          isOpen
          onClose={() =>
            setStep((current) =>
              current === 'completado' ? current : 'resumen',
            )
          }
          onSuccessCallback={() => setStep('completado')}
        />
      )}
    </AnimatePresence>
  );
}
const DetailRow = ({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon size={14} />
      <span className="text-[10px] font-bold uppercase tracking-widest">
        {label}
      </span>
    </div>
    <span
      className={cn(
        'font-bold',
        highlight
          ? 'text-2xl font-black text-ember font-mono'
          : 'text-foreground font-mono text-sm',
      )}
    >
      {value}
    </span>
  </div>
);

export default function PaymentReservationPage() {
  return (
    <QueryProvider>
      <PaymentReservationContent />
    </QueryProvider>
  );
}
