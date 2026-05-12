import { useEffect, useState } from "react";
import {
  deleteProduct,
  getProducts,
} from "@/modules/auth/services/product.service";

export default function ProductTable() {
  const [products, setProducts] = useState<any[]>([]);

  const loadProducts = async () => {
    try {
      const data = await getProducts();

      console.log("PRODUCTOS BACKEND:", data);

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else if (Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error(error);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar");
    }
  };

  return (
    <div className="bg-[#120c09] border border-yellow-900/40 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Productos Registrados
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-white">
          <thead>
            <tr className="border-b border-yellow-900/40 text-yellow-500">
              <th className="py-3">Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-zinc-400"
                >
                  No hay productos registrados
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id || product._id}
                  className="border-b border-zinc-800"
                >
                  <td className="py-4">
                    {product.name || product.nombre}
                  </td>

                  <td>
                    S/ {product.price || product.precio}
                  </td>

                  <td>
                    {product.stock}
                  </td>

                  <td>
                    {product.category || product.categoria}
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        handleDelete(product.id || product._id)
                      }
                      className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-lg text-white"
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
    </div>
  );
}