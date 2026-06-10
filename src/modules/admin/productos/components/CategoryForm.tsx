import { useEffect, useState } from "react";
import {
  createCategory,
  getCategories,
  deleteCategory,
} from "@/modules/admin/productos/services/category.service";

export default function CategoryForm() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar categorías");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Escribe el nombre de la categoría");
      return;
    }

    try {
      await createCategory({ name });

      alert("Categoría creada correctamente");

      setName("");
      loadCategories();
    } catch (error) {
      console.error(error);
      alert("Error al crear categoría");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("¿Eliminar esta categoría?");

    if (!confirmDelete) return;

    try {
      await deleteCategory(id);
      alert("Categoría eliminada");
      loadCategories();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar categoría");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-card-foreground mb-6">
        Gestión de Categorías
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-4 mb-8">
        <input
          type="text"
          placeholder="Nombre de categoría"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-background border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
        />

        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg transition-all"
        >
          Crear Categoría
        </button>
      </form>

      <h3 className="text-xl font-bold text-card-foreground mb-4">
        Categorías registradas
      </h3>

      <div className="grid gap-3">
        {categories.length === 0 ? (
          <p className="text-muted-foreground">
            No hay categorías registradas.
          </p>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-muted/50 border border-border rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-primary font-bold">
                  {category.name}
                </p>

                <p className="text-muted-foreground text-sm break-all">
                  ID: {category.id}
                </p>
              </div>

              <button
                onClick={() => handleDelete(category.id)}
                className="text-destructive hover:text-destructive/80 font-bold transition-colors"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}