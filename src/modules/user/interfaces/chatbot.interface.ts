export interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

export interface ChatbotRequest {
  message: string;
}

export interface ChatbotResponse {
  reply: string;
}