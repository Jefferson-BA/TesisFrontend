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
      <div className="w-full h-48 flex items-center justify-center border border-zinc-800 rounded-xl bg-zinc-900/30">
        <p className="text-zinc-400 font-medium animate-pulse">Cargando estadísticas en tiempo real...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-48 flex items-center justify-center border border-red-900/50 rounded-xl bg-red-950/10">
        <p className="text-red-400 font-medium">Error al conectar con el servidor de estadísticas.</p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0 w-full">
      
      {/* Gráfico 1: Ventas */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col min-w-0">
        <h2 className="text-zinc-100 font-semibold mb-6">Ventas Reales por Mes</h2>
        <div className="w-full h-[250px] min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ventasPorMes}>
              <XAxis dataKey="mes" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }} />
              <Bar dataKey="ventas" fill="#eab308" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 2: Resumen Totalidades */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col min-w-0">
        <h2 className="text-zinc-100 font-semibold mb-6">Volumen General de Datos</h2>
        <div className="w-full h-[250px] min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={usuariosData}>
              <XAxis dataKey="tipo" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }} />
              <Line type="monotone" dataKey="cantidad" stroke="#eab308" strokeWidth={3} dot={{ r: 4, fill: '#eab308' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 3: Estado de Reservas */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col min-w-0">
        <h2 className="text-zinc-100 font-semibold mb-6">Estado de Reservas</h2>
        <div className="w-full h-[250px] min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={estadoReservas} dataKey="value" outerRadius={80} innerRadius={60} paddingAngle={5} label={{ fill: '#a1a1aa', fontSize: 12 }}>
                {estadoReservas.map((_, index) => (
                  <Cell key={index} fill={["#f59e0b", "#10b981"][index % 2]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }} />
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