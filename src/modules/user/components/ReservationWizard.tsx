import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useReservationWizard } from "../hooks/useReservationWizard";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import type { Product } from "@/modules/user/interfaces/product.interface";

import { Button } from "@/components/ui/button";
import { Input as CustomInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  User, Mail, Phone, MapPin, Calendar, Clock, Users,
  CreditCard, Smartphone, ArrowRightLeft, ChevronLeft,
  ChevronRight, CheckCircle2, Utensils, Sparkles,
  ShoppingBag, Flame, Ticket, FileText,
} from "lucide-react";

/* ─────────────────────────────────────────────
   COLORES DE MARCA  (dorado árabe en lugar de
   amarillo genérico)
───────────────────────────────────────────── */
const GOLD = "#C9974A";
const GOLD_LIGHT = "#E8B96A";

const stepVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 28 : -28 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -28 : 28, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }),
};

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────── */
export default function ReservationWizard() {
  const wizard = useReservationWizard();

  const steps = [
    { id: 1, label: "Contacto",      desc: "Datos del titular"    },
    { id: 2, label: "Menú",          desc: "Selección culinaria"  },
    { id: 3, label: "Evento",        desc: "Logística"            },
    { id: 4, label: "Garantía",      desc: "Asegurar fecha"       },
  ];

  const progress = ((wizard.currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-6">

      {/* Luces ambientales */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[160px] pointer-events-none"
           style={{ background: "radial-gradient(ellipse, rgba(201,151,74,0.07) 0%, transparent 70%)" }} />

      <div
        className="relative p-0 rounded-[28px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.9)]"
        style={{ background: "#13100D", border: "1px solid rgba(201,151,74,0.18)" }}
      >

        {/* ── HEADER CON PATRÓN GEOMÉTRICO ÁRABE ── */}
        <div className="relative px-10 pt-10 pb-8 overflow-hidden"
             style={{ background: "#1A1410", borderBottom: "1px solid rgba(201,151,74,0.15)" }}>

          {/* Arabesco SVG de fondo */}
          <svg
            className="absolute top-0 right-0 opacity-[0.055] pointer-events-none"
            width="260" height="220" viewBox="0 0 260 220" fill="none"
          >
            <polygon points="130,12 218,62 218,158 130,208 42,158 42,62"
                     stroke={GOLD} strokeWidth="1" fill="none"/>
            <polygon points="130,34 196,74 196,146 130,186 64,146 64,74"
                     stroke={GOLD} strokeWidth="0.6" fill="none"/>
            <polygon points="130,56 174,82 174,138 130,164 86,138 86,82"
                     stroke={GOLD} strokeWidth="0.4" fill="none"/>
            {[[42,62],[218,62],[218,158],[42,158]].map(([x,y],i)=>(
              <line key={i} x1={x} y1={y} x2="130" y2="110"
                    stroke={GOLD} strokeWidth="0.3"/>
            ))}
            <circle cx="130" cy="110" r="10" stroke={GOLD} strokeWidth="0.5" fill="none"/>
            <circle cx="130" cy="110" r="4"  fill={GOLD} opacity="0.35"/>
          </svg>

          {/* Eyebrow ornamental */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}55)` }}/>
            <span className="text-[10px] font-black tracking-[0.25em] uppercase"
                  style={{ color: GOLD }}>DeParraSpitz Catering</span>
            <div className="h-px flex-1" style={{ background: `linear-gradient(270deg, transparent, ${GOLD}55)` }}/>
          </div>

          <h1 className="text-4xl font-serif font-normal text-white tracking-tight leading-tight">
            Reserva tu{" "}
            <em className="font-serif not-italic font-light" style={{ color: GOLD }}>evento</em>
          </h1>
          <p className="text-sm mt-2 font-light" style={{ color: "#7A6A55" }}>
            Cuatro pasos para recibir una propuesta de catering a tu medida.
          </p>
        </div>

        {/* ── BARRA DE PASOS ── */}
        <div className="flex items-start justify-center gap-0 px-10 pt-8 pb-0"
             style={{ background: "#13100D" }}>
          {steps.map((step, idx) => {
            const isActive    = wizard.currentStep === step.id;
            const isCompleted = wizard.currentStep  > step.id;

            return (
              <div key={step.id} className="flex flex-col items-center flex-1 relative">

                {/* Conector entre pasos */}
                {idx < steps.length - 1 && (
                  <div className="absolute top-[18px] left-[calc(50%+18px)] right-0 h-px"
                       style={{ width: "calc(100% - 36px)", background: "rgba(201,151,74,0.15)" }}>
                    <motion.div
                      className="h-full"
                      style={{ background: GOLD, opacity: 0.55 }}
                      initial={false}
                      animate={{ width: wizard.currentStep > step.id ? "100%" : "0%" }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                )}

                {/* Círculo del paso */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all duration-300"
                  style={{
                    border: isActive || isCompleted
                      ? `1px solid ${GOLD}`
                      : "1px solid rgba(201,151,74,0.2)",
                    background: isActive
                      ? GOLD
                      : isCompleted
                        ? "rgba(201,151,74,0.1)"
                        : "#1A1410",
                    color: isActive ? "#0A0806" : isCompleted ? GOLD : "#5A4A35",
                    transform: isActive ? "scale(1.12)" : "scale(1)",
                    boxShadow: isActive ? `0 0 0 4px rgba(201,151,74,0.12)` : "none",
                  }}
                >
                  {isCompleted
                    ? <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                    : step.id}
                </div>

                <span className={`text-[10px] tracking-widest uppercase font-bold mt-3 hidden md:block transition-colors`}
                      style={{ color: isActive ? GOLD : isCompleted ? "#7A6A55" : "#3A2E22" }}>
                  {step.label}
                </span>
                <span className="text-[9px] mt-0.5 hidden md:block font-light mb-4"
                      style={{ color: "#3A2E22" }}>
                  {step.desc}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── CONTENIDO DEL PASO ── */}
        <div className="min-h-[360px] px-10 py-8 overflow-hidden">
          <AnimatePresence mode="wait" custom={1} initial={false}>
            <motion.div
              key={wizard.currentStep}
              custom={1}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {wizard.currentStep === 1 && (
                <Step1Contact formData={wizard.formData} handleChange={wizard.handleChange} />
              )}
              {wizard.currentStep === 2 && (
                <Step2Menu products={wizard.products} isLoading={wizard.isLoadingProducts} />
              )}
              {wizard.currentStep === 3 && (
                <Step3Logistics formData={wizard.formData} handleChange={wizard.handleChange} wizard={wizard} />
              )}
              {wizard.currentStep === 4 && (
                <Step4Payment formData={wizard.formData} setFormData={wizard.setFormData} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── NAVEGACIÓN ── */}
        <div className="flex justify-between items-center px-10 py-6"
             style={{ borderTop: "1px solid rgba(201,151,74,0.12)", background: "#13100D" }}>

          {wizard.currentStep > 1 ? (
            <button
              type="button"
              onClick={wizard.prevStep}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all"
              style={{
                border: "1px solid rgba(201,151,74,0.2)",
                color: "#7A6A55",
                background: "transparent",
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,151,74,0.5)";
                (e.currentTarget as HTMLButtonElement).style.color = "#C9974A";
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,151,74,0.2)";
                (e.currentTarget as HTMLButtonElement).style.color = "#7A6A55";
              }}
            >
              <ChevronLeft className="w-4 h-4" /> Volver
            </button>
          ) : (
            <div />
          )}

          {wizard.currentStep < 4 ? (
            <button
              type="button"
              onClick={wizard.nextStep}
              className="flex items-center gap-2 px-7 py-3 rounded-xl text-xs uppercase tracking-widest font-black transition-all"
              style={{ background: GOLD, color: "#0A0806", border: "none" }}
              onMouseOver={e => (e.currentTarget as HTMLButtonElement).style.background = GOLD_LIGHT}
              onMouseOut={e  => (e.currentTarget as HTMLButtonElement).style.background = GOLD}
            >
              Continuar <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={wizard.submitReservation}
              className="flex items-center gap-2 px-7 py-3 rounded-xl text-xs uppercase tracking-widest font-black transition-all"
              style={{ background: "linear-gradient(135deg,#1a7a4a,#27ae60)", color: "#fff", border: "none" }}
            >
              <CheckCircle2 className="w-4 h-4" /> Finalizar reserva
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PASO 1 — Contacto
───────────────────────────────────────────── */
const Step1Contact = ({ formData, handleChange }: any) => (
  <div className="space-y-6">
    <StepHeader icon={<User className="w-5 h-5" />} title="Datos del titular"
      sub="Información para personalizar su propuesta de catering." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
      <InputField label="Nombre completo"       name="name"  value={formData.name}  onChange={handleChange} placeholder="Ej. Juan Pérez"       icon={<User  className="w-4 h-4"/>} />
      <InputField label="Correo electrónico"    name="email" value={formData.email} onChange={handleChange} placeholder="juan@ejemplo.com"      icon={<Mail  className="w-4 h-4"/>} type="email" />
      <InputField label="Teléfono / WhatsApp"   name="phone" value={formData.phone} onChange={handleChange} placeholder="Ej. 987 654 321"       icon={<Phone className="w-4 h-4"/>} />
      <InputField label="Ciudad de residencia"  name="city"  value={formData.city}  onChange={handleChange} placeholder="Ej. Lima"              icon={<MapPin className="w-4 h-4"/>} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   PASO 2 — Menú
───────────────────────────────────────────── */
const Step2Menu = ({ products, isLoading }: { products: Product[]; isLoading: boolean }) => {
  const addToCart = useCartStore((s) => s.addToCart);
  const cart      = useCartStore((s) => s.cart);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
           style={{ borderColor: `${GOLD} transparent transparent transparent` }}/>
      <p className="text-xs tracking-widest uppercase font-medium" style={{ color: GOLD }}>
        Consultando propuestas culinarias…
      </p>
    </div>
  );

  if (products.length === 0) return (
    <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
           style={{ background: "#1A1410", border: "1px solid rgba(201,151,74,0.2)", color: GOLD }}>
        <Utensils className="w-6 h-6"/>
      </div>
      <h3 className="text-lg font-serif font-normal text-white">Carta no disponible</h3>
      <p className="text-sm font-light max-w-xs" style={{ color: "#7A6A55" }}>
        No pudimos cargar las propuestas. Puedes continuar y coordinar el menú con nuestro equipo.
      </p>
    </div>
  );

  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center pb-4"
           style={{ borderBottom: "1px solid rgba(201,151,74,0.12)" }}>
        <StepHeader icon={<Utensils className="w-5 h-5"/>} title="Menú & Estaciones"
          sub="Selecciona las experiencias gastronómicas para su banquete." />
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl shrink-0"
             style={{ background: "#1A1410", border: "1px solid rgba(201,151,74,0.2)" }}>
          <ShoppingBag className="w-3.5 h-3.5" style={{ color: GOLD }}/>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
            {totalItems} añadido{totalItems !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[340px] overflow-y-auto pr-1"
           style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(201,151,74,0.25) transparent" }}>
        {products.map((p) => {
          const inCart = cart.find((i) => i.id === p.id);
          return (
            <div
              key={p.id}
              className="relative p-4 rounded-xl flex flex-col gap-3 transition-all duration-300"
              style={{
                background: inCart ? "rgba(201,151,74,0.05)" : "#1A1410",
                border: `1px solid ${inCart ? "rgba(201,151,74,0.55)" : "rgba(201,151,74,0.12)"}`,
              }}
            >
              {p.isPromo && (
                <span className="absolute -top-2.5 right-3 flex items-center gap-1 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{ background: "linear-gradient(135deg,#c0392b,#e67e22)" }}>
                  <Flame size={10}/> Promo
                </span>
              )}
              <div>
                <h3 className="text-sm font-serif font-medium text-white">{p.name}</h3>
                <p className="text-[11px] mt-1.5 line-clamp-2 font-light" style={{ color: "#7A6A55" }}>
                  {p.description || "Servicio gourmet exclusivo listo para el despliegue."}
                </p>
              </div>
              <div className="flex justify-between items-center pt-2"
                   style={{ borderTop: "1px solid rgba(201,151,74,0.1)" }}>
                <span className="text-sm font-black" style={{ color: GOLD }}>
                  S/ {Number(p.price).toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => addToCart({ id: p.id, name: p.name, price: Number(p.price) })}
                  className="px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all"
                  style={{
                    background: inCart ? GOLD : "rgba(201,151,74,0.08)",
                    border: `1px solid ${inCart ? GOLD : "rgba(201,151,74,0.25)"}`,
                    color: inCart ? "#0A0806" : GOLD,
                  }}
                >
                  {inCart ? `✓ Añadido (${inCart.quantity})` : "Añadir"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   PASO 3 — Logística
───────────────────────────────────────────── */
const Step3Logistics = ({ formData, handleChange, wizard }: any) => (
  <div className="space-y-6">
    <StepHeader icon={<Sparkles className="w-5 h-5"/>} title="Logística del evento"
      sub="Coordenadas esenciales para el despliegue del equipo." />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
      <div className="md:col-span-2">
        <InputField label="Dirección de la locación / local" name="address" value={formData.address}
          onChange={handleChange} placeholder="Ej. Hacienda Los Ficus, Pachacamac" icon={<MapPin className="w-4 h-4"/>} />
      </div>
      <InputField label="Fecha del evento"      name="date"   type="date"   value={formData.date}   onChange={handleChange} icon={<Calendar className="w-4 h-4"/>} />
      <InputField label="Hora de inicio"        name="time"   type="time"   value={formData.time}   onChange={handleChange} icon={<Clock    className="w-4 h-4"/>} />
      <InputField label="N.° de invitados"      name="guests" type="number" value={formData.guests} onChange={handleChange} placeholder="Ej. 150" icon={<Users className="w-4 h-4"/>} />

      <div className="space-y-2 flex flex-col justify-end">
        <Label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7A6A55" }}>
          Tipo de celebración
        </Label>
        <Select
          value={formData.eventType || "Boda"}
          onValueChange={(v) => wizard.setFormData({ ...formData, eventType: v })}
        >
          <SelectTrigger className="h-11 rounded-xl px-4 text-xs font-medium"
            style={{ background: "#1A1410", border: "1px solid rgba(201,151,74,0.2)", color: "#D4C4A8" }}>
            <SelectValue placeholder="Seleccione formato"/>
          </SelectTrigger>
          <SelectContent style={{ background: "#1A1410", border: "1px solid rgba(201,151,74,0.2)", color: "#D4C4A8" }}>
            <SelectItem value="Boda">💍 Boda / Matrimonio</SelectItem>
            <SelectItem value="Corporativo">💼 Evento Corporativo</SelectItem>
            <SelectItem value="Cumpleaños">🎉 Cumpleaños / Fiesta Privada</SelectItem>
            <SelectItem value="Aniversario">✨ Aniversario / Gala</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7A6A55" }}>
            Notas adicionales
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 pointer-events-none" style={{ color: "#5A4A35" }}>
              <FileText className="w-4 h-4"/>
            </span>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Alergias, estilo de menú, requerimientos especiales…"
              className="w-full pl-11 pr-4 py-3 rounded-xl text-xs font-medium resize-none outline-none transition-all"
              style={{
                background: "#1A1410",
                border: "1px solid rgba(201,151,74,0.2)",
                color: "#D4C4A8",
              }}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Ticket-resumen animado */}
    {(formData.date || formData.guests) && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(201,151,74,0.2)" }}
      >
        <div className="flex items-center gap-2 px-4 py-3 text-[10px] uppercase tracking-widest font-bold"
             style={{ background: "#211C16", color: GOLD }}>
          <Ticket className="w-3.5 h-3.5"/> Resumen del evento
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 px-4 py-3 text-sm"
             style={{ background: "#1A1410" }}>
          {formData.date && (
            <p style={{ color: "#D4C4A8" }}>
              <span style={{ color: "#7A6A55" }}>Fecha: </span>
              <strong className="font-medium">{formData.date}</strong>
              {formData.time && <span style={{ color: "#7A6A55" }}> · {formData.time}</span>}
            </p>
          )}
          {formData.guests && (
            <p style={{ color: "#D4C4A8" }}>
              <span style={{ color: "#7A6A55" }}>Invitados: </span>
              <strong className="font-medium">{formData.guests}</strong>
            </p>
          )}
          {formData.eventType && (
            <p>
              <span style={{ color: "#7A6A55" }}>Tipo: </span>
              <strong className="font-medium" style={{ color: GOLD }}>{formData.eventType}</strong>
            </p>
          )}
        </div>
      </motion.div>
    )}
  </div>
);

/* ─────────────────────────────────────────────
   PASO 4 — Pago
───────────────────────────────────────────── */
const Step4Payment = ({ formData, setFormData }: any) => {
  const methods = [
    { id: "card", label: "Tarjeta",  desc: "Crédito o débito",      icon: CreditCard,      selColor: GOLD,      selText: "#0A0806", selBg: "rgba(201,151,74,0.08)" },
    { id: "yape", label: "Yape",     desc: "Billetera BCP",          icon: Smartphone,      selColor: "#9b59b6", selText: "#fff",    selBg: "rgba(155,89,182,0.08)" },
    { id: "plin", label: "Plin",     desc: "Transferencia directa",  icon: ArrowRightLeft,  selColor: "#00b4d8", selText: "#fff",    selBg: "rgba(0,180,216,0.08)"  },
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      <StepHeader icon={<CreditCard className="w-5 h-5"/>} title="Método de garantía"
        sub="Selecciona el método para asegurar tu fecha en nuestra agenda." center />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg">
        {methods.map(({ id, label, desc, icon: Icon, selColor, selText, selBg }) => {
          const selected = formData.paymentMethod === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setFormData({ ...formData, paymentMethod: id })}
              className="p-5 rounded-2xl text-left flex flex-col gap-3 h-32 transition-all duration-300"
              style={{
                background: selected ? selBg : "#1A1410",
                border: `1px solid ${selected ? selColor : "rgba(201,151,74,0.15)"}`,
                boxShadow: selected ? `0 0 20px ${selColor}22` : "none",
              }}
            >
              <Icon className="w-5 h-5" style={{ color: selected ? selColor : "#5A4A35" }}/>
              <div>
                <span className="text-xs font-black uppercase tracking-wider block"
                      style={{ color: selected ? selText : "#D4C4A8" }}>
                  {label}
                </span>
                <span className="text-[10px] font-medium block mt-0.5"
                      style={{ color: selected ? `${selColor}bb` : "#5A4A35" }}>
                  {desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] font-light text-center max-w-md leading-relaxed" style={{ color: "#5A4A35" }}>
        La garantía confirma tu fecha en nuestra agenda. El saldo restante
        se coordina antes del evento según el método elegido.
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────
   HELPERS COMPARTIDOS
───────────────────────────────────────────── */
const StepHeader = ({ icon, title, sub, center = false }: {
  icon: React.ReactNode; title: string; sub: string; center?: boolean;
}) => (
  <div className={`mb-1 ${center ? "text-center flex flex-col items-center" : ""}`}>
    <h2 className={`text-xl font-serif font-normal text-white flex items-center gap-2.5 ${center ? "justify-center" : ""}`}>
      <span style={{ color: GOLD }}>{icon}</span>
      {title}
    </h2>
    <p className="text-xs mt-1 font-light" style={{ color: "#7A6A55" }}>{sub}</p>
  </div>
);

const InputField = ({ label, icon, type = "text", ...props }: any) => (
  <div className="space-y-2 flex flex-col">
    <Label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7A6A55" }}>
      {label}
    </Label>
    <div className="relative flex items-center group">
      {icon && (
        <span className="absolute left-4 pointer-events-none transition-colors duration-200"
              style={{ color: "#5A4A35" }}>
          {icon}
        </span>
      )}
      <CustomInput
        type={type}
        className={`h-11 rounded-xl text-xs font-medium transition-all outline-none ${icon ? "pl-11" : "px-4"}`}
        style={{
          background: "#1A1410",
          border: "1px solid rgba(201,151,74,0.2)",
          color: "#D4C4A8",
        }}
        onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
        onBlur={e  => (e.currentTarget.style.borderColor = "rgba(201,151,74,0.2)")}
        {...props}
      />
    </div>
  </div>
);