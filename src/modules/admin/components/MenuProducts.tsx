import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { getProducts } from "@/modules/auth/services/product.service";
import { useCartStore } from "@/modules/auth/store/cartStore";

export const MenuProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(Array.isArray(res) ? res : res.data || []);
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      category: product.category?.name || product.category || "Criollo",
    });

    toast.success("Producto agregado al carrito");
  };

  if (loading) {
    return (
      <p className="text-center text-zinc-400">Cargando productos...</p>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-center text-zinc-400">No hay productos registrados.</p>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {products.map((product) => (
        <article
          key={product.id}
          className="bg-[#15100e] border border-[#4a3824] rounded-2xl overflow-hidden"
        >
          <img
            src={product.imageUrl || "https://placehold.co/600x400"}
            alt={product.name}
            className="h-56 w-full object-cover"
          />

          <div className="p-6">
            <h2 className="text-2xl font-bold">{product.name}</h2>

            <p className="text-zinc-300 mt-3 line-clamp-3">
              {product.description}
            </p>

            <p className="text-yellow-500 text-3xl font-bold mt-5">
              S/ {Number(product.price).toFixed(2)}
            </p>

            <button
              onClick={() => handleAddToCart(product)}
              className="mt-5 w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Agregar al carrito
            </button>
          </div>
        </article>
      ))}
    </section>
  );
};
