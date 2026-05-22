// src/modules/auth/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: any) => authService.login(data),

    onSuccess: (response: any) => {
      console.log("LOGIN RESPONSE:", response);

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

      if (token) {
        localStorage.setItem("token", token);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      if (user && token) {
        setAuth(user, token);
      }

      const role = (
        user?.role ||
        user?.rol ||
        user?.role?.name ||
        user?.roles?.[0]?.name ||
        "user"
      )
        .toString()
        .toLowerCase();

      document.cookie = `user-role=${role}; path=/; max-age=86400; SameSite=Lax`;

      setTimeout(() => {
        if (role === "superadmin") {
          window.location.href = "/superadmin/dashboard";
        } else if (role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/";
        }
      }, 100);
    },

    onError: (error: any) => {
      console.error(error);
      alert(error.response?.data?.message || "Error al iniciar sesión");
    },
  });
};