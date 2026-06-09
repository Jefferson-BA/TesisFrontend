import { useEffect, useState } from "react";
import { getActiveAdminReservations } from "@/modules/admin/pedidos/services/order.service";

interface OrderReservationFilterProps {
  onSelectReservation: (reservation: any | null) => void;
}

export default function OrderReservationFilter({ onSelectReservation }: OrderReservationFilterProps) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedValue, setSelectedValue] = useState<string>("");

  // 1. Sincronizar el estado visual del select con la URL al montar el componente
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get("reservationId");
    if (urlId) {
      setSelectedValue(urlId);
    }
  }, []);

  // 2. Cargar las reservas y disparar la selección automática si existe un ID en la URL
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getActiveAdminReservations();
        const list = Array.isArray(data) ? data : data.data || [];
        setReservations(list);

        // Si vino un ID por URL, buscamos el objeto completo de la reserva y lo mandamos a la tarjeta
        const params = new URLSearchParams(window.location.search);
        const urlId = params.get("reservationId");

        if (urlId) {
          const found = list.find((r: any) => String(r.id) === String(urlId)); if (found) {
            onSelectReservation(found);
          }
        }
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
    setSelectedValue(val);

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
        value={selectedValue}
        onChange={handleChange}
        disabled={loading}
        className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all cursor-pointer disabled:opacity-50"
      >
        <option value="">Ver todos los pedidos</option>
        {reservations.map((res) => (
          <option key={res.id} value={res.id}>
            Reserva de {res.user?.name || res.customerName || res.clientName || `Ref: #${res.id}`}
          </option>
        ))}
      </select>
    </div>
  );
}