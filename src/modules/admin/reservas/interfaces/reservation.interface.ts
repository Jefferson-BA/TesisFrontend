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
  status: string; // ej: 'pending_review', 'approved', 'cancelled'
  items: ReservationItem[];
  createdAt: string;
  user?: {
    name: string;
    email: string;
    phone: string;
  };
  notes?: string;
  order?: {
    id: string;
  };
}

// 🔥 NUEVAS INTERFACES PARA PAGINACIÓN
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