import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { toast } from "sonner"; 

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: any) => {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      return authService.signup(payload);
    },
    onSuccess: () => {
      // 👇 Adiós alert, hola toast.success
      toast.success("¡Cuenta creada con éxito!", {
        description: "Redirigiendo al inicio de sesión..."
      });
      
      // Le damos 1.5 segundos al usuario para leer el mensaje antes de cambiar de página
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message;
    
      if (Array.isArray(message)) {
        toast.error("Error en el formulario", {
          description: message.join(", ")
        });
      } else {
        toast.error(message || "Hubo un error al crear la cuenta");
      }
    }
  });
};