import { useEffect, useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { getProducts } from "@/modules/auth/services/product.service";
import { useCartStore } from "@/modules/auth/store/cartStore";

export const MenuProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

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
    <>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <article
            key={product.id}
            className="bg-[#15100e] border border-[#4a3824] rounded-2xl overflow-hidden"
          >
            <img
              src={product.imageUrl || "https://placehold.co/600x400"}
              alt={product.name}
              onClick={() => setSelectedProduct(product)}
              className="h-56 w-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
            />

            <div className="p-6">
              <h2 className="text-2xl font-bold text-white">{product.name}</h2>

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
                onClick={() => setSelectedProduct(product)}
                className="mt-4 text-yellow-500 font-bold underline"
              >
                Ver descripción
              </button>

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
                {product.stock === 0 ? "No disponible" : "Agregar al carrito"}
              </button>
            </div>
          </article>
        ))}
      </section>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative w-full max-w-5xl bg-[#15100e] border border-[#4a3824] rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 bg-black/70 hover:bg-black text-white rounded-full p-2"
              >
                <X size={24} />
              </button>

              <div
                className="absolute inset-0 opacity-20 blur-2xl bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    selectedProduct.imageUrl || "https://placehold.co/600x400"
                  })`,
                }}
              />

              <div className="relative h-[420px] md:h-[620px] bg-black">
                <img
                  src={selectedProduct.imageUrl || "https://placehold.co/600x400"}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative p-8 flex flex-col justify-center">
                <h2 className="text-4xl font-black text-white mb-4">
                  {selectedProduct.name}
                </h2>

                <p className="text-yellow-500 text-4xl font-black mb-5">
                  S/ {Number(selectedProduct.price).toFixed(2)}
                </p>

                <p className="text-zinc-300 leading-7 mb-6">
                  {selectedProduct.description ||
                    "Este producto aún no tiene descripción. El administrador puede agregar los ingredientes, preparación y detalles desde el panel de productos."}
                </p>

                <div className="mb-6">
                  {selectedProduct.stock >= 10 ? (
                    <span className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
                      Disponible
                    </span>
                  ) : selectedProduct.stock === 1 ? (
                    <span className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-bold">
                      Disponible para mañana
                    </span>
                  ) : (
                    <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
                      No disponible
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(selectedProduct)}
                  disabled={selectedProduct.stock === 0}
                  className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 ${
                    selectedProduct.stock === 0
                      ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                      : "bg-yellow-500 text-black hover:bg-yellow-400"
                  }`}
                >
                  <ShoppingCart size={20} />
                  {selectedProduct.stock === 0
                    ? "No disponible"
                    : "Agregar al carrito"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};