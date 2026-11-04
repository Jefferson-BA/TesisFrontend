// src/modules/admin/reservas/interfaces/reservation.interface.ts

export interface ReservationItem {
  id?: string | number;
  name?: string;
  price?: number;
  product?: import('@/modules/catalog/interfaces/product.interface').Product;
  productId: string;
  quantity: number;
  subtotal?: number;
  category?: string;
  imageUrl?: string;
  image?: string;
}

export interface Reservation {
  id: string | number;
  eventDate: string;
  serviceStartTime: string;
  guestsCount: number;
  venueAddress: string;
  city: string;
  status: string; // ej: 'pending_review', 'approved', 'cancelled', 'fully_paid', 'completed'
  items: ReservationItem[];
  createdAt: string;
  totalAmount?: number;
  paymentMethod?: string;
  user?: {
    name: string;
    email: string;
    phone: string;
  };
  customerName?: string;
  clientName?: string;
  phone?: string;
  customerPhone?: string;
  clientPhone?: string;
  customerEmail?: string;
  additionalNotes?: string;
  orders?: import('@/modules/orders/interfaces/order.interface').Order[];
  notes?: string;
  order?: {
    items?: import('@/modules/orders/interfaces/order.interface').OrderItem[];
    id: string | number;
  };
}

// ─── Payload para crear reserva ───
export interface ReservationPayload {
  eventDate: string;
  serviceStartTime: string;
  guestsCount: number;
  venueAddress: string;
  city: string;
  items: ReservationItem[];
  additionalNotes?: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
}

// ─── Respuesta del backend al crear reserva ───
export interface ReservationResponse {
  id: string | number;
  status: string;
  totalAmount?: number;
  message?: string;
  data?: Reservation;
}

// ─── Formulario del wizard ───
export interface ReservationFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  date: string;
  time: string;
  guests: string;
  eventType: string;
  notes: string;
  paymentMethod: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
}

// ─── Paginación ───
export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedReservations {
  data: Reservation[];
  meta: PaginationMeta;
}
