import { ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCulqiAppearance } from '../lib/culqi-appearance';
import { QueryProvider } from '@/components/shared/QueryProvider';
import { getErrorMessage } from '@/lib/errors';
import { getPaymentStatus } from '@/modules/orders/services/order.service';
import type { CulqiInstance } from '@/types/culqi';
import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { usePayOrder } from '../hooks/usePayOrder';
import { loadCulqi } from '../lib/culqi-loader';

interface CulqiPaymentProps {
  presentation?: 'embedded' | 'fullscreen';
  orderId: string | number;
  amount: number;
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccessCallback?: () => void;
}
function CulqiPaymentInner({
  presentation = 'embedded',
  orderId,
  amount,
  userEmail,
  isOpen,
  onClose,
  onSuccessCallback,
}: CulqiPaymentProps) {
  const id = useId().replace(/:/g, '');
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [monitoring, setMonitoring] = useState(false);
  const instance = useRef<CulqiInstance | null>(null);
  const inFlight = useRef(false);
  const tokens = useRef(new Set<string>());
  const completed = useRef(false);
  const { mutateAsync: pay, isPending: isPaying } = usePayOrder();
  const status = useQuery({
    queryKey: ['payment-status', orderId],
    queryFn: () => getPaymentStatus(orderId),
    enabled: isOpen,
    staleTime: 0,
    refetchInterval: (query) =>
      monitoring || query.state.data?.paymentStatus === 'processing'
        ? 3000
        : false,
  });
  const { refetch: refetchStatus } = status;
  const callbacks = useRef({ onClose, onSuccessCallback });
  useEffect(() => {
    callbacks.current = { onClose, onSuccessCallback };
  }, [onClose, onSuccessCallback]);
  const pending =
    isPaying || monitoring || status.data?.paymentStatus === 'processing';
  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    loadCulqi()
      .then(() => {
        if (mounted) setScriptReady(true);
      })
      .catch(() => {
        if (mounted)
          setError(
            'No se pudo cargar la pasarela. Cierra y vuelve a abrir para reintentar.',
          );
      });
    return () => {
      mounted = false;
    };
  }, [isOpen]);
  useEffect(() => {
    if (status.data?.paymentStatus === 'failed') {
      setMonitoring(false);
      inFlight.current = false;
    }
    if (
      (status.data?.paymentStatus === 'succeeded' ||
        ['paid', 'shipped', 'delivered'].includes(
          status.data?.orderStatus ?? '',
        )) &&
      !completed.current
    ) {
      completed.current = true;
      setMonitoring(false);
      callbacks.current.onSuccessCallback?.();
      callbacks.current.onClose();
    }
  }, [status.data]);
  const handleToken = useCallback(
    async (tokenId: string) => {
      if (inFlight.current || tokens.current.has(tokenId)) return;
      tokens.current.add(tokenId);
      inFlight.current = true;
      setError('');
      instance.current?.close();
      try {
        await pay({ orderId, tokenId, amount, email: userEmail });
        setMonitoring(true);
      } catch (failure) {
        const definiteRejection =
          isAxiosError(failure) && failure.response?.status === 400;
        setMonitoring(!definiteRejection);
        setError(
          getErrorMessage(
            failure,
            'No se pudo confirmar el resultado del pago. Verificaremos su estado.',
          ),
        );
        if (definiteRejection) inFlight.current = false;
      }
      await refetchStatus();
    },
    [pay, orderId, amount, userEmail, refetchStatus],
  );
  useEffect(() => {
    if (
      !isOpen ||
      !scriptReady ||
      status.isPending ||
      status.isError ||
      pending ||
      completed.current
    )
      return;
    const Constructor = window.CulqiCheckout;
    const key = import.meta.env.PUBLIC_CULQI_KEY;
    if (!Constructor || !key || !Number.isFinite(amount) || amount <= 0) {
      setError(
        'No se pudo preparar el pago. Revisa la orden o la configuración de Culqi.',
      );
      return;
    }
    const paymentMethods = {
      tarjeta: true,
      yape: true,
      billetera: false,
      bancaMovil: false,
      agente: false,
      cuotealo: false,
    };
    const widget = new Constructor(key, {
      settings: {
        title: 'DeParraSpitz Catering',
        currency: 'PEN',
        amount: Math.round(amount * 100),
      },
      client: { email: userEmail },
      options: {
        lang: 'auto',
        installments: false,
        modal: false,
        container: `#${id}`,
        paymentMethods,
        paymentMethodsSort: Object.keys(paymentMethods),
      },
      appearance: getCulqiAppearance(
        document.documentElement.classList.contains('dark'),
        presentation === 'fullscreen',
      ),
    });
    instance.current = widget;
    const handler = () => {
      const token = widget.token || window.Culqi?.token;
      if (token?.id) {
        widget.token = null;
        if (window.Culqi) window.Culqi.token = null;
        void handleToken(token.id);
      } else if (widget.order || window.Culqi?.order) {
        // El evento del SDK solo inicia la verificación del cobro en el servidor.
        setMonitoring(true);
        widget.close();
      } else if (widget.error || window.Culqi?.error) {
        setError(
          (widget.error || window.Culqi?.error)?.user_message ||
            'No se pudo procesar la tarjeta',
        );
      }
    };
    widget.culqi = handler;
    window.culqi = handler;
    window.culqi3ds = handler;
    widget.open();
    return () => {
      widget.close();
      if (window.culqi === handler) window.culqi = undefined;
      if (window.culqi3ds === handler) window.culqi3ds = undefined;
      instance.current = null;
    };
  }, [
    isOpen,
    scriptReady,
    status.isPending,
    status.isError,
    pending,
    amount,
    userEmail,
    id,
    handleToken,
    attempt,
    presentation,
  ]);
  if (!isOpen) return null;
  const feedback = (
    <>
      {' '}
      {error && (
        <p role="alert" className="mb-4 text-destructive">
          {error}
        </p>
      )}
      {!pending && error && (
        <button
          className="underline mb-4"
          onClick={() => {
            setError('');
            void loadCulqi()
              .then(() => {
                setScriptReady(true);
                setAttempt((value) => value + 1);
              })
              .catch(() =>
                setError('No se pudo cargar la pasarela. Intenta nuevamente.'),
              );
          }}
        >
          Reintentar pasarela
        </button>
      )}
      {pending && (
        <p role="status" className="mb-4">
          Estamos verificando el resultado. Evita iniciar otro pago; puedes
          consultar el estado desde tu perfil.
        </p>
      )}
      {status.isError && (
        <p role="alert">No se pudo consultar el estado de la orden.</p>
      )}
      {(pending || status.isError) && (
        <button
          className="underline mb-4"
          onClick={() => void status.refetch()}
        >
          Verificar estado
        </button>
      )}
      {status.isPending && <p role="status">Verificando orden…</p>}
    </>
  );
  const isDark = document.documentElement.classList.contains('dark');
  const processingOverlay = isPaying && (
    <div
      role="status"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md pointer-events-auto"
    >
      <div className="mx-4 max-w-sm rounded-2xl border border-ember/20 bg-card p-8 text-center shadow-2xl">
        <Loader2 className="mx-auto mb-4 size-12 animate-spin text-ember" />
        <h3 className="mb-2 text-xl font-bold text-foreground">
          Validando Transacción
        </h3>
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-gradient-to-r from-ember to-amber-600 animate-progress-bar" />
        </div>
        <p className="text-sm text-muted-foreground">
          Estamos procesando tu pago con Culqi. Por favor, no cierres esta
          ventana ni recargues la página.
        </p>
      </div>
    </div>
  );
  if (presentation === 'fullscreen')
    return (
      <>
        <section
          aria-label="Completar pago de reserva"
          className={cn(
            'fixed inset-0 top-[80px] z-40 flex flex-col',
            isDark ? 'bg-[#0b0806]' : 'bg-stone-50',
          )}
        >
          <div
            className={cn(
              'flex shrink-0 items-center justify-between border-b px-6 py-4 backdrop-blur-sm',
              isDark
                ? 'border-[#3d2c1f] bg-[#140d0b]/95'
                : 'border-stone-200 bg-white/95',
            )}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isPaying}
              className={cn(
                'inline-flex items-center gap-2 text-sm transition-colors',
                isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-stone-500 hover:text-stone-900',
                isPaying && 'opacity-40 cursor-not-allowed pointer-events-none',
              )}
            >
              <ArrowLeft size={16} /> Volver
            </button>
            <div className="text-right">
              <p
                className={cn(
                  'text-xs',
                  isDark ? 'text-zinc-500' : 'text-stone-400',
                )}
              >
                Monto a pagar
              </p>
              <p className="text-lg font-bold text-ember">
                S/ {amount.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="px-6 pt-3">{feedback}</div>
          <div
            id={id}
            className={cn('flex-1 overflow-auto', pending && 'hidden')}
            style={{
              display: pending ? 'none' : 'flex',
              flexDirection: 'column',
            }}
          />
        </section>
        {processingOverlay}
      </>
    );
  return (
    <>
      {processingOverlay}
      <div className="w-full bg-white dark:bg-[#140d0b] border border-stone-200 dark:border-[#3d2c1f] rounded-2xl shadow-sm overflow-hidden">
        {/* Header de la sección */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">Completar Pago</h3>
            <p className="text-amber-100 text-xs">DeParraSpitz Catering</p>
          </div>
          <button
            onClick={onClose}
            disabled={isPaying}
            aria-label="Cerrar pasarela de pago"
            className={`w-8 h-8 bg-black/20 hover:bg-black/40 text-white/80 hover:text-white rounded-lg flex items-center justify-center transition-all ${
              isPaying
                ? 'opacity-30 cursor-not-allowed pointer-events-none'
                : ''
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Contenedor de Culqi */}
        <div className="p-6">
          {feedback}
          <div
            id={id}
            className={cn('w-full min-h-[300px]', pending && 'hidden')}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-100 dark:bg-neutral-950/50 border-t border-stone-200 dark:border-neutral-800 flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span className="text-xs text-stone-500 dark:text-neutral-400">
            Pago seguro procesado por Culqi
          </span>
        </div>
      </div>
    </>
  );
}
export function CulqiPayment(props: CulqiPaymentProps) {
  return (
    <QueryProvider>
      <CulqiPaymentInner {...props} />
    </QueryProvider>
  );
}
