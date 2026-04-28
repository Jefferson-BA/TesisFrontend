// 1. Asegúrate de que la ruta sea @/api/axios (sin .ts al final)
import api from "@/api/axios"; 

// 2. Agrega la palabra "type" para que TS esté feliz
import type { LoginFormData } from "../schemas/auth.schema"; 

export const authService = {
  login: async (data: LoginFormData) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },
};