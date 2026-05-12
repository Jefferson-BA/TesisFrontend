import { useEffect, useState } from "react";
import { getProducts } from "@/modules/auth/services/product.service";

export const MenuProducts = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await getProducts();

        if (Array.isArray(res)) {
          setProducts(res);
        } else if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadProducts();
  }, []);

  return (
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
            <h2 className="text-2xl font-bold">{product.name}</h2>

            <p className="text-zinc-300 mt-3">
              {product.description}
            </p>

            <p className="text-yellow-500 text-3xl font-bold mt-5">
              S/ {product.price}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
};