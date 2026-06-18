// Asumiendo que exportas tu instancia de axios configurada desde aquí
import { api } from "@/api/axios"; 
import type { ChatbotRequest, ChatbotResponse } from "../interfaces/chatbot.interface";

export const askChatbot = async (message: string): Promise<string> => {
  try {
    const payload: ChatbotRequest = { message };
    const response = await api.post<ChatbotResponse>("/chatbot/ask", payload);
    return response.data.reply;
  } catch (error) {
    console.error("Error en el servicio del chatbot:", error);
    throw new Error("No se pudo conectar con el asistente.");
  }
};