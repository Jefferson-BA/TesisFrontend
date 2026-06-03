import { api } from "@/api/axios";

// Para cuando el cliente crea la reserva (se queda igual)
export const createReservation = async (data: any) => {
  const res = await api.post("/reservations", data);
  return res.data;
};

// NUEVO: Endpoint exclusivo de Admin
export const getReservations = async () => {
  const res = await api.get("/reservations/admin");
  return res.data;
};

// NUEVO: PATCH para actualizar estado o editar detalles
export const updateReservation = async (id: string, data: any) => {
  const res = await api.patch(`/reservations/${id}`, data);
  return res.data;
};

// NUEVO: DELETE para eliminar la reserva
export const deleteReservation = async (id: string) => {
  const res = await api.delete(`/reservations/${id}`);
  return res.data;
};