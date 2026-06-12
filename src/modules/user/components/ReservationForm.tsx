
import { useState } from "react";
import { toast } from "sonner";
import { createOrder, createReservation } from "@/modules/admin/pedidos/services/order.service";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Calendar, Clock,
  Users, CreditCard, Smartphone, ArrowRightLeft,
  FileText, ChevronDown, Loader2, Send, ChefHat, Sparkles,
} from "lucide-react";

const GOLD       = "#C9974A";
const GOLD_LIGHT = "#E8B96A";

/* ─── animación simple reutilizable (sin variants/custom) ─── */
const anim = (delay = 0) => ({
  initial:    { opacity: 0, y: 12 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] as any },
});

/* ─── campo de formulario ─── */
const Field = ({
  label, icon, type = "text", name, value, onChange,
  placeholder, required = false, delay = 0,
}: {
  label: string; icon: React.ReactNode; type?: string;
  name: string; value: string; onChange: (e: any) => void;
  placeholder?: string; required?: boolean; delay?: number;
}) => (
  <motion.div {...anim(delay)} className="flex flex-col gap-2">
    <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7A6A55" }}>
      {label}{required && <span style={{ color: GOLD }}> *</span>}
    </label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#5A4A35" }}>
        {icon}
      </span>
      <input
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-11 pl-11 pr-4 rounded-xl text-sm font-light outline-none transition-all"
        style={{ background: "#1A1410", border: "1px solid rgba(201,151,74,0.2)", color: "#D4C4A8" }}
        onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
        onBlur={e  => (e.currentTarget.style.borderColor = "rgba(201,151,74,0.2)")}
      />
    </div>
  </motion.div>
);

/* ─── cabecera de sección ─── */
const SectionHeader = ({ number, title, icon }: {
  number: string; title: string; icon: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
    className="flex items-center gap-4 mb-5"
  >
    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
         style={{ background: "rgba(201,151,74,0.1)", border: `1px solid ${GOLD}44`, color: GOLD }}>
      {icon}
    </div>
    <h2 className="text-base font-serif font-normal" style={{ color: "#E8D9C0" }}>{title}</h2>
    <div className="flex-1 h-px" style={{ background: "rgba(201,151,74,0.12)" }}/>
    <span className="text-xs font-black" style={{ color: "rgba(201,151,74,0.3)" }}>0{number}</span>
  </motion.div>
);

/* ════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════ */
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
    { id: "card", label: "Tarjeta",  icon: CreditCard,     selColor: GOLD,      selBg: "rgba(201,151,74,0.08)" },
    { id: "yape", label: "Yape",     icon: Smartphone,     selColor: "#9b59b6", selBg: "rgba(155,89,182,0.08)" },
    { id: "plin", label: "Plin",     icon: ArrowRightLeft, selColor: "#00b4d8", selBg: "rgba(0,180,216,0.08)"  },
  ];

  return (
    <div className="relative max-w-3xl mx-auto">

      {/* Luces ambientales */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full blur-[160px] pointer-events-none"
           style={{ background: "radial-gradient(ellipse, rgba(201,151,74,0.07) 0%, transparent 70%)" }}/>
      <div className="absolute top-1/2 -left-16 w-[200px] h-[400px] rounded-full blur-[140px] pointer-events-none"
           style={{ background: "radial-gradient(ellipse, rgba(201,151,74,0.04) 0%, transparent 70%)" }}/>

      <div className="relative rounded-[24px] overflow-hidden shadow-[0_32px_90px_rgba(0,0,0,0.9)]"
           style={{ background: "#13100D", border: "1px solid rgba(201,151,74,0.18)" }}>

        {/* ── HEADER ── */}
        <div className="relative px-8 pt-8 pb-7 overflow-hidden"
             style={{ background: "#1A1410", borderBottom: "1px solid rgba(201,151,74,0.15)" }}>

          <svg className="absolute top-0 right-0 opacity-[0.05] pointer-events-none"
               width="200" height="180" viewBox="0 0 200 180" fill="none">
            <polygon points="100,8 170,50 170,130 100,172 30,130 30,50" stroke={GOLD} strokeWidth="1" fill="none"/>
            <polygon points="100,28 148,58 148,122 100,152 52,122 52,58" stroke={GOLD} strokeWidth="0.5" fill="none"/>
            <circle cx="100" cy="90" r="18" stroke={GOLD} strokeWidth="0.5" fill="none"/>
            <circle cx="100" cy="90" r="4" fill={GOLD} opacity="0.4"/>
          </svg>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}44)` }}/>
              <div className="flex items-center gap-2">
                <ChefHat className="w-3.5 h-3.5" style={{ color: GOLD }}/>
                <span className="text-[9px] font-black tracking-[0.25em] uppercase" style={{ color: GOLD }}>
                  DeParraSpitz Catering
                </span>
              </div>
              <div className="h-px flex-1" style={{ background: `linear-gradient(270deg, transparent, ${GOLD}44)` }}/>
            </div>
            <h1 className="text-3xl font-serif font-normal text-white">
              Solicita tu <em className="not-italic font-light" style={{ color: GOLD }}>propuesta</em>
            </h1>
            <p className="text-xs mt-1.5 font-light" style={{ color: "#7A6A55" }}>
              Completa los datos y nuestro equipo te contactará con una propuesta personalizada.
            </p>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-10">

          {/* ── 1. Contacto ── */}
          <section>
            <SectionHeader number="1" title="Datos de contacto" icon={<User className="w-3.5 h-3.5"/>} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field required delay={0.00} label="Nombre completo"     icon={<User   className="w-4 h-4"/>} name="name"  value={form.name}  onChange={handleChange} placeholder="Ej. María Gómez" />
              <Field required delay={0.06} label="Correo electrónico"  icon={<Mail   className="w-4 h-4"/>} name="email" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" type="email" />
              <Field required delay={0.12} label="Teléfono / WhatsApp" icon={<Phone  className="w-4 h-4"/>} name="phone" value={form.phone} onChange={handleChange} placeholder="Ej. 987 654 321" />
              <Field required delay={0.18} label="Ciudad"              icon={<MapPin className="w-4 h-4"/>} name="city"  value={form.city}  onChange={handleChange} placeholder="Ej. Lima" />
            </div>
          </section>

          {/* ── 2. Logística ── */}
          <section>
            <SectionHeader number="2" title="Logística del evento" icon={<Sparkles className="w-3.5 h-3.5"/>} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <motion.div {...anim(0.00)} className="md:col-span-2">
                <Field required label="Dirección del evento / local" icon={<MapPin className="w-4 h-4"/>}
                  name="address" value={form.address} onChange={handleChange}
                  placeholder="Ej. Hacienda Los Ficus, Pachacamac" />
              </motion.div>

              <Field required delay={0.06} label="Fecha del evento"  icon={<Calendar className="w-4 h-4"/>} name="date"   type="date"   value={form.date}   onChange={handleChange} />
              <Field required delay={0.12} label="Hora de inicio"    icon={<Clock    className="w-4 h-4"/>} name="time"   type="time"   value={form.time}   onChange={handleChange} />
              <Field required delay={0.18} label="N.° de asistentes" icon={<Users    className="w-4 h-4"/>} name="guests" type="number" value={form.guests} onChange={handleChange} placeholder="Ej. 150" />

              {/* Tipo de evento */}
              <motion.div {...anim(0.24)} className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7A6A55" }}>
                  Tipo de evento <span style={{ color: GOLD }}>*</span>
                </label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#5A4A35" }}>
                    <ChevronDown className="w-4 h-4"/>
                  </span>
                  <select
                    name="eventType" value={form.eventType} onChange={handleChange}
                    className="w-full h-11 pl-4 pr-10 rounded-xl text-sm font-light outline-none appearance-none transition-all"
                    style={{ background: "#1A1410", border: "1px solid rgba(201,151,74,0.2)", color: "#D4C4A8" }}
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

              {/* Notas */}
              <motion.div {...anim(0.30)} className="md:col-span-2 flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7A6A55" }}>
                  Notas adicionales
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 pointer-events-none" style={{ color: "#5A4A35" }}>
                    <FileText className="w-4 h-4"/>
                  </span>
                  <textarea
                    name="notes" value={form.notes} onChange={handleChange} rows={3}
                    placeholder="Alergias de invitados, estilo de menú, requerimientos especiales…"
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-light resize-none outline-none transition-all"
                    style={{ background: "#1A1410", border: "1px solid rgba(201,151,74,0.2)", color: "#D4C4A8" }}
                    onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                    onBlur={e  => (e.currentTarget.style.borderColor = "rgba(201,151,74,0.2)")}
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── 3. Pago ── */}
          <section>
            <SectionHeader number="3" title="Método de garantía" icon={<CreditCard className="w-3.5 h-3.5"/>} />
            <div className="grid grid-cols-3 gap-3">
              {payMethods.map(({ id, label, icon: Icon, selColor, selBg }, i) => {
                const sel = form.paymentMethod === id;
                return (
                  <motion.button
                    key={id}
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.08 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setForm({ ...form, paymentMethod: id })}
                    className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-300"
                    style={{
                      background: sel ? selBg : "#1A1410",
                      border: `1px solid ${sel ? selColor : "rgba(201,151,74,0.15)"}`,
                      boxShadow: sel ? `0 0 18px ${selColor}22` : "none",
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: sel ? selColor : "#5A4A35" }}/>
                    <span className="text-xs font-bold uppercase tracking-wider"
                          style={{ color: sel ? "#E8D9C0" : "#5A4A35" }}>
                      {label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* ── Submit ── */}
          <motion.button
            type="submit"
            disabled={loading}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileTap={{ scale: 0.98 }}
            whileHover={!loading ? { boxShadow: `0 0 32px rgba(201,151,74,0.3)` } : {}}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-black uppercase tracking-widest"
            style={{
              background: loading ? "rgba(201,151,74,0.4)" : GOLD,
              color: "#0A0806",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                             className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin"/> Enviando propuesta…
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                             className="flex items-center gap-2">
                  <Send className="w-4 h-4"/> Enviar propuesta de reserva
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

        </form>
      </div>
    </div>
  );
}
