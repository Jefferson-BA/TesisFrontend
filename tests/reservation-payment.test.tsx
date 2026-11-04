// @vitest-environment happy-dom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import PaymentReservationPage from '@/modules/user/checkout/components/PaymentReservationPage';

const nativeAnimate = Object.getOwnPropertyDescriptor(
  Element.prototype,
  'animate',
);
beforeAll(() => {
  // Happy DOM rechaza las cancelaciones de WAAPI; estas pruebas verifican el flujo, no las animaciones.
  Reflect.deleteProperty(Element.prototype, 'animate');
});
afterAll(() => {
  if (nativeAnimate)
    Object.defineProperty(Element.prototype, 'animate', nativeAnimate);
});

const state = vi.hoisted(() => ({
  createOrder: vi.fn(),
  getOrders: vi.fn(),
  getOrder: vi.fn(),
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
  },
}));
vi.mock('@/modules/user/hooks/useUser', () => ({
  useUser: () => ({ user: { id: 1, email: 'user@example.com' } }),
}));
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useQuery: () => ({
      data: [state.reservation],
      isPending: false,
      isError: false,
    }),
  };
});
vi.mock('@/modules/orders/services/order.service', () => ({
  createOrder: state.createOrder,
  getOrders: state.getOrders,
  getOrder: state.getOrder,
}));
vi.mock('@/modules/payments/components/CulqiPayment', () => ({
  CulqiPayment: ({
    amount,
    onSuccessCallback,
    onClose,
  }: {
    amount: number;
    onSuccessCallback: () => void;
    onClose: () => void;
  }) => (
    <section aria-label="Pasarela de prueba">
      <p>Importe confirmado: {amount}</p>
      <button
        onClick={() => {
          onSuccessCallback();
          onClose();
        }}
      >
        Simular respuesta confirmada
      </button>
    </section>
  ),
}));
beforeEach(() => {
  window.history.replaceState(
    {},
    '',
    '/user/pagar-reserva?reservationId=74&amount=0.01',
  );
  state.getOrders.mockResolvedValue([]);
  state.createOrder.mockResolvedValue({
    id: 81,
    totalAmount: 23.23,
    status: 'pending',
    items: [],
  });
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
describe('pago de reserva', () => {
  it('abre el pago con el total del servidor y conserva la confirmación al cerrar la pasarela', async () => {
    render(<PaymentReservationPage />);
    expect(await screen.findByText('S/ 23.23')).toBeTruthy();
    expect(screen.queryByText('S/ 0.01')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y Pagar' }));
    await waitFor(() =>
      expect(state.createOrder).toHaveBeenCalledWith({ reservationId: 74 }),
    );
    expect(await screen.findByText('Importe confirmado: 23.23')).toBeTruthy();
    fireEvent.click(
      screen.getByRole('button', { name: 'Simular respuesta confirmada' }),
    );
    expect(await screen.findByText('¡Pago Exitoso!')).toBeTruthy();
  });
  it('reutiliza una orden pendiente al volver al flujo', async () => {
    state.getOrders.mockResolvedValue([{ id: 81, status: 'pending' }]);
    state.getOrder.mockResolvedValue({
      id: 81,
      totalAmount: 23.23,
      status: 'pending',
      items: [],
    });
    render(<PaymentReservationPage />);
    fireEvent.click(
      await screen.findByRole('button', { name: 'Confirmar y Pagar' }),
    );
    expect(await screen.findByText('Importe confirmado: 23.23')).toBeTruthy();
    expect(state.getOrder).toHaveBeenCalledWith(81);
    expect(state.createOrder).not.toHaveBeenCalled();
  });
});
