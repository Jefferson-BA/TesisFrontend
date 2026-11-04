import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const http = vi.hoisted(() => ({ get: vi.fn(), delete: vi.fn() }));
vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('axios')>();
  return { ...actual, default: { ...actual.default, create: () => http } };
});
import { useAuthStore } from '@/modules/auth/store/authStore';
import { useCartStore } from '@/modules/cart/store/cartStore';

const user = {
  id: 1,
  name: 'Ana',
  email: 'ana@example.com',
  role: 'user' as const,
};
let storage: Map<string, string>;
beforeEach(() => {
  storage = new Map();
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    },
  });
  useAuthStore.setState({ user, loading: false, error: null });
  http.get.mockReset();
  http.delete.mockReset();
});
afterEach(() => vi.unstubAllGlobals());
describe('estado único de sesión', () => {
  it('limpia usuario, caché y claves heredadas solo después del cierre del servidor', async () => {
    for (const key of [
      'auth-storage',
      'token',
      'user',
      'deparraspitz-cart-storage',
    ])
      storage.set(key, 'old-value');
    http.delete.mockResolvedValue({ data: { user: null } });
    useCartStore.setState({
      cart: [{ id: '1', name: 'Producto', price: 10, quantity: 1 }],
    });
    await useAuthStore.getState().logout();
    expect(http.delete).toHaveBeenCalledWith('/session');
    expect(useAuthStore.getState().user).toBeNull();
    expect(useCartStore.getState().cart).toEqual([]);
    expect(storage.size).toBe(0);
  });
  it('no simula un cierre exitoso cuando el servidor no elimina la cookie', async () => {
    http.delete.mockRejectedValue(new Error('offline'));
    await expect(useAuthStore.getState().logout()).rejects.toThrow('offline');
    expect(useAuthStore.getState().user).toEqual(user);
  });
  it('no reintroduce al usuario si una consulta antigua termina después del cierre', async () => {
    let finish!: (value: { data: { user: typeof user } }) => void;
    http.get.mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    const pending = useAuthStore.getState().loadSession();
    useAuthStore.getState().clearSession();
    finish({ data: { user } });
    await pending;
    expect(useAuthStore.getState().user).toBeNull();
  });
  it('comparte una sola consulta de sesión entre varias islas React', async () => {
    http.get.mockResolvedValue({ data: { user } });
    await Promise.all([
      useAuthStore.getState().loadSession(),
      useAuthStore.getState().loadSession(),
    ]);
    expect(http.get).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState().user).toEqual(user);
  });
  it('limpia el estado privado si la cookie fue eliminada desde otra pestaña', async () => {
    http.get.mockResolvedValue({ data: { user: null } });
    useCartStore.setState({
      cart: [{ id: '1', name: 'Producto', price: 10, quantity: 1 }],
    });
    await useAuthStore.getState().loadSession();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useCartStore.getState().cart).toEqual([]);
    expect(useAuthStore.getState().loading).toBe(false);
  });
});
