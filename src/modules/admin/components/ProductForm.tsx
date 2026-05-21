import { useEffect, useState } from "react";
import { createProduct } from "@/modules/auth/services/product.service";
import { getCategories, createCategory } from "@/modules/auth/services/category.service";

export default function ProductForm() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
  });

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(Array.isArray(data) ? data : data.data || []);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateCategory = async (e: any) => {
    e.preventDefault();

    if (!newCategory.trim()) return;

    try {
      await createCategory({ name: newCategory });
      alert("Categoría creada correctamente");
      setNewCategory("");
      loadCategories();
    } catch (error: any) {
      console.error(error.response?.data || error);
      alert(error.response?.data?.message || "Error al crear categoría");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await createProduct({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: form.categoryId,
        imageUrl: form.imageUrl,
      });

      alert("Producto creado correctamente");

      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        imageUrl: "",
      });

      window.location.reload();
    } catch (error: any) {
      console.error("ERROR PRODUCTO:", error.response?.data || error);
      alert(error.response?.data?.message || "Error al crear producto");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      <div className="bg-[#120c09] border border-yellow-900/40 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Nuevo Producto
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white"
            required
          />

          <textarea
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
            className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white"
          />

          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={form.price}
            onChange={handleChange}
            className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white"
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white"
            required
          />

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white"
            required
          >
            <option value="">Selecciona una categoría</option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="imageUrl"
            placeholder="URL de imagen"
            value={form.imageUrl}
            onChange={handleChange}
            className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white"
          />

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-all"
          >
            Crear Producto
          </button>
        </form>
      </div>

      <div className="bg-[#120c09] border border-yellow-900/40 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Crear Categoría
        </h2>

        <form onSubmit={handleCreateCategory} className="grid gap-4">
          <input
            type="text"
            placeholder="Ejemplo: Criollo, Árabe, Parrillero"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white"
            required
          />

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg"
          >
            Crear Categoría
          </button>
        </form>

        <h3 className="text-white font-bold mt-8 mb-4">
          Categorías disponibles
        </h3>

        <div className="space-y-3">
          {categories.length === 0 ? (
            <p className="text-zinc-400">No hay categorías registradas</p>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-black border border-zinc-800 rounded-lg p-4"
              >
                <p className="text-yellow-500 font-bold">{cat.name}</p>
                <p className="text-xs text-zinc-400 break-all">{cat.id}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}