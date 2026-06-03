import { useState } from "react";
import { toast } from "sonner";
import { createOrder } from "@/modules/admin/pedidos/services/order.service";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";

export default function ReservationForm() {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    date: "",
    time: "",
    guests: "",
    eventType: "Boda",
    notes: "",
    paymentMethod: "card", 
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Tu carrito está vacío. Agrega servicios antes de reservar.");
      return;
    }

    // 🛠️ CORRECCIÓN AQUÍ: Dejamos el ID como string (UUID) tal como lo pide tu backend
    const items = cart.map((item) => ({
      productId: String(item.id), // Aseguramos que sea texto (UUID) y no número
      quantity: Number(item.quantity),
    }));

    const orderData = {
      shippingAddress: `${form.address} | EVENTO: ${form.date} a las ${form.time} | Asistentes: ${form.guests} | Tipo: ${form.eventType} | Notas: ${form.notes}`,
      city: form.city,
      postalCode: "00000",
      phone: form.phone,
      paymentMethod: form.paymentMethod,
      items,
    };

    try {
      await createOrder(orderData);
      
      clearCart();
      toast.success("¡Reserva enviada exitosamente!");
      
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);

    } catch (error: any) {
      console.error("Fallo del servidor:", error);
      
      if (error.response?.status === 500) {
        toast.error("Tu reserva se procesó, pero hubo un problema interno. Te contactaremos pronto.");
      } else {
        // Esto te mostrará en un bonito toast si vuelve a faltar alguna validación
        const backendMessage = error.response?.data?.message;
        const alertMessage = Array.isArray(backendMessage) ? backendMessage.join(", ") : backendMessage;
        toast.error(alertMessage || "Error al enviar la reserva");
      }
    }
  };

  return (
    <div className="bg-[#15100e] border border-[#4a3824] p-8 rounded-2xl max-w-3xl mx-auto shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* --- DATOS PERSONALES --- */}
        <h2 className="text-xl font-bold text-yellow-500 border-b border-[#4a3824] pb-2">1. Datos de Contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-zinc-300">Nombre Completo *</label>
            <input required name="name" value={form.name} onChange={handleChange} className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-3 text-white focus:border-yellow-500 outline-none" placeholder="Ej. María Gómez" />
          </div>
          <div>
            <label className="text-sm font-bold text-zinc-300">Correo *</label>
            <input required type="email" name="email" value={form.email} onChange={handleChange} className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-3 text-white focus:border-yellow-500 outline-none" placeholder="correo@ejemplo.com" />
          </div>
          <div>
            <label className="text-sm font-bold text-zinc-300">Teléfono *</label>
            <input required name="phone" value={form.phone} onChange={handleChange} className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-3 text-white focus:border-yellow-500 outline-none" placeholder="Ej. 987654321" />
          </div>
          <div>
            <label className="text-sm font-bold text-zinc-300">Ciudad *</label>
            <input required name="city" value={form.city} onChange={handleChange} className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-3 text-white focus:border-yellow-500 outline-none" placeholder="Ej. Lima" />
          </div>
        </div>

        {/* --- DATOS DEL EVENTO --- */}
        <h2 className="text-xl font-bold text-yellow-500 border-b border-[#4a3824] pb-2 mt-8">2. Logística del Evento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-zinc-300">Dirección del Evento / Local *</label>
            <input required name="address" value={form.address} onChange={handleChange} className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-3 text-white focus:border-yellow-500 outline-none" placeholder="Ej. Hacienda Los Ficus, Pachacamac" />
          </div>
          <div>
            <label className="text-sm font-bold text-zinc-300">Fecha del Evento *</label>
            <input required type="date" name="date" value={form.date} onChange={handleChange} className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-3 text-white focus:border-yellow-500 outline-none" />
          </div>
          <div>
            <label className="text-sm font-bold text-zinc-300">Hora de Inicio *</label>
            <input required type="time" name="time" value={form.time} onChange={handleChange} className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-3 text-white focus:border-yellow-500 outline-none" />
          </div>
          <div>
            <label className="text-sm font-bold text-zinc-300">Número de Asistentes *</label>
            <input required type="number" min="1" name="guests" value={form.guests} onChange={handleChange} className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-3 text-white focus:border-yellow-500 outline-none" placeholder="Ej. 150" />
          </div>
          <div>
            <label className="text-sm font-bold text-zinc-300">Tipo de Evento *</label>
            <select name="eventType" value={form.eventType} onChange={handleChange} className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-3 text-white focus:border-yellow-500 outline-none">
              <option value="Boda">Boda</option>
              <option value="Corporativo">Evento Corporativo</option>
              <option value="Cumpleaños">Cumpleaños / Quinceañero</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-zinc-300">Notas Adicionales (Opcional)</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-3 text-white focus:border-yellow-500 outline-none" placeholder="Requerimientos especiales, alergias de invitados, estilo de menú, etc." />
          </div>
        </div>

        {/* --- MÉTODO DE PAGO --- */}
        <h2 className="text-xl font-bold text-yellow-500 border-b border-[#4a3824] pb-2 mt-8">3. Método de Pago (Garantía)</h2>
        <div className="grid grid-cols-3 gap-3 bg-[#211814] rounded-lg p-2 mt-4">
          {[
            ["card", "Tarjeta"],
            ["yape", "Yape"],
            ["plin", "Plin"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm({ ...form, paymentMethod: value })}
              className={`py-3 rounded-lg font-bold transition-all duration-300 ${
                form.paymentMethod === value
                  ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                  : "text-[#f1d8b5] hover:bg-[#3a2a1e]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold py-4 rounded-xl mt-8 transition-colors text-lg shadow-[0_0_20px_rgba(234,179,8,0.2)]">
          Enviar Propuesta de Reserva
        </button>
      </form>
    </div>
  );
}