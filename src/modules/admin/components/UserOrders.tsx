import { useEffect, useState } from "react";
import { getOrders } from "../services/order.service";

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
    <div className="bg-[#140d0b] border border-[#3d2c1f] rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-6">Mis Pedidos</h2>

      {orders.length === 0 ? (
        <p className="text-zinc-400">No tienes pedidos registrados</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-[#3d2c1f] rounded-xl p-5">
              <p className="font-bold">Pedido #{order.id}</p>
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