import { z } from 'zod';
export const checkoutSchema = z.object({
  shippingAddress: z
    .string()
    .trim()
    .min(5, 'Ingresa la dirección de entrega')
    .max(255),
  city: z.string().trim().min(2, 'Ingresa la ciudad').max(100),
});
