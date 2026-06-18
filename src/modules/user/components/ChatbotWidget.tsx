import { MessageCircle, X, Send, User, Bot, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChatbot } from "../hooks/useChatbot";

const GOLD = "#C9974A";
const GOLD_LIGHT = "#E8B96A";

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

      {/* ── VENTANA DEL CHAT ── */}
      {isOpen && (
        <div
          className="mb-4 w-[360px] sm:w-[400px] h-[580px] flex flex-col overflow-hidden rounded-[20px] animate-in fade-in slide-in-from-bottom-6 duration-300"
          style={{
            background: "#0E0A07",
            border: "1px solid rgba(201,151,74,0.22)",
            boxShadow: "0 30px_80px rgba(0,0,0,0.9), 0 0 0 1px rgba(201,151,74,0.05)",
          }}
        >

          {/* Luz ambiental top */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(201,151,74,0.07) 0%, transparent 70%)", filter: "blur(20px)" }}
          />

          {/* ── HEADER ── */}
          <div
            className="relative flex items-center justify-between px-5 py-4 shrink-0"
            style={{ background: "#130E0B", borderBottom: "1px solid rgba(201,151,74,0.15)" }}
          >
            {/* Patrón geométrico sutil */}
            <svg className="absolute right-0 top-0 opacity-[0.06] pointer-events-none" width="120" height="72" viewBox="0 0 120 72" fill="none">
              <polygon points="60,4 108,32 108,56 60,68 12,56 12,32" stroke={GOLD} strokeWidth="0.8" fill="none"/>
              <polygon points="60,14 96,36 96,52 60,60 24,52 24,36" stroke={GOLD} strokeWidth="0.4" fill="none"/>
              <circle cx="60" cy="38" r="7" stroke={GOLD} strokeWidth="0.4" fill="none"/>
            </svg>

            {/* Avatar + info */}
            <div className="flex items-center gap-3 z-10">
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(201,151,74,0.08)",
                    border: "1px solid rgba(201,151,74,0.3)",
                    boxShadow: `0 0 16px rgba(201,151,74,0.12)`,
                  }}
                >
                  <Bot className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                {/* Indicador online */}
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 animate-pulse"
                  style={{ background: "#27ae60", borderColor: "#130E0B" }}
                />
              </div>

              <div>
                {/* Eyebrow ornamental */}
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="h-px w-6" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}55)` }}/>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>
                    DeParraSpitz
                  </span>
                  <div className="h-px w-6" style={{ background: `linear-gradient(270deg, transparent, ${GOLD}55)` }}/>
                </div>
                <h3
                  className="font-serif font-normal text-white text-sm tracking-wide flex items-center gap-1.5"
                >
                  Asistente Virtual
                  <Sparkles className="w-3 h-3 animate-pulse" style={{ color: GOLD }} />
                </h3>
                <p className="text-[10px] font-light mt-0.5" style={{ color: "#7A6A55" }}>
                  En línea · Responde al instante
                </p>
              </div>
            </div>

            {/* Botón cerrar */}
            <button
              onClick={toggleChat}
              className="relative z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: "rgba(201,151,74,0.06)",
                border: "1px solid rgba(201,151,74,0.15)",
                color: "#7A6A55",
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,151,74,0.4)";
                (e.currentTarget as HTMLButtonElement).style.color = GOLD;
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,151,74,0.15)";
                (e.currentTarget as HTMLButtonElement).style.color = "#7A6A55";
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── FEED DE MENSAJES ── */}
          <div
            className="flex-1 overflow-y-auto px-4 py-5 space-y-4"
            style={{
              background: "linear-gradient(180deg, #0E0A07 0%, #100C09 100%)",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(201,151,74,0.2) transparent",
            }}
          >

            {/* Estado vacío */}
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center gap-5 px-4">
                {/* Ornamento central */}
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "rgba(201,151,74,0.06)",
                      border: "1px solid rgba(201,151,74,0.2)",
                      boxShadow: `0 0 30px rgba(201,151,74,0.08)`,
                    }}
                  >
                    <Bot className="w-7 h-7" style={{ color: GOLD }} />
                  </div>
                  {/* Diamante decorativo */}
                  <svg className="absolute -top-2 -right-2" width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="6,0 12,6 6,12 0,6" fill={GOLD} opacity="0.5"/>
                  </svg>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-3 mb-1">
                    <div className="h-px w-10" style={{ background: `rgba(201,151,74,0.3)` }}/>
                    <svg width="8" height="8" viewBox="0 0 8 8"><polygon points="4,0 8,4 4,8 0,4" fill={GOLD} opacity="0.5"/></svg>
                    <div className="h-px w-10" style={{ background: `rgba(201,151,74,0.3)` }}/>
                  </div>
                  <p className="text-sm font-serif font-normal text-white">¡Bienvenido!</p>
                  <p className="text-xs font-light leading-relaxed max-w-[220px]" style={{ color: "#7A6A55" }}>
                    ¿En qué te puedo ayudar? Consulta sobre nuestro menú, catering o reservas.
                  </p>
                </div>

                {/* Quick chips */}
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {["Ver menú", "Reservar evento", "Precios"].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setInputValue(chip)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                      style={{
                        background: "rgba(201,151,74,0.06)",
                        border: "1px solid rgba(201,151,74,0.2)",
                        color: "#C9B090",
                      }}
                      onMouseOver={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = GOLD;
                        (e.currentTarget as HTMLButtonElement).style.color = GOLD;
                      }}
                      onMouseOut={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,151,74,0.2)";
                        (e.currentTarget as HTMLButtonElement).style.color = "#C9B090";
                      }}
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
                className={`flex items-end gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar IA */}
                {msg.role === "ai" && (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(201,151,74,0.08)",
                      border: "1px solid rgba(201,151,74,0.22)",
                    }}
                  >
                    <Bot className="w-4 h-4" style={{ color: GOLD }} />
                  </div>
                )}

                {/* Burbuja */}
                <div
                  className={`max-w-[78%] px-4 py-3 text-[13px] leading-relaxed ${
                    msg.role === "user" ? "rounded-2xl rounded-br-sm" : "rounded-2xl rounded-bl-sm"
                  }`}
                  style={
                    msg.role === "user"
                      ? {
                          background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
                          color: "#0A0806",
                          fontWeight: 500,
                        }
                      : {
                          background: "#1A1410",
                          border: "1px solid rgba(201,151,74,0.14)",
                          color: "#D4C4A8",
                        }
                  }
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <div className="prose prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0 max-w-none text-[13px] prose-strong:font-bold"
                         style={{ "--tw-prose-bold": GOLD } as React.CSSProperties}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* Avatar usuario */}
                {msg.role === "user" && (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(201,151,74,0.08)",
                      border: "1px solid rgba(201,151,74,0.22)",
                    }}
                  >
                    <User className="w-4 h-4" style={{ color: GOLD }} />
                  </div>
                )}
              </div>
            ))}

            {/* Indicador de escritura */}
            {isLoading && (
              <div className="flex items-end gap-2.5 justify-start animate-in fade-in duration-200">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(201,151,74,0.08)", border: "1px solid rgba(201,151,74,0.22)" }}
                >
                  <Bot className="w-4 h-4" style={{ color: GOLD }} />
                </div>
                <div
                  className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5"
                  style={{ background: "#1A1410", border: "1px solid rgba(201,151,74,0.14)" }}
                >
                  {["-0.3s", "-0.15s", "0s"].map((delay, i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ background: GOLD, animationDelay: delay }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── INPUT ── */}
          <div
            className="px-4 py-4 shrink-0"
            style={{ background: "#0E0A07", borderTop: "1px solid rgba(201,151,74,0.12)" }}
          >
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all"
              style={{
                background: "#1A1410",
                border: "1px solid rgba(201,151,74,0.2)",
              }}
              onFocusCapture={e => (e.currentTarget.style.borderColor = GOLD)}
              onBlurCapture={e  => (e.currentTarget.style.borderColor = "rgba(201,151,74,0.2)")}
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                maxLength={500}
                disabled={isLoading}
                placeholder="Escribe tu consulta…"
                className="flex-1 bg-transparent text-sm font-light outline-none disabled:opacity-40 placeholder-[#5A4A35]"
                style={{ color: "#D4C4A8" }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                style={{ background: GOLD, color: "#0A0806", border: "none" }}
                onMouseOver={e => { if (!((e.currentTarget as HTMLButtonElement).disabled)) (e.currentTarget as HTMLButtonElement).style.background = GOLD_LIGHT; }}
                onMouseOut={e  => { if (!((e.currentTarget as HTMLButtonElement).disabled)) (e.currentTarget as HTMLButtonElement).style.background = GOLD; }}
              >
                {isLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Send  className="w-4 h-4" />}
              </button>
            </form>

            <div className="flex justify-between items-center mt-2 px-1">
              <span className="text-[10px]" style={{ color: "#3A2E22" }}>Impulsado por IA</span>
              <span className="text-[10px] font-mono" style={{ color: "#3A2E22" }}>{inputValue.length}/500</span>
            </div>
          </div>

        </div>
      )}

      {/* ── BOTÓN FLOTANTE ── */}
      <div className="relative flex items-center justify-end">
        {/* Tooltip */}
        {!isOpen && (
          <div
            className="absolute right-16 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium pointer-events-none opacity-0 hover:opacity-100 transition-opacity"
            style={{
              background: "#1A1410",
              border: "1px solid rgba(201,151,74,0.25)",
              color: "#D4C4A8",
            }}
          >
            ¿Tienes dudas?
          </div>
        )}

        <button
          onClick={toggleChat}
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
          style={{
            background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
            border: "1px solid rgba(232,185,106,0.4)",
            boxShadow: `0 8px 28px rgba(201,151,74,0.35), 0 0 0 1px rgba(201,151,74,0.1)`,
          }}
        >
          {/* Onda de ping sutil */}
          <span
            className="absolute inset-0 rounded-2xl animate-ping opacity-30 group-hover:opacity-0 transition-opacity duration-500"
            style={{ background: `rgba(201,151,74,0.4)` }}
          />
          {isOpen
            ? <X className="w-6 h-6 relative z-10" style={{ color: "#0A0806" }} />
            : <MessageCircle className="w-6 h-6 relative z-10 transition-transform group-hover:rotate-6" style={{ color: "#0A0806" }} />}
        </button>
      </div>

    </div>
  );
}