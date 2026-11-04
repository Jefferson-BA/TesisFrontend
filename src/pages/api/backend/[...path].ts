import {
  backendFetch,
  clearSession,
  isSameOrigin,
  json,
  SESSION_COOKIE,
} from '@/server/backend';
import type { APIRoute } from 'astro';

export const prerender = false;
const allowedRoots = new Set([
  'auth',
  'users',
  'products',
  'categories',
  'promotions',
  'reservations',
  'orders',
  'dashboard',
  'superadmin',
  'chatbot',
  'cart',
]);
export const ALL: APIRoute = async ({ request, params, cookies, url }) => {
  const path = params.path ?? '';
  const segments = path.split('/');
  const isDashboardStats =
    path === 'admin/dashboard/stats' &&
    ['GET', 'HEAD'].includes(request.method);
  if (
    (!allowedRoots.has(segments[0]) && !isDashboardStats) ||
    segments.some((s) => !/^[a-zA-Z0-9_-]+$/.test(s)) ||
    (segments[0] === 'auth' && path !== 'auth/signup')
  )
    return json({ message: 'Ruta no disponible' }, 404);
  if (
    !['GET', 'HEAD', 'POST', 'PATCH', 'PUT', 'DELETE'].includes(request.method)
  )
    return json({ message: 'Método no permitido' }, 405);
  if (!['GET', 'HEAD'].includes(request.method) && !isSameOrigin(request))
    return json({ message: 'Origen no permitido' }, 403);
  const headers = new Headers({ Accept: 'application/json' });
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);
  try {
    const response = await backendFetch(
      path,
      {
        method: request.method,
        headers,
        body: ['GET', 'HEAD'].includes(request.method)
          ? undefined
          : await request.arrayBuffer(),
      },
      url.search,
    );
    if (response.status === 401) clearSession(cookies);
    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type':
          response.headers.get('content-type') ?? 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return json(
      { message: 'El servidor no está disponible. Intenta de nuevo.' },
      502,
    );
  }
};
