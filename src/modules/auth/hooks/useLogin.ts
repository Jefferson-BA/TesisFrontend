// src/modules/auth/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: any) => authService.login(data),

    onSuccess: (response: any) => {
      // 1. Log detallado para que veas EXACTAMENTE qué devuelve tu backend
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
        console.warn("⚠️ ALERTA: No se encontró el token o el user en la respuesta. Verifica la estructura del JSON.");
      }

      if (token) localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      
      if (user && token) {
        setAuth(user, token);
      }

      // Buscamos el rol de forma segura
      const role = (
        user?.role ||
        user?.rol ||
        user?.role?.name ||
        user?.roles?.[0]?.name ||
        "user"
      ).toString().toLowerCase();

      console.log("🧭 Rol detectado para redirección:", role);

      document.cookie = `user-role=${role}; path=/; max-age=86400; SameSite=Lax`;

      // 2. Aumentamos el tiempo a 1200ms para que el Toast de éxito se alcance a leer
      setTimeout(() => {
        if (role === "superadmin") {
          window.location.href = "/superadmin/dashboard";
        } else if (role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          // Si cae aquí, te enviará a la raíz
          window.location.href = "/";
        }
      }, 1200);
    },

    onError: (error: any) => {
      // 3. Capturamos el error real del backend si las credenciales fallan
      console.error("🔴 ERROR EN EL LOGIN:", error?.response?.data || error.message);
    }
  });
};