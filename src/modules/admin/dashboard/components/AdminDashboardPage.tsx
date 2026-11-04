import { QueryProvider } from '@/components/shared/QueryProvider';
import { useAdminStats } from '../hooks/useAdminStats';
import AdminStatsCharts from './AdminStatsCharts';
import ReservationNotificationsCard from './ReservationNotificationsCard';
function DashboardContent() {
  const { data, isLoading, isError } = useAdminStats();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Panel de Administración
        </h1>
        <p className="text-muted-foreground text-sm">
          Aquí tienes el resumen general de tu restaurante.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex justify-between items-center transition-colors">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Ventas Totales Históricas
            </p>
            <h2
              id="earnings-count"
              className="text-2xl font-bold text-foreground mt-1"
            >
              {data ? `S/ ${data.cards.totalEarnings.toFixed(2)}` : '—'}
            </h2>
          </div>
          <span className="text-xl font-bold text-emerald-500">S/</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex justify-between items-center transition-colors">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Reservas Totales
            </p>
            <h2
              id="reservation-count"
              className="text-2xl font-bold text-foreground mt-1"
            >
              {data?.cards.totalReservations ?? '—'}
            </h2>
          </div>
          <span className="text-xl text-amber-500">◇</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex justify-between items-center transition-colors">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Usuarios Registrados
            </p>
            <h2
              id="user-count"
              className="text-2xl font-bold text-foreground mt-1"
            >
              {data?.cards.totalCustomers ?? '—'}
            </h2>
          </div>
          <span className="text-xl text-blue-500">♙</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex justify-between items-center transition-colors">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Pedidos
            </p>
            <h2
              id="order-count"
              className="text-2xl font-bold text-foreground mt-1"
            >
              {data?.cards.totalOrders ?? '—'}
            </h2>
          </div>
          <span className="text-xl text-purple-500">▤</span>
        </div>
      </div>

      {isLoading && (
        <p role="status" className="text-muted-foreground">
          Cargando estadísticas...
        </p>
      )}
      {isError && (
        <p role="alert" className="text-destructive">
          No se pudieron cargar las estadísticas.
        </p>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <AdminStatsCharts />
        </div>
        <div className="lg:col-span-1">
          <ReservationNotificationsCard />
        </div>
      </div>
    </div>
  );
}
export default function AdminDashboardPage() {
  return (
    <QueryProvider>
      <DashboardContent />
    </QueryProvider>
  );
}
