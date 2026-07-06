import { api } from "@/api/axios";
import type { PayOrderParams, PaymentResponse } from "../interfaces/payment.interface";

export const paymentService = {
  processPayment: async ({ orderId, tokenId, email, amount }: PayOrderParams): Promise<PaymentResponse> => {
    // 👇 Añadimos 'amount' al objeto que se envía al backend
    const { data } = await api.post(`/orders/${orderId}/pay`, { tokenId, email, amount });
    return data;
  },
};