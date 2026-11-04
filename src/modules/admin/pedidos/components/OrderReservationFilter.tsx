import type { Reservation } from '@/modules/reservations/interfaces/reservation.interface';
import { useEffect, useState } from 'react';

interface OrderReservationFilterProps {
  reservations: Reservation[];
  selectedReservationId?: string | number | null;
  onSelectReservation: (reservation: Reservation | null) => void;
}

export default function OrderReservationFilter({
  reservations,
  selectedReservationId,
  onSelectReservation,
}: OrderReservationFilterProps) {
  const [selectedValue, setSelectedValue] = useState<string>('');

  useEffect(() => {
    if (selectedReservationId !== undefined) {
      setSelectedValue(
        selectedReservationId ? String(selectedReservationId) : '',
      );
    }
  }, [selectedReservationId]);

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
        disabled={reservations.length === 0}
        className="w-full bg-background border border-input text-foreground rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all cursor-pointer disabled:opacity-50"
      >
        <option value="">Ver todos los pedidos</option>
        {reservations.map((res) => (
          <option key={res.id} value={res.id}>
            Reserva #{res.id} -{' '}
            {res.user?.name ||
              res.customerName ||
              res.clientName ||
              `Ref: #${res.id}`}{' '}
            ({res.guestsCount || 0} PAX)
          </option>
        ))}
      </select>
    </div>
  );
}
