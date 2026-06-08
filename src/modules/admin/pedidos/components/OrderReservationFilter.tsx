import { useEffect, useState } from "react";
import { getActiveAdminReservations } from "@/modules/admin/pedidos/services/order.service";

interface OrderReservationFilterProps {
  onSelectReservation: (reservation: any | null) => void;
}

export default function OrderReservationFilter({ onSelectReservation }: OrderReservationFilterProps) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getActiveAdminReservations();
        setReservations(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("Error cargando filtro de reservas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      onSelectReservation(null);
      return;
    }
    const found = reservations.find((r) => String(r.id) === val);
    onSelectReservation(found || null);
  };

  return (
    <div className="flex flex-col gap-1.5 min-w-[240px]">
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        Filtrar por Reserva Activa
      </label>
      <select
        onChange={handleChange}
        disabled={loading}
        className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all cursor-pointer disabled:opacity-50"
      >
        <option value="">Ver todos los pedidos</option>
        {reservations.map((res) => (
          <option key={res.id} value={res.id}>
            Reserva {res.tableNumber || res.mesaId || res.id} - {res.user?.name || res.customerName || res.clientName || `Ref: #${res.id}`}
          </option>
        ))}
      </select>
    </div>
  );
}