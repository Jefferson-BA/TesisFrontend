import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const getProductId = (item: any) => {
    return item.product?.id || item.productId || item.id || item._id;
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;

    const updated = cart.map((item) =>
      getProductId(item) === id
        ? { ...item, quantity }
        : item
    );

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id: string) => {
    const updated = cart.filter((item) => getProductId(item) !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  const total = cart.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="bg-[#1a1210] border-b border-[#3d2c1f]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <a href="/menu" className="text-[#f1d8b5]">
            ← Continuar comprando
          </a>

          <h1 className="text-6xl font-serif font-bold mt-6">
            Carrito de Compras
          </h1>

          <p className="text-[#d8b892] mt-4">
            {cart.length} producto en tu carrito
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-5">
          {cart.length === 0 ? (
            <div className="bg-[#140d0b] border border-[#3d2c1f] rounded-2xl p-10">
              Tu carrito está vacío
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={getProductId(item)}
                className="bg-[#140d0b] border border-[#3d2c1f] rounded-2xl p-6 flex justify-between items-center"
              >
                <div className="flex gap-5 items-center">
                  <img
                    src={item.imageUrl || item.image || item.product?.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />

                  <div>
                    <h2 className="text-2xl font-serif font-bold">
                      {item.name}
                    </h2>

                    <p className="text-[#d8b892]">
                      {item.category || "Criollo"}
                    </p>

                    <div className="mt-4 flex items-center gap-4 border border-[#4a3824] rounded-xl px-4 py-2 w-fit">
                      <button
                        onClick={() =>
                          updateQuantity(getProductId(item), item.quantity - 1)
                        }
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(getProductId(item), item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => removeItem(getProductId(item))}
                    className="text-red-500 mb-5"
                  >
                    <Trash2 size={20} />
                  </button>

                  <p className="text-[#d8b892]">
                    S/ {Number(item.price).toFixed(2)} c/u
                  </p>

                  <strong className="text-3xl text-yellow-500">
                    S/ {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </strong>
                </div>
              </div>
            ))
          )}

          {cart.length > 0 && (
            <button onClick={clearCart} className="text-red-500 flex gap-2">
              <Trash2 size={18} />
              Vaciar carrito
            </button>
          )}
        </div>

        <aside className="bg-[#140d0b] border border-[#3d2c1f] rounded-2xl p-8 h-fit">
          <h2 className="text-3xl font-serif font-bold mb-8">
            Resumen del pedido
          </h2>

          <div className="flex justify-between mb-5">
            <span>Subtotal</span>
            <span>S/ {total.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-5">
            <span>Servicio de catering</span>
            <span>Incluido</span>
          </div>

          <hr className="border-[#3d2c1f] my-5" />

          <div className="flex justify-between items-center">
            <strong>Total</strong>
            <strong className="text-4xl text-yellow-500">
              S/ {total.toFixed(2)}
            </strong>
          </div>

          <a
            href="/checkout"
            className="block text-center w-full bg-yellow-500 text-black font-bold py-4 rounded-xl mt-8"
          >
            Proceder al Checkout
          </a>

          <p className="text-center text-sm text-[#b89b7a] mt-5">
            Al continuar, aceptas nuestros términos y condiciones de servicio
          </p>
        </aside>
      </section>
    </main>
  );
}