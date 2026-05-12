import { useEffect, useState } from "react";
import { getProducts } from "@/modules/auth/services/product.service";

export const MenuProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    const res = await getProducts();
    setProducts(Array.isArray(res) ? res : res.data || []);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const exists = cart.find((item: any) => item.id === product.id);

    if (exists) {
      exists.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    setMessage("Producto agregado a su carrito");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  return (
    <>
      {message && (
        <div className="fixed top-24 right-6 z-50 bg-yellow-500 text-black font-bold px-6 py-4 rounded-xl shadow-lg">
          {message}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <article
            key={product.id}
            className="bg-[#15100e] border border-[#4a3824] rounded-2xl overflow-hidden"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-56 w-full object-cover"
            />

            <div className="p-6">
              <h2 className="text-2xl font-bold">
                {product.name}
              </h2>

              <p className="text-zinc-300 mt-3">
                {product.description}
              </p>

              <p className="text-yellow-500 text-3xl font-bold mt-5">
                S/ {product.price}
              </p>

              <button
                onClick={() => addToCart(product)}
                className="mt-5 w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400"
              >
                Agregar al carrito
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
};