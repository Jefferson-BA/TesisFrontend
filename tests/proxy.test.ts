import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ALL } from '@/pages/api/backend/[...path]';
import { SESSION_COOKIE } from '@/server/backend';
import { context } from './helpers';
beforeEach(() => vi.stubEnv('API_URL', 'https://backend.test'));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
describe('proxy al backend', () => {
  it('reenvía las estadísticas del dashboard con la sesión del servidor', async () => {
    const stats = { cards: { totalOrders: 5 } };
    const fetch = vi.fn().mockResolvedValue(Response.json(stats));
    vi.stubGlobal('fetch', fetch);
    const input = context('/api/backend/admin/dashboard/stats', {
      cookies: { [SESSION_COOKIE]: 'admin-token' },
    });
    input.context.params.path = 'admin/dashboard/stats';
    const response = await ALL(input.context);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(stats);
    const [url, options] = fetch.mock.calls[0];
    expect(String(url)).toBe('https://backend.test/admin/dashboard/stats');
    expect(options.headers.get('Authorization')).toBe('Bearer admin-token');
  });
  it('usa el token HttpOnly y conserva los filtros sin reenviar credenciales del cliente', async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json([]));
    vi.stubGlobal('fetch', fetch);
    const input = context('/api/backend/orders?reservationId=7', {
      cookies: { [SESSION_COOKIE]: 'server-token' },
      headers: { Authorization: 'Bearer forged' },
    });
    input.context.params.path = 'orders';
    const response = await ALL(input.context);
    expect(response.status).toBe(200);
    const [url, options] = fetch.mock.calls[0];
    expect(String(url)).toBe('https://backend.test/orders?reservationId=7');
    expect(options.headers.get('Authorization')).toBe('Bearer server-token');
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });
  it.each([
    'auth/login',
    'auth/profile',
    '../orders',
    'orders/../users',
    'orders/%2Fusers',
    'unknown',
    'admin/users',
    'admin/dashboard/unknown',
  ])('bloquea rutas no permitidas: %s', async (path) => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const input = context('/api/backend/placeholder');
    input.context.params.path = path;
    expect((await ALL(input.context)).status).toBe(404);
    expect(fetch).not.toHaveBeenCalled();
  });
  it('no habilita escrituras en la excepción del dashboard', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const input = context('/api/backend/admin/dashboard/stats', {
      method: 'POST',
      origin: 'https://frontend.test',
      body: {},
    });
    input.context.params.path = 'admin/dashboard/stats';
    expect((await ALL(input.context)).status).toBe(404);
    expect(fetch).not.toHaveBeenCalled();
  });
  it('bloquea cambios sin un origen válido', async () => {
    const input = context('/api/backend/orders', {
      method: 'POST',
      origin: 'https://attacker.test',
      body: {},
    });
    input.context.params.path = 'orders';
    expect((await ALL(input.context)).status).toBe(403);
  });
  it('elimina la sesión en un 401 sin ocultar el código del backend', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          Response.json({ message: 'expired' }, { status: 401 }),
        ),
    );
    const input = context('/api/backend/orders', {
      cookies: { [SESSION_COOKIE]: 'token' },
    });
    input.context.params.path = 'orders';
    expect((await ALL(input.context)).status).toBe(401);
    expect(input.cookies.delete).toHaveBeenCalledWith(SESSION_COOKIE, {
      path: '/',
    });
  });
});
