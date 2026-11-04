import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { POST, GET, DELETE } from '@/pages/api/session';
import { SESSION_COOKIE } from '@/server/backend';
import { context } from './helpers';

const user = {
  id: 1,
  name: 'Cliente',
  email: 'user@example.com',
  role: 'USER',
  phone: '999888777',
};
const credentials = { email: user.email, password: 'password123' };
beforeEach(() => {
  vi.stubEnv('API_URL', 'https://backend.test');
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('sesión HttpOnly', () => {
  it('guarda el token en una cookie segura y devuelve solo datos públicos', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(Response.json({ access_token: 'secret-token', user }));
    vi.stubGlobal('fetch', fetch);
    const input = context('/api/session', {
      method: 'POST',
      origin: 'https://frontend.test',
      body: credentials,
    });
    const response = await POST(input.context);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ user: { ...user, role: 'user' } });
    expect(input.cookies.set).toHaveBeenCalledWith(
      SESSION_COOKIE,
      'secret-token',
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      }),
    );
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });
  it('rechaza peticiones de otro origen antes de consultar al backend', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const response = await POST(
      context('/api/session', {
        method: 'POST',
        origin: 'https://attacker.test',
        body: credentials,
      }).context,
    );
    expect(response.status).toBe(403);
    expect(fetch).not.toHaveBeenCalled();
  });
  it('rechaza respuestas sin token o con roles desconocidos', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ user })));
    const input = context('/api/session', {
      method: 'POST',
      origin: 'https://frontend.test',
      body: credentials,
    });
    expect(
      (
        await POST(
          context('/api/session', {
            method: 'POST',
            origin: 'https://frontend.test',
            body: credentials,
          }).context,
        )
      ).status,
    ).toBe(502);
    expect(input.cookies.set).not.toHaveBeenCalled();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({
          access_token: 'token',
          user: { ...user, role: 'owner' },
        }),
      ),
    );
    expect(
      (
        await POST(
          context('/api/session', {
            method: 'POST',
            origin: 'https://frontend.test',
            body: credentials,
          }).context,
        )
      ).status,
    ).toBe(502);
  });
  it('rechaza entradas inválidas sin enviar credenciales al servidor', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    expect(
      (
        await POST(
          context('/api/session', {
            method: 'POST',
            origin: 'https://frontend.test',
            body: { email: 'bad' },
          }).context,
        )
      ).status,
    ).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });
  it('elimina cookies cuando el backend invalida la sesión', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 401 })),
    );
    const input = context('/api/session', {
      cookies: { [SESSION_COOKIE]: 'expired' },
    });
    expect((await GET(input.context)).status).toBe(401);
    expect(input.cookies.delete).toHaveBeenCalledWith(SESSION_COOKIE, {
      path: '/',
    });
  });
  it('conserva la sesión si el backend está temporalmente caído', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const input = context('/api/session', {
      cookies: { [SESSION_COOKIE]: 'valid' },
    });
    expect((await GET(input.context)).status).toBe(503);
    expect(input.cookies.delete).not.toHaveBeenCalled();
  });
  it('cierra la sesión en el servidor y rechaza cierres desde otro origen', async () => {
    const input = context('/api/session', {
      method: 'DELETE',
      origin: 'https://frontend.test',
      cookies: { [SESSION_COOKIE]: 'token' },
    });
    expect((await DELETE(input.context)).status).toBe(200);
    expect(input.cookies.delete).toHaveBeenCalledWith(SESSION_COOKIE, {
      path: '/',
    });
    expect(
      (
        await DELETE(
          context('/api/session', {
            method: 'DELETE',
            origin: 'https://attacker.test',
          }).context,
        )
      ).status,
    ).toBe(403);
  });
});
