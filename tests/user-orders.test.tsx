// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Reservation } from '@/modules/reservations/interfaces/reservation.interface';
import UserOrders from '@/modules/user/components/UserOrders';

const { reservation } = vi.hoisted(() => ({
  reservation: {
    id: 74,
    status: 'approved',
    eventDate: '2026-12-10',
    serviceStartTime: '15:00',
    guestsCount: 20,
    venueAddress: 'Av. Principal 123',
    city: 'Lima',
    items: [],
    createdAt: '2026-11-03',
    totalAmount: 23.23,
  } satisfies Reservation,
}));
vi.mock('@/modules/user/hooks/useUser', () => ({
  useUser: () => ({ user: { id: 1, email: 'user@example.com' } }),
}));
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...original,
    useQuery: () => ({
      data: [reservation],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    }),
  };
});
vi.mock('@/modules/user/components/ReservationDetailModal', () => ({
  ReservationDetailModal: ({ open }: { open: boolean }) =>
    open ? <div role="dialog">Detalle de reserva</div> : null,
}));
afterEach(cleanup);
describe('cabecera de reservas', () => {
  it('permite expandir y abrir el detalle con botones independientes', () => {
    const { container } = render(<UserOrders />);
    expect(container.querySelector('button button')).toBeNull();
    const toggle = screen.getByRole('button', {
      name: 'Mostrar detalles de reserva RES-00074',
    });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Ver detalle completo de reserva 74',
      }),
    );
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelector('#reservation-details-74')).toBeTruthy();
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });
});
