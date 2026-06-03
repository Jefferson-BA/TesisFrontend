import { api } from "@/api/axios";

// 1. Nueva función específica para enviar las reservas
export const createReservation = async (data: any) => {
  const res = await api.post("/reservations", data);
  return res.data;
};

// Tus funciones anteriores las dejamos intactas por seguridad
export const createOrder = async (data: any) => {
  const res = await api.post("/orders", data);
  return res.data;
};

export const getOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const updateOrderStatus = async (id: string | number, status: string) => {
  const res = await api.patch(`/orders/${id}`, { status });
  return res.data;
};