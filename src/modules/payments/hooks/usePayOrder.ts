import { useMutation } from '@tanstack/react-query';
import type { PayOrderParams } from '../interfaces/payment.interface';
import { paymentService } from '../services/payment.service';

export const usePayOrder = () => {
  return useMutation({
    mutationFn: (params: PayOrderParams) =>
      paymentService.processPayment(params),
  });
};
