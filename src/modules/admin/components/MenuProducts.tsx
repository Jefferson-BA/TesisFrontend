import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { getProducts } from "@/modules/auth/services/product.service";
import { useCartStore } from "@/modules/auth/store/cartStore";

export const MenuProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    getProducts().then((res) =>
      setProducts(Array.isArray(res) ? res : res.data || [])
    );
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

            <p className="text-yellow-500 text-3xl font-bold mt-5">
              S/ {Number(product.price).toFixed(2)}
            </p>

           <div className="mt-3">
  {product.stock >= 10 ? (
    <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
      Disponible
    </span>
  ) : product.stock === 1 ? (
    <span className="bg-yellow-500 text-black px-3 py-1 rounded-lg text-sm font-bold">
      Disponible para mañana
    </span>
  ) : (
    <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
      No disponible
    </span>
  )}
</div>
            <button
              onClick={() =>
                setOpenId(openId === product.id ? null : product.id)
              }
              className="mt-4 text-yellow-500 font-bold underline"
            >
              {openId === product.id
                ? "Ocultar descripción"
                : "Ver descripción"}
            </button>

            {openId === product.id && (
              <p className="text-zinc-300 mt-3">
                {product.description || "Sin descripción disponible"}
              </p>
            )}

            <button
              onClick={() => handleAddToCart(product)}
              disabled={product.stock === 0}
              className={`mt-5 w-full font-bold py-3 rounded-lg flex items-center justify-center gap-2 ${
                product.stock === 0
                  ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                  : "bg-yellow-500 text-black hover:bg-yellow-400"
              }`}
            >
              <ShoppingCart size={18} />
              {product.stock === 0
                ? "No disponible"
                : "Agregar al carrito"}
            </button>
          </div>
        </article>
      ))}
    </section>
  );
};