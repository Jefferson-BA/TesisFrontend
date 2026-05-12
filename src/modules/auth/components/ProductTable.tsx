import { useEffect, useState } from "react";
import {
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/modules/auth/services/product.service";

export default function ProductTable() {
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const loadProducts = async () => {
    try {
      const data = await getProducts();

      if (Array.isArray(data)) setProducts(data);
      else if (Array.isArray(data.products)) setProducts(data.products);
      else if (Array.isArray(data.data)) setProducts(data.data);
      else setProducts([]);
    } catch (error) {
      console.error(error);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      await deleteProduct(id);
      await loadProducts();
      alert("Producto eliminado");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar producto");
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct({
      id: product.id || product._id,
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      categoryId: product.categoryId || product.category?.id || "",
      imageUrl: product.imageUrl || "",
    });
  };

  const handleChange = (e: any) => {
    setEditingProduct({
      ...editingProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    try {
      await updateProduct(editingProduct.id, {
        name: editingProduct.name,
        description: editingProduct.description,
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock),
        categoryId: editingProduct.categoryId,
        imageUrl: editingProduct.imageUrl,
      });

      alert("Producto actualizado correctamente");
      setEditingProduct(null);
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar producto");
    }
  };

  return (
    <section className="bg-[#120c09] border border-yellow-900/40 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          Catálogo de Productos
        </h2>

        <button className="bg-black border border-[#4a3824] text-white px-5 py-2 rounded-lg">
          Todos
        </button>
      </div>

      {editingProduct && (
        <form
          onSubmit={handleUpdate}
          className="mb-8 bg-black/40 border border-yellow-900/40 rounded-xl p-5 grid gap-4"
        >
          <h3 className="text-xl font-bold text-yellow-500">
            Editar Producto
          </h3>

          <input
            name="name"
            value={editingProduct.name}
            onChange={handleChange}
            placeholder="Nombre"
            className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white"
          />

          <textarea
            name="description"
            value={editingProduct.description}
            onChange={handleChange}
            placeholder="Descripción"
            className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white"
          />

          <input
            name="price"
            type="number"
            value={editingProduct.price}
            onChange={handleChange}
            placeholder="Precio"
            className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white"
          />

          <input
            name="stock"
            type="number"
            value={editingProduct.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white"
          />

          <input
            name="categoryId"
            value={editingProduct.categoryId}
            onChange={handleChange}
            placeholder="ID de categoría UUID"
            className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white"
          />

          <input
            name="imageUrl"
            value={editingProduct.imageUrl}
            onChange={handleChange}
            placeholder="URL de imagen"
            className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-3 rounded-lg font-bold"
            >
              Guardar Cambios
            </button>

            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-5 py-3 rounded-lg font-bold"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-white">
          <thead>
            <tr className="border-b border-[#4a3824] text-[#f1d8b5]">
              <th className="py-3">Nombre</th>
              <th>Tipo</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id || product._id}
                className="border-b border-[#4a3824]"
              >
                <td className="py-4 font-bold">{product.name}</td>

                <td>
                  {product.category?.name ||
                    product.category ||
                    "Sin categoría"}
                </td>

                <td>S/ {Number(product.price).toFixed(2)}</td>

                <td>{product.stock}</td>

                <td>
                  <span className="bg-green-900 text-green-400 px-3 py-1 rounded-md text-sm font-bold">
                    Disponible
                  </span>
                </td>

                <td>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(product.id || product._id)
                      }
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold"
                    >
                      Borrar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}