// src/modules/admin/dashboard/components/ReservationNotificationsCard.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAdminStats } from "@/modules/admin/dashboard/hooks/useAdminStats";
import { Bell, Clock, CheckCircle, CreditCard, PartyPopper, XCircle } from "lucide-react";

// Cliente local – evita colisión con el proveedor global de la página
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } },
});

// ── Configuración de los estados ─────────────────────────────────────────────
const STATUS_CONFIG = [
  {
    key: "pending" as const,
    label: "Pendiente Revisión",
    Icon: Clock,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    dot: "bg-yellow-500",
  },
  {
    key: "approved" as const,
    label: "Aprobada",
    Icon: CheckCircle,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  {
    key: "fully_paid" as const,
    label: "Pagada 100%",
    Icon: CreditCard,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    dot: "bg-green-400",
  },
  {
    key: "completed" as const,
    label: "Completada",
    Icon: PartyPopper,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
  },
  {
    key: "cancelled" as const,
    label: "Cancelada",
    Icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-400",
  },
] as const;

// ── Componente interno ────────────────────────────────────────────────────────
function NotificationsContent() {
  const { reservationStatusCounts, isLoading, isError } = useAdminStats();

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-colors">
      {/* Header */}
      <div className="p-5 border-b border-border bg-muted/30 flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
          <Bell className="w-4 h-4" />
        </span>
        <div>
          <h2 className="text-sm font-black text-foreground uppercase tracking-wider">
            Notificaciones de Reservas
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Estado actual · se actualiza automáticamente
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {isLoading && (
          <div className="flex flex-col gap-3">
            {STATUS_CONFIG.map((s) => (
              <div
                key={s.key}
                className="h-12 rounded-lg bg-muted/40 animate-pulse"
              />
            ))}
          </div>
        )}

        {isError && !isLoading && (
          <p className="text-sm text-destructive text-center py-4">
            No se pudo obtener el estado de las reservas.
          </p>
        )}

        {!isLoading && !isError && (
          <ul className="flex flex-col gap-2.5">
            {STATUS_CONFIG.map(({ key, label, Icon, color, bg, border, dot }) => {
              const count = reservationStatusCounts[key];
              const isPending = key === "pending" && count > 0;

              return (
                <li
                  key={key}
                  className={`flex items-center justify-between gap-3 rounded-lg px-4 py-3 border transition-all ${bg} ${border}`}
                >
                  {/* Left: icon + label */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                    <span className="text-sm font-semibold text-foreground truncate">
                      {label}
                    </span>
                    {/* Pulso animado si hay pendientes */}
                    {isPending && (
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dot} opacity-75`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${dot}`} />
                      </span>
                    )}
                  </div>

                  {/* Right: badge con número */}
                  <span
                    className={`shrink-0 min-w-[2rem] text-center text-sm font-black tabular-nums rounded-md px-2.5 py-0.5 border ${color} ${bg} ${border}`}
                  >
                    {count}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

// ── Export envuelto con su propio QueryClientProvider ──────────────────────
export default function ReservationNotificationsCard() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsContent />
    </QueryClientProvider>
  );
}
