// src/modules/auth/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: any) => authService.login(data),
    onSuccess: (response) => {
      setAuth(response.user, response.accessToken);

      // Forzamos el rol a minúsculas para que coincida con el middleware
      const role = response.user.role.toLowerCase();

      // Guardamos la cookie
      document.cookie = `user-role=${role}; path=/; max-age=86400; SameSite=Lax`;

      // Pequeño retraso de 100ms para asegurar que la cookie se escriba antes de redirigir
      // Fragmento de tu useLogin.ts
      setTimeout(() => {
        if (role === 'superadmin') {
          // 👇 Ahora sí te llevará a la página que acabamos de crear
          window.location.href = "/superadmin/dashboard";
        } else if (role === 'admin') {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/";
        }
      }, 100);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Error al iniciar sesión");
    }
  });
};