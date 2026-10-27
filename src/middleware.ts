// src/middleware.ts
import type { APIContext, MiddlewareNext } from "astro";

export async function onRequest({ url, cookies, redirect }: APIContext, next: MiddlewareNext) {
  const pathname = url.pathname;
  const isAdminPage = pathname.startsWith("/admin");
  const isSuperAdminPage = pathname.startsWith("/superadmin");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // 1. Obtenemos el rol y lo saneamos contra cookies corruptas
  let userRole = cookies.get("user-role")?.value?.toLowerCase()?.trim();

  if (userRole === "[object object]" || userRole === "undefined" || userRole === "null") {
    cookies.delete("user-role", { path: "/" });
    userRole = undefined;
  }

  // 2. Redirección inteligente si ya está logueado e intenta entrar a /login o /register
  if (isAuthPage && userRole) {
    if (userRole === "superadmin") {
      return redirect("/superadmin/dashboard");
    }
    if (userRole === "admin") {
      return redirect("/admin/dashboard");
    }
  }

  // 3. Manejo de URLs base sin sub-ruta (/admin o /admin/ -> /admin/dashboard)
  if (pathname === "/admin" || pathname === "/admin/") {
    if (userRole === "admin" || userRole === "superadmin") {
      return redirect("/admin/dashboard");
    }
    return redirect("/login");
  }

  // 4. Manejo de URLs base sin sub-ruta (/superadmin o /superadmin/ -> /superadmin/dashboard)
  if (pathname === "/superadmin" || pathname === "/superadmin/") {
    if (userRole === "superadmin") {
      return redirect("/superadmin/dashboard");
    }
    return userRole === "admin" ? redirect("/admin/dashboard") : redirect("/login");
  }

  // 5. Protección estricta de rutas Superadmin (/superadmin/*)
  if (isSuperAdminPage) {
    if (userRole !== "superadmin") {
      // Si un Admin intenta entrar al panel de Superadmin, se le redirige a su panel operativo
      return userRole === "admin" ? redirect("/admin/dashboard") : redirect("/login");
    }
  }

  // 6. Protección de rutas Admin (/admin/*)
  // Superadmin tiene acceso maestro también a las operaciones del Admin convencional
  if (isAdminPage) {
    if (userRole !== "admin" && userRole !== "superadmin") {
      return redirect("/login");
    }
  }

  return next();
}