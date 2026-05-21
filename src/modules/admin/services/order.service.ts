import { api } from "@/api/axios";

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