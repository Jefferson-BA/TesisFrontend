import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Exportamos el tipo para que el Service lo reconozca
export type LoginFormData = z.infer<typeof loginSchema>;
// Añade esto al final de tu auth.schema.ts
export const registerSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Formato de correo inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"], // El error aparecerá en el campo de confirmar
});

export type RegisterFormData = z.infer<typeof registerSchema>;