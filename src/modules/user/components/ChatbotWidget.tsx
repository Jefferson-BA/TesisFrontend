import { MessageCircle, X, Send, User, Bot, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChatbot } from "../hooks/useChatbot";

export default function ChatbotWidget() {
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
    <div className="fixed bottom-6 right-6 z-50 font-sans selection:bg-yellow-500/30">
      {isOpen && (
        <div className="mb-4 w-[360px] sm:w-[420px] h-[580px] bg-[#0d0907]/95 border border-[#3d2c1f] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-300 relative">
          
          {/* Efectos de luz ambiental de fondo */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-600/5 rounded-full blur-[60px] pointer-events-none" />

          {/* HEADER PREMIUM */}
          <div className="bg-[#060403] border-b border-[#3d2c1f]/70 p-4 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#120d0a] border border-yellow-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.1)] relative">
                <Bot className="text-yellow-500 w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-black rounded-full animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-serif font-bold text-white text-[13px] tracking-wide flex items-center gap-1.5">
                  Asistente Virtual <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                </h3>
                <p className="text-[11px] text-zinc-400 font-medium">Soporte DeParraSpitz • En línea</p>
              </div>
            </div>
            
            <button 
              onClick={toggleChat} 
              className="w-8 h-8 rounded-lg bg-zinc-900/50 border border-zinc-800/60 flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#3d2c1f] hover:bg-zinc-800/30 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ÁREA DE MENSAJES (Feed Estilizado) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0c0806]/40 scrollbar-thin scrollbar-thumb-[#3d2c1f] scrollbar-track-transparent relative z-10">
            
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-yellow-500/5 border border-yellow-500/10 flex items-center justify-center text-yellow-500/60">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-zinc-200">¡Hola! Gusto en saludarte</p>
                  <p className="text-xs text-zinc-500 max-w-[240px]">¿En qué te puedo ayudar hoy respecto a nuestro menú, catering o reservas?</p>
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-200`}>
                
                {/* Avatar de IA */}
                {msg.role === "ai" && (
                  <div className="w-7 h-7 rounded-lg bg-[#120d0a] border border-[#3d2c1f] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4 text-yellow-500" />
                  </div>
                )}
                
                {/* Burbuja contenedora */}
                <div className={`max-w-[80%] p-3.5 rounded-xl text-[13px] leading-relaxed shadow-md transition-all ${
                  msg.role === "user" 
                    ? "bg-gradient-to-br from-yellow-500 to-amber-500 text-black rounded-tr-none font-medium shadow-yellow-500/5" 
                    : "bg-[#140f0c] border border-[#2d2016] text-zinc-300 rounded-tl-none"
                }`}>
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <div className="prose prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0 max-w-none text-[13px] tracking-wide prose-strong:text-yellow-500 prose-strong:font-bold">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* Avatar de Usuario */}
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-yellow-500" />
                  </div>
                )}
              </div>
            ))}

            {/* Indicador de Carga Premium */}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start animate-pulse">
                <div className="w-7 h-7 rounded-lg bg-[#120d0a] border border-[#3d2c1f] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="bg-[#140f0c] border border-[#2d2016] text-zinc-400 px-4 py-3 rounded-xl rounded-tl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT DE TEXTO MODERNIZADO */}
          <div className="p-4 bg-[#060403] border-t border-[#3d2c1f]/60 relative z-10">
            <form onSubmit={handleSend} className="flex items-center gap-2 bg-[#120d0a] border border-[#2d2016] focus-within:border-yellow-500/50 rounded-xl px-3.5 py-2.5 transition-all group shadow-inner">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                maxLength={500}
                disabled={isLoading}
                placeholder="Escribe tu consulta aquí..."
                className="flex-1 bg-transparent text-zinc-200 focus:outline-none text-xs sm:text-sm disabled:opacity-50 placeholder-zinc-600"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="w-8 h-8 rounded-lg bg-yellow-500 disabled:bg-zinc-900 text-black disabled:text-zinc-600 flex items-center justify-center transition-all enabled:hover:bg-yellow-400 enabled:hover:scale-105 enabled:active:scale-95 shadow-md shadow-yellow-500/10 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
            <div className="flex justify-between items-center mt-2 px-1 text-[10px] text-zinc-600">
              <span>Impulsado por IA</span>
              <span className="font-mono">{inputValue.length}/500</span>
            </div>
          </div>
        </div>
      )}

      {/* BOTÓN FLOTANTE CON GLOW EFECTO */}
      {!isOpen && (
        <button 
          onClick={toggleChat} 
          className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 rounded-2xl shadow-[0_8px_30px_rgba(234,179,8,0.3)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative border border-yellow-400/20 cursor-pointer"
        >
          {/* Onda expansiva sutil detrás del botón */}
          <span className="absolute inset-0 rounded-2xl bg-yellow-500/20 animate-ping opacity-75 group-hover:opacity-0 transition-opacity duration-500" />
          <MessageCircle className="w-6 h-6 text-black transition-transform group-hover:rotate-6" />
        </button>
      )}
    </div>
  );
}