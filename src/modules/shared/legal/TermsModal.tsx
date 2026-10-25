// src/modules/shared/legal/TermsModal.tsx

import { X, ScrollText, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
}

export function TermsModal({ open, onClose }: TermsModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-card border border-border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/95 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <ScrollText size={18} className="text-amber-500" />
            </div>
            <div>
              <h2 id="terms-modal-title" className="text-base font-black text-foreground uppercase tracking-wide">
                Términos y Condiciones
              </h2>
              <p className="text-[11px] text-muted-foreground">Última actualización: septiembre 2026</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 text-sm text-muted-foreground leading-relaxed">
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex gap-3">
            <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Al usar nuestros servicios, aceptas estos términos. Léelos con atención antes de continuar.
            </p>
          </div>

          <section className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-amber-500" /> 1. Descripción del Servicio
            </h3>
            <p>
              <strong className="text-foreground">De Parras &amp; Pitz</strong> es una empresa de catering y eventos que
              ofrece servicios de buffet, parrilla y atención gastronómica personalizada para eventos privados,
              corporativos y sociales en Lima, Perú. Nuestros servicios incluyen la planificación del menú,
              preparación de alimentos, montaje y desmontaje del servicio.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-amber-500" /> 2. Reservas y Cotizaciones
            </h3>
            <ul className="space-y-1.5 list-none">
              <li>• Las reservas se confirman únicamente tras recibir el pago del adelanto acordado.</li>
              <li>• Las cotizaciones tienen una vigencia de <strong className="text-foreground">72 horas</strong> desde su emisión.</li>
              <li>• La fecha del evento queda bloqueada para el cliente solo después de la confirmación formal.</li>
              <li>• Cambios en la fecha del evento deben notificarse con un mínimo de <strong className="text-foreground">7 días de anticipación</strong>.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-amber-500" /> 3. Precios y Pagos
            </h3>
            <ul className="space-y-1.5 list-none">
              <li>• Todos los precios se expresan en soles peruanos (S/) e incluyen IGV.</li>
              <li>• Se requiere un adelanto del <strong className="text-foreground">30%</strong> del total para confirmar la reserva.</li>
              <li>• El saldo restante debe cancelarse como mínimo <strong className="text-foreground">48 horas antes</strong> del evento.</li>
              <li>• Los métodos de pago aceptados son: tarjeta de crédito/débito y Yape.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-amber-500" /> 4. Cancelaciones y Reembolsos
            </h3>
            <ul className="space-y-1.5 list-none">
              <li>• Cancelación con <strong className="text-foreground">más de 7 días</strong> de anticipación: reembolso del 80% del adelanto.</li>
              <li>• Cancelación con <strong className="text-foreground">3 a 7 días</strong>: reembolso del 50% del adelanto.</li>
              <li>• Cancelación con <strong className="text-foreground">menos de 72 horas</strong>: sin reembolso.</li>
              <li>• Los reembolsos se procesan en un plazo de 5 a 10 días hábiles.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-amber-500" /> 5. Promociones
            </h3>
            <p>
              Las promociones y descuentos publicados en nuestra plataforma son válidos únicamente durante el
              período indicado y según las condiciones descritas en cada oferta. No son acumulables salvo
              indicación expresa. El titular de la cuenta es responsable de verificar la vigencia antes de
              reservar.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-amber-500" /> 6. Responsabilidades
            </h3>
            <p>
              De Parras &amp; Pitz se compromete a entregar el servicio pactado con la calidad y cantidad
              acordadas. No nos hacemos responsables por alergias alimentarias no declaradas al momento de la
              cotización, daños a terceros causados por el cliente o sus invitados, ni por condiciones climáticas
              fuera de nuestro control que afecten el evento.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-amber-500" /> 7. Uso de la Plataforma
            </h3>
            <p>
              El acceso a este sistema es para uso personal y no comercial. Está prohibido reproducir, distribuir
              o modificar cualquier parte del contenido sin autorización expresa. Nos reservamos el derecho de
              suspender cuentas que realicen actividades fraudulentas o que violen estos términos.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-amber-500" /> 8. Ley Aplicable
            </h3>
            <p>
              Estos términos se rigen por las leyes de la República del Perú. Cualquier controversia será
              sometida a los juzgados y tribunales competentes de la ciudad de Lima.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-border bg-muted/30">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 bg-amber-500 hover:bg-amber-400 text-black font-black text-sm uppercase tracking-wide rounded-xl transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
