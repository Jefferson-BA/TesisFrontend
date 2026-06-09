import { MessageCircle, X, Send, User, Bot, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChatbot } from "../hooks/useChatbot";

export default function ChatbotWidget() {
  // Consumimos toda la lógica desde nuestro Custom Hook
  const {
    isOpen,
    messages,
    inputValue,
    isLoading,
    messagesEndRef,
    setInputValue,
    handleSend,
    toggleChat,
  } = useChatbot();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-[#15100e] border border-[#4a3824] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-black border-b border-[#4a3824] p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot className="text-yellow-500 w-6 h-6" />
              <h3 className="font-bold">Asistente Virtual</h3>
            </div>
            <button onClick={toggleChat} className="text-zinc-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#120c09] scrollbar-thin scrollbar-thumb-[#4a3824] scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-[#4a3824] flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-yellow-500" />
                  </div>
                )}
                
                <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-yellow-500 text-black rounded-br-none font-medium" : "bg-[#1c1613] border border-[#4a3824] text-zinc-300 rounded-bl-none"}`}>
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <div className="prose prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0 max-w-none text-sm">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 text-yellow-500">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-[#4a3824] flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="bg-[#1c1613] border border-[#4a3824] text-zinc-300 p-4 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Texto */}
          <div className="p-3 bg-black border-t border-[#4a3824]">
            <form onSubmit={handleSend} className="flex items-center gap-2 bg-[#1c1613] border border-[#4a3824] rounded-full px-4 py-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                maxLength={500}
                disabled={isLoading}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-transparent text-white focus:outline-none text-sm disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="text-yellow-500 hover:text-yellow-400 disabled:text-zinc-600 transition-colors"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
            <div className="text-right mt-1 px-2">
              <span className="text-[10px] text-zinc-600">{inputValue.length}/500</span>
            </div>
          </div>
        </div>
      )}

      {/* BOTÓN FLOTANTE (BUBBLE) */}
      {!isOpen && (
        <button onClick={toggleChat} className="w-14 h-14 bg-yellow-500 hover:bg-yellow-400 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
          <MessageCircle className="w-7 h-7 text-black" />
        </button>
      )}
    </div>
  );
}