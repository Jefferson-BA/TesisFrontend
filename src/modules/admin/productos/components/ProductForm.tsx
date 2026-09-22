import { useState } from "react";
import { PlusCircle, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { createProduct } from "@/modules/admin/productos/services/product.service";

interface ProductFormProps {
  onProductCreated: () => void;
  /** Categorías precargadas desde el Dashboard – evita doble fetch */
  categories: any[];
}

export const ProductForm = ({ onProductCreated, categories }: ProductFormProps) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    isAvailable: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error("Por favor completa los campos obligatorios (*)");
      return;
    }

    setLoading(true);
    try {
      await createProduct({
        ...formData,
        price: Number(formData.price),
      });

      toast.success("Producto creado exitosamente ✓");
      setFormData({ name: "", description: "", price: "", categoryId: "", imageUrl: "", isAvailable: true });
      onProductCreated();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-card border border-border rounded-2xl p-6 shadow-xl text-card-foreground">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">Nuevo Producto</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Registra los alimentos, bebidas o combos disponibles en el menú.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Nombre */}
          <div className="flex flex-col gap-2">
            <label htmlFor="prod-name" className="text-foreground text-sm font-semibold">
              Nombre del Producto <span className="text-primary">*</span>
            </label>
            <input
              id="prod-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Lomo Saltado"
              className="h-11 px-4 bg-background border border-input text-foreground rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {/* Categoría */}
          <div className="flex flex-col gap-2">
            <label htmlFor="prod-categoryId" className="text-foreground text-sm font-semibold">
              Categoría <span className="text-primary">*</span>
            </label>
            <select
              id="prod-categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="h-11 px-3 bg-background border border-input text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id || cat._id} value={cat.id || cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Precio */}
          <div className="flex flex-col gap-2">
            <label htmlFor="prod-price" className="text-foreground text-sm font-semibold">
              Precio (S/) <span className="text-primary">*</span>
            </label>
            <input
              id="prod-price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              className="h-11 px-4 bg-background border border-input text-foreground rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {/* Disponibilidad – radio buttons estilizados */}
          <div className="flex flex-col gap-2">
            <span className="text-foreground text-sm font-semibold">Disponibilidad</span>
            <div className="flex gap-3 h-11 items-center">

              {/* Disponible */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isAvailable: true })}
                className={`
                  flex items-center gap-2 px-4 h-full rounded-lg border font-semibold text-sm transition-all
                  ${formData.isAvailable
                    ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30"
                    : "bg-background border-input text-muted-foreground hover:border-emerald-400/40"
                  }
                `}
              >
                <CheckCircle2 className="w-4 h-4" />
                Disponible
              </button>

              {/* No disponible */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isAvailable: false })}
                className={`
                  flex items-center gap-2 px-4 h-full rounded-lg border font-semibold text-sm transition-all
                  ${!formData.isAvailable
                    ? "bg-red-500/15 border-red-500/50 text-red-600 dark:text-red-400 ring-1 ring-red-500/30"
                    : "bg-background border-input text-muted-foreground hover:border-red-400/40"
                  }
                `}
              >
                <XCircle className="w-4 h-4" />
                No disponible
              </button>

            </div>
          </div>

          {/* URL imagen */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <label htmlFor="prod-imageUrl" className="text-foreground text-sm font-semibold">
              URL de la Imagen
            </label>
            <input
              id="prod-imageUrl"
              name="imageUrl"
              type="text"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="h-11 px-4 bg-background border border-input text-foreground rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Descripción */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <label htmlFor="prod-description" className="text-foreground text-sm font-semibold">
              Descripción del Plato
            </label>
            <textarea
              id="prod-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detalla los ingredientes o la presentación..."
              rows={3}
              className="p-3 bg-background border border-input text-foreground rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-bold rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
        >
          {loading ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Guardando...</>
          ) : (
            <><PlusCircle className="h-5 w-5" /> Crear Producto</>
          )}
        </button>
      </form>
    </section>
  );
};