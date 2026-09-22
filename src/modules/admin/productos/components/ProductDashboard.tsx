import { useEffect, useState } from "react";
import { Loader2, PlusCircle, ChevronUp } from "lucide-react";
import { ProductForm } from "./ProductForm";
import ProductTable from "./ProductTable";
import { getProducts } from "@/modules/admin/productos/services/product.service";
import { categoryService } from "@/modules/admin/categorias/services/category.service";

export default function ProductDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    try {
      const responseData: any = await getProducts();
      let cleanProductsList: any[] = [];

      if (Array.isArray(responseData)) {
        cleanProductsList = responseData;
      } else if (responseData && Array.isArray(responseData.products)) {
        cleanProductsList = responseData.products;
      } else if (responseData && Array.isArray(responseData.data)) {
        cleanProductsList = responseData.data;
      }

      setProducts(cleanProductsList);
    } catch (error) {
      console.error("Error al cargar el catálogo de productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll();
      setCategories(Array.isArray(res) ? res : (res as any).data || []);
    } catch {
      // silencioso: si falla categorías, la tabla sigue funcionando
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Si no hay productos aún, el form siempre visible; si ya hay, toggle manual
  const hasProducts = products.length > 0;
  const isFormVisible = !hasProducts || showForm;

  const handleProductCreated = () => {
    fetchProducts();
    // Al crear el primer producto, el form se oculta automáticamente
    setShowForm(false);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* BOTÓN TOGGLE – solo aparece si ya hay productos */}
      {hasProducts && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className={`
              inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm
              transition-all duration-200 shadow-sm border
              ${isFormVisible
                ? "bg-secondary border-border text-secondary-foreground hover:bg-secondary/80"
                : "bg-primary border-primary/30 text-primary-foreground hover:bg-primary/90 shadow-primary/20"
              }
            `}
          >
            {isFormVisible ? (
              <><ChevronUp className="w-4 h-4" /> Ocultar formulario</>
            ) : (
              <><PlusCircle className="w-4 h-4" /> Agregar producto</>
            )}
          </button>
        </div>
      )}

      {/* SECCIÓN 1: Formulario (animado con altura) */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isFormVisible ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
        `}
      >
        <ProductForm
          onProductCreated={handleProductCreated}
          categories={categories}
        />
      </div>

      {/* SECCIÓN 2: Catálogo de Productos */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-2xl shadow-xl">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground text-sm font-medium">Conectando con el catálogo...</p>
        </div>
      ) : (
        <ProductTable
          products={products}
          categories={categories}
          onRefresh={() => { fetchProducts(); }}
        />
      )}

    </div>
  );
}