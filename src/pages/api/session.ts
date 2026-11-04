import { loginSchema } from '@/modules/auth/schemas/auth.schema';
import { sessionUserSchema } from '@/modules/auth/types/auth.types';
import {
  backendFetch,
  clearSession,
  isSameOrigin,
  json,
  SESSION_COOKIE,
} from '@/server/backend';
import type { APIRoute } from 'astro';
import { z } from 'zod';

export const prerender = false;
const loginResponseSchema = z.object({
  access_token: z.string().min(1),
  user: sessionUserSchema,
});
export const POST: APIRoute = async ({ request, cookies, url }) => {
  if (!isSameOrigin(request))
    return json({ message: 'Origen no permitido' }, 403);
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return json({ message: 'JSON inválido' }, 400);
  }
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success)
    return json({ message: 'Correo o contraseña inválidos' }, 400);
  try {
    const response = await backendFetch('auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    });
    if (!response.ok) {
      if (response.status === 401) clearSession(cookies);
      return json(
        {
          message:
            response.status === 401
              ? 'Credenciales incorrectas'
              : 'No se pudo iniciar sesión',
        },
        response.status,
      );
    }
    const result = loginResponseSchema.safeParse(await response.json());
    if (!result.success)
      return json({ message: 'Respuesta de autenticación inválida' }, 502);
    cookies.set(SESSION_COOKIE, result.data.access_token, {
      httpOnly: true,
      secure: url.protocol === 'https:',
      sameSite: 'lax',
      path: '/',
      maxAge: 604800,
    });
    cookies.delete('user-role', { path: '/' });
    return json({ user: result.data.user });
  } catch {
    return json({ message: 'No se pudo conectar con el servidor' }, 502);
  }
};
export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (!token) return json({ user: null });
  try {
    const response = await backendFetch('auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 401) {
      clearSession(cookies);
      return json({ user: null }, 401);
    }
    if (!response.ok)
      return json({ message: 'No se pudo verificar la sesión' }, 503);
    const result = z
      .object({ user: sessionUserSchema })
      .safeParse(await response.json());
    if (!result.success)
      return json({ message: 'Respuesta de sesión inválida' }, 502);
    return json(result.data);
  } catch {
    return json({ message: 'No se pudo verificar la sesión' }, 503);
  }
};
export const DELETE: APIRoute = ({ request, cookies }) => {
  if (!isSameOrigin(request))
    return json({ message: 'Origen no permitido' }, 403);
  clearSession(cookies);
  return json({ user: null });
};
