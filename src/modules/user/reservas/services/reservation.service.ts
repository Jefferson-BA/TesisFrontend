// src/modules/user/reservas/services/reservation.service.ts

import { api } from "@/api/axios";
import type { ReservationPayload, ReservationResponse, Reservation, PaginatedReservations } from "@/modules/admin/reservas/interfaces/reservation.interface";

/**
 * Crea una nueva reserva
 */
export const createReservation = async (data: ReservationPayload): Promise<ReservationResponse> => {
  const res = await api.post<ReservationResponse>("/reservations", data);
  return res.data;
};

/**
 * Obtiene las reservas del usuario autenticado
 */
export const getUserReservations = async (): Promise<Reservation[]> => {
  const res = await api.get<Reservation[] | PaginatedReservations>("/reservations");
  // Si el backend devuelve paginación, extraemos data; si no, devolvemos el array
  if (Array.isArray(res.data)) return res.data;
  if (res.data && "data" in res.data) return res.data.data;
  return [];
};

/**
 * Obtiene todas las reservas (admin)
 */
export const getAllReservations = async (): Promise<PaginatedReservations> => {
  const res = await api.get<PaginatedReservations>("/reservations/admin");
  return res.data;
};

/**
 * Actualiza el estado de una reserva (admin)
 */
export const updateReservationStatus = async (id: string, status: string): Promise<ReservationResponse> => {
  const res = await api.patch<ReservationResponse>(`/reservations/${id}/status`, { status });
  return res.data;
};