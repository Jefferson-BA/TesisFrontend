// src/modules/admin/reservas/interfaces/reservation.interface.ts

export interface ReservationItem {
  productId: string;
  quantity: number;
}

export interface Reservation {
  id: string;
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
  notes?: string;
  order?: {
    id: string;
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
  notes?: string;
  paymentMethod?: string;
}

// ─── Respuesta del backend al crear reserva ───
export interface ReservationResponse {
  id: string;
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