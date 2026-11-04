import { getDefaultRouteByRole } from '@/lib/auth-utils';
import { sessionUserSchema } from '@/modules/auth/types/auth.types';
import { backendFetch, clearSession, SESSION_COOKIE } from '@/server/backend';
import type { APIContext, MiddlewareNext } from 'astro';
import { z } from 'zod';

export async function onRequest(
  { url, cookies, redirect }: APIContext,
  next: MiddlewareNext,
) {
  const path = url.pathname;
  const admin = /^\/admin(?:\/|$)/.test(path);
  const superadmin = /^\/superadmin(?:\/|$)/.test(path);
  const userPage = /^\/user(?:\/|$)/.test(path) || path === '/checkout';
  const authPage = path === '/login' || path === '/register';
  if (!admin && !superadmin && !userPage && !authPage) return next();
  const token = cookies.get(SESSION_COOKIE)?.value;
  let role: 'user' | 'admin' | 'superadmin' | undefined;
  if (token) {
    try {
      const response = await backendFetch('auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) clearSession(cookies);
      else if (!response.ok) throw new Error('No se pudo verificar la sesión');
      else
        role = z
          .object({ user: sessionUserSchema })
          .parse(await response.json()).user.role;
    } catch {
      return new Response(
        'No se pudo verificar tu sesión. Intenta nuevamente en unos momentos.',
        {
          status: 503,
          headers: {
            'Cache-Control': 'no-store',
            'Content-Type': 'text/plain; charset=utf-8',
          },
        },
      );
    }
  }
  if (authPage) return role ? redirect(getDefaultRouteByRole(role)) : next();
  if (!role) return redirect('/login');
  if (superadmin && role !== 'superadmin')
    return redirect(getDefaultRouteByRole(role));
  if (admin && role === 'user') return redirect('/');
  if (['/admin', '/admin/', '/superadmin', '/superadmin/'].includes(path)) {
    return redirect(superadmin ? '/superadmin/dashboard' : '/admin/dashboard');
  }
  const response = await next();
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
