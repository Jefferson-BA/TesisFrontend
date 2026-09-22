import { useState } from "react";
import { toast } from "sonner";
import { Edit, Trash2, X, CheckCircle2, XCircle, Save } from "lucide-react";
import { deleteProduct, updateProduct } from "@/modules/admin/productos/services/product.service";

interface ProductTableProps {
  products: any[];
  categories: any[];
  onRefresh: () => void | Promise<void>;
}

export default function ProductTable({ products, categories, onRefresh }: ProductTableProps) {
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      toast.success("Producto eliminado correctamente");
      await onRefresh();
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar producto");
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct({
      id: product.id || product._id,
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      categoryId: product.categoryId || product.category?.id || "",
      imageUrl: product.imageUrl || "",
      // Determinar disponibilidad: priorizar isAvailable, fallback a stock
      isAvailable: product.isAvailable !== undefined
        ? Boolean(product.isAvailable)
        : (product.stock !== undefined ? product.stock > 0 : true),
    });
  };

  const handleChange = (e: any) => {
    setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    try {
      await updateProduct(editingProduct.id, {
        name: editingProduct.name,
        description: editingProduct.description,
        price: Number(editingProduct.price),
        categoryId: editingProduct.categoryId,
        imageUrl: editingProduct.imageUrl,
        isAvailable: editingProduct.isAvailable,
      });
      toast.success("Producto actualizado correctamente ✓");
      setEditingProduct(null);
      await onRefresh();
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar producto");
    }
  };

  /** Evalúa si el producto está disponible (compatible con isAvailable o stock) */
  const isProductAvailable = (product: any): boolean => {
    if (product.isAvailable !== undefined) return Boolean(product.isAvailable);
    if (product.stock !== undefined) return product.stock > 0;
    return true;
  };

  return (
    <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Catálogo de Productos
        </h2>
        <span className="text-xs font-semibold text-muted-foreground bg-secondary border border-border px-3 py-1.5 rounded-lg uppercase tracking-wider">
          {products.length} producto{products.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ─── FORMULARIO DE EDICIÓN ─── */}
      {editingProduct && (
        <form
          onSubmit={handleUpdate}
          className="mb-8 bg-muted/30 border border-border rounded-xl p-6 space-y-5 animate-in fade-in duration-200"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-primary uppercase tracking-wide flex items-center gap-2">
              <Edit className="w-4 h-4" /> Editar Producto
            </h3>
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nombre */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">
                Nombre <span className="text-primary">*</span>
              </label>
              <input
                name="name"
                value={editingProduct.name}
                onChange={handleChange}
                placeholder="Nombre del producto"
                className="h-11 px-4 bg-background border border-input text-foreground rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            {/* Precio */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">
                Precio (S/) <span className="text-primary">*</span>
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={editingProduct.price}
                onChange={handleChange}
                placeholder="0.00"
                className="h-11 px-4 bg-background border border-input text-foreground rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            {/* Categoría – select con nombres (NO muestra UUID) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">Categoría</label>
              <select
                name="categoryId"
                value={editingProduct.categoryId}
                onChange={handleChange}
                className="h-11 px-3 bg-background border border-input text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat._id} value={cat.id || cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Disponibilidad – radio buttons estilizados */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">Disponibilidad</label>
              <div className="flex gap-3 h-11 items-center">
                <button
                  type="button"
                  onClick={() => setEditingProduct({ ...editingProduct, isAvailable: true })}
                  className={`
                    flex items-center gap-2 px-4 h-full rounded-lg border font-semibold text-sm transition-all
                    ${editingProduct.isAvailable
                      ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30"
                      : "bg-background border-input text-muted-foreground hover:border-emerald-400/40"
                    }
                  `}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Disponible
                </button>

                <button
                  type="button"
                  onClick={() => setEditingProduct({ ...editingProduct, isAvailable: false })}
                  className={`
                    flex items-center gap-2 px-4 h-full rounded-lg border font-semibold text-sm transition-all
                    ${!editingProduct.isAvailable
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
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">URL de la Imagen</label>
              <input
                name="imageUrl"
                value={editingProduct.imageUrl}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="h-11 px-4 bg-background border border-input text-foreground rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Descripción */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">Descripción</label>
              <textarea
                name="description"
                value={editingProduct.description}
                onChange={handleChange}
                placeholder="Detalla los ingredientes o la presentación..."
                rows={3}
                className="p-3 bg-background border border-input text-foreground rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-bold transition-colors"
            >
              <Save className="w-4 h-4" /> Guardar Cambios
            </button>
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-2.5 rounded-lg font-bold transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* ─── TABLA DE PRODUCTOS ─── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-foreground text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
              <th className="py-3 font-bold">Nombre</th>
              <th className="font-bold">Categoría</th>
              <th className="font-bold">Precio</th>
              <th className="font-bold">Estado</th>
              <th className="font-bold text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products && products.length > 0 ? (
              products.map((product) => {
                const available = isProductAvailable(product);
                return (
                  <tr
                    key={product.id || product._id}
                    className="border-b border-border hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-4 font-bold text-foreground">{product.name}</td>
                    <td className="text-muted-foreground">
                      {product.category?.name || product.category || "Sin categoría"}
                    </td>
                    <td className="font-mono">S/ {Number(product.price).toFixed(2)}</td>
                    <td>
                      <span
                        className={`
                          inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs border
                          ${available
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                          }
                        `}
                      >
                        {available ? (
                          <><CheckCircle2 className="w-3 h-3" /> Disponible</>
                        ) : (
                          <><XCircle className="w-3 h-3" /> No disponible</>
                        )}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(product)}
                          title="Editar producto"
                          className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id || product._id)}
                          title="Eliminar producto"
                          className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted-foreground">
                  No hay productos cargados en el catálogo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}