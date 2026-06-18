import { useState } from "react"; // Solo importamos useState
import { toast } from "sonner";
import { createOrder, createReservation } from "@/modules/admin/pedidos/services/order.service";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import { motion, AnimatePresence,  } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Calendar, Clock,
  Users, CreditCard, Smartphone, ArrowRightLeft,
  FileText, ChevronDown, Loader2, Send, ChefHat, Sparkles,
} from "lucide-react";

const GOLD       = "#C9974A";
const GOLD_LIGHT = "#E8B96A";

/* ─── ANIMACIONES SIMPLES SEGUIDAS (Sin import de ComponentProps) ─── */
const animFadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }
} as any);

/* ─── CAMPO DE FORMULARIO PREMIUM ─── */
const Field = ({
  label, icon, type = "text", name, value, onChange, placeholder, required = false, delay = 0,
}: {
  label: string; icon: React.ReactNode; type?: string;
  name: string; value: string; onChange: (e: any) => void;
  placeholder?: string; required?: boolean; delay?: number;
}) => (
  <motion.div {...animFadeUp(delay)} className="flex flex-col gap-2 group">
    <label className="text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 group-focus-within:text-amber-400" style={{ color: "#7A6A55" }}>
      {label}{required && <span style={{ color: GOLD }}> *</span>}
    </label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110" style={{ color: "#5A4A35" }}>
        {icon}
      </span>
      <input
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-12 pl-11 pr-4 rounded-xl text-sm font-light outline-none transition-all duration-300 bg-black/40 hover:bg-[#1f1813]/60 focus:bg-[#1c140f]"
        style={{ border: "1px solid rgba(201,151,74,0.2)", color: "#D4C4A8" }}
        onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
        onBlur={e  => (e.currentTarget.style.borderColor = "rgba(201,151,74,0.2)")}
      />
    </div>
  </motion.div>
);

/* ─── CABECERA DE SECCIÓN ESTILIZADA ─── */
const SectionHeader = ({ number, title, icon }: { number: string; title: string; icon: React.ReactNode }) => (
  <div className="flex items-center gap-4 mb-6 mt-2">
    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg bg-gradient-to-br from-[#1c140f] to-[#2d2016] border"
         style={{ borderColor: "rgba(201,151,74,0.25)", color: GOLD }}>
      {icon}
    </div>
    <h2 className="text-base font-serif font-normal tracking-wide" style={{ color: "#E8D9C0" }}>{title}</h2>
    <div className="flex-1 h-px bg-gradient-to-r from-amber-500/20 via-amber-500/5 to-transparent" />
    <span className="text-xs font-black tracking-widest font-mono text-amber-500/30">0{number}</span>
  </div>
);

export default function ReservationForm() {
  const cart      = useCartStore((s) => s.cart);
  const clearCart = useCartStore((s) => s.clearCart);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", city: "",
    address: "", date: "", time: "", guests: "",
    eventType: "Boda", notes: "", paymentMethod: "card",
  });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Tu carrito está vacío. Agrega servicios antes de reservar.");
      return;
    }
    setLoading(true);
    const items = cart.map((i) => ({ productId: String(i.id), quantity: Number(i.quantity) }));
    try {
      const newReservation = await createReservation({
        eventDate: form.date, serviceStartTime: form.time,
        guestsCount: Number(form.guests), venueAddress: form.address,
        city: form.city, notes: form.notes, phone: form.phone, items,
      });
      await createOrder({
        reservationId: newReservation.id,
        shippingAddress: `${form.address} | EVENTO: ${form.date} a las ${form.time} | Asistentes: ${form.guests} | Tipo: ${form.eventType} | Notas: ${form.notes}`,
        city: form.city, postalCode: "00000", phone: form.phone,
        paymentMethod: form.paymentMethod, items,
      });
      clearCart();
      toast.success("¡Reserva enviada exitosamente!");
      setTimeout(() => (window.location.href = "/"), 1500);
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 500) {
        toast.error("Tu reserva se procesó, pero hubo un problema interno. Te contactaremos pronto.");
      } else {
        const msg = error.response?.data?.message;
        toast.error(Array.isArray(msg) ? msg.join(", ") : msg || "Error al enviar la reserva");
      }
    } finally {
      setLoading(false);
    }
  };

  const payMethods = [
    { id: "card", label: "Tarjeta",  icon: CreditCard,  selColor: GOLD,      selBg: "rgba(201,151,74,0.06)" },
    { id: "yape", label: "Yape",     icon: Smartphone,  selColor: "#9b59b6", selBg: "rgba(155,89,182,0.06)" },
    { id: "plin", label: "Plin",     icon: ArrowRightLeft, selColor: "#00b4d8", selBg: "rgba(0,180,216,0.06)"  },
  ];

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-0">
      
      {/* Auroras de Luz Ambiental Dinámica */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[180px] pointer-events-none opacity-60"
           style={{ background: "radial-gradient(circle, rgba(201,151,74,0.15) 0%, transparent 80%)" }}/>

      {/* Contenedor Principal */}
      <div 
        className="relative rounded-[28px] overflow-hidden shadow-[0_35px_100px_rgba(0,0,0,0.95)] border backdrop-blur-md"
        style={{ background: "linear-gradient(145deg, #14100e 0%, #0d0a08 100%)", borderColor: "rgba(201,151,74,0.15)" }}
      >
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

        {/* ── HEADER PREMIUM ── */}
        <div className="relative px-6 sm:px-10 pt-10 pb-8 overflow-hidden border-b"
             style={{ background: "linear-gradient(180deg, #1a130f 0%, #130f0c 100%)", borderColor: "rgba(201,151,74,0.12)" }}>
          
          <div className="flex items-center gap-3 mb-4 justify-center sm:justify-start">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/5 border border-amber-500/20 shadow-[0_0_15px_rgba(201,151,74,0.05)]">
              <ChefHat className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span className="text-[9px] font-black tracking-[0.25em] uppercase text-amber-500/90 font-sans">
                DeParraSpitz Catering
              </span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/40"/>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-white text-center sm:text-left tracking-wide leading-tight">
            Solicita tu <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 drop-shadow-sm">propuesta de autor</span>
          </h1>
        </div>

        {/* ── FORMULARIO PRINCIPAL ── */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-10 py-8 space-y-12">

          {/* Sección 1: Datos de Contacto */}
          <section className="space-y-4">
            <SectionHeader number="1" title="Datos de contacto" icon={<User className="w-3.5 h-3.5"/>} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field required label="Nombre completo" icon={<User className="w-4 h-4"/>} name="name" value={form.name} onChange={handleChange} placeholder="Ej. María Gómez" delay={0.02} />
              <Field required label="Correo electrónico" icon={<Mail className="w-4 h-4"/>} name="email" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" type="email" delay={0.04} />
              <Field required label="Teléfono / WhatsApp" icon={<Phone className="w-4 h-4"/>} name="phone" value={form.phone} onChange={handleChange} placeholder="Ej. 987 654 321" delay={0.06} />
              <Field required label="Ciudad" icon={<MapPin className="w-4 h-4"/>} name="city" value={form.city} onChange={handleChange} placeholder="Ej. Lima" delay={0.08} />
            </div>
          </section>

          {/* Sección 2: Logística del Evento */}
          <section className="space-y-4">
            <SectionHeader number="2" title="Logística del evento" icon={<Sparkles className="w-3.5 h-3.5"/>} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div className="sm:col-span-2">
                <Field required label="Dirección del evento / local" icon={<MapPin className="w-4 h-4"/>} name="address" value={form.address} onChange={handleChange} placeholder="Ej. Hacienda Los Ficus, Pachacamac" delay={0.10} />
              </div>

              <Field required label="Fecha del evento" icon={<Calendar className="w-4 h-4"/>} name="date" type="date" value={form.date} onChange={handleChange} delay={0.12} />
              <Field required label="Hora de inicio" icon={<Clock className="w-4 h-4"/>} name="time" type="time" value={form.time} onChange={handleChange} delay={0.14} />
              <Field required label="N.° de asistentes" icon={<Users className="w-4 h-4"/>} name="guests" type="number" value={form.guests} onChange={handleChange} placeholder="Ej. 150" delay={0.16} />

              {/* Selector de Tipo de Evento */}
              <motion.div {...(animFadeUp(0.18))} className="flex flex-col gap-2 group">
                <label className="text-[10px] font-bold uppercase tracking-widest group-focus-within:text-amber-400" style={{ color: "#7A6A55" }}>
                  Tipo de evento <span style={{ color: GOLD }}>*</span>
                </label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#5A4A35" }}>
                    <ChevronDown className="w-4 h-4"/>
                  </span>
                  <select
                    name="eventType" value={form.eventType} onChange={handleChange}
                    className="w-full h-12 pl-4 pr-10 rounded-xl text-sm font-light outline-none appearance-none transition-all duration-300 backdrop-blur-sm bg-black/40 hover:bg-[#1f1813]/60 focus:bg-[#1c140f] focus:ring-2 focus:ring-[#C9974A]/20 cursor-pointer"
                    style={{ border: "1px solid rgba(201,151,74,0.2)", color: "#D4C4A8" }}
                    onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                    onBlur={e  => (e.currentTarget.style.borderColor = "rgba(201,151,74,0.2)")}
                  >
                    <option value="Boda">💍 Boda / Matrimonio</option>
                    <option value="Corporativo">💼 Evento Corporativo</option>
                    <option value="Cumpleaños">🎉 Cumpleaños / Fiesta Privada</option>
                    <option value="Aniversario">✨ Aniversario / Gala</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </motion.div>

              {/* Notas Adicionales */}
              <motion.div {...(animFadeUp(0.20))} className="sm:col-span-2 flex flex-col gap-2 group">
                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7A6A55" }}>
                  Notas adicionales / Requerimientos
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-4 pointer-events-none" style={{ color: "#5A4A35" }}>
                    <FileText className="w-4 h-4"/>
                  </span>
                  <textarea
                    name="notes" value={form.notes} onChange={handleChange} rows={3}
                    placeholder="Alergias de invitados, preferencia de cortes de carne, necesidades especiales…"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-light resize-none outline-none transition-all duration-300 backdrop-blur-sm bg-black/40 hover:bg-[#1f1813]/60 focus:bg-[#1c140f] focus:ring-2 focus:ring-[#C9974A]/20"
                    style={{ border: "1px solid rgba(201,151,74,0.2)", color: "#D4C4A8" }}
                    onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                    onBlur={e  => (e.currentTarget.style.borderColor = "rgba(201,151,74,0.2)")}
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Sección 3: Método de Garantía */}
          <section className="space-y-4">
            <SectionHeader number="3" title="Método de garantía" icon={<CreditCard className="w-3.5 h-3.5"/>} />
            <div className="grid grid-cols-3 gap-3">
              {payMethods.map(({ id, label, icon: Icon, selColor, selBg }, i) => {
                const sel = form.paymentMethod === id;
                return (
                  <motion.button
                    key={id}
                    type="button"
                    {...(animFadeUp(0.22 + i * 0.02))}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setForm({ ...form, paymentMethod: id })}
                    className="flex flex-col items-center gap-2 py-4 px-2 rounded-xl transition-all duration-300 cursor-pointer group/btn"
                    style={{
                      background: sel ? selBg : "rgba(0,0,0,0.2)",
                      border: `1px solid ${sel ? selColor : "rgba(201,151,74,0.12)"}`,
                    }}
                  >
                    <Icon className="w-5 h-5 transition-transform duration-300 group-hover/btn:scale-110" style={{ color: sel ? selColor : "#5A4A35" }}/>
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: sel ? "#E8D9C0" : "#5A4A35" }}>
                      {label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* Botón de Envío Premium */}
          <motion.button
            type="submit"
            disabled={loading}
            {...(animFadeUp(0.30))}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 py-4.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-black/30 select-none transition-all duration-500 relative overflow-hidden group"
            style={{
              background: loading ? "rgba(201,151,74,0.3)" : `linear-gradient(135deg, ${GOLD} 0%, #b38137 100%)`,
              color: "#0A0806",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                             className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin"/> Procesando propuesta…
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                             className="flex items-center gap-2 font-sans font-bold">
                  <Send className="w-3.5 h-3.5"/> Enviar solicitud de reserva
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>
      </div>

      {/* ── BURBUJA FLOTANTE DE WHATSAPP ── */}
      <div className="fixed bottom-6 right-6 z-[9999] flex items-center justify-end pointer-events-none">
        <motion.a
          href="https://wa.me/51999999999?text=Hola%20DeParraSpitz%20Catering,%20quiero%20coordinar%20una%20reserva%20directa."
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_8px_32px_rgba(37,211,102,0.4)] hover:bg-[#22c35e] transition-colors relative group pointer-events-auto"
        >
          <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all duration-200 origin-right bg-[#14100e] border border-[#C9974A]/40 text-[#E8D9C0] text-[11px] px-3 py-2 rounded-xl whitespace-nowrap shadow-xl backdrop-blur-sm">
            ¿Cotizar por WhatsApp? 💬
          </span>
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.66.986 3.288 1.447 4.805 1.448 5.422-.002 9.835-4.42 9.838-9.843.002-2.628-1.022-5.1-2.882-6.962C16.505 1.933 14.03 .907 11.4 .905c-5.43 0-9.843 4.417-9.846 9.843-.001 1.713.465 3.393 1.348 4.885L1.879 21.05l5.768-1.896zM17.02 14.12c-.29-.145-1.72-.85-1.986-.944-.268-.096-.463-.145-.658.145-.195.29-.757.945-.928 1.14-.17.193-.342.217-.633.073-.29-.145-1.228-.453-2.338-1.444-.864-.77-1.447-1.72-1.617-2.012-.17-.29-.018-.447.127-.591.13-.13.29-.34.436-.508.145-.17.195-.29.293-.483.097-.193.048-.36-.024-.507-.073-.145-.658-1.594-.9-2.174-.237-.573-.478-.496-.658-.505-.17-.008-.365-.01-.56-.01s-.51.073-.778.365c-.268.29-1.022.997-1.022 2.43 0 1.434 1.045 2.82 1.19 3.015.145.195 2.057 3.14 4.984 4.403.696.3 1.24.48 1.666.616.7.222 1.338.19 1.843.115.56-.083 1.72-.702 1.962-1.38.243-.678.243-1.258.17-1.38-.072-.122-.268-.194-.56-.34z" />
          </svg>
        </motion.a>
      </div>
    </div>
  );
}