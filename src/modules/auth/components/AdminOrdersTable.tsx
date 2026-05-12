import { useEffect, useState } from "react";
import {
  getOrders,
  updateOrderStatus,
} from "@/modules/auth/services/order.service";

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);

  const loadOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(Array.isArray(res) ? res : res.data || []);
    } catch (error) {
      console.error(error);
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const changeStatus = async (id: string | number, status: string) => {
    await updateOrderStatus(id, status);
    loadOrders();
  };

  return (
    <section className="admin-card">
      <h2>Gestión de Pedidos</h2>

      <table>
        <thead>
          <tr>
            <th>N° Pedido</th>
            <th>Cliente</th>
            <th>Fecha Evento</th>
            <th>Total</th>
            <th>Método Pago</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-6">
                No hay pedidos registrados
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>

                <td>
                  <strong>{order.customerName}</strong>
                  <small>{order.phone}</small>
                </td>

                <td>{order.eventDate}</td>

                <td>S/ {order.total}</td>

                <td>{order.paymentMethod}</td>

                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      changeStatus(order.id, e.target.value)
                    }
                    className="status"
                  >
                    <option>Pendiente</option>
                    <option>Confirmado</option>
                    <option>Entregado</option>
                    <option>Cancelado</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}