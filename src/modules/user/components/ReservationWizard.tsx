import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useReservationWizard } from "../hooks/useReservationWizard";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import type { Product } from "@/modules/user/interfaces/product.interface";

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
  ShoppingBag, Flame, Ticket, FileText, Star,
  ShoppingCart, Plus, Minus, ChefHat,
} from "lucide-react";

const GOLD       = "#C9974A";
const GOLD_LIGHT = "#E8B96A";

/* ─── variantes de animación del wizard ─── */
const stepVariants: Variants = {
  enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ? 36 : -36, scale: 0.97 }),
  center: {
    opacity: 1, x: 0, scale: 1,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as any },
  },
  exit: (dir: number) => ({
    opacity: 0, x: dir > 0 ? -36 : 36, scale: 0.97,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as any },
  }),
};

/* ════════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════════ */
export default function ReservationWizard() {
  const wizard = useReservationWizard();

  const steps = [
    { id: 1, label: "Contacto", desc: "Datos del titular",   icon: User      },
    { id: 2, label: "Menú",     desc: "Selección culinaria", icon: Utensils  },
    { id: 3, label: "Evento",   desc: "Logística",           icon: Calendar  },
    { id: 4, label: "Garantía", desc: "Asegurar fecha",      icon: CreditCard },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-6">

      <div className="absolute -top-20 left-1/4 w-[380px] h-[260px] rounded-full blur-[180px] pointer-events-none"
           style={{ background: "radial-gradient(ellipse, rgba(201,151,74,0.08) 0%, transparent 70%)" }} />
      <div className="absolute top-1/3 -right-12 w-[200px] h-[400px] rounded-full blur-[150px] pointer-events-none"
           style={{ background: "radial-gradient(ellipse, rgba(201,151,74,0.04) 0%, transparent 70%)" }} />

      <div className="relative rounded-[28px] overflow-hidden shadow-[0_32px_90px_rgba(0,0,0,0.9)]"
           style={{ background: "#13100D", border: "1px solid rgba(201,151,74,0.18)" }}>

        <Header />
        <Stepper steps={steps} currentStep={wizard.currentStep} />

        <div className="min-h-[400px] px-8 md:px-10 py-8 overflow-hidden">
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

        <NavBar
          currentStep={wizard.currentStep}
          totalSteps={steps.length}
          prevStep={wizard.prevStep}
          nextStep={wizard.nextStep}
          submitReservation={wizard.submitReservation}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   HEADER
════════════════════════════════════════════ */
const Header = () => (
  <div className="relative px-8 md:px-10 pt-10 pb-8 overflow-hidden"
       style={{ background: "#1A1410", borderBottom: "1px solid rgba(201,151,74,0.15)" }}>

    <svg className="absolute top-0 right-0 opacity-[0.055] pointer-events-none"
         width="280" height="240" viewBox="0 0 280 240" fill="none">
      <polygon points="140,14 230,68 230,172 140,226 50,172 50,68"
               stroke={GOLD} strokeWidth="1" fill="none"/>
      <polygon points="140,36 208,80 208,160 140,204 72,160 72,80"
               stroke={GOLD} strokeWidth="0.6" fill="none"/>
      <polygon points="140,60 184,88 184,152 140,180 96,152 96,88"
               stroke={GOLD} strokeWidth="0.4" fill="none"/>
      <circle cx="140" cy="120" r="14" stroke={GOLD} strokeWidth="0.5" fill="none"/>
      <circle cx="140" cy="120" r="5" fill={GOLD} opacity="0.3"/>
    </svg>

    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}55)` }}/>
        <div className="flex items-center gap-2">
          <ChefHat className="w-3.5 h-3.5" style={{ color: GOLD }} />
          <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: GOLD }}>
            DeParraSpitz Catering
          </span>
        </div>
        <div className="h-px flex-1" style={{ background: `linear-gradient(270deg, transparent, ${GOLD}55)` }}/>
      </div>
      <h1 className="text-4xl font-serif font-normal text-white tracking-tight leading-tight">
        Reserva tu{" "}
        <em className="font-serif not-italic font-light" style={{ color: GOLD }}>evento</em>
      </h1>
      <p className="text-sm mt-2 font-light" style={{ color: "#7A6A55" }}>
        Cuatro pasos para recibir una propuesta de catering a tu medida.
      </p>
    </motion.div>
  </div>
);

/* ════════════════════════════════════════════
   STEPPER
════════════════════════════════════════════ */
const Stepper = ({ steps, currentStep }: { steps: any[]; currentStep: number }) => (
  <div className="flex items-start justify-center gap-0 px-8 md:px-10 pt-8 pb-0"
       style={{ background: "#13100D" }}>
    {steps.map((step, idx) => {
      const isActive    = currentStep === step.id;
      const isCompleted = currentStep  > step.id;
      const Icon        = step.icon;
      return (
        <div key={step.id} className="flex flex-col items-center flex-1 relative">
          {idx < steps.length - 1 && (
            <div className="absolute top-[18px] left-[calc(50%+18px)] h-px"
                 style={{ width: "calc(100% - 36px)", background: "rgba(201,151,74,0.12)" }}>
              <motion.div
                className="h-full"
                style={{ background: GOLD, opacity: 0.5 }}
                initial={false}
                animate={{ width: currentStep > step.id ? "100%" : "0%" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
              />
            </div>
          )}
          <motion.div
            className="w-9 h-9 rounded-full flex items-center justify-center z-10"
            animate={{
              border: isActive || isCompleted ? `1px solid ${GOLD}` : "1px solid rgba(201,151,74,0.2)",
              background: isActive ? GOLD : isCompleted ? "rgba(201,151,74,0.12)" : "#1A1410",
              scale: isActive ? 1.12 : 1,
              boxShadow: isActive ? `0 0 0 5px rgba(201,151,74,0.1)` : "none",
            }}
            transition={{ duration: 0.35 }}
          >
            {isCompleted
              ? <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} style={{ color: GOLD }} />
              : <Icon className="w-4 h-4" style={{ color: isActive ? "#0A0806" : "#5A4A35" }} />
            }
          </motion.div>
          <motion.span
            className="text-[10px] tracking-widest uppercase font-bold mt-3 hidden md:block"
            animate={{ color: isActive ? GOLD : isCompleted ? "#7A6A55" : "#3A2E22" }}
          >
            {step.label}
          </motion.span>
          <span className="text-[9px] mt-0.5 hidden md:block font-light mb-5" style={{ color: "#3A2E22" }}>
            {step.desc}
          </span>
        </div>
      );
    })}
  </div>
);

/* ════════════════════════════════════════════
   PASO 1 — Contacto
════════════════════════════════════════════ */
const Step1Contact = ({ formData, handleChange }: any) => (
  <div className="space-y-6">
    <StepHeader icon={<User className="w-5 h-5" />} title="Datos del titular"
      sub="Información para personalizar su propuesta de catering." />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
      <InputField label="Nombre completo"      name="name"  value={formData.name}  onChange={handleChange} placeholder="Ej. Juan Pérez"   icon={<User   className="w-4 h-4"/>} />
      <InputField label="Correo electrónico"   name="email" value={formData.email} onChange={handleChange} placeholder="juan@ejemplo.com"  icon={<Mail   className="w-4 h-4"/>} type="email" />
      <InputField label="Teléfono / WhatsApp"  name="phone" value={formData.phone} onChange={handleChange} placeholder="Ej. 987 654 321"   icon={<Phone  className="w-4 h-4"/>} />
      <InputField label="Ciudad de residencia" name="city"  value={formData.city}  onChange={handleChange} placeholder="Ej. Lima"          icon={<MapPin className="w-4 h-4"/>} />
    </div>

    {/* Tarjetas decorativas */}
    <div className="grid grid-cols-3 gap-3 mt-2">
      {[
        { emoji: "🥂", label: "Bodas & Galas",   sub: "Experiencias únicas"   },
        { emoji: "🍽️", label: "Eventos Corp.",    sub: "Servicio ejecutivo"    },
        { emoji: "🎂", label: "Fiestas privadas", sub: "Celebraciones íntimas" },
      ].map((c) => (
        <div key={c.label} className="rounded-xl p-3 text-center"
             style={{ background: "#1A1410", border: "1px solid rgba(201,151,74,0.12)" }}>
          <div className="text-2xl mb-1">{c.emoji}</div>
          <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#D4C4A8" }}>{c.label}</p>
          <p className="text-[9px] mt-0.5 font-light" style={{ color: "#5A4A35" }}>{c.sub}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ════════════════════════════════════════════
   PASO 2 — Menú  (usa imágenes del producto)
════════════════════════════════════════════ */
const Step2Menu = ({ products, isLoading }: { products: Product[]; isLoading: boolean }) => {
  const addToCart      = useCartStore((s) => s.addToCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const cart           = useCartStore((s) => s.cart);
  const totalItems     = cart.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice     = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 animate-spin"
             style={{ borderColor: `${GOLD} transparent transparent transparent` }}/>
        <div className="absolute inset-2 rounded-full border animate-spin"
             style={{ borderColor: `rgba(201,151,74,0.3) transparent transparent transparent`, animationDuration: "1.5s" }}/>
      </div>
      <p className="text-xs tracking-widest uppercase font-medium" style={{ color: GOLD }}>
        Cargando propuestas culinarias…
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

  return (
    <div className="space-y-5">

      {/* Header con contador */}
      <div className="flex flex-wrap justify-between items-start gap-3 pb-5"
           style={{ borderBottom: "1px solid rgba(201,151,74,0.12)" }}>
        <StepHeader icon={<Utensils className="w-5 h-5"/>} title="Menú & Estaciones"
          sub="Selecciona las experiencias gastronómicas para su banquete." />

        <AnimatePresence>
          {totalItems > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="flex flex-col items-end gap-0.5 px-4 py-2 rounded-xl shrink-0"
              style={{ background: "#1A1410", border: "1px solid rgba(201,151,74,0.3)" }}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-3.5 h-3.5" style={{ color: GOLD }}/>
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#D4C4A8" }}>
                  {totalItems} {totalItems === 1 ? "servicio" : "servicios"}
                </span>
              </div>
              <span className="text-[10px] font-black" style={{ color: GOLD }}>
                S/ {totalPrice.toFixed(2)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid de productos — imagen del producto real */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[420px] overflow-y-auto pr-1"
           style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(201,151,74,0.25) transparent" }}>
        {products.map((p) => {
          const inCart = cart.find((i) => i.id === p.id);
          // imageUrl puede llamarse p.image, p.imageUrl, p.photo — ajusta al campo real de tu API
          const imgSrc = (p as any).imageUrl || (p as any).image || (p as any).photo || null;

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="relative rounded-2xl overflow-hidden flex flex-col group"
              style={{
                background: "#1A1410",
                border: `1px solid ${inCart ? "rgba(201,151,74,0.6)" : "rgba(201,151,74,0.12)"}`,
                boxShadow: inCart ? "0 0 24px rgba(201,151,74,0.1)" : "none",
                transition: "border-color 0.25s, box-shadow 0.25s",
              }}
            >
              {/* ── Imagen del producto ── */}
              <div className="relative overflow-hidden" style={{ height: imgSrc ? 140 : 0 }}>
                {imgSrc && (
                  <>
                    <img
                      src={imgSrc}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ filter: inCart ? "brightness(1)" : "brightness(0.75) saturate(0.85)" }}
                    />
                    {/* Degradado al pie de la imagen */}
                    <div className="absolute inset-0 pointer-events-none"
                         style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(13,10,7,0.85) 100%)" }}/>

                    {/* Precio sobre la imagen */}
                    <div className="absolute bottom-2 right-2">
                      <span className="text-sm font-black px-2 py-0.5 rounded-lg"
                            style={{ background: "rgba(0,0,0,0.65)", color: GOLD }}>
                        S/ {Number(p.price).toFixed(2)}
                      </span>
                    </div>

                    {/* Check cuando está en carrito */}
                    <AnimatePresence>
                      {inCart && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ background: GOLD }}
                        >
                          <CheckCircle2 className="w-4 h-4" style={{ color: "#0A0806" }}/>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}

                {/* Badge promo */}
                {p.isPromo && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                        style={{ background: "linear-gradient(135deg,#c0392b,#e67e22)" }}>
                    <Flame className="w-2.5 h-2.5"/> Promo
                  </span>
                )}
              </div>

              {/* ── Info ── */}
              <div className="flex flex-col gap-2 p-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-serif font-medium leading-snug" style={{ color: "#E8D9C0" }}>
                    {p.name}
                  </h3>
                  {/* Precio aquí si no hay imagen */}
                  {!imgSrc && (
                    <span className="text-sm font-black shrink-0" style={{ color: GOLD }}>
                      S/ {Number(p.price).toFixed(2)}
                    </span>
                  )}
                </div>

                <p className="text-[10px] font-light leading-relaxed line-clamp-2 flex-1"
                   style={{ color: "#7A6A55" }}>
                  {p.description || "Servicio gourmet exclusivo para su celebración."}
                </p>

                {/* Controles +/- */}
                <div className="flex items-center gap-2 pt-2"
                     style={{ borderTop: "1px solid rgba(201,151,74,0.08)" }}>
                  {inCart ? (
                    <div className="flex items-center gap-2 w-full justify-between">
                      <button
                        type="button"
                        onClick={() => removeFromCart(p.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                        style={{ background: "rgba(201,151,74,0.1)", border: "1px solid rgba(201,151,74,0.3)", color: GOLD }}
                      >
                        <Minus className="w-3 h-3"/>
                      </button>
                      <span className="text-sm font-black" style={{ color: GOLD }}>{inCart.quantity}</span>
                      <button
                        type="button"
                        onClick={() => addToCart({ id: p.id, name: p.name, price: Number(p.price) })}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: GOLD, border: "none", color: "#0A0806" }}
                      >
                        <Plus className="w-3 h-3"/>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addToCart({ id: p.id, name: p.name, price: Number(p.price) })}
                      className="w-full py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 transition-all"
                      style={{
                        background: "rgba(201,151,74,0.08)",
                        border: "1px solid rgba(201,151,74,0.25)",
                        color: GOLD,
                      }}
                    >
                      <Plus className="w-3 h-3"/> Añadir
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Resumen pie */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(201,151,74,0.2)" }}
          >
            <div className="flex items-center justify-between px-4 py-3"
                 style={{ background: "#211C16" }}>
              <div className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5" style={{ color: GOLD }}/>
                <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: GOLD }}>
                  Servicios seleccionados
                </span>
              </div>
              <span className="text-sm font-black" style={{ color: GOLD }}>
                S/ {totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="px-4 py-2 flex flex-wrap gap-2" style={{ background: "#1A1410" }}>
              {cart.map((item) => (
                <span key={item.id} className="text-[10px] px-2.5 py-1 rounded-lg font-medium"
                      style={{ background: "rgba(201,151,74,0.08)", border: "1px solid rgba(201,151,74,0.2)", color: "#D4C4A8" }}>
                  {item.name} ×{item.quantity}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ════════════════════════════════════════════
   PASO 3 — Logística
════════════════════════════════════════════ */
const Step3Logistics = ({ formData, handleChange, wizard }: any) => (
  <div className="space-y-6">
    <StepHeader icon={<Sparkles className="w-5 h-5"/>} title="Logística del evento"
      sub="Coordenadas esenciales para el despliegue del equipo." />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
      <div className="md:col-span-2">
        <InputField label="Dirección de la locación" name="address" value={formData.address}
          onChange={handleChange} placeholder="Ej. Hacienda Los Ficus, Pachacamac"
          icon={<MapPin className="w-4 h-4"/>} />
      </div>
      <InputField label="Fecha del evento"  name="date"   type="date"   value={formData.date}   onChange={handleChange} icon={<Calendar className="w-4 h-4"/>} />
      <InputField label="Hora de inicio"    name="time"   type="time"   value={formData.time}   onChange={handleChange} icon={<Clock    className="w-4 h-4"/>} />
      <InputField label="N.° de invitados"  name="guests" type="number" value={formData.guests} onChange={handleChange} placeholder="Ej. 150" icon={<Users className="w-4 h-4"/>} />

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

      <div className="md:col-span-2 space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7A6A55" }}>
          Notas adicionales
        </Label>
        <div className="relative">
          <span className="absolute left-4 top-3.5 pointer-events-none" style={{ color: "#5A4A35" }}>
            <FileText className="w-4 h-4"/>
          </span>
          <textarea
            name="notes" value={formData.notes} onChange={handleChange} rows={3}
            placeholder="Alergias, estilo de menú, requerimientos especiales…"
            className="w-full pl-11 pr-4 py-3 rounded-xl text-xs font-medium resize-none outline-none transition-all"
            style={{ background: "#1A1410", border: "1px solid rgba(201,151,74,0.2)", color: "#D4C4A8" }}
            onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
            onBlur={e  => (e.currentTarget.style.borderColor = "rgba(201,151,74,0.2)")}
          />
        </div>
      </div>
    </div>

    <AnimatePresence>
      {(formData.date || formData.guests) && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(201,151,74,0.22)" }}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold"
               style={{ background: "#211C16", color: GOLD }}>
            <Ticket className="w-3.5 h-3.5"/> Resumen del evento
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 px-4 py-3" style={{ background: "#1A1410" }}>
            {formData.date && (
              <p className="text-sm" style={{ color: "#D4C4A8" }}>
                <span style={{ color: "#7A6A55" }}>Fecha: </span>
                <strong className="font-medium">{formData.date}</strong>
                {formData.time && <span style={{ color: "#7A6A55" }}> · {formData.time}</span>}
              </p>
            )}
            {formData.guests && (
              <p className="text-sm" style={{ color: "#D4C4A8" }}>
                <span style={{ color: "#7A6A55" }}>Invitados: </span>
                <strong className="font-medium">{formData.guests}</strong>
              </p>
            )}
            {formData.eventType && (
              <p className="text-sm">
                <span style={{ color: "#7A6A55" }}>Tipo: </span>
                <strong className="font-medium" style={{ color: GOLD }}>{formData.eventType}</strong>
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

/* ════════════════════════════════════════════
   PASO 4 — Pago
════════════════════════════════════════════ */
const Step4Payment = ({ formData, setFormData }: any) => {
  const cart       = useCartStore((s) => s.cart);
  const totalPrice = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const methods = [
    { id: "card", label: "Tarjeta",  desc: "Crédito o débito",     icon: CreditCard,     selColor: GOLD,      selText: "#0A0806", selBg: "rgba(201,151,74,0.08)" },
    { id: "yape", label: "Yape",     desc: "Billetera BCP",         icon: Smartphone,     selColor: "#9b59b6", selText: "#fff",    selBg: "rgba(155,89,182,0.08)" },
    { id: "plin", label: "Plin",     desc: "Transferencia directa", icon: ArrowRightLeft, selColor: "#00b4d8", selText: "#fff",    selBg: "rgba(0,180,216,0.08)"  },
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      <StepHeader icon={<CreditCard className="w-5 h-5"/>} title="Método de garantía"
        sub="Selecciona el método para asegurar tu fecha en nuestra agenda." center />

      {totalPrice > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 px-6 py-3 rounded-2xl"
          style={{ background: "#1A1410", border: "1px solid rgba(201,151,74,0.2)" }}
        >
          <ShoppingBag className="w-4 h-4" style={{ color: GOLD }}/>
          <span className="text-sm font-light" style={{ color: "#7A6A55" }}>Total estimado:</span>
          <span className="text-xl font-black" style={{ color: GOLD }}>S/ {totalPrice.toFixed(2)}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg">
        {methods.map(({ id, label, desc, icon: Icon, selColor, selText, selBg }) => {
          const selected = formData.paymentMethod === id;
          return (
            <motion.button
              key={id}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setFormData({ ...formData, paymentMethod: id })}
              className="p-5 rounded-2xl text-left flex flex-col gap-3 h-32 transition-all duration-300"
              style={{
                background: selected ? selBg : "#1A1410",
                border: `1px solid ${selected ? selColor : "rgba(201,151,74,0.15)"}`,
                boxShadow: selected ? `0 0 24px ${selColor}20` : "none",
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
            </motion.button>
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

/* ════════════════════════════════════════════
   NAVEGACIÓN
════════════════════════════════════════════ */
const NavBar = ({ currentStep, totalSteps, prevStep, nextStep, submitReservation }: any) => (
  <div className="flex justify-between items-center px-8 md:px-10 py-6 relative"
       style={{ borderTop: "1px solid rgba(201,151,74,0.12)", background: "#13100D" }}>

    {currentStep > 1 ? (
      <button
        type="button"
        onClick={prevStep}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all"
        style={{ border: "1px solid rgba(201,151,74,0.2)", color: "#7A6A55", background: "transparent" }}
        onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,151,74,0.5)"; (e.currentTarget as HTMLButtonElement).style.color = GOLD; }}
        onMouseOut={e  => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,151,74,0.2)"; (e.currentTarget as HTMLButtonElement).style.color = "#7A6A55"; }}
      >
        <ChevronLeft className="w-4 h-4" /> Volver
      </button>
    ) : <div />}

    {/* Dots indicadores */}
    <div className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: currentStep === i + 1 ? 20 : 6,
            background: currentStep > i ? GOLD : currentStep === i + 1 ? GOLD : "rgba(201,151,74,0.2)",
          }}
          transition={{ duration: 0.35 }}
          className="h-1.5 rounded-full"
        />
      ))}
    </div>

    {currentStep < totalSteps ? (
      <button
        type="button"
        onClick={nextStep}
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
        onClick={submitReservation}
        className="flex items-center gap-2 px-7 py-3 rounded-xl text-xs uppercase tracking-widest font-black"
        style={{ background: "linear-gradient(135deg,#1a7a4a,#27ae60)", color: "#fff", border: "none" }}
      >
        <CheckCircle2 className="w-4 h-4" /> Finalizar reserva
      </button>
    )}
  </div>
);

/* ════════════════════════════════════════════
   HELPERS COMPARTIDOS
════════════════════════════════════════════ */
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
    <div className="relative flex items-center">
      {icon && (
        <span className="absolute left-4 pointer-events-none" style={{ color: "#5A4A35" }}>
          {icon}
        </span>
      )}
      <CustomInput
        type={type}
        className={`h-11 rounded-xl text-xs font-medium transition-all outline-none ${icon ? "pl-11" : "px-4"}`}
        style={{ background: "#1A1410", border: "1px solid rgba(201,151,74,0.2)", color: "#D4C4A8" }}
        onFocus={(e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = GOLD)}
        onBlur={(e: React.FocusEvent<HTMLInputElement>)  => (e.currentTarget.style.borderColor = "rgba(201,151,74,0.2)")}
        {...props}
      />
    </div>
  </div>
);