// src/modules/admin/dashboard/components/AdminStatsCharts.tsx
import { useAdminStats } from "@/modules/admin/dashboard/hooks/useAdminStats";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

// 1. Instanciamos el cliente de React Query localmente
const queryClient = new QueryClient();

// 2. Renombramos tu componente original a una función interna
function ChartsContent() {
  const { ventasPorMes, usuariosData, estadoReservas, isLoading, isError } = useAdminStats();

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center border border-border rounded-xl bg-muted/50">
        <p className="text-muted-foreground font-medium animate-pulse">Cargando estadísticas en tiempo real...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-48 flex items-center justify-center border border-destructive/50 rounded-xl bg-destructive/10">
        <p className="text-destructive font-medium">Error al conectar con el servidor de estadísticas.</p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0 w-full">
      
      {/* Gráfico 1: Ventas */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col min-w-0 transition-colors">
        <h2 className="text-foreground font-semibold mb-6">Ventas Reales por Mes</h2>
        <div className="w-full h-[250px] min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ventasPorMes}>
              <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '8px' }} 
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Bar dataKey="ventas" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 2: Resumen Totalidades */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col min-w-0 transition-colors">
        <h2 className="text-foreground font-semibold mb-6">Volumen General de Datos</h2>
        <div className="w-full h-[250px] min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={usuariosData}>
              <XAxis dataKey="tipo" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '8px' }} 
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Line type="monotone" dataKey="cantidad" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 3: Estado de Reservas */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col min-w-0 transition-colors">
        <h2 className="text-foreground font-semibold mb-6">Estado de Reservas</h2>
        <div className="w-full h-[250px] min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={estadoReservas} dataKey="value" outerRadius={80} innerRadius={60} paddingAngle={5} label={{ fill: 'var(--muted-foreground)', fontSize: 12 }}>
                {estadoReservas.map((_, index) => (
                  <Cell key={index} fill={index % 2 === 0 ? "var(--primary)" : "#10b981"} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '8px' }} 
                itemStyle={{ color: 'var(--foreground)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </section>
  );
}

// 3. Exportamos el componente YA ENVUELTO para que Astro no rompa el contexto
export default function AdminStatsCharts() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChartsContent />
    </QueryClientProvider>
  );
}