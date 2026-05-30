import { api } from "@/api/axios";

// Aquí movemos la función que ya habías creado para el POST
export const createReservation = async (data: any) => {
  const res = await api.post("/reservations", data);
  return res.data;
};

// Esta es la NUEVA función para que el Admin lea las reservas
export const getReservations = async () => {
  const res = await api.get("/reservations");
  return res.data;
};

export const updateReservationStatus = async (id: string, status: string) => {
  const res = await api.patch(`/reservations/${id}`, { status });
  return res.data;
};