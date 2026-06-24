// src/admin/pedidos/services/order.service.ts
import { api } from "@/api/axios";

export const createReservation = async (data: any) => {
  const res = await api.post("/reservations", data);
  return res.data;
};

export const createOrder = async (data: any) => {
  const res = await api.post("/orders", data);
  return res.data;
};

export const getOrders = async (reservationId?: string | number) => {
  const url = reservationId ? `/orders?reservationId=${reservationId}` : "/orders";
  const res = await api.get(url);
  return res.data;
};

export const updateOrderStatus = async (id: string | number, status: string) => {
  const res = await api.patch(`/orders/${id}`, { status });
  return res.data;
};

export const getActiveAdminReservations = async () => {
  const res = await api.get("/reservations/admin?status=active");
  return res.data;
};

// 🌟 NUEVO: Endpoint para el Polling del cliente de sus propias reservas
export const getUserReservations = async () => {
  const res = await api.get("/reservations"); 
  return res.data;
};