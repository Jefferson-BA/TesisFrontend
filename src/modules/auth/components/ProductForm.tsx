import { useState } from "react";
import { createProduct } from "@/modules/auth/services/product.service";

export default function ProductForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
    } catch (error) {
      console.error(error);
      alert("Error al crear producto");
    }
  };

  return (
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
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white"
        />

        <input
          type="text"
          name="categoryId"
          placeholder="ID de categoría UUID"
          value={form.categoryId}
          onChange={handleChange}
          className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white"
        />

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
  );
}