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
  status: string; // ej: 'PENDIENTE', 'CONFIRMADA', 'CANCELADA'
  items: ReservationItem[];
  createdAt: string;
}