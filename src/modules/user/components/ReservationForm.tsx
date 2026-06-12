import { useState } from "react";
import { toast } from "sonner";
import { createOrder, createReservation } from "@/modules/admin/pedidos/services/order.service";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Calendar, Clock,
  Users, CreditCard, Smartphone, ArrowRightLeft,
  FileText, ChevronDown, Loader2, Send,
} from "lucide-react";

const GOLD = "#C9974A";
const GOLD_LIGHT = "#E8B96A";

/* ─── helper de campo con ícono ─── */
const Field = ({
  label, icon, type = "text", name, value, onChange, placeholder, required = false,
}: {
  label: string; icon: React.ReactNode; type?: string;
  name: string; value: string; onChange: (e: any) => void;
  placeholder?: string; required?: boolean;
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7A6A55" }}>
      {label}{required && <span style={{ color: GOLD }}> *</span>}
    </label>
    <div className="relative group">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
            style={{ color: "#5A4A35" }}>
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
        style={{
          background: "#1A1410",
          border: "1px solid rgba(201,151,74,0.2)",
          color: "#D4C4A8",
        }}
        onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
        onBlur={e  => (e.currentTarget.style.borderColor = "rgba(201,151,74,0.2)")}
      />
    </div>
  </div>
);

/* ─── section header ornamental ─── */
const SectionHeader = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-center gap-4 mb-5">
    <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0"
          style={{ background: "rgba(201,151,74,0.12)", border: `1px solid ${GOLD}55`, color: GOLD }}>
      {number}
    </span>
    <h2 className="text-base font-serif font-normal" style={{ color: "#E8D9C0" }}>{title}</h2>
    <div className="flex-1 h-px" style={{ background: "rgba(201,151,74,0.12)" }}/>
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

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
        eventDate: form.date,
        serviceStartTime: form.time,
        guestsCount: Number(form.guests),
        venueAddress: form.address,
        city: form.city,
        notes: form.notes,
        phone: form.phone,
        items,
      });

      await createOrder({
        reservationId: newReservation.id,
        shippingAddress: `${form.address} | EVENTO: ${form.date} a las ${form.time} | Asistentes: ${form.guests} | Tipo: ${form.eventType} | Notas: ${form.notes}`,
        city: form.city,
        postalCode: "00000",
        phone: form.phone,
        paymentMethod: form.paymentMethod,
        items,
      });

      clearCart();
      toast.success("¡Reserva enviada exitosamente!");
      setTimeout(() => (window.location.href = "/"), 1500);
    } catch (error: any) {
      console.error("Fallo del servidor:", error);
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

      {/* Luz de fondo */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full blur-[160px] pointer-events-none"
           style={{ background: "radial-gradient(ellipse, rgba(201,151,74,0.06) 0%, transparent 70%)" }}/>

      <div className="relative rounded-[24px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.9)]"
           style={{ background: "#13100D", border: "1px solid rgba(201,151,74,0.18)" }}>

        {/* Header ornamental */}
        <div className="relative px-8 pt-8 pb-7 overflow-hidden"
             style={{ background: "#1A1410", borderBottom: "1px solid rgba(201,151,74,0.15)" }}>
          <svg className="absolute top-0 right-0 opacity-[0.05] pointer-events-none"
               width="200" height="180" viewBox="0 0 200 180" fill="none">
            <polygon points="100,8 170,50 170,130 100,172 30,130 30,50" stroke={GOLD} strokeWidth="1" fill="none"/>
            <polygon points="100,28 148,58 148,122 100,152 52,122 52,58" stroke={GOLD} strokeWidth="0.5" fill="none"/>
            <circle cx="100" cy="90" r="18" stroke={GOLD} strokeWidth="0.5" fill="none"/>
            <circle cx="100" cy="90" r="4"  fill={GOLD} opacity="0.4"/>
          </svg>

          <div className="flex items-center gap-3 mb-2">
            <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}44)` }}/>
            <span className="text-[9px] font-black tracking-[0.25em] uppercase" style={{ color: GOLD }}>
              DeParraSpitz Catering
            </span>
            <div className="h-px flex-1" style={{ background: `linear-gradient(270deg, transparent, ${GOLD}44)` }}/>
          </div>
          <h1 className="text-3xl font-serif font-normal text-white">
            Solicita tu <em className="not-italic font-light" style={{ color: GOLD }}>propuesta</em>
          </h1>
          <p className="text-xs mt-1.5 font-light" style={{ color: "#7A6A55" }}>
            Completa los datos y nuestro equipo te contactará con una propuesta personalizada.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-10">

          {/* ── 1. Datos de contacto ── */}
          <section>
            <SectionHeader number="1" title="Datos de contacto" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field required label="Nombre completo"    icon={<User  className="w-4 h-4"/>} name="name"  value={form.name}  onChange={handleChange} placeholder="Ej. María Gómez" />
              <Field required label="Correo electrónico" icon={<Mail  className="w-4 h-4"/>} name="email" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" type="email" />
              <Field required label="Teléfono / WhatsApp"icon={<Phone className="w-4 h-4"/>} name="phone" value={form.phone} onChange={handleChange} placeholder="Ej. 987 654 321" />
              <Field required label="Ciudad"             icon={<MapPin className="w-4 h-4"/>}name="city"  value={form.city}  onChange={handleChange} placeholder="Ej. Lima" />
            </div>
          </section>

          {/* ── 2. Logística del evento ── */}
          <section>
            <SectionHeader number="2" title="Logística del evento" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Field required label="Dirección del evento / local" icon={<MapPin className="w-4 h-4"/>}
                  name="address" value={form.address} onChange={handleChange}
                  placeholder="Ej. Hacienda Los Ficus, Pachacamac" />
              </div>
              <Field required label="Fecha del evento"  icon={<Calendar className="w-4 h-4"/>} name="date"   type="date"   value={form.date}   onChange={handleChange} />
              <Field required label="Hora de inicio"    icon={<Clock    className="w-4 h-4"/>} name="time"   type="time"   value={form.time}   onChange={handleChange} />
              <Field required label="N.° de asistentes" icon={<Users    className="w-4 h-4"/>} name="guests" type="number" value={form.guests} onChange={handleChange} placeholder="Ej. 150" />

              {/* Tipo de evento */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7A6A55" }}>
                  Tipo de evento <span style={{ color: GOLD }}>*</span>
                </label>
                <div className="relative group">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#5A4A35" }}>
                    <ChevronDown className="w-4 h-4"/>
                  </span>
                  <select
                    name="eventType"
                    value={form.eventType}
                    onChange={handleChange}
                    className="w-full h-11 pl-4 pr-10 rounded-xl text-sm font-light outline-none appearance-none transition-all"
                    style={{
                      background: "#1A1410",
                      border: "1px solid rgba(201,151,74,0.2)",
                      color: "#D4C4A8",
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                    onBlur={e  => (e.currentTarget.style.borderColor = "rgba(201,151,74,0.2)")}
                  >
                    <option value="Boda">Boda / Matrimonio</option>
                    <option value="Corporativo">Evento Corporativo</option>
                    <option value="Cumpleaños">Cumpleaños / Fiesta Privada</option>
                    <option value="Aniversario">Aniversario / Gala</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              {/* Notas */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7A6A55" }}>
                  Notas adicionales
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 pointer-events-none" style={{ color: "#5A4A35" }}>
                    <FileText className="w-4 h-4"/>
                  </span>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Alergias de invitados, estilo de menú, requerimientos especiales…"
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-light resize-none outline-none transition-all"
                    style={{
                      background: "#1A1410",
                      border: "1px solid rgba(201,151,74,0.2)",
                      color: "#D4C4A8",
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                    onBlur={e  => (e.currentTarget.style.borderColor = "rgba(201,151,74,0.2)")}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── 3. Método de pago ── */}
          <section>
            <SectionHeader number="3" title="Método de garantía" />
            <div className="grid grid-cols-3 gap-3">
              {payMethods.map(({ id, label, icon: Icon, selColor, selBg }) => {
                const sel = form.paymentMethod === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setForm({ ...form, paymentMethod: id })}
                    className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-300"
                    style={{
                      background: sel ? selBg : "#1A1410",
                      border: `1px solid ${sel ? selColor : "rgba(201,151,74,0.15)"}`,
                      boxShadow: sel ? `0 0 16px ${selColor}22` : "none",
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: sel ? selColor : "#5A4A35" }}/>
                    <span className="text-xs font-bold uppercase tracking-wider"
                          style={{ color: sel ? "#E8D9C0" : "#5A4A35" }}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Submit ── */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all"
            style={{
              background: loading ? "rgba(201,151,74,0.4)" : GOLD,
              color: "#0A0806",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin"/> Enviando propuesta…</>
              : <><Send className="w-4 h-4"/> Enviar propuesta de reserva</>}
          </motion.button>

        </form>
      </div>
    </div>
  );
}