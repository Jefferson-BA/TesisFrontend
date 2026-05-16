import { useEffect, useState } from "react";
import { getOrders } from "@/modules/auth/services/order.service";
import { getUsers } from "@/modules/auth/services/user.service";
import { usePromoStore } from "@/modules/auth/store/promoStore";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function AdminStatsCharts() {
  const promos = usePromoStore((state) => state.promos);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    getOrders().then((res) => {
      const data = Array.isArray(res) ? res : res?.data || [];
      setOrders(data);
    });

    getUsers().then((res) => {
      const data = Array.isArray(res) ? res : res?.data || [];
      setUsers(data);
    });
  }, []);

  useEffect(() => {
    const promoCount = document.getElementById("promo-count");
    const userCount = document.getElementById("user-count");
    const orderCount = document.getElementById("order-count");

    if (promoCount) promoCount.innerText = String(promos.length);
    if (userCount) userCount.innerText = String(users.length);
    if (orderCount) orderCount.innerText = String(orders.length);
  }, [promos, users, orders]);

  const ventasPorMes =
    orders.length > 0
      ? orders.reduce((acc: any[], order: any) => {
          const mes = new Date(order.createdAt).toLocaleString("es-PE", {
            month: "short",
          });

          const found = acc.find((x) => x.mes === mes);

          if (found) found.ventas += Number(order.totalAmount || 0);
          else acc.push({ mes, ventas: Number(order.totalAmount || 0) });

          return acc;
        }, [])
      : [{ mes: "Sin datos", ventas: 0 }];

  const usuariosData = [
    { tipo: "Usuarios", cantidad: users.length },
    { tipo: "Promos", cantidad: promos.length },
    { tipo: "Pedidos", cantidad: orders.length },
  ];

  const estadoPedidos =
    orders.length > 0
      ? orders.reduce((acc: any[], order: any) => {
          const estado = order.status || "pending";
          const found = acc.find((x) => x.name === estado);

          if (found) found.value += 1;
          else acc.push({ name: estado, value: 1 });

          return acc;
        }, [])
      : [{ name: "Sin pedidos", value: 1 }];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

      <div className="admin-card">
        <h2>Ventas Reales por Mes</h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ventasPorMes}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ventas" fill="#eab308" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-card">
        <h2>Usuarios / Promos / Pedidos</h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={usuariosData}>
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="cantidad"
                stroke="#eab308"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-card">
        <h2>Estado de Pedidos</h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={estadoPedidos} dataKey="value" outerRadius={90} label>
                {estadoPedidos.map((_, index) => (
                  <Cell
                    key={index}
                    fill={["#eab308", "#22c55e", "#ef4444", "#3b82f6"][index % 4]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </section>
  );
}