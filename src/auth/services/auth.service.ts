import api from "@/api/axios";
// Usamos "import type" para cumplir con las reglas de TS moderno
import type { LoginFormData } from "../schemas/auth.schema";

export const authService = {
  login: async (data: LoginFormData) => {
    // El "post" apunta al endpoint que creaste en NestJS
    const response = await api.post("/auth/login", data);
    return response.data; 
  },

  // Ejemplo de cómo escalar: añadir logout o registro es así de fácil
  logout: () => {
    localStorage.removeItem('token');
  }
};