import { api } from "@/api/axios";

interface PaymentResponse {
  message?: string;
  success: boolean;
}

export const processPayment = async (orderId: string, tokenId: string): Promise<PaymentResponse> => {
  // Cambiamos 'axiosInstance' por 'api'
  const { data } = await api.post<PaymentResponse>(`/orders/${orderId}/pay`, {
    tokenId,
  });
  return data;
};