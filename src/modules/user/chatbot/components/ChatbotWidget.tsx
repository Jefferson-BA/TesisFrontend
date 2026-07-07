// src/modules/user/chatbot/components/ChatbotWidget.tsx

"use client";

import { MessageCircle, X, Send, User, Bot, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChatbot } from "../hooks/useChatbot";
import { cn } from "@/lib/utils";

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
    <div className="fixed bottom-6 right-6 z-50 font-sans">

      {/* ── VENTANA DEL CHAT ── */}
      {isOpen && (
        <div className={cn(
          "mb-4 w-[360px] sm:w-[400px] h-[580px] flex flex-col overflow-hidden rounded-[20px] animate-in fade-in slide-in-from-bottom-6 duration-300 shadow-2xl",
          "bg-[#fffdf9] border-[#e0d5c5] dark:bg-[#0E0A07] dark:border-amber-500/20",
          "border"
        )}>
          {/* ── HEADER ── */}
          <div className={cn(
            "relative flex items-center justify-between px-5 py-4 shrink-0",
            "bg-[#faf7f2] border-b border-[#e0d5c5] dark:bg-[#130E0B] dark:border-amber-500/15"
          )}>
            <div className="flex items-center gap-3 z-10">
              <div className="relative">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  "bg-ember/10 border border-ember/30 shadow-[0_0_16px_rgba(201,151,74,0.12)]"
                )}>
                  <Bot className="w-5 h-5 text-ember" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#faf7f2] dark:border-[#130E0B] bg-emerald-500 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="h-px w-6 bg-gradient-to-r from-transparent to-ember/30" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-ember">DeParraSpitz</span>
                  <div className="h-px w-6 bg-gradient-to-l from-transparent to-ember/30" />
                </div>
                <h3 className="font-serif font-normal text-foreground text-sm tracking-wide flex items-center gap-1.5">
                  Asistente Virtual
                  <Sparkles className="w-3 h-3 animate-pulse text-ember" />
                </h3>
                <p className="text-[10px] font-light mt-0.5 text-muted-foreground">En línea · Responde al instante</p>
              </div>
            </div>

            <button
              onClick={toggleChat}
              className="relative z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-muted border border-border text-muted-foreground hover:border-ember/40 hover:text-ember"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── MENSAJES ── */}
          <div className={cn(
            "flex-1 overflow-y-auto px-4 py-5 space-y-4",
            "bg-[#fffdf9] dark:bg-[#0E0A07]",
            "[scrollbar-width:thin] [scrollbar-color:rgba(201,151,74,0.2)_transparent]"
          )}>
            {/* Estado vacío */}
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center gap-5 px-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-ember/5 border border-ember/20 shadow-[0_0_30px_rgba(201,151,74,0.08)]">
                    <Bot className="w-7 h-7 text-ember" />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-serif font-normal text-foreground">¡Bienvenido!</p>
                  <p className="text-xs font-light leading-relaxed max-w-[220px] text-muted-foreground">
                    ¿En qué te puedo ayudar? Consulta sobre nuestro menú, catering o reservas.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {["Ver menú", "Reservar evento", "Precios"].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setInputValue(chip)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all bg-ember/5 border border-ember/20 text-ember/80 hover:border-ember hover:text-ember"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mensajes */}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-end gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "ai" && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-ember/10 border border-ember/20">
                    <Bot className="w-4 h-4 text-ember" />
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[78%] px-4 py-3 text-[13px] leading-relaxed",
                    msg.role === "user"
                      ? "rounded-2xl rounded-br-sm bg-gradient-to-br from-ember to-amber-400 text-char-deep font-medium"
                      : "rounded-2xl rounded-bl-sm bg-muted border border-border text-foreground"
                  )}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-ember">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-ember/10 border border-ember/20">
                    <User className="w-4 h-4 text-ember" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-end gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-ember/10 border border-ember/20">
                  <Bot className="w-4 h-4 text-ember" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5 bg-muted border border-border">
                  {["-0.3s", "-0.15s", "0s"].map((delay, i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-ember animate-bounce" style={{ animationDelay: delay }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── INPUT ── */}
          <div className={cn(
            "px-4 py-4 shrink-0",
            "bg-[#faf7f2] border-t border-[#e0d5c5] dark:bg-[#0E0A07] dark:border-amber-500/10"
          )}>
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all bg-muted border border-border focus-within:border-ember/50"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                maxLength={500}
                disabled={isLoading}
                placeholder="Escribe tu consulta…"
                className="flex-1 bg-transparent text-sm font-light outline-none disabled:opacity-40 text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-ember hover:brightness-110 text-char-deep disabled:opacity-30"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>

            <div className="flex justify-between items-center mt-2 px-1">
              <span className="text-[10px] text-muted-foreground/50">Impulsado por IA</span>
              <span className="text-[10px] font-mono text-muted-foreground/50">{inputValue.length}/500</span>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTÓN FLOTANTE ── */}
      <div className="relative flex items-center justify-end">
        {!isOpen && (
          <div className="absolute right-16 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium bg-card border border-border text-muted-foreground shadow-lg">
            ¿Tienes dudas?
          </div>
        )}

        <button
          onClick={toggleChat}
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group bg-gradient-to-br from-ember to-amber-400 shadow-[0_8px_28px_rgba(201,151,74,0.35)]"
        >
          <span className="absolute inset-0 rounded-2xl animate-ping opacity-30 group-hover:opacity-0 transition-opacity duration-500 bg-ember/40" />
          {isOpen ? (
            <X className="w-6 h-6 relative z-10 text-char-deep" />
          ) : (
            <MessageCircle className="w-6 h-6 relative z-10 transition-transform group-hover:rotate-6 text-char-deep" />
          )}
        </button>
      </div>
    </div>
  );
}