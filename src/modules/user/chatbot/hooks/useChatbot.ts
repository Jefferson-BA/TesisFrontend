import { useState, useEffect, useRef } from "react";
import type { ChatMessage } from "../interfaces/chatbot.interface";
import { askChatbot } from "../services/chatbot.service";

export const useChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar historial al inicio
  useEffect(() => {
    const savedMessages = sessionStorage.getItem("chatbot_history");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([{ role: "ai", content: "¡Hola! Soy tu asistente virtual. ¿En qué te puedo ayudar hoy?" }]);
    }
  }, []);

  // Guardar historial al actualizar mensajes y hacer scroll
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("chatbot_history", JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || inputValue.length > 500) return;

    const userMsg = inputValue.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInputValue("");
    setIsLoading(true);

    try {
      const reply = await askChatbot(userMsg);
      setMessages((prev) => [...prev, { role: "ai", content: reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Lo siento, tuve un problema de conexión. Intenta de nuevo más tarde." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return {
    isOpen,
    messages,
    inputValue,
    isLoading,
    messagesEndRef,
    setInputValue,
    handleSend,
    toggleChat,
  };
};