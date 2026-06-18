import { useState } from "react";
import { usePromoStore } from "@/modules/auth/store/promoStore";
import { toast } from "sonner";

export default function PromoForm() {
  const { promos, addPromo, removePromo } = usePromoStore();

  const [form, setForm] = useState({
    title: "",
    discount: "",
    description: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    addPromo({
      id: crypto.randomUUID(),
      title: form.title,
      discount: form.discount,
      description: form.description,
      active: true,
    });

    toast.success("Promoción publicada");
    setForm({ title: "", discount: "", description: "" });
  };

  return (
    <section className="admin-card">
      <div className="card-head">
        <h2>Promociones Activas</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Título: 2x1 en Buffet Criollo"
          className="w-full bg-black border border-[#4a3824] rounded-lg p-4 text-white"
          required
        />

        <input
          name="discount"
          value={form.discount}
          onChange={handleChange}
          placeholder="Descuento: 2x1 / 30% / S/50 OFF"
          className="w-full bg-black border border-[#4a3824] rounded-lg p-4 text-white"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción de la promoción"
          className="w-full bg-black border border-[#4a3824] rounded-lg p-4 text-white"
          required
        />

        <button className="yellow-btn">
          Nueva Promoción
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Descuento</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>
          {promos.length === 0 ? (
            <tr>
              <td colSpan={4}>No hay promociones registradas</td>
            </tr>
          ) : (
            promos.map((promo) => (
              <tr key={promo.id}>
                <td>{promo.title}</td>
                <td>{promo.discount}</td>
                <td>Activo</td>
                <td>
                  <button
                    onClick={() => removePromo(promo.id)}
                    className="bg-red-500 px-4 py-2 rounded-lg font-bold"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}