import { useEffect, useState } from "react";
// Ahora que moviste los servicios, estas rutas sí funcionarán:
import { getOrders } from "@/modules/admin/pedidos/services/order.service";
import { getUsers } from "@/modules/user/services/user.service";
// La promoStore la dejamos en auth por ahora (o la puedes mover a un store global luego)
import { usePromoStore } from "@/modules/auth/store/promoStore";

export function useAdminStats() {
  const promos = usePromoStore((state) => state.promos);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // 1. Carga de datos del backend (Agregamos ": any" para silenciar a TypeScript)
  useEffect(() => {
    getOrders().then((res: any) => {
      const data = Array.isArray(res) ? res : res?.data || [];
      setOrders(data);
    });

    getUsers().then((res: any) => {
      const data = Array.isArray(res) ? res : res?.data || [];
      setUsers(data);
    });
  }, []);

  // 2. Sincronización con las tarjetas de Astro
  useEffect(() => {
    const promoCount = document.getElementById("promo-count");
    const userCount = document.getElementById("user-count");
    const orderCount = document.getElementById("order-count");

    if (promoCount) promoCount.innerText = String(promos.length);
    if (userCount) userCount.innerText = String(users.length);
    if (orderCount) orderCount.innerText = String(orders.length);
  }, [promos, users, orders]);

  // 3. Procesamiento de Ventas
  const ventasPorMes = orders.length > 0
    ? orders.reduce((acc: any[], order: any) => {
        const mes = new Date(order.createdAt).toLocaleString("es-PE", { month: "short" });
        const found = acc.find((x) => x.mes === mes);
        if (found) found.ventas += Number(order.totalAmount || 0);
        else acc.push({ mes, ventas: Number(order.totalAmount || 0) });
        return acc;
      }, [])
    : [{ mes: "Sin datos", ventas: 0 }];

  // 4. Formateo general
  const usuariosData = [
    { tipo: "Usuarios", cantidad: users.length },
    { tipo: "Promos", cantidad: promos.length },
    { tipo: "Pedidos", cantidad: orders.length },
  ];

  // 5. Estado de Órdenes
  const estadoPedidos = orders.length > 0
    ? orders.reduce((acc: any[], order: any) => {
        const estado = order.status || "pending";
        const found = acc.find((x) => x.name === estado);
        if (found) found.value += 1;
        else acc.push({ name: estado, value: 1 });
        return acc;
      }, [])
    : [{ name: "Sin pedidos", value: 1 }];

  return {
    ventasPorMes,
    usuariosData,
    estadoPedidos,
  };
}