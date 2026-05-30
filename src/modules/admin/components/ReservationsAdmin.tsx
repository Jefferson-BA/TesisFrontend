import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getReservations } from "@/modules/admin/services/reservation.service";
import type { Reservation } from "@/modules/admin/interfaces/reservation.interface";

export default function ReservationsAdmin() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await getReservations();
      // Ajusta esto si tu backend devuelve { data: [...] } o directo el array
      setReservations(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error cargando reservas:", error);
      toast.error("No se pudieron cargar las reservas");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8 text-zinc-400">Cargando reservas...</div>;

  return (
    <div className="bg-[#15100c] rounded-xl border border-[#2a1f1a] overflow-hidden">
      <div className="p-6 border-b border-[#2a1f1a]">
        <h2 className="text-xl font-bold text-yellow-500">Gestión de Reservas</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-[#211814] text-xs uppercase text-zinc-400">
            <tr>
              <th className="px-6 py-4 border-b border-[#2a1f1a]">Fecha Evento</th>
              <th className="px-6 py-4 border-b border-[#2a1f1a]">Ciudad/Dirección</th>
              <th className="px-6 py-4 border-b border-[#2a1f1a]">Invitados</th>
              <th className="px-6 py-4 border-b border-[#2a1f1a]">Estado</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                  No hay reservas registradas aún.
                </td>
              </tr>
            ) : (
              reservations.map((res) => (
                <tr key={res.id} className="hover:bg-[#211814] transition-colors border-b border-[#2a1f1a]">
                  <td className="px-6 py-4">
                    {new Date(res.eventDate).toLocaleDateString()} <br />
                    <span className="text-xs text-zinc-500">{res.serviceStartTime}</span>
                  </td>
                  <td className="px-6 py-4">
                    {res.city} <br />
                    <span className="text-xs text-zinc-500 truncate block max-w-[200px]">{res.venueAddress}</span>
                  </td>
                  <td className="px-6 py-4">{res.guestsCount} personas</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-yellow-500/10 text-yellow-500">
                      {res.status || "NUEVA"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}