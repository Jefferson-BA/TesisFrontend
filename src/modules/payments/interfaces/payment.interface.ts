export interface PayOrderParams {
  orderId: string | number;
  tokenId: string;
  amount: number;
  email: string;
}
export interface PaymentResponse {
  success: boolean;
  message: string;
  orderId: number;
  chargeId: string;
  status: string;
}
