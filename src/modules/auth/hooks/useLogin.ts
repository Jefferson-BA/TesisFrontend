import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: any) => authService.login(data),
    onSuccess: (response) => {
      // 1. Guardamos en el Store (Zustand)
      setAuth(response.user, response.accessToken);
      
      const role = response.user.role; 

      // 2. CREAMOS LA COOKIE para que el Middleware la pueda leer (Válida por 1 día)
      document.cookie = `user-role=${role}; path=/; max-age=86400`;

      // 3. Redirección inteligente
      if (role === 'superadmin') {
        window.location.href = "/superadmin/dashboard";
      } else if (role === 'admin') {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/"; 
      }
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Credenciales incorrectas");
    }
  });
};