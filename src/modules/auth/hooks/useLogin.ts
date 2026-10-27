// src/modules/auth/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";
import { extractRole, getDefaultRouteByRole } from "@/lib/auth-utils";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: any) => authService.login(data),

    onSuccess: (response: any) => {
      console.log("🟢 LOGIN EXITOSO. Respuesta del backend:", response);

      const token =
        response.token ||
        response.access_token ||
        response.accessToken ||
        response.jwt;

      const user =
        response.user ||
        response.usuario ||
        response.data?.user ||
        response.data?.usuario;

      if (!token || !user) {
        console.warn("⚠️ ALERTA: No se encontró el token o el usuario en la respuesta.");
      }

      // 🛡️ Extracción robusta de rol (evita "[object Object]")
      const role = extractRole(user);
      console.log("🧭 Rol detectado y validado para redirección:", role);

      // Normalizamos el usuario para que contenga el rol como string limpio
      const normalizedUser = {
        ...user,
        role: role,
      };

      if (token) localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      
      if (token) {
        setAuth(normalizedUser, token);
      }

      // Guardamos la cookie de sesión para el middleware de Astro (7 días de vigencia)
      document.cookie = `user-role=${role}; path=/; max-age=604800; SameSite=Lax`;

      const targetRoute = getDefaultRouteByRole(role);

      setTimeout(() => {
        window.location.href = targetRoute;
      }, 1000);
    },

    onError: (error: any) => {
      console.error("🔴 ERROR EN EL LOGIN:", error?.response?.data || error.message);
    }
  });
};