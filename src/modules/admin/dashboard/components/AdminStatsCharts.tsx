// src/modules/admin/dashboard/components/AdminStatsCharts.tsx
import { useAdminStats } from "@/modules/admin/dashboard/hooks/useAdminStats";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { BarChart3, TrendingUp, PieChart as PieIcon, Loader2, AlertCircle } from "lucide-react";

const queryClient = new QueryClient();

function ChartsContent() {
  const { ventasPorMes, usuariosData, estadoReservas, isLoading, isError } = useAdminStats();

  // Estados de Carga Premium (Sincronizados con el ecosistema visual de la marca)
  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center border border-[#2d2016]/40 rounded-2xl bg-[#0a0705]/50 backdrop-blur-md">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin mb-3" />
        <p className="text-zinc-400 font-medium text-xs uppercase tracking-widest animate-pulse">
          Sincronizando analíticas de banquetes...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center border border-red-950/40 rounded-2xl bg-gradient-to-b from-[#110c0a] to-[#140a0a]">
        <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
        <p className="text-red-400 font-bold text-sm tracking-wide">
          Enlace Interrumpido
        </p>
        <p className="text-zinc-500 text-xs mt-1">
          No se pudo conectar con el motor de estadísticas central.
        </p>
      </div>
    );
  }

  // Colores sofisticados para el gráfico de torta (Ámbar, Jade, Carmesí)
  const PIE_COLORS = ["#eab308", "#10b981", "#ef4444"];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0 w-full relative">
      {/* Destellos ambientales decorativos para romper el fondo plano */}
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* --- GRÁFICO 1: VENTAS (BARRAS ESTILIZADAS) --- */}
      <div className="group relative rounded-2xl border border-zinc-900 bg-gradient-to-b from-[#110c0a] to-[#090605] p-6 flex flex-col min-w-0 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-amber-950/40 transition-all duration-500">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-500 border border-yellow-500/20">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-zinc-100 font-serif font-bold tracking-wide text-sm">Flujo de Ventas</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Facturación Mensual Real</p>
          </div>
        </div>
        
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ventasPorMes} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid stroke="#1c1612" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} dy={10} fontStyle="italic" />
              <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(234, 179, 8, 0.03)' }}
                contentStyle={{ backgroundColor: '#0e0a08', borderColor: '#2d2016', borderRadius: '12px', color: '#f4f4f5', fontSize: '12px', backdropFilter: 'blur(8px)' }}
                itemStyle={{ color: '#eab308', fontWeight: 'bold' }}
              />
              <Bar dataKey="ventas" fill="url(#goldGradient)" radius={[6, 6, 0, 0]} maxBarSize={32} />
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                  <stop offset="100%" stopColor="#78350f" stopOpacity={0.4} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- GRÁFICO 2: VOLUMEN DE DATOS (ÁREA DE SEDA / GRADIENTE DE FLUJO) --- */}
      <div className="group relative rounded-2xl border border-zinc-900 bg-gradient-to-b from-[#110c0a] to-[#090605] p-6 flex flex-col min-w-0 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-amber-950/40 transition-all duration-500">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-zinc-100 font-serif font-bold tracking-wide text-sm">Crecimiento Orgánico</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Volumen General de Usuarios</p>
          </div>
        </div>
        
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={usuariosData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid stroke="#1c1612" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="tipo" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0e0a08', borderColor: '#2d2016', borderRadius: '12px', color: '#f4f4f5', fontSize: '12px', backdropFilter: 'blur(8px)' }}
                itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
              />
              {/* Cambiado Line por Area para darle un look mucho más corporativo y menos tosco */}
              <Area type="monotone" dataKey="cantidad" stroke="#eab308" strokeWidth={2.5} fill="url(#areaGradient)" dot={{ r: 4, fill: '#0a0705', stroke: '#eab308', strokeWidth: 2 }} />
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#eab308" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- GRÁFICO 3: ESTADO DE RESERVAS (DONUT CHART ESTILIZADO) --- */}
      <div className="group relative rounded-2xl border border-zinc-900 bg-gradient-to-b from-[#110c0a] to-[#090605] p-6 flex flex-col min-w-0 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-amber-950/40 transition-all duration-500">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-zinc-800/50 rounded-xl text-zinc-300 border border-zinc-700/30">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-zinc-100 font-serif font-bold tracking-wide text-sm">Logística de Calendario</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Segmentación de Reservas</p>
          </div>
        </div>
        
        <div className="w-full h-[250px] relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
  data={estadoReservas} 
  dataKey="value" 
  outerRadius={85} 
  innerRadius={68} 
  paddingAngle={4} 
label={(props: any) => {
  const { name, percent } = props;
  return `${name} ${(percent * 100).toFixed(0)}%`;
}}  labelLine={false}
>
  {estadoReservas.map((_, index) => (
    <Cell 
      key={index} 
      fill={PIE_COLORS[index % PIE_COLORS.length]} 
      stroke="#0a0705" 
      strokeWidth={3}
      className="focus:outline-none transition-opacity duration-300 hover:opacity-90"
    />
  ))}
</Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0e0a08', borderColor: '#2d2016', borderRadius: '12px', color: '#f4f4f5', fontSize: '12px', backdropFilter: 'blur(8px)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Leyenda central minimalista en el ojo de la dona */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Gala</span>
            <span className="text-xl font-serif font-black text-zinc-200 mt-0.5">ERP</span>
          </div>
        </div>
      </div>

    </section>
  );
}

export default function AdminStatsCharts() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChartsContent />
    </QueryClientProvider>
  );
}