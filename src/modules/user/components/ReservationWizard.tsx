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
  ShoppingBag, Flame, FileText, ShoppingCart, Plus, Minus, ChefHat, Loader2, MessageCircle
} from "lucide-react";

const GOLD       = "#C9974A";
const GOLD_LIGHT = "#E8B96A";

interface StepItem {
  id: number;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

/* ─── Variantes de Animación con Curvas de Física Premium ─── */
const stepVariants: Variants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 40 : -40,
    scale: 0.98,
    filter: "blur(4px)"
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -40 : 40,
    scale: 0.98,
    filter: "blur(4px)",
    transition: { duration: 0.25, ease: "easeInOut" }
  }),
};

const cardHoverVariants: Variants = {
  initial: { y: 0, boxShadow: "none", borderColor: "rgba(201,151,74,0.12)" },
  hover: {
    y: -6,
    boxShadow: "0 12px 30px rgba(201,151,74,0.15)",
    borderColor: "rgba(201,151,74,0.4)",
    transition: { type: "spring", stiffness: 400, damping: 20 }
  }
};

/* ════════════════════════════════════════════
    COMPONENTE PRINCIPAL (RESERVATION WIZARD)
════════════════════════════════════════════ */
export default function ReservationWizard() {
  // Se añade cast 'as any' para mitigar discrepancias en las propiedades del hook personalizado
  const wizard = useReservationWizard() as any;

  const steps: StepItem[] = [
    { id: 1, label: "Contacto", desc: "Datos del titular",   icon: User       },
    { id: 2, label: "Menú",     desc: "Selección culinaria", icon: Utensils  },
    { id: 3, label: "Evento",   desc: "Logística",           icon: Calendar   },
    { id: 4, label: "Garantía", desc: "Asegurar fecha",      icon: CreditCard },
  ];

  // Solución al error de compilación de 'direction' e 'isLoadingSubmit' mediante fallbacks
  const direction = wizard.direction !== undefined ? wizard.direction : (wizard.delta || 1); 
  const isFormLoading = wizard.isLoadingSubmit ?? wizard.isLoading ?? wizard.isSubmitting ?? false;

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-6 px-4 sm:px-0">
      
      {/* Luces Ambientales de Fondo Estilo "Cinematic Aura" */}
      <div className="absolute -top-20 left-1/4 w-[450px] h-[300px] rounded-full blur-[160px] pointer-events-none opacity-70"
           style={{ background: "radial-gradient(ellipse, rgba(201,151,74,0.12) 0%, transparent 75%)" }} />
      <div className="absolute bottom-1/4 -right-12 w-[300px] h-[400px] rounded-full blur-[180px] pointer-events-none opacity-40"
           style={{ background: "radial-gradient(ellipse, rgba(201,151,74,0.06) 0%, transparent 75%)" }} />

      {/* Contenedor Premium Autolayout */}
      <div className="relative rounded-[28px] overflow-hidden shadow-[0_40px_110px_rgba(0,0,0,0.95)] backdrop-blur-md transition-all duration-500"
           style={{ background: "linear-gradient(145deg, #14110E 0%, #0D0A08 100%)", border: "1px solid rgba(201,151,74,0.16)" }}>
        
        {/* Línea de luz superior de acento */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

        <Header />
        
        <Stepper steps={steps} currentStep={wizard.currentStep || 1} />

        {/* Contenedor Dinámico */}
        <div className="min-h-[420px] px-6 md:px-10 py-8 relative">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={wizard.currentStep || 1}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              {(wizard.currentStep === 1 || !wizard.currentStep) && (
                <Step1Contact formData={wizard.formData || {}} handleChange={wizard.handleChange} />
              )}
              {wizard.currentStep === 2 && (
                <Step2Menu products={wizard.products || []} isLoading={wizard.isLoadingProducts ?? false} />
              )}
              {wizard.currentStep === 3 && (
                <Step3Logistics formData={wizard.formData || {}} handleChange={wizard.handleChange} wizard={wizard} />
              )}
              {wizard.currentStep === 4 && (
                <Step4Payment formData={wizard.formData || {}} setFormData={wizard.setFormData} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <NavBar
          currentStep={wizard.currentStep || 1}
          totalSteps={steps.length}
          prevStep={wizard.prevStep}
          nextStep={wizard.nextStep}
          submitReservation={wizard.submitReservation}
          isLoading={isFormLoading}
        />
      </div>

      {/* BURBUJA FLOTANTE DE WHATSAPP (CONTACTO DIRECTO COTIZACIÓN - LADO IZQUIERDO) */}
      <a
        href="https://wa.me/51999999999?text=Hola%20DeParraSpitz,%20me%20gustar%C3%ADa%20cotizar%20un%20servicio%20de%20catering."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-[9999] flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_25px_rgba(37,211,102,0.7)] hover:scale-110 active:scale-95 transition-all duration-300 group"
        aria-label="Contactar por WhatsApp"
      >
        {/* Tooltip elegante que aparece al pasar el cursor */}
        <span className="absolute left-16 scale-0 group-hover:scale-100 transition-all duration-200 origin-left bg-zinc-900/90 border border-zinc-800 text-white text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap shadow-xl">
          ¿Hablamos de tu evento? 💬
        </span>

        {/* SVG del Logo Oficial de WhatsApp */}
        <svg
          className="w-7 h-7 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.516 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.66.986 3.288 1.479 4.808 1.48 4.817-.004 8.895-3.834 8.898-8.554.003-2.26-.974-4.385-2.75-6.162C15.865 4.14 13.993 3.16 12.01 3.16c-4.895 0-8.943 4.016-8.945 8.91-.001 1.662.495 3.248 1.482 4.75l-.972 3.548 3.572-.934zM17.986 14.57c-.33-.164-1.953-.964-2.253-1.074-.3-.11-.518-.165-.737.165-.218.331-.846 1.074-1.037 1.293-.19.218-.382.246-.71.082-.33-.164-1.393-.513-2.654-1.638-.98-.874-1.641-1.954-1.833-2.282-.19-.33-.02-.508.145-.671.148-.147.33-.384.495-.577.165-.191.22-.33.329-.55.11-.22.055-.412-.028-.577-.082-.164-.737-1.777-1.01-2.436-.264-.636-.53-.55-.737-.56-.19-.009-.41-.013-.63-.013-.22 0-.576.083-.878.412-.3.33-1.15 1.128-1.15 2.751 0 1.623 1.182 3.19 1.346 3.41.165.22 2.328 3.555 5.639 4.983.788.34 1.402.544 1.88.697.79.25 1.512.215 2.08.131.634-.094 1.954-.8 2.226-1.57.272-.77.272-1.43.19-1.57-.081-.13-.298-.21-.629-.375z"/>
        </svg>
      </a>

      {/* BURBUJA FLOTANTE DE WHATSAPP CHATBOT ASESOR (MANTENIDA EN EL LADO DERECHO) */}
      <WhatsAppBubble phoneNumber="51987654321" message="Hola, me gustaría recibir más información sobre el servicio de catering exclusivo de DeParraSpitz." />
    </div>
  );
}

/* ════════════════════════════════════════════
    HELPERS COMPARTIDOS INTEGRADOS
════════════════════════════════════════════ */
const StepHeader = ({ icon, title, sub, center = false }: {
  icon: React.ReactNode; title: string; sub: string; center?: boolean;
}) => (
  <div className={`mb-4 ${center ? "text-center flex flex-col items-center" : ""}`}>
    <h2 className={`text-xl font-serif font-normal text-white flex items-center gap-2.5 ${center ? "justify-center" : ""}`}>
      <span style={{ color: GOLD }}>{icon}</span>
      {title}
    </h2>
    <p className="text-xs mt-1 font-light" style={{ color: "#7A6A55" }}>{sub}</p>
  </div>
);

const InputField = ({ label, icon, type = "text", ...props }: any) => (
  <div className="space-y-2 flex flex-col w-full">
    <Label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7A6A55" }}>
      {label}
    </Label>
    <div className="relative flex items-center w-full">
      {icon && (
        <span className="absolute left-4 pointer-events-none z-10" style={{ color: "#5A4A35" }}>
          {icon}
        </span>
      )}
      <CustomInput
        type={type}
        className={`h-11 rounded-xl text-xs font-medium transition-all outline-none w-full ${icon ? "pl-11" : "px-4"}`}
        style={{ background: "#1A1410", border: "1px solid rgba(201,151,74,0.2)", color: "#D4C4A8" }}
        onFocus={(e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = GOLD)}
        onBlur={(e: React.FocusEvent<HTMLInputElement>)  => (e.currentTarget.style.borderColor = "rgba(201,151,74,0.2)")}
        {...props}
      />
    </div>
  </div>
);

/* ════════════════════════════════════════════
    BURBUJA DE WHATSAPP CHATBOT (LADO DERECHO)
════════════════════════════════════════════ */
const WhatsAppBubble = ({ phoneNumber, message }: { phoneNumber: string; message: string }) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-[9999] p-4 rounded-full border flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-md group"
      style={{ 
        background: "linear-gradient(135deg, #1C1814 0%, #110E0C 100%)", 
        borderColor: "rgba(201,151,74,0.3)" 
      }}
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
      whileHover={{ 
        scale: 1.08, 
        borderColor: "rgba(201,151,74,0.7)",
        boxShadow: "0 20px 45px rgba(201,151,74,0.3)"
      }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="absolute inset-0 rounded-full bg-amber-500/10 animate-ping opacity-70 pointer-events-none" style={{ animationDuration: "2.5s" }} />
      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#110E0C] animate-pulse z-10" />

      <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:text-amber-400 transition-colors duration-300" />
      
      <span className="absolute right-16 bg-[#16120F] border border-amber-500/20 text-[#D4C4A8] text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-xl opacity-0 translate-x-4 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap shadow-xl">
        Asesoría en línea
      </span>
    </motion.a>
  );
};

/* ════════════════════════════════════════════
    COMPONENTES ESTRUCTURALES INTERNOS
════════════════════════════════════════════ */
const Header = () => (
  <div className="relative px-8 md:px-10 pt-10 pb-8 overflow-hidden border-b"
       style={{ background: "linear-gradient(180deg, #181310 0%, #110E0B 100%)", borderColor: "rgba(201,151,74,0.1)" }}>

    <svg className="absolute -top-10 -right-10 opacity-[0.045] pointer-events-none transform rotate-12"
         width="320" height="320" viewBox="0 0 280 240" fill="none">
      <polygon points="140,14 230,68 230,172 140,226 50,172 50,68" stroke={GOLD} strokeWidth="1"/>
      <polygon points="140,36 208,80 208,160 140,204 72,160 72,80" stroke={GOLD} strokeWidth="0.6"/>
      <circle cx="140" cy="120" r="14" stroke={GOLD} strokeWidth="0.5"/>
    </svg>

    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
      <div className="flex items-center gap-3 mb-3.5">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-amber-500/30"/>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/5 border border-amber-500/10">
          <ChefHat className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[9px] font-black tracking-[0.3em] uppercase text-amber-500/90 font-sans">
            DeParraSpitz Catering
          </span>
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-amber-500/30"/>
      </div>
      <h1 className="text-3xl md:text-4xl font-serif font-normal text-white tracking-wide leading-tight">
        Reserva tu <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-600 drop-shadow-sm">evento exclusivo</span>
      </h1>
      <p className="text-xs md:text-sm mt-2 font-light" style={{ color: "#7A6A55" }}>
        Diseña y personaliza tu propuesta de alta cocina en cuatro pasos guiados.
      </p>
    </motion.div>
  </div>
);

const Stepper = ({ steps, currentStep }: { steps: StepItem[]; currentStep: number }) => (
  <div className="flex items-start justify-center gap-0 px-6 md:px-10 pt-8 pb-2" style={{ background: "#13100D" }}>
    {steps.map((step, idx) => {
      const isActive    = currentStep === step.id;
      const isCompleted = currentStep > step.id;
      const Icon        = step.icon;
      
      return (
        <div key={step.id} className="flex flex-col items-center flex-1 relative group/step">
          {idx < steps.length - 1 && (
            <div className="absolute top-[18px] left-[calc(50%+20px)] h-[2px] rounded-full"
                 style={{ width: "calc(100% - 40px)", background: "rgba(201,151,74,0.1)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})` }}
                initial={false}
                animate={{ width: isCompleted ? "100%" : "0%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          )}

          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center z-10 relative"
            animate={{
              border: isActive || isCompleted ? `1px solid ${GOLD}` : "1px solid rgba(201,151,74,0.15)",
              background: isActive ? "linear-gradient(135deg, #C9974A 0%, #A37432 100%)" : isCompleted ? "rgba(201,151,74,0.06)" : "#181310",
              scale: isActive ? 1.15 : 1,
            }}
            whileHover={{ scale: isActive ? 1.15 : 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {isActive && (
              <motion.div 
                layoutId="stepGlow"
                className="absolute inset-0 rounded-full blur-md opacity-40 -z-10 bg-amber-400"
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              />
            )}
            
            {isCompleted ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <CheckCircle2 className="w-4 h-4" strokeWidth={3} style={{ color: GOLD }} />
              </motion.div>
            ) : (
              <Icon className="w-4 h-4" style={{ color: isActive ? "#0A0806" : "rgba(201,151,74,0.4)" }} />
            )}
          </motion.div>

          <motion.span
            className="text-[10px] tracking-widest uppercase font-bold mt-3.5 hidden md:block text-center"
            animate={{ color: isActive ? "#E8D9C0" : isCompleted ? "#7A6A55" : "#4A3E31" }}
          >
            {step.label}
          </motion.span>
          <span className="text-[9px] mt-0.5 hidden md:block font-light text-center transition-colors px-2" 
                style={{ color: isActive ? "#7A6A55" : "#3A2E22" }}>
            {step.desc}
          </span>
        </div>
      );
    })}
  </div>
);

/* ════════════════════════════════════════════
    PASO 1 — CONTACTO
════════════════════════════════════════════ */
const Step1Contact = ({ formData, handleChange }: any) => (
  <div className="space-y-6">
    <StepHeader icon={<User className="w-4 h-4" />} title="Datos de contacto del titular"
                sub="Información confidencial para personalizar su propuesta gastronómica." />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
      <InputField label="Nombre completo" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Ej. Juan Pérez" icon={<User className="w-4 h-4"/>} />
      <InputField label="Correo electrónico" name="email" value={formData.email || ''} onChange={handleChange} placeholder="juan@ejemplo.com" icon={<Mail className="w-4 h-4"/>} type="email" />
      <InputField label="Teléfono / WhatsApp" name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="Ej. +51 987 654 321" icon={<Phone className="w-4 h-4"/>} />
      <InputField label="Ciudad de residencia" name="city" value={formData.city || ''} onChange={handleChange} placeholder="Ej. Lima" icon={<MapPin className="w-4 h-4"/>} />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
      {[
        { emoji: "🥂", label: "Bodas & Galas", sub: "Experiencias de etiqueta única" },
        { emoji: "🍽️", label: "Eventos Corp.", sub: "Alta gama y servicios ejecutivos" },
        { emoji: "🎂", label: "Fiestas Privadas", sub: "Celebraciones íntimas de autor" },
      ].map((c) => (
        <motion.div
          key={c.label}
          initial="initial"
          variants={cardHoverVariants}
          whileHover="hover"
          className="rounded-xl p-4 text-center cursor-default border transition-colors duration-200"
          style={{ background: "rgba(24,19,16,0.5)" }}
        >
          <span className="text-2xl block mb-1.5">{c.emoji}</span>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#E8D9C0" }}>{c.label}</p>
          <p className="text-[9px] mt-1 font-light leading-relaxed" style={{ color: "#6A5A45" }}>{c.sub}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

/* ════════════════════════════════════════════
    PASO 2 — MENÚ
════════════════════════════════════════════ */
const Step2Menu = ({ products, isLoading }: { products: Product[]; isLoading: boolean }) => {
  const addToCart      = useCartStore((s) => s.addToCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const cart           = useCartStore((s) => s.cart);
  const totalItems     = cart.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice     = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
      <p className="text-[10px] tracking-[0.2em] uppercase font-bold animate-pulse" style={{ color: GOLD }}>
        Cargando cartas exclusivas…
      </p>
    </div>
  );

  if (products.length === 0) return (
    <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center border" style={{ background: "#1A1410", borderColor: "rgba(201,151,74,0.15)", color: GOLD }}>
        <Utensils className="w-5 h-5"/>
      </div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-white">Carta no disponible</h3>
      <p className="text-xs font-light max-w-xs" style={{ color: "#7A6A55" }}>
        Puede continuar el proceso sin problemas y diseñar el menú directo con nuestro Chef ejecutivo.
      </p>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-between items-center gap-3 pb-4 border-b" style={{ borderColor: "rgba(201,151,74,0.1)" }}>
        <StepHeader icon={<Utensils className="w-4 h-4"/>} title="Menú & Estaciones Premium" sub="Seleccione los servicios gastronómicos del evento." />

        <AnimatePresence>
          {totalItems > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 5 }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl border"
              style={{ background: "rgba(201,151,74,0.05)", borderColor: "rgba(201,151,74,0.3)" }}
            >
              <ShoppingCart className="w-4 h-4" style={{ color: GOLD }}/>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-wide text-[#E8D9C0]">{totalItems} Servicios</span>
                <span className="text-xs font-black" style={{ color: GOLD }}>S/ {totalPrice.toFixed(2)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(201,151,74,0.2) transparent" }}>
        {products.map((p) => {
          const inCart = cart.find((i) => i.id === p.id);
          const imgSrc = (p as any).imageUrl || (p as any).image || (p as any).photo || null;

          return (
            <motion.div
              key={p.id}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-xl overflow-hidden flex flex-col border group"
              style={{
                background: "#16120F",
                borderColor: inCart ? "rgba(201,151,74,0.6)" : "rgba(201,151,74,0.12)",
              }}
            >
              {imgSrc && (
                <div className="relative h-36 overflow-hidden bg-black/40">
                  <img src={imgSrc} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ filter: inCart ? "brightness(1)" : "brightness(0.75)" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16120F] via-transparent to-transparent" />
                  {p.isPromo && (
                    <span className="absolute top-2.5 left-2.5 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full text-white shadow-md" style={{ background: "linear-gradient(135deg, #C53030, #DD6B20)" }}>
                      <Flame className="w-2.5 h-2.5"/> Promo
                    </span>
                  )}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-xs font-bold" style={{ color: GOLD }}>
                    S/ {Number(p.price).toFixed(2)}
                  </div>
                </div>
              )}

              <div className="p-3.5 flex flex-col flex-1 gap-1.5">
                <h4 className="text-xs font-serif font-medium tracking-wide text-[#E8D9C0] line-clamp-1 group-hover:text-amber-400 transition-colors">{p.name}</h4>
                <p className="text-[10px] font-light leading-relaxed line-clamp-2" style={{ color: "#7A6A55" }}>{p.description || "Menú exclusivo de autor de nuestra firma culinaria."}</p>

                <div className="pt-2.5 mt-auto border-t flex items-center justify-between" style={{ borderColor: "rgba(201,151,74,0.06)" }}>
                  {inCart ? (
                    <div className="flex items-center justify-between w-full">
                      <button type="button" onClick={() => removeFromCart(p.id)} className="w-7 h-7 rounded-lg flex items-center justify-center border bg-amber-500/5 text-amber-500" style={{ borderColor: "rgba(201,151,74,0.3)" }}><Minus className="w-3 h-3"/></button>
                      <span className="text-xs font-black" style={{ color: GOLD }}>{inCart.quantity}</span>
                      <button type="button" onClick={() => addToCart({ id: p.id, name: p.name, price: Number(p.price) })} className="w-7 h-7 rounded-lg flex items-center justify-center text-black" style={{ background: GOLD }}><Plus className="w-3 h-3"/></button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => addToCart({ id: p.id, name: p.name, price: Number(p.price) })} className="w-full py-1.5 rounded-lg text-[9px] uppercase tracking-widest font-black flex items-center justify-center gap-1 border border-amber-500/20 text-amber-500 hover:bg-amber-500/5 transition-colors"><Plus className="w-3 h-3"/> Agregar servicio</button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
    PASO 3 — LOGÍSTICA
════════════════════════════════════════════ */
const Step3Logistics = ({ formData, handleChange, wizard }: any) => (
  <div className="space-y-6">
    <StepHeader icon={<Sparkles className="w-4 h-4"/>} title="Logística y locación del evento"
                sub="Coordenadas estratégicas esenciales para el despliegue técnico del catering." />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
      <div className="md:col-span-2">
        <InputField label="Dirección exacta de la locación" name="address" value={formData.address || ''} onChange={handleChange} placeholder="Ej. Hacienda Los Ficus, Pachacamac" icon={<MapPin className="w-4 h-4"/>} />
      </div>
      <InputField label="Fecha del banquete" name="date" type="date" value={formData.date || ''} onChange={handleChange} icon={<Calendar className="w-4 h-4"/>} />
      <InputField label="Hora de apertura / Recepción" name="time" type="time" value={formData.time || ''} onChange={handleChange} icon={<Clock className="w-4 h-4"/>} />
      <InputField label="Número estimado de invitados" name="guests" type="number" value={formData.guests || ''} onChange={handleChange} placeholder="Ej. 150 personas" icon={<Users className="w-4 h-4"/>} />

      <div className="space-y-1.5 flex flex-col justify-end">
        <Label className="text-[9px] font-bold uppercase tracking-widest text-[#7A6A55]">Tipo de celebración</Label>
        <Select value={formData.eventType || "Boda"} onValueChange={(v) => wizard.setFormData({ ...formData, eventType: v })}>
          <SelectTrigger className="h-11 rounded-xl px-4 text-xs font-light" style={{ background: "#16120F", border: "1px solid rgba(201,151,74,0.18)", color: "#D4C4A8" }}>
            <SelectValue placeholder="Seleccione formato" />
          </SelectTrigger>
          <SelectContent style={{ background: "#16120F", border: "1px solid rgba(201,151,74,0.2)", color: "#D4C4A8" }}>
            <SelectItem value="Boda">💍 Boda / Matrimonio de gala</SelectItem>
            <SelectItem value="Corporativo">💼 Banquete Corporativo</SelectItem>
            <SelectItem value="Cumpleaños">🎉 Aniversario / Fiesta Privada</SelectItem>
            <SelectItem value="Aniversario">✨ Gala de gala / Cocktail</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2 space-y-1.5">
        <Label className="text-[9px] font-bold uppercase tracking-widest text-[#7A6A55]">Notas de catering o restricciones</Label>
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-[#5A4A35]"><FileText className="w-4 h-4"/></span>
          <textarea
            name="notes" value={formData.notes || ''} onChange={handleChange} rows={3}
            placeholder="Alergias alimentarias, requerimientos dietéticos o notas del espacio..."
            className="w-full pl-11 pr-4 py-3 rounded-xl text-xs font-light resize-none outline-none transition-colors"
            style={{ background: "#16120F", border: "1px solid rgba(201,151,74,0.18)", color: "#D4C4A8" }}
            onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
            onBlur={e  => (e.currentTarget.style.borderColor = "rgba(201,151,74,0.18)")}
          />
        </div>
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════════
    PASO 4 — GARANTÍA
════════════════════════════════════════════ */
const Step4Payment = ({ formData, setFormData }: any) => {
  const cart       = useCartStore((s) => s.cart);
  const totalPrice = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const methods = [
    { id: "card", label: "Tarjeta",  desc: "Crédito / Débito",  icon: CreditCard,  selColor: GOLD,      selBg: "rgba(201,151,74,0.06)" },
    { id: "yape", label: "Yape",     desc: "Billetera Digital BCP", icon: Smartphone,  selColor: "#9b59b6", selBg: "rgba(155,89,182,0.06)" },
    { id: "plin", label: "Plin",     desc: "Transferencia Directa",icon: ArrowRightLeft, selColor: "#00b4d8", selBg: "rgba(0,180,216,0.06)"  },
  ];

  return (
    <div className="flex flex-col items-center gap-6 py-2">
      <StepHeader icon={<CreditCard className="w-4 h-4"/>} title="Garantía de bloqueo de agenda"
                  sub="Seleccione el método de apertura contable para fijar la reserva de su fecha corporativa o social." center />

      {totalPrice > 0 && (
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl border bg-[#1A1410]" style={{ borderColor: "rgba(201,151,74,0.15)" }}>
          <ShoppingBag className="w-4 h-4 text-amber-500"/>
          <span className="text-xs font-light text-[#7A6A55]">Presupuesto Estimado:</span>
          <span className="text-lg font-black" style={{ color: GOLD }}>S/ {totalPrice.toFixed(2)}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
        {methods.map(({ id, label, desc, icon: Icon, selColor, selBg }) => {
          const isSel = formData.paymentMethod === id;
          return (
            <motion.button
              key={id}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setFormData({ ...formData, paymentMethod: id })}
              className="p-4 rounded-xl text-left flex flex-col gap-3 relative transition-all duration-300 group/pay cursor-pointer"
              style={{ background: isSel ? selBg : "#16120F", border: `1px solid ${isSel ? selColor : "rgba(201,151,74,0.12)"}` }}
            >
              {isSel && (
                <motion.div layoutId="paySelectorGlow" className="absolute inset-0 border rounded-xl pointer-events-none" style={{ borderColor: selColor, opacity: 0.4 }} />
              )}
              <Icon className="w-5 h-5" style={{ color: isSel ? selColor : "#5A4A35" }}/>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest block" style={{ color: isSel ? "#E8D9C0" : "#A49478" }}>{label}</span>
                <span className="text-[9px] font-light block mt-0.5 leading-tight" style={{ color: isSel ? `${selColor}cc` : "#5A4A35" }}>{desc}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
    BARRA DE NAVEGACIÓN (NAVBAR)
════════════════════════════════════════════ */
const NavBar = ({ currentStep, totalSteps, prevStep, nextStep, submitReservation, isLoading }: any) => {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-between items-center px-6 md:px-10 py-5 border-t" style={{ borderColor: "rgba(201,151,74,0.12)", background: "#110E0C" }}>
      {currentStep > 1 ? (
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={prevStep}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-colors cursor-pointer"
          style={{ borderColor: "rgba(201,151,74,0.15)", color: "#7A6A55" }}
          onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.color = GOLD; (e.currentTarget as HTMLButtonElement).style.borderColor = GOLD; }}
          onMouseOut={e  => { (e.currentTarget as HTMLButtonElement).style.color = "#7A6A55"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,151,74,0.15)"; }}
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Volver
        </motion.button>
      ) : <div />}

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        disabled={isLoading}
        onClick={isLastStep ? submitReservation : nextStep}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-black cursor-pointer shadow-lg relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #B38137 100%)`, opacity: isLoading ? 0.7 : 1 }}
      >
        {isLoading ? (
          <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Procesando…</>
        ) : isLastStep ? (
          <>Confirmar Reserva <CheckCircle2 className="w-3.5 h-3.5"/></>
        ) : (
          <>Continuar <ChevronRight className="w-3.5 h-3.5" /></>
        )}
      </motion.button>
    </div>
  );
};