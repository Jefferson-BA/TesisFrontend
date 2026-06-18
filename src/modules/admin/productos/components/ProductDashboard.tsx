import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ProductForm } from "./ProductForm";
import ProductTable from "./ProductTable";
import { getProducts } from "@/modules/admin/productos/services/product.service";

export default function ProductDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      
      {/* SECCIÓN 1: Formulario (Arriba) */}
      <ProductForm onProductCreated={() => { fetchProducts(); }} />

      {/* SECCIÓN 2: Catálogo de Productos (Abajo) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-[#15100e] border border-[#4a3824] rounded-2xl shadow-xl">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500 mb-2" />
          <p className="text-zinc-400 text-sm font-medium">Conectando con el catálogo...</p>
        </div>
      ) : (
        /* CORRECCIÓN: Envoltura síncrona segura en la prop onRefresh */
        <ProductTable 
          products={products} 
          onRefresh={() => { fetchProducts(); }} 
        />
      )}

    </div>
  );
}