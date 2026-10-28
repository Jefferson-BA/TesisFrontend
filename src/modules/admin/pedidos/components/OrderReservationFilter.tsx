import { useEffect, useState } from "react";
import { getActiveAdminReservations } from "@/modules/admin/pedidos/services/order.service";

interface OrderReservationFilterProps {
  selectedReservationId?: string | number | null;
  onSelectReservation: (reservation: any | null) => void;
}

export default function OrderReservationFilter({
  selectedReservationId,
  onSelectReservation,
}: OrderReservationFilterProps) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    if (selectedReservationId !== undefined) {
      setSelectedValue(selectedReservationId ? String(selectedReservationId) : "");
    }
  }, [selectedReservationId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get("reservationId");
    if (urlId && selectedReservationId === undefined) {
      setSelectedValue(urlId);
    }
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getActiveAdminReservations();
        const list = Array.isArray(data) ? data : data.data || [];
        setReservations(list);

        const params = new URLSearchParams(window.location.search);
        const urlId = params.get("reservationId");

        if (urlId) {
          const found = list.find((r: any) => String(r.id) === String(urlId));
          if (found) {
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
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Filtrar por Reserva Activa
      </label>
      <select
        value={selectedValue}
        onChange={handleChange}
        disabled={loading}
        className="w-full bg-background border border-input text-foreground rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all cursor-pointer disabled:opacity-50"
      >
        <option value="">Ver todos los pedidos</option>
        {reservations.map((res) => (
          <option key={res.id} value={res.id}>
            Reserva #{res.id} - {res.user?.name || res.customerName || res.clientName || `Ref: #${res.id}`} ({res.guestsCount || 0} PAX)
          </option>
        ))}
      </select>
    </div>
  );
}
