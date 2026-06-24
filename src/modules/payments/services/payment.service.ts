import { api } from "../../../api/axios";
import type { PayOrderParams, PaymentResponse } from "../interfaces/payment.interface";

export const paymentService = {
  processPayment: async ({ orderId, tokenId, amount }: PayOrderParams & { amount: number }): Promise<PaymentResponse> => {
    const { data } = await api.post(`/orders/${orderId}/pay`, { tokenId, amount });
    return data;
  },
};