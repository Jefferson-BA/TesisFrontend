import type { CartItem } from '@/modules/cart/store/cartStore';
import { z } from 'zod';
import type {
  ReservationFormData,
  ReservationPayload,
} from '../interfaces/reservation.interface';

export function todayInLima() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Ingresa el nombre del contacto'),
  email: z.string().trim().email('Ingresa un correo válido'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{9,18}$/, 'Ingresa un teléfono válido'),
  city: z.string().trim().min(2, 'Ingresa la ciudad'),
});
export const logisticsSchema = z.object({
  address: z.string().trim().min(5, 'Ingresa la dirección del evento'),
  date: z
    .string()
    .date('Selecciona una fecha válida')
    .refine(
      (value) => value >= todayInLima(),
      'La fecha no puede estar en el pasado',
    ),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Selecciona una hora válida'),
  guests: z
    .string()
    .regex(
      /^[1-9]\d*$/,
      'Ingresa una cantidad entera de invitados mayor a cero',
    )
    .refine(
      (value) => Number.isSafeInteger(Number(value)),
      'Cantidad de invitados inválida',
    ),
  eventType: z.string().trim().min(1, 'Selecciona el tipo de evento'),
});
export const reservationSchema = contactSchema.merge(logisticsSchema).extend({
  notes: z.string().max(4000, 'Las notas son demasiado largas'),
  paymentMethod: z.string(),
  acceptedTerms: z
    .boolean()
    .refine((value) => value, 'Debes aceptar los términos y condiciones'),
  acceptedPrivacy: z
    .boolean()
    .refine((value) => value, 'Debes aceptar la política de privacidad'),
});
export function buildReservationPayload(
  form: ReservationFormData,
  cart: CartItem[],
): ReservationPayload {
  const data = reservationSchema.parse(form);
  if (
    !cart.length ||
    cart.some(
      (item) => !Number.isSafeInteger(item.quantity) || item.quantity < 1,
    )
  )
    throw new Error('El carrito contiene cantidades inválidas');
  return {
    eventDate: data.date,
    serviceStartTime: data.time,
    guestsCount: Number(data.guests),
    venueAddress: data.address,
    city: data.city,
    items: cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
    // El DTO de Nest admite additionalNotes, no columnas de contacto independientes.
    additionalNotes: [
      `Contacto: ${data.name}`,
      `Correo: ${data.email}`,
      `Teléfono: ${data.phone}`,
      `Tipo de evento: ${data.eventType}`,
      `Método preferido: ${data.paymentMethod}`,
      data.notes,
    ]
      .filter(Boolean)
      .join('\n'),
    acceptedTerms: data.acceptedTerms,
    acceptedPrivacy: data.acceptedPrivacy,
  };
}
