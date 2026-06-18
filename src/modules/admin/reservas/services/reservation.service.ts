import { api } from "@/api/axios";

// Para cuando el cliente crea la reserva (se queda igual)
export const createReservation = async (data: any) => {
  const res = await api.post("/reservations", data);
  return res.data;
};

// 🔥 ACTUALIZADO: Endpoint exclusivo de Admin con Paginación
export const getReservations = async (status?: string, page: number = 1, limit: number = 10) => {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const res = await api.get(`/reservations/admin?${params.toString()}`);
  return res.data; // Ahora devuelve { data: [], meta: {} }
};

// PATCH para actualizar estado o editar detalles
export const updateReservation = async (id: string, data: any) => {
  const res = await api.patch(`/reservations/${id}`, data);
  return res.data;
};

// DELETE para eliminar la reserva
export const deleteReservation = async (id: string) => {
  const res = await api.delete(`/reservations/${id}`);
  return res.data;
};