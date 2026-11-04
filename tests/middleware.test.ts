import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { onRequest } from '@/middleware';
import { SESSION_COOKIE } from '@/server/backend';
import { context } from './helpers';

beforeEach(() => vi.stubEnv('API_URL', 'https://backend.test'));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
const next = () => Promise.resolve(new Response('page'));
describe('autorización de páginas', () => {
  it('una cookie de rol falsificada no concede acceso', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const response = await onRequest(
      context('/superadmin/dashboard', {
        cookies: { 'user-role': 'superadmin' },
      }).context,
      next,
    );
    expect(response.headers.get('Location')).toBe('/login');
    expect(fetch).not.toHaveBeenCalled();
  });
  it.each([
    '/user/profile',
    '/user/pagar-reserva',
    '/checkout',
    '/admin/dashboard',
  ])('exige una sesión para %s', async (path) => {
    expect(
      (await onRequest(context(path).context, next)).headers.get('Location'),
    ).toBe('/login');
  });
  it.each([
    ['user', '/admin/dashboard', '/'],
    ['admin', '/superadmin/dashboard', '/admin/dashboard'],
    ['superadmin', '/superadmin/dashboard', null],
    ['superadmin', '/admin/dashboard', null],
    ['user', '/user/profile', null],
  ])(
    'comprueba el rol %s contra %s usando el backend',
    async (role, path, destination) => {
      const fetch = vi
        .fn()
        .mockResolvedValue(
          Response.json({ user: { id: 1, email: 'user@example.com', role } }),
        );
      vi.stubGlobal('fetch', fetch);
      const response = await onRequest(
        context(path, { cookies: { [SESSION_COOKIE]: 'verified-token' } })
          .context,
        next,
      );
      expect(response.headers.get('Location')).toBe(destination);
      if (!destination)
        expect(response.headers.get('Cache-Control')).toContain('no-store');
      expect(fetch).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          headers: { Authorization: 'Bearer verified-token' },
        }),
      );
    },
  );
  it('devuelve 503 en una caída temporal y no concede acceso', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const input = context('/admin/dashboard', {
      cookies: { [SESSION_COOKIE]: 'token' },
    });
    expect((await onRequest(input.context, next)).status).toBe(503);
    expect(input.cookies.delete).not.toHaveBeenCalled();
  });
  it('las páginas públicas siguen disponibles sin consultar sesiones', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    expect((await onRequest(context('/menu').context, next)).status).toBe(200);
    expect(fetch).not.toHaveBeenCalled();
  });
});
