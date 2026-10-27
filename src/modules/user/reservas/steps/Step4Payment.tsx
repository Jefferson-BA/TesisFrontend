// src/modules/user/reservas/steps/Step4Payment.tsx

import React from "react";
import {
  CreditCard,
  Smartphone,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Users,
  Utensils,
  Edit2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { StepHeader } from "../components/WizardUI";
import { cn } from "@/lib/utils";
import { LegalCheckboxes, type LegalCheckboxesValue } from "@/modules/shared/legal/LegalCheckboxes";

interface Step4PaymentProps {
  formData: any;
  setFormData: (data: any) => void;
  cartTotal?: number;
  cart?: any[];
  goToStep?: (step: number) => void;
  /** Callback para propagar si los checkboxes legales son válidos */
  onLegalChange?: (valid: boolean) => void;
}

export const Step4Payment = ({
  formData,
  setFormData,
  cartTotal = 0,
  cart = [],
  goToStep,
  onLegalChange,
}: Step4PaymentProps) => {
  const methods = [
    {
      id: "card",
      label: "Tarjeta de Crédito / Débito",
      desc: "Procesamiento seguro vía Culqi",
      icon: CreditCard,
      badge: "Recomendado",
    },
    {
      id: "yape",
      label: "Yape / Transferencia",
      desc: "Billetera digital BCP y banca móvil",
      icon: Smartphone,
      badge: "Rápido",
    },
  ];

  const safeTotal = typeof cartTotal === "number" && !isNaN(cartTotal) ? cartTotal : 0;

  const legal: LegalCheckboxesValue = {
    acceptedTerms: !!formData.acceptedTerms,
    acceptedPrivacy: !!formData.acceptedPrivacy,
  };

  const handleLegalChange = (v: LegalCheckboxesValue) => {
    setFormData({
      ...formData,
      acceptedTerms: v.acceptedTerms,
      acceptedPrivacy: v.acceptedPrivacy,
    });
    onLegalChange?.(v.acceptedTerms && v.acceptedPrivacy);
  };

  const bothAccepted = legal.acceptedTerms && legal.acceptedPrivacy;

  // Formato amigable de fecha
  const formattedDate = React.useMemo(() => {
    if (!formData.date) return "Fecha no especificada";
    try {
      const parts = formData.date.split("-");
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString("es-PE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      return formData.date;
    } catch {
      return formData.date;
    }
  }, [formData.date]);

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        icon={<CreditCard className="w-5 h-5 text-ember" />}
        title="Resumen y Garantía"
        sub="Verifica los detalles de tu evento y confirma tu método de pago preferido para asegurar la fecha."
        center
      />

      {/* Grid de Resumen: Evento y Menú */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tarjeta: Detalles del Evento */}
        <div className="p-5 rounded-2xl bg-card border border-border flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-ember" />
                Datos del Evento
              </span>
              {goToStep && (
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="text-[11px] font-semibold text-ember hover:underline flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3 h-3" /> Editar
                </button>
              )}
            </div>

            <div className="space-y-2.5 text-xs text-foreground">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-ember shrink-0 mt-0.5" />
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Fecha</span>
                  <span className="capitalize font-medium">{formattedDate}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-ember shrink-0 mt-0.5" />
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Hora</span>
                  <span className="font-medium">{formData.time || "12:00 PM"}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Users className="w-4 h-4 text-ember shrink-0 mt-0.5" />
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Invitados</span>
                  <span className="font-medium">{formData.guests ? `${formData.guests} personas` : "No especificado"} ({formData.eventType || "Boda"})</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-ember shrink-0 mt-0.5" />
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Lugar</span>
                  <span className="font-medium">
                    {formData.address ? `${formData.address}${formData.city ? `, ${formData.city}` : ""}` : "Por definir"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta: Menú Seleccionado */}
        <div className="p-5 rounded-2xl bg-card border border-border flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-ember" />
                Menú Seleccionado ({cart.length})
              </span>
              {goToStep && (
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="text-[11px] font-semibold text-ember hover:underline flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3 h-3" /> Editar
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground text-xs space-y-2">
                <p>No has añadido platos o servicios gastronómicos aún.</p>
                {goToStep && (
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="px-3 py-1.5 bg-ember/10 text-ember border border-ember/30 rounded-lg text-xs font-bold hover:bg-ember/20 transition-colors"
                  >
                    Seleccionar Menú
                  </button>
                )}
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {cart.map((item) => {
                  const hasDiscount = !!(item.originalPrice && item.originalPrice > item.price);
                  const unitOriginal = item.originalPrice !== undefined ? Number(item.originalPrice) : Number(item.price || 0);
                  const unitFinal = Number(item.price || 0);
                  const qty = Number(item.quantity || 1);

                  return (
                    <div key={item.id} className="flex items-center justify-between text-xs py-1.5 border-b border-border/40 last:border-none">
                      <div className="flex-1 truncate mr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-foreground truncate">{item.name}</span>
                          {item.promoLabel && (
                            <span className="inline-flex items-center text-[9px] font-black bg-amber-500 text-black px-1.5 py-0.2 rounded-full uppercase shrink-0">
                              {item.promoLabel}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                          <span>x{qty}</span>
                          {hasDiscount ? (
                            <>
                              <span className="line-through text-muted-foreground/60 font-mono">
                                S/ {unitOriginal.toFixed(2)}
                              </span>
                              <span className="text-amber-500 font-semibold font-mono">
                                S/ {unitFinal.toFixed(2)} c/u
                              </span>
                            </>
                          ) : (
                            <span className="font-mono">S/ {unitFinal.toFixed(2)} c/u</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {hasDiscount && (
                          <span className="block text-[10px] text-muted-foreground/60 line-through font-mono">
                            S/ {(unitOriginal * qty).toFixed(2)}
                          </span>
                        )}
                        <span className={cn("font-mono font-bold", hasDiscount ? "text-amber-500" : "text-foreground")}>
                          S/ {(unitFinal * qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {(() => {
            const rawTotal = cart.reduce((acc, item) => {
              const base = item.originalPrice !== undefined ? Number(item.originalPrice) : Number(item.price || 0);
              return acc + base * Number(item.quantity || 1);
            }, 0);
            const savings = Math.max(0, rawTotal - safeTotal);

            return (
              <div className="pt-3 mt-3 border-t border-border space-y-1.5">
                {savings > 0 && (
                  <>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Subtotal regular</span>
                      <span className="font-mono line-through text-muted-foreground/70">S/ {rawTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-ember" /> Descuento aplicado
                      </span>
                      <span className="font-mono font-bold">- S/ {savings.toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">Total Estimado</span>
                  <span className="text-lg font-bold font-serif text-ember">
                    S/ {safeTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Selector de Método de Garantía / Pago */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block text-center">
          Método de Garantía Preferido
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto w-full">
          {methods.map(({ id, label, desc, icon: Icon, badge }) => {
            const isSelected = formData.paymentMethod === id || (!formData.paymentMethod && id === "card");
            return (
              <button
                key={id}
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: id })}
                className={cn(
                  "p-4 rounded-xl flex items-center gap-3.5 text-left transition-all border relative",
                  isSelected
                    ? "bg-ember/10 border-ember shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                    : "bg-card border-border hover:border-ember/40 dark:bg-zinc-900/60"
                )}
              >
                <div
                  className={cn(
                    "p-2.5 rounded-lg shrink-0 transition-colors",
                    isSelected ? "bg-ember text-char-deep" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn("block text-xs font-bold truncate", isSelected ? "text-ember" : "text-foreground")}>
                      {label}
                    </span>
                  </div>
                  <span className="block text-[11px] text-muted-foreground truncate">{desc}</span>
                </div>
                {badge && (
                  <span className="absolute top-2 right-2 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nota Informativa de la Revisión */}
      <div className="max-w-xl mx-auto w-full p-4 rounded-xl bg-muted/40 border border-border/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-ember shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <p className="font-semibold text-foreground mb-0.5">Compromiso DeParraSpitz</p>
          Tu reserva pasará a una breve revisión técnica de agenda y logística por nuestro equipo. Una vez validada, te notificaremos para formalizar la garantía y asegurar tu fecha en el calendario.
        </div>
      </div>

      {/* Separador y Checkboxes Legales */}
      <div className="max-w-xl mx-auto w-full">
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Términos del Servicio</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Legal checkboxes */}
        <LegalCheckboxes
          value={legal}
          onChange={handleLegalChange}
        />

        {/* Alerta si aún no se han aceptado los términos */}
        {!bothAccepted && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Debes aceptar los Términos y Condiciones y la Política de Privacidad para poder confirmar tu reserva.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};