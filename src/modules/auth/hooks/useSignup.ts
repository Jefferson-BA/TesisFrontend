import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { toast } from "sonner"; 
import type { RegisterFormData } from "../schemas/auth.schema";

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: RegisterFormData) => {
      // 🟢 CORREGIDO: Ahora incluimos 'phone' en el payload para que viaje al backend
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: (data as any).phone, // 👈 ¡Súper importante para que viaje por la API!
      };
      return authService.signup(payload);
    },
    onSuccess: () => {
      toast.success("¡Cuenta creada con éxito!", {
        description: "Redirigiendo al inicio de sesión..."
      });
      
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