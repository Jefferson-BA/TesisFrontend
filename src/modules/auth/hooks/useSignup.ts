import { getErrorMessage } from '@/lib/errors';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { RegisterFormData } from '../schemas/auth.schema';
import { authService } from '../services/auth.service';

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: RegisterFormData) => {
      // 🟢 CORREGIDO: Ahora incluimos 'phone' en el payload para que viaje al backend
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone, // 👈 ¡Súper importante para que viaje por la API!
        acceptedTerms: data.acceptedTerms,
        acceptedPrivacy: data.acceptedPrivacy,
      };
      return authService.signup(payload);
    },
    onSuccess: () => {
      toast.success('¡Cuenta creada con éxito!', {
        description: 'Redirigiendo al inicio de sesión...',
      });

      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    },
    onError: (error: unknown) =>
      toast.error(getErrorMessage(error, 'No se pudo crear la cuenta')),
  });
};
