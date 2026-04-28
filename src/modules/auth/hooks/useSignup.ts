import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: any) => {
      // Quitamos el roleId, enviamos solo lo que el SignupDto acepta
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      return authService.signup(payload);
    },
    onSuccess: () => {
      alert("¡Cuenta creada con éxito! Por favor, inicia sesión.");
      window.location.href = "/login";
    },
    onError: (error: any) => {
      const message = error.response?.data?.message;
      if (Array.isArray(message)) {
        alert("Corrije esto:\n- " + message.join("\n- "));
      } else {
        alert(message || "Hubo un error al crear la cuenta");
      }
    }
  });
};