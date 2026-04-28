import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: any) => {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        roleId: 3 
      };
      return authService.signup(payload);
    },
    onSuccess: () => {
      alert("¡Cuenta creada con éxito! Por favor, inicia sesión.");
      window.location.href = "/login";
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Hubo un error al crear la cuenta");
    }
  });
};