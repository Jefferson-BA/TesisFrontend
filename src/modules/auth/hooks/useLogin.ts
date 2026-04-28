import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";
import type { LoginFormData } from "../schemas/auth.schema";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (response) => {
      // Guardamos en el store global
      setAuth(response.user, response.accessToken);
      
      // Redirección profesional según el rol (o directo al admin por ahora)
      window.location.href = "/admin/dashboard";
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Error al iniciar sesión");
    }
  });
};