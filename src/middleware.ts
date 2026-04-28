// src/middleware.ts
import type { APIContext, MiddlewareNext } from "astro";

export async function onRequest(
  { url, cookies, redirect }: APIContext,
  next: MiddlewareNext
) {
  // 1. Definimos qué rutas son protegidas
  const isAdminPage = url.pathname.startsWith("/admin");
  const isSuperAdminPage = url.pathname.startsWith("/superadmin");

  // 2. Leemos la cookie que guardará el rol del usuario
  const userRole = cookies.get("user-role")?.value;

  // 3. Reglas de seguridad
  if (isAdminPage && userRole !== "admin" && userRole !== "superadmin") {
    // Si intenta entrar al admin y no es admin, lo pateamos al login
    return redirect("/login");
  }

  if (isSuperAdminPage && userRole !== "superadmin") {
    // Si intenta entrar al superadmin y no lo es, lo mandamos al panel normal
    return redirect("/admin/dashboard");
  }

  // Si todo está bien, lo dejamos pasar
  return next();
}