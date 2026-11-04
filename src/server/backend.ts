import type { AstroCookies } from 'astro';

export const SESSION_COOKIE = 'deparraspitz-session';
export function backendURL(path: string, search = ''): URL {
  const base =
    import.meta.env.API_URL ||
    import.meta.env.PUBLIC_API_URL ||
    (import.meta.env.DEV ? 'http://localhost:3000' : '');
  if (!base) throw new Error('Falta configurar API_URL en el servidor');
  const url = new URL(base.endsWith('/') ? base : `${base}/`);
  if (!['http:', 'https:'].includes(url.protocol))
    throw new Error('API_URL inválida');
  url.pathname = `${url.pathname}${path.replace(/^\/+/, '')}`;
  url.search = search;
  return url;
}
export function clearSession(cookies: AstroCookies) {
  cookies.delete(SESSION_COOKIE, { path: '/' });
  cookies.delete('user-role', { path: '/' });
}
export function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}
export function isSameOrigin(request: Request): boolean {
  return request.headers.get('origin') === new URL(request.url).origin;
}
export function backendFetch(
  path: string,
  init: RequestInit = {},
  search = '',
) {
  return fetch(backendURL(path, search), {
    ...init,
    redirect: 'error',
    signal: init.signal ?? AbortSignal.timeout(30_000),
  });
}
