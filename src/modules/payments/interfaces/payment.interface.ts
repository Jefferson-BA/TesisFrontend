export interface PayOrderParams {
  orderId: string | number;
  tokenId: string;
  amount: number; // <-- Quítale el "?" para que sea obligatorio
  email: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  order: any; // Aquí puedes tipar tu orden si tienes la interfaz
  data?: any;
}