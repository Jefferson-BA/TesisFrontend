import { useEffect, useState } from "react";
import { createOrder } from "@/modules/auth/services/order.service";

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);

  const [form, setForm] = useState({
    phone: "",
    shippingAddress: "",
    city: "",
    postalCode: "",
    paymentMethod: "card",
  });

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const getProductId = (item: any) =>
    item.product?.id || item.productId || item.id || item._id;

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const items = cart.map((item) => ({
      productId: getProductId(item),
      quantity: Number(item.quantity),
    }));

    const orderData = {
      shippingAddress: form.shippingAddress,
      city: form.city,
      postalCode: form.postalCode,
      phone: form.phone,
      paymentMethod: form.paymentMethod,
      items,
    };

    console.log("ORDER DATA:", orderData);

    try {
      await createOrder(orderData);
      localStorage.removeItem("cart");
      alert("Pedido registrado correctamente");
      window.location.href = "/menu";
    } catch (error) {
      console.error(error);
      alert("Error al registrar pedido");
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-serif font-bold mb-10">
        Finalizar Compra
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-[#15100e] border border-[#4a3824] rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-8">
              Datos del Cliente y Evento
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-bold text-sm">Nombre Completo *</label>
                <input
                  className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-4"
                  placeholder="Nombre completo"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-sm">Correo Electrónico *</label>
                <input
                  type="email"
                  className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-4"
                  placeholder="correo@gmail.com"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-sm">Teléfono *</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-4"
                  placeholder="+51 985 212 313"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-sm">Ciudad *</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-4"
                  placeholder="Lima"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-bold text-sm">
                  Dirección del Evento *
                </label>
                <input
                  name="shippingAddress"
                  value={form.shippingAddress}
                  onChange={handleChange}
                  className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-4"
                  placeholder="Av. Principal 123"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-sm">Código Postal *</label>
                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-4"
                  placeholder="1234"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-sm">Fecha del Evento *</label>
                <input
                  type="date"
                  className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-4"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-bold text-sm">Notas Especiales</label>
                <textarea
                  className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-4"
                  placeholder="Alergias, requerimientos específicos..."
                  rows={4}
                />
              </div>
            </div>
          </section>

          <section className="bg-[#15100e] border border-[#4a3824] rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-8">Método de Pago</h2>

            <div className="grid grid-cols-3 gap-3 bg-[#211814] rounded-lg p-2 mb-6">
              <button
                type="button"
                onClick={() => setForm({ ...form, paymentMethod: "card" })}
                className={`py-3 rounded-lg font-bold ${
                  form.paymentMethod === "card"
                    ? "bg-black text-white"
                    : "text-[#f1d8b5]"
                }`}
              >
                Tarjeta
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, paymentMethod: "yape" })}
                className={`py-3 rounded-lg font-bold ${
                  form.paymentMethod === "yape"
                    ? "bg-black text-white"
                    : "text-[#f1d8b5]"
                }`}
              >
                Yape
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, paymentMethod: "plin" })}
                className={`py-3 rounded-lg font-bold ${
                  form.paymentMethod === "plin"
                    ? "bg-black text-white"
                    : "text-[#f1d8b5]"
                }`}
              >
                Plin
              </button>
            </div>

            {form.paymentMethod === "card" && (
              <div className="space-y-5">
                <div>
                  <label className="font-bold text-sm">Número de Tarjeta</label>
                  <input
                    className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-4"
                    placeholder="0000 0000 0000 0000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="font-bold text-sm">Vencimiento</label>
                    <input
                      className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-4"
                      placeholder="MM/YY"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-sm">CVV</label>
                    <input
                      className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-4"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-sm">
                    Nombre en la tarjeta
                  </label>
                  <input
                    className="mt-2 w-full bg-black border border-[#4a3824] rounded-lg p-4"
                    placeholder="Nombre completo"
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className="bg-[#15100e] border border-[#4a3824] rounded-2xl h-fit overflow-hidden">
          <div className="p-8 border-b border-[#4a3824]">
            <h2 className="text-2xl font-bold">
              Resumen del Pedido
            </h2>
          </div>

          <div className="p-8 space-y-5">
            {cart.map((item) => (
              <div
                key={getProductId(item)}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      item.imageUrl ||
                      item.image ||
                      item.product?.imageUrl ||
                      "https://placehold.co/100x100"
                    }
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover border border-[#4a3824]"
                  />

                  <div>
                    <h3 className="font-bold text-lg">
                      {item.name}
                    </h3>

                    <p className="text-[#f1d8b5] text-sm">
                      Cant: {item.quantity} x S/{" "}
                      {Number(item.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                <strong className="text-yellow-500 text-lg">
                  S/{" "}
                  {(
                    Number(item.price) * Number(item.quantity)
                  ).toFixed(2)}
                </strong>
              </div>
            ))}

            <hr className="border-[#4a3824]" />

            <div className="flex justify-between text-[#f1d8b5]">
              <span>Subtotal</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">
                Total a Pagar
              </span>

              <span className="text-yellow-500 text-3xl font-bold">
                S/ {total.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              disabled={cart.length === 0}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold py-4 rounded-lg mt-5"
            >
              Confirmar Pedido
            </button>
          </div>
        </aside>
      </form>
    </main>
  );
}