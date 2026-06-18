import { useEffect, useState } from "react";
import { PlusCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createProduct } from "@/modules/admin/productos/services/product.service";
import { categoryService } from "@/modules/admin/categorias/services/category.service";

interface ProductFormProps {
  onProductCreated: () => void;
}

export const ProductForm = ({ onProductCreated }: ProductFormProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "", description: "", price: "", stock: "", categoryId: "", imageUrl: "",
  });

  useEffect(() => {
    categoryService.getAll()
      .then((res) => {
        setCategories(Array.isArray(res) ? res : (res as any).data || []);
      })
      .catch(() => {
        toast.error("Error al cargar las categorías");
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        stock: Number(formData.stock) || 0,
      });
      
      toast.success("Producto creado exitosamente");
      setFormData({ name: "", description: "", price: "", stock: "", categoryId: "", imageUrl: "" });
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
          
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-foreground text-sm font-medium">Nombre del Producto *</label>
            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Ej. Lomo Saltado" className="h-11 px-4 bg-background border border-input text-foreground rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" required />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="categoryId" className="text-foreground text-sm font-medium">Categoría *</label>
            <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} className="h-11 px-3 bg-background border border-input text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" required>
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="price" className="text-foreground text-sm font-medium">Precio (S/) *</label>
            <input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="0.00" className="h-11 px-4 bg-background border border-input text-foreground rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" required />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="stock" className="text-foreground text-sm font-medium">Stock Inicial</label>
            <input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Cantidad disponible" className="h-11 px-4 bg-background border border-input text-foreground rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label htmlFor="imageUrl" className="text-foreground text-sm font-medium">URL de la Imagen</label>
            <input id="imageUrl" name="imageUrl" type="text" value={formData.imageUrl} onChange={handleChange} placeholder="https://ejemplo.com/imagen.jpg" className="h-11 px-4 bg-background border border-input text-foreground rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label htmlFor="description" className="text-foreground text-sm font-medium">Descripción del Plato</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Detalla los ingredientes o la presentación..." rows={3} className="p-3 bg-background border border-input text-foreground rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>

        </div>

        <button type="submit" disabled={loading} className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-bold rounded-lg flex items-center justify-center gap-2 transition-colors duration-200">
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