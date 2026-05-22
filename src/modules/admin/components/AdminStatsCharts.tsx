import { useAdminStats } from "@/modules/admin/hooks/useAdminStats";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function AdminStatsCharts() {
  // Consumimos la lógica aislada
  const { ventasPorMes, usuariosData, estadoPedidos } = useAdminStats();

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0 w-full">
      
      {/* Gráfico 1 */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col min-w-0">
        <h2 className="text-zinc-100 font-semibold mb-6">Ventas Reales por Mes</h2>
        <div className="w-full h-[250px] min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={ventasPorMes}>
              <XAxis dataKey="mes" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }} />
              <Bar dataKey="ventas" fill="#eab308" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 2 */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col min-w-0">
        <h2 className="text-zinc-100 font-semibold mb-6">Usuarios / Promos / Pedidos</h2>
        <div className="w-full h-[250px] min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={usuariosData}>
              <XAxis dataKey="tipo" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }} />
              <Line type="monotone" dataKey="cantidad" stroke="#eab308" strokeWidth={3} dot={{ r: 4, fill: '#eab308' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 3 */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col min-w-0">
        <h2 className="text-zinc-100 font-semibold mb-6">Estado de Pedidos</h2>
        <div className="w-full h-[250px] min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie data={estadoPedidos} dataKey="value" outerRadius={80} innerRadius={60} paddingAngle={5} label={{ fill: '#a1a1aa', fontSize: 12 }}>
                {estadoPedidos.map((_, index) => (
                  <Cell key={index} fill={["#eab308", "#22c55e", "#ef4444", "#3b82f6"][index % 4]} stroke="transparent" />
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