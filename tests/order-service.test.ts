import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '@/api/axios';
import { createOrder } from '@/modules/orders/services/order.service';

afterEach(() => vi.restoreAllMocks());
describe('creación de órdenes', () => {
  it('normaliza orderId del contrato real de Nest sin exigir un campo id inexistente', async () => {
    const post = vi
      .spyOn(api, 'post')
      .mockResolvedValue({
        data: {
          success: true,
          orderId: 81,
          totalAmount: 23.23,
          message: 'Orden generada. Pendiente de pago.',
        },
      });
    const order = await createOrder({ reservationId: 74 });
    expect(post).toHaveBeenCalledWith('/orders', { reservationId: 74 });
    expect(order).toMatchObject({
      id: 81,
      totalAmount: 23.23,
      status: 'pending',
      reservationId: 74,
    });
  });
  it('rechaza una respuesta incompleta antes de abrir la pasarela', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({
      data: { success: true, totalAmount: 23.23 },
    });
    await expect(createOrder({ reservationId: 74 })).rejects.toThrow();
  });
});
