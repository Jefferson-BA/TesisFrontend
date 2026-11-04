// src/modules/admin/dashboard/hooks/useAdminStats.ts

import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../services/dashboard.service';

export function useAdminStats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getDashboardStats,
    refetchInterval: 30000, // Se refresca automáticamente cada 30 segundos
  });

  // 1. Mapeo de ventas mensuales (Genera los nombres de los últimos 6 meses automáticamente)
  const labelMeses = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toLocaleString('es-PE', { month: 'short' }).toUpperCase();
  });

  const ventasPorMes = data?.charts.salesMonthly.map((value, idx) => ({
    mes: labelMeses[idx] || `Mes ${idx + 1}`,
    ventas: value,
  })) || [{ mes: 'Sin datos', ventas: 0 }];

  // 2. Mapeo de volumen general de datos
  const usuariosData = data
    ? [
        { tipo: 'Clientes', cantidad: data.cards.totalCustomers },
        { tipo: 'Reservas', cantidad: data.cards.totalReservations },
        { tipo: 'Pedidos', cantidad: data.cards.totalOrders },
      ]
    : [{ tipo: 'Cargando...', cantidad: 0 }];

  // 3. Mapeo del estado de Reservas (Tu backend envía el estado de reservas para la dona)
  const estadoReservas = data
    ? [
        { name: 'Pendientes', value: data.charts.reservationsStatus.pending },
        { name: 'Aprobadas', value: data.charts.reservationsStatus.approved },
        {
          name: 'Pagadas 100%',
          value: data.charts.reservationsStatus.fully_paid,
        },
        {
          name: 'Completadas',
          value: data.charts.reservationsStatus.completed,
        },
        { name: 'Canceladas', value: data.charts.reservationsStatus.cancelled },
      ]
    : [{ name: 'Sin datos', value: 1 }];

  // 4. Conteos individuales por estado (para el card de notificaciones)
  const reservationStatusCounts = {
    pending: data?.charts.reservationsStatus.pending ?? 0,
    approved: data?.charts.reservationsStatus.approved ?? 0,
    fully_paid: data?.charts.reservationsStatus.fully_paid ?? 0,
    completed: data?.charts.reservationsStatus.completed ?? 0,
    cancelled: data?.charts.reservationsStatus.cancelled ?? 0,
  };

  return {
    data,
    ventasPorMes,
    usuariosData,
    estadoReservas,
    reservationStatusCounts,
    isLoading,
    isError,
  };
}
