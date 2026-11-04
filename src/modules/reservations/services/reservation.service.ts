// src/modules/user/reservas/services/reservation.service.ts

import { api } from '@/api/axios';
import type {
  PaginatedReservations,
  Reservation,
  ReservationPayload,
  ReservationResponse,
} from '@/modules/reservations/interfaces/reservation.interface';

/**
 * Crea una nueva reserva
 */
export const createReservation = async (
  data: ReservationPayload,
): Promise<ReservationResponse> => {
  const res = await api.post<ReservationResponse>('/reservations', data);
  return res.data;
};

/**
 * Obtiene las reservas del usuario autenticado
 */
export const getUserReservations = async (): Promise<Reservation[]> => {
  const res = await api.get<Reservation[] | PaginatedReservations>(
    '/reservations',
  );
  // Si el backend devuelve paginación, extraemos data; si no, devolvemos el array
  if (Array.isArray(res.data)) return res.data;
  if (res.data && 'data' in res.data) return res.data.data;
  return [];
};

export const getReservations = async (
  status?: string,
  page = 1,
  limit = 10,
): Promise<PaginatedReservations> =>
  (
    await api.get<PaginatedReservations>('/reservations/admin', {
      params: { status, page, limit },
    })
  ).data;
export const updateReservation = async (
  id: string | number,
  data: Partial<ReservationPayload> & { status?: string },
): Promise<ReservationResponse> =>
  (await api.patch<ReservationResponse>(`/reservations/${id}`, data)).data;
export const deleteReservation = async (id: string | number): Promise<void> => {
  await api.delete(`/reservations/${id}`);
};
export const updateReservationStatus = (id: string | number, status: string) =>
  updateReservation(id, { status });
