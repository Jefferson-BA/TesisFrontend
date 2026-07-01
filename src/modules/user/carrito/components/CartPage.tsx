import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";

export default function CartPage() {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const total = cart.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0,
  );

  const handleRemove = (id: string) => {
    removeFromCart(id);
    toast.success("Producto eliminado del carrito");
  };

  const handleClear = () => {
    clearCart();
    toast.success("Carrito vaciado");
  };

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
            {cart.length} producto{cart.length === 1 ? "" : "s"} en tu carrito
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
                key={item.id}
                className="bg-[#140d0b] border border-[#3d2c1f] rounded-2xl p-6 flex justify-between items-center"
              >
                <div className="flex gap-5 items-center">
                  <img
                    src={item.imageUrl || item.image || "https://placehold.co/120x120"}
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
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
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
            <button onClick={handleClear} className="text-red-500 flex gap-2">
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
            className={`block text-center w-full text-black font-bold py-4 rounded-xl mt-8 ${
              cart.length === 0
                ? "bg-yellow-500/40 pointer-events-none"
                : "bg-yellow-500 hover:bg-yellow-400"
            }`}
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
