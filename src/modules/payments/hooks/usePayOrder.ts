import { useMutation } from "@tanstack/react-query";
import { paymentService } from "../services/payment.service";
import type { PayOrderParams } from "../interfaces/payment.interface";

export const usePayOrder = () => {
  return useMutation({
    mutationFn: (params: PayOrderParams) => paymentService.processPayment(params),
  });
};