// src/middleware.ts
import type { APIContext, MiddlewareNext } from "astro";

export async function onRequest({ url, cookies, redirect }: APIContext, next: MiddlewareNext) {
  const isAdminPage = url.pathname.startsWith("/admin");
  const isSuperAdminPage = url.pathname.startsWith("/superadmin");

  // Obtenemos el rol y lo pasamos a minúsculas por seguridad
  const userRole = cookies.get("user-role")?.value?.toLowerCase();

  // Bloqueo para Admin
  if (isAdminPage) {
    if (userRole !== "admin" && userRole !== "superadmin") {
      return redirect("/login");
    }
  }

  // Bloqueo para Superadmin
  if (isSuperAdminPage) {
    if (userRole !== "superadmin") {
      // Si es admin pero no superadmin, lo mandamos a su panel
      return userRole === "admin" ? redirect("/admin/dashboard") : redirect("/login");
    }
  }

  return next();
}