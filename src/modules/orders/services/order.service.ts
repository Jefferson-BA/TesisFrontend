import { api } from '@/api/axios';
import { z } from 'zod';
import type { PaginatedReservations } from '@/modules/reservations/interfaces/reservation.interface';
import type {
  CreateOrderPayload,
  Order,
  OrderStatus,
  PaymentStatus,
} from '../interfaces/order.interface';
const createdOrderSchema = z.object({
  success: z.literal(true),
  orderId: z.number().int().positive(),
  totalAmount: z.number().positive(),
});
export const createOrder = async (data: CreateOrderPayload): Promise<Order> => {
  const response = await api.post<unknown>('/orders', data);
  const created = createdOrderSchema.parse(response.data);
  return {
    id: created.orderId,
    totalAmount: created.totalAmount,
    status: 'pending',
    items: [],
    reservationId: data.reservationId,
  };
};
export const getOrder = async (id: string | number): Promise<Order> =>
  (await api.get<Order>(`/orders/${id}`)).data;
export const getOrders = async (
  reservationId?: string | number,
): Promise<Order[]> =>
  (await api.get<Order[]>('/orders', { params: { reservationId } })).data;
export const updateOrderStatus = async (
  id: string | number,
  status: OrderStatus,
): Promise<Order> =>
  (await api.patch<Order>(`/orders/${id}/status`, { status })).data;
export const getPaymentStatus = async (
  id: string | number,
): Promise<PaymentStatus> =>
  (await api.get<PaymentStatus>(`/orders/${id}/payment-status`)).data;
export const getActiveAdminReservations =
  async (): Promise<PaginatedReservations> =>
    (
      await api.get<PaginatedReservations>('/reservations/admin', {
        params: { status: 'active', limit: 100 },
      })
    ).data;
