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
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-card-foreground mb-6">Promociones Activas</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Título: 2x1 en Buffet Criollo"
          className="w-full bg-background border border-input rounded-lg p-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
          required
        />

        <input
          name="discount"
          value={form.discount}
          onChange={handleChange}
          placeholder="Descuento: 2x1 / 30% / S/50 OFF"
          className="w-full bg-background border border-input rounded-lg p-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción de la promoción"
          className="w-full bg-background border border-input rounded-lg p-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
          required
        />

        <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg transition-all">
          Nueva Promoción
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b border-border py-3 text-primary font-semibold">Título</th>
              <th className="border-b border-border py-3 text-primary font-semibold">Descuento</th>
              <th className="border-b border-border py-3 text-primary font-semibold">Estado</th>
              <th className="border-b border-border py-3 text-primary font-semibold text-right">Acción</th>
            </tr>
          </thead>

          <tbody>
            {promos.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-muted-foreground">No hay promociones registradas</td>
              </tr>
            ) : (
              promos.map((promo) => (
                <tr key={promo.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 text-foreground font-medium">{promo.title}</td>
                  <td className="py-3 text-muted-foreground">{promo.discount}</td>
                  <td className="py-3 text-muted-foreground">Activo</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => removePromo(promo.id)}
                      className="bg-destructive/10 text-destructive hover:bg-destructive/20 px-4 py-2 rounded-lg font-bold transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}