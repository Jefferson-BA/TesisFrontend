import { useEffect, useState } from "react";
import { getOrders } from "../../admin/pedidos/services/order.service";

export default function UserOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    getOrders()
      .then((res) => {
        setOrders(Array.isArray(res) ? res : res?.data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-white dark:bg-[#140d0b] border border-stone-200 dark:border-[#3d2c1f] rounded-2xl p-8 transition-colors duration-500">
      <h2 className="text-2xl font-bold mb-6 text-stone-900 dark:text-white">
        Mis Pedidos
      </h2>

      {orders.length === 0 ? (
        <p className="text-stone-500 dark:text-zinc-400">
          No tienes pedidos registrados
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-stone-200 dark:border-[#3d2c1f] rounded-xl p-5 text-stone-700 dark:text-zinc-200 transition-colors duration-300 hover:border-amber-400/60 dark:hover:border-yellow-500/40"
            >
              <p className="font-bold text-stone-900 dark:text-white">
                Pedido #{order.id}
              </p>
              <p>Total: S/ {order.totalAmount}</p>
              <p>Estado: {order.status}</p>
              <p>Método: {order.paymentMethod}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}