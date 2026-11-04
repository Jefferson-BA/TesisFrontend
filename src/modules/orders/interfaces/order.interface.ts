import type { Product } from '@/modules/catalog/interfaces/product.interface';
import type { Reservation } from '@/modules/reservations/interfaces/reservation.interface';
export type OrderStatus =
  'pending' | 'paid' | 'failed' | 'shipped' | 'delivered' | 'cancelled';
export interface OrderItem {
  id?: string | number;
  productId: string;
  quantity: number;
  price: number;
  subtotal?: number;
  name?: string;
  category?: string;
  product?: Product;
  imageUrl?: string;
  image?: string;
}
export interface Order {
  id: string | number;
  status: OrderStatus;
  totalAmount: number;
  total?: number;
  items: OrderItem[];
  reservationId?: number;
  reservation?: Reservation;
  shippingAddress?: string;
  address?: string;
  city?: string;
  fullName?: string;
  customerName?: string;
  email?: string;
  customerEmail?: string;
  phone?: string;
  customerPhone?: string;
  eventDate?: string;
  serviceStartTime?: string;
  guestsCount?: number;
  notes?: string;
  paymentMethod?: string;
  createdAt?: string;
}
export interface CreateOrderPayload {
  reservationId?: number;
  shippingAddress?: string;
  city?: string;
  phone?: string;
  paymentMethod?: 'card' | 'yape' | 'plin' | 'cash';
  items?: { productId: string; quantity: number }[];
}
export interface PaymentStatus {
  orderId: number;
  orderStatus: OrderStatus;
  paymentStatus: 'not_started' | 'processing' | 'succeeded' | 'failed';
  chargeId: string | null;
}
