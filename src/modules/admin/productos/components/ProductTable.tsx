import { useState } from "react";
import { deleteProduct, updateProduct } from "@/modules/admin/productos/services/product.service";

interface ProductTableProps {
  products: any[];
  onRefresh: () => void | Promise<void>;
}

export default function ProductTable({ products, onRefresh }: ProductTableProps) {
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      await onRefresh();
      alert("Producto eliminado");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar producto");
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct({
      id: product.id || product._id, name: product.name || "", description: product.description || "", price: product.price || "", stock: String(product.stock ?? ""), categoryId: product.categoryId || product.category?.id || "", imageUrl: product.imageUrl || "",
    });
  };

  const handleChange = (e: any) => {
    setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    try {
      await updateProduct(editingProduct.id, {
        name: editingProduct.name, description: editingProduct.description, price: Number(editingProduct.price), stock: Number(editingProduct.stock), categoryId: editingProduct.categoryId, imageUrl: editingProduct.imageUrl,
      });
      alert("Producto actualizado correctamente");
      setEditingProduct(null);
      await onRefresh();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar producto");
    }
  };

  return (
    <section className="bg-card border border-border rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Catálogo de Productos
        </h2>
        <button className="bg-secondary border border-border text-secondary-foreground px-5 py-2 rounded-lg">
          Todos
        </button>
      </div>

      {editingProduct && (
        <form onSubmit={handleUpdate} className="mb-8 bg-muted/40 border border-border rounded-xl p-5 grid gap-4">
          <h3 className="text-xl font-bold text-primary">Editar Producto</h3>
          <input name="name" value={editingProduct.name} onChange={handleChange} placeholder="Nombre" className="bg-background border border-input rounded-lg px-4 py-3 text-foreground" />
          <textarea name="description" value={editingProduct.description} onChange={handleChange} placeholder="Descripción" className="bg-background border border-input rounded-lg px-4 py-3 text-foreground" />
          <input name="price" type="number" value={editingProduct.price} onChange={handleChange} placeholder="Precio" className="bg-background border border-input rounded-lg px-4 py-3 text-foreground" />
          <select name="stock" value={editingProduct.stock} onChange={handleChange} className="bg-background border border-input rounded-lg px-4 py-3 text-foreground" required>
            <option value="">Selecciona disponibilidad</option>
            <option value="10">Disponible</option>
            <option value="0">No disponible</option>
          </select>
          <input name="categoryId" value={editingProduct.categoryId} onChange={handleChange} placeholder="ID de categoría UUID" className="bg-background border border-input rounded-lg px-4 py-3 text-foreground" />
          <input name="imageUrl" value={editingProduct.imageUrl} onChange={handleChange} placeholder="URL de imagen" className="bg-background border border-input rounded-lg px-4 py-3 text-foreground" />

          <div className="flex gap-3">
            <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-3 rounded-lg font-bold">Guardar Cambios</button>
            <button type="button" onClick={() => setEditingProduct(null)} className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-5 py-3 rounded-lg font-bold">Cancelar</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-foreground">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-3">Nombre</th>
              <th>Tipo</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id || product._id} className="border-b border-border">
                  <td className="py-4 font-bold">{product.name}</td>
                  <td>{product.category?.name || product.category || "Sin categoría"}</td>
                  <td>S/ {Number(product.price).toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`px-3 py-1 rounded-lg font-bold text-sm ${product.stock > 0 ? "bg-green-600/20 text-green-600 dark:bg-green-600 dark:text-white" : "bg-red-600/20 text-red-600 dark:bg-red-600 dark:text-white"}`}>
                      {product.stock > 0 ? "Disponible" : "No disponible"}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-3">
                      <button onClick={() => handleEdit(product)} className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-bold">Editar</button>
                      <button onClick={() => handleDelete(product.id || product._id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg font-bold">Borrar</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">No hay productos cargados en el catálogo.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}