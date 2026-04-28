import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Exportamos el tipo para que el Service lo reconozca
export type LoginFormData = z.infer<typeof loginSchema>;