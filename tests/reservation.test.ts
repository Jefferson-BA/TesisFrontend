import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildReservationPayload,
  contactSchema,
  logisticsSchema,
  reservationSchema,
  todayInLima,
} from '@/modules/reservations/schemas/reservation.schema';
import type { ReservationFormData } from '@/modules/reservations/interfaces/reservation.interface';
import { checkoutSchema } from '@/modules/orders/schemas/checkout.schema';
import { registerSchema } from '@/modules/auth/schemas/auth.schema';
const form: ReservationFormData = {
  name: 'Ana Torres',
  email: 'ana@example.com',
  phone: '999888777',
  city: 'Lima',
  address: 'Av. Principal 123',
  date: '2099-11-20',
  time: '15:30',
  guests: '20',
  eventType: 'Boda',
  notes: 'Sin maní',
  paymentMethod: 'card',
  acceptedTerms: true,
  acceptedPrivacy: true,
};
const cart = [{ id: 'product-1', name: 'Buffet', price: 100, quantity: 2 }];
afterEach(() => vi.useRealTimers());
describe('validación de reservas y checkout', () => {
  it('conserva el contacto, el tipo de evento y las notas en el DTO permitido por Nest', () => {
    const payload = buildReservationPayload(form, cart);
    expect(payload).toMatchObject({
      eventDate: form.date,
      serviceStartTime: '15:30',
      guestsCount: 20,
      venueAddress: form.address,
      acceptedTerms: true,
      acceptedPrivacy: true,
      items: [{ productId: 'product-1', quantity: 2 }],
    });
    for (const value of [
      form.name,
      form.email,
      form.phone,
      form.eventType,
      form.notes,
    ])
      expect(payload.additionalNotes).toContain(value);
  });
  it.each(['', '0', '-1', '1.5', 'NaN'])(
    'rechaza la cantidad de invitados %s',
    (guests) => {
      expect(logisticsSchema.safeParse({ ...form, guests }).success).toBe(
        false,
      );
    },
  );
  it('rechaza contacto incompleto y horarios inválidos', () => {
    expect(
      contactSchema.safeParse({ ...form, email: 'bad', phone: '' }).success,
    ).toBe(false);
    expect(logisticsSchema.safeParse({ ...form, time: '25:00' }).success).toBe(
      false,
    );
  });
  it('no inventa consentimientos ni acepta un carrito vacío', () => {
    expect(
      reservationSchema.safeParse({ ...form, acceptedTerms: false }).success,
    ).toBe(false);
    expect(
      reservationSchema.safeParse({ ...form, acceptedPrivacy: undefined })
        .success,
    ).toBe(false);
    expect(() => buildReservationPayload(form, [])).toThrow();
  });
  it('compara fechas según Lima incluso cerca del cambio de día UTC', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-04T02:00:00Z'));
    expect(todayInLima()).toBe('2026-11-03');
    expect(
      logisticsSchema.safeParse({ ...form, date: '2026-11-02' }).success,
    ).toBe(false);
    expect(
      logisticsSchema.safeParse({ ...form, date: '2026-11-03' }).success,
    ).toBe(true);
  });
  it('exige dirección y ciudad para una orden directa', () => {
    expect(
      checkoutSchema.safeParse({ shippingAddress: '', city: '' }).success,
    ).toBe(false);
    expect(
      checkoutSchema.parse({ shippingAddress: '  Av. 123  ', city: ' Lima ' }),
    ).toEqual({ shippingAddress: 'Av. 123', city: 'Lima' });
  });
  it('el registro exige consentimiento y respeta el máximo de contraseña del backend', () => {
    const input = {
      ...form,
      password: 'password123',
      confirmPassword: 'password123',
    };
    expect(registerSchema.safeParse(input).success).toBe(true);
    expect(
      registerSchema.safeParse({ ...input, acceptedTerms: false }).success,
    ).toBe(false);
    expect(
      registerSchema.safeParse({
        ...input,
        password: 'x'.repeat(33),
        confirmPassword: 'x'.repeat(33),
      }).success,
    ).toBe(false);
  });
});
