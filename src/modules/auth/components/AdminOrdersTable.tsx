import { useEffect, useState } from "react";
import { getOrders } from "@/modules/auth/services/order.service";

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error(error);
      alert("Error al cargar pedidos");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="admin-card">
      <h2>Gestión de Pedidos</h2>

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>N° Pedido</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Ciudad</th>
              <th>Dirección</th>
              <th>Código Postal</th>
              <th>Fecha Evento</th>
              <th>Notas</th>
              <th>Total</th>
              <th>Método Pago</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>

                <td>
                  {order.fullName ||
                    order.customerName ||
                    order.name ||
                    "Sin nombre"}
                </td>

                <td>
                  {order.email ||
                    order.customerEmail ||
                    "Sin correo"}
                </td>

                <td>
                  {order.phone ||
                    order.customerPhone ||
                    "Sin teléfono"}
                </td>

                <td>
                  {order.city || "Sin ciudad"}
                </td>

                <td>
                  {order.address ||
                    order.eventAddress ||
                    "Sin dirección"}
                </td>

                <td>
                  {order.postalCode || "Sin código"}
                </td>

                <td>
                  {order.eventDate || "Sin fecha"}
                </td>

                <td>
                  {order.notes ||
                    order.specialNotes ||
                    "Sin notas"}
                </td>

                <td>
                  S/ {Number(order.total || 0).toFixed(2)}
                </td>

                <td>
                  {order.paymentMethod || "Sin método"}
                </td>

                <td>
                  <select defaultValue={order.status || "Pendiente"}>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}