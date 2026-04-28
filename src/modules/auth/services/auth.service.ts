// 1. Asegúrate de que la ruta sea @/api/axios (sin .ts al final)
import api from "@/api/axios"; 
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// 2. Agrega la palabra "type" para que TS esté feliz
import type { LoginFormData } from "../schemas/auth.schema"; 

export const authService = {
  login: async (data: LoginFormData) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },
  // Dentro de tu authService
  signup: async (data: any) => {
    const response = await axios.post(`${API_URL}/signup`, data);
    return response.data;
  },
};