// src/modules/admin/dashboard/hooks/useAdminStats.ts

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getDashboardStats } from "../services/dashboard.service";

export function useAdminStats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getDashboardStats,
    refetchInterval: 30000, // Se refresca automáticamente cada 30 segundos
  });

  // Sincronización dinámica con las tarjetas HTML de Astro en la página
  useEffect(() => {
    if (!data) return;

    // Buscamos los elementos por ID en tu plantilla de Astro
    const earningsCount = document.getElementById("earnings-count");
    const reservationCount = document.getElementById("reservation-count");
    const orderCount = document.getElementById("order-count");
    const userCount = document.getElementById("user-count");

    // Formateamos los valores dentro del DOM de Astro
    if (earningsCount) earningsCount.innerText = `S/ ${data.cards.totalEarnings.toFixed(2)}`;
    if (reservationCount) reservationCount.innerText = String(data.cards.totalReservations);
    if (orderCount) orderCount.innerText = String(data.cards.totalOrders);
    if (userCount) userCount.innerText = String(data.cards.totalCustomers);
  }, [data]);

  // 1. Mapeo de ventas mensuales (Genera los nombres de los últimos 6 meses automáticamente)
  const labelMeses = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toLocaleString("es-PE", { month: "short" }).toUpperCase();
  });

  const ventasPorMes = data?.charts.salesMonthly.map((value, idx) => ({
    mes: labelMeses[idx] || `Mes ${idx + 1}`,
    ventas: value,
  })) || [{ mes: "Sin datos", ventas: 0 }];

  // 2. Mapeo de volumen general de datos
  const usuariosData = data ? [
    { tipo: "Clientes", cantidad: data.cards.totalCustomers },
    { tipo: "Reservas", cantidad: data.cards.totalReservations },
    { tipo: "Pedidos", cantidad: data.cards.totalOrders },
  ] : [{ tipo: "Cargando...", cantidad: 0 }];

  // 3. Mapeo del estado de Reservas (Tu backend envía el estado de reservas para la dona)
  const estadoReservas = data ? [
    { name: "Pendientes", value: data.charts.reservationsStatus.pending },
    { name: "Aprobadas", value: data.charts.reservationsStatus.approved },
  ] : [{ name: "Sin datos", value: 1 }];

  return {
    ventasPorMes,
    usuariosData,
    estadoReservas,
    isLoading,
    isError
  };
}