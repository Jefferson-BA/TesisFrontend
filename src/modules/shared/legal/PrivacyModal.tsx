// src/modules/shared/legal/PrivacyModal.tsx

import { X, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
}

export function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
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
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <Shield size={18} className="text-emerald-500" />
            </div>
            <div>
              <h2 id="privacy-modal-title" className="text-base font-black text-foreground uppercase tracking-wide">
                Política de Privacidad
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
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex gap-3">
            <AlertCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Tu privacidad es importante para nosotros. Esta política explica cómo recopilamos, usamos y protegemos tu información personal.
            </p>
          </div>

          <section className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" /> 1. Responsable del Tratamiento
            </h3>
            <p>
              El responsable del tratamiento de tus datos personales es <strong className="text-foreground">De Parras &amp; Pitz S.A.C.</strong>,
              con domicilio en Av. Principal 420, San Isidro, Lima, Perú. Para consultas sobre privacidad,
              puedes contactarnos en <strong className="text-foreground">privacidad@deparraspitz.com</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" /> 2. Datos que Recopilamos
            </h3>
            <p className="mb-2">Recopilamos los siguientes tipos de información:</p>
            <ul className="space-y-1.5 list-none">
              <li>• <strong className="text-foreground">Datos de identidad:</strong> nombre completo.</li>
              <li>• <strong className="text-foreground">Datos de contacto:</strong> correo electrónico y número de teléfono.</li>
              <li>• <strong className="text-foreground">Datos de reserva:</strong> fecha, tipo de evento, número de personas, menú seleccionado.</li>
              <li>• <strong className="text-foreground">Datos de pago:</strong> método de pago elegido (no almacenamos datos de tarjetas directamente; usamos pasarelas seguras).</li>
              <li>• <strong className="text-foreground">Datos de navegación:</strong> dirección IP, tipo de dispositivo y navegador (anonimizados).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" /> 3. Finalidad del Tratamiento
            </h3>
            <p className="mb-2">Utilizamos tus datos para:</p>
            <ul className="space-y-1.5 list-none">
              <li>• Gestionar y confirmar tus reservas y cotizaciones.</li>
              <li>• Enviarte comunicaciones relacionadas con tu servicio (confirmaciones, recordatorios).</li>
              <li>• Personalizar tu experiencia en la plataforma.</li>
              <li>• Informarte sobre promociones y ofertas especiales (solo si das tu consentimiento).</li>
              <li>• Cumplir con obligaciones legales y fiscales.</li>
              <li>• Mejorar la calidad de nuestros servicios mediante análisis estadísticos anónimos.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" /> 4. Base Legal
            </h3>
            <p>
              El tratamiento de tus datos se basa en: (a) la ejecución del contrato de servicio contigo,
              (b) el cumplimiento de obligaciones legales y (c) tu consentimiento expreso para
              comunicaciones de marketing. Puedes retirar tu consentimiento en cualquier momento sin que
              ello afecte la licitud del tratamiento previo.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" /> 5. Compartición de Datos
            </h3>
            <p className="mb-2">
              No vendemos ni alquilamos tus datos a terceros. Podemos compartirlos únicamente con:
            </p>
            <ul className="space-y-1.5 list-none">
              <li>• Proveedores de servicios tecnológicos (hosting, procesadores de pago) bajo acuerdos de confidencialidad.</li>
              <li>• Autoridades competentes cuando lo exija la ley.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" /> 6. Conservación de Datos
            </h3>
            <p>
              Conservamos tus datos personales durante el tiempo necesario para prestarte el servicio
              y durante los plazos legalmente establecidos (hasta <strong className="text-foreground">5 años</strong> para
              datos de facturación). Una vez vencidos estos plazos, los datos son eliminados o anonimizados.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" /> 7. Tus Derechos (ARCO)
            </h3>
            <p className="mb-2">
              Conforme a la Ley N° 29733 de Protección de Datos Personales del Perú, tienes derecho a:
            </p>
            <ul className="space-y-1.5 list-none">
              <li>• <strong className="text-foreground">Acceso:</strong> conocer qué datos tenemos sobre ti.</li>
              <li>• <strong className="text-foreground">Rectificación:</strong> corregir datos inexactos o incompletos.</li>
              <li>• <strong className="text-foreground">Cancelación:</strong> solicitar la eliminación de tus datos.</li>
              <li>• <strong className="text-foreground">Oposición:</strong> oponerte al tratamiento de tus datos.</li>
            </ul>
            <p className="mt-2">
              Para ejercer estos derechos, escríbenos a <strong className="text-foreground">privacidad@deparraspitz.com</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" /> 8. Seguridad
            </h3>
            <p>
              Aplicamos medidas técnicas y organizativas apropiadas para proteger tus datos: cifrado SSL/TLS
              en todas las transmisiones, control de acceso por roles, auditorías periódicas de seguridad y
              almacenamiento en servidores seguros. Sin embargo, ningún sistema es 100% infalible y no podemos
              garantizar la seguridad absoluta.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" /> 9. Cookies
            </h3>
            <p>
              Utilizamos cookies técnicas estrictamente necesarias para el funcionamiento de la plataforma
              (autenticación, sesión). No utilizamos cookies de seguimiento de terceros sin tu consentimiento.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" /> 10. Cambios en la Política
            </h3>
            <p>
              Podemos actualizar esta política periódicamente. Te notificaremos sobre cambios significativos
              mediante correo electrónico o un aviso destacado en la plataforma antes de que entren en vigor.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-border bg-muted/30">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wide rounded-xl transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
