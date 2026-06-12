import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { useLogin } from "../hooks/useLogin";
import { Loader2, Mail, Lock, ChefHat } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";

const queryClient = new QueryClient();

function LoginFormInner() {
  const { mutate: login, isPending } = useLogin();
  const [focused, setFocused] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const emailReg = register("email");
  const passReg = register("password");

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => toast.success("Bienvenido de nuevo 👋", {
        style: { background: '#120d0a', color: '#fff', border: '1px solid #4a3824' }
      }),
      onError: () => toast.error("Credenciales incorrectas", {
        style: { background: '#120d0a', color: '#fff', border: '1px solid #e11d48' }
      }),
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

        @keyframes lf-slideUp   { from{opacity:0;transform:translateY(40px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes lf-float     { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-10px) rotate(2deg)} }
        @keyframes lf-spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes lf-shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes lf-ripple    { 0%{transform:scale(0);opacity:0.6} 100%{transform:scale(4);opacity:0} }
        @keyframes lf-inputGlow { 0%,100%{box-shadow:0 0 0 0 rgba(234,179,8,0)} 50%{box-shadow:0 0 20px 2px rgba(234,179,8,0.12)} }
        @keyframes lf-orbit     { 0%{transform:rotate(0deg) translateX(28px) rotate(0deg)} 100%{transform:rotate(360deg) translateX(28px) rotate(-360deg)} }
        @keyframes lf-pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

        .lf-wrapper {
          opacity: 0;
          transition: opacity 0.1s;
        }
        .lf-wrapper.visible {
          opacity: 1;
          animation: lf-slideUp 0.75s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        .lf-card {
          position: relative;
          width: 430px;
          background: #0c0906;
          border-radius: 32px;
          border: 1px solid rgba(74,56,36,0.35);
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.03) inset;
          transition: box-shadow 0.4s ease;
        }
        .lf-card:hover {
          box-shadow: 0 50px 100px rgba(0,0,0,0.95), 0 0 60px rgba(234,179,8,0.04);
        }

        /* Spotlight que sigue el cursor */
        .lf-spotlight {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          border-radius: 32px; overflow: hidden;
        }
        .lf-spotlight::after {
          content: '';
          position: absolute; width: 350px; height: 350px; border-radius: 50%;
          background: radial-gradient(circle, rgba(234,179,8,0.07) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          left: var(--mx, 50%); top: var(--my, 50%);
          transition: left 0.15s ease, top 0.15s ease;
          pointer-events: none;
        }

        /* Anillos giratorios de ambiente */
        .lf-ring {
          position: absolute; border-radius: 50%; pointer-events: none;
          border: 1px solid rgba(234,179,8,0.06);
        }
        .lf-ring-1 { width:260px; height:260px; top:-80px; right:-80px; animation: lf-spin-slow 20s linear infinite; }
        .lf-ring-2 { width:180px; height:180px; bottom:-40px; left:-40px; animation: lf-spin-slow 14s linear infinite reverse; border-color: rgba(234,179,8,0.04); }

        .lf-header { position: relative; z-index: 1; padding: 3rem 2.5rem 2rem; display: flex; flex-direction: column; align-items: center; gap: 1.25rem; }

        /* Ícono flotante con órbitas */
        .lf-icon-wrap {
          position: relative; width: 80px; height: 80px;
          animation: lf-float 5s ease-in-out infinite;
        }
        .lf-icon-bg {
          width: 80px; height: 80px; border-radius: 24px;
          background: linear-gradient(135deg, #1c140e, #261a10);
          border: 1px solid rgba(74,56,36,0.6);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02) inset;
        }
        .lf-orbit-dot {
          position: absolute; width: 8px; height: 8px; border-radius: 50%;
          background: #eab308; top: 50%; left: 50%; margin: -4px 0 0 -4px;
          animation: lf-orbit 3s linear infinite;
          box-shadow: 0 0 8px rgba(234,179,8,0.8);
        }
        .lf-orbit-dot-2 {
          position: absolute; width: 5px; height: 5px; border-radius: 50%;
          background: #f59e0b; top: 50%; left: 50%; margin: -2.5px 0 0 -2.5px;
          animation: lf-orbit 3s linear infinite reverse;
          animation-delay: -1.5s;
          box-shadow: 0 0 6px rgba(245,158,11,0.7);
        }

        /* Título con shimmer */
        .lf-title {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-size: 2rem; font-weight: 900; color: #f4f4f5;
          text-align: center; letter-spacing: -0.02em;
          background: linear-gradient(135deg, #f5f5f5 30%, #d4a017 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: lf-shimmer 4s linear infinite;
        }
        .lf-subtitle { font-size: 0.78rem; color: #71717a; text-align: center; letter-spacing: 0.04em; }

        .lf-divider { width: 100%; display: flex; align-items: center; gap: 12px; }
        .lf-divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(74,56,36,0.4), transparent); }
        .lf-divider-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(234,179,8,0.4); animation: lf-pulse-dot 2s ease-in-out infinite; }

        .lf-body { position: relative; z-index: 1; padding: 0 2.5rem 2rem; display: flex; flex-direction: column; gap: 1.5rem; }

        /* Campos con animación al focus */
        .lf-field { display: flex; flex-direction: column; gap: 0.45rem; }
        .lf-label {
          font-size: 0.7rem; font-weight: 800; letter-spacing: 0.22em;
          text-transform: uppercase; color: #52525b;
          transition: color 0.25s ease;
        }
        .lf-field.focused .lf-label { color: #eab308; }

        .lf-input-wrap {
          position: relative; border-radius: 14px;
          transition: transform 0.2s ease;
        }
        .lf-input-wrap:focus-within { transform: translateY(-1px); }

        .lf-input-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: #52525b; pointer-events: none; z-index: 2;
          transition: color 0.25s ease, transform 0.25s ease;
        }
        .lf-field.focused .lf-input-icon { color: #eab308; transform: translateY(-50%) scale(1.1); }

        .lf-input {
          width: 100%; height: 54px; padding: 0 16px 0 48px;
          background: #100c09; border: 1px solid #3d2c1f;
          border-radius: 14px; color: #f4f4f5; font-size: 0.925rem;
          outline: none; transition: all 0.25s ease; font-family: inherit;
          box-sizing: border-box;
        }
        .lf-input::placeholder { color: #3f3f46; }
        .lf-input:focus {
          border-color: rgba(234,179,8,0.5);
          background: #120f0b;
          box-shadow: 0 0 0 3px rgba(234,179,8,0.08), 0 4px 16px rgba(0,0,0,0.4);
          animation: lf-inputGlow 2s ease-in-out infinite;
        }

        /* Línea inferior animada con efecto spring */
        .lf-input-underline {
          position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #eab308, transparent);
          border-radius: 0 0 14px 14px; transform: scaleX(0);
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          transform-origin: center;
        }
        .lf-field.focused .lf-input-underline { transform: scaleX(1); }

        .lf-error { color: #f87171; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 4px; }
        .lf-error::before { content: '⚠'; font-size: 0.65rem; }

        /* Botón con ripple */
        .lf-submit {
          width: 100%; height: 54px; border: none; border-radius: 14px; cursor: pointer;
          background: linear-gradient(135deg, #d97706, #eab308, #f59e0b);
          background-size: 200% auto;
          color: #0c0906; font-weight: 900; font-size: 0.8rem;
          letter-spacing: 0.2em; text-transform: uppercase;
          transition: all 0.3s ease; font-family: inherit;
          position: relative; overflow: hidden;
          box-shadow: 0 6px 24px rgba(234,179,8,0.2);
          margin-top: 0.25rem;
        }
        .lf-submit:hover:not(:disabled) {
          background-position: right center;
          box-shadow: 0 10px 36px rgba(234,179,8,0.35);
          transform: translateY(-2px);
        }
        .lf-submit:active:not(:disabled) { transform: translateY(0) scale(0.99); }
        .lf-submit:disabled { background: #1c1c1c; color: #3f3f46; cursor: not-allowed; box-shadow: none; }
        .lf-submit-content { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .lf-submit-ripple {
          position: absolute; border-radius: 50%;
          background: rgba(255,255,255,0.2);
          width: 10px; height: 10px; margin: -5px 0 0 -5px;
          animation: lf-ripple 0.6s ease-out forwards;
          pointer-events: none;
        }
        .lf-submit-arrow { display: inline-block; transition: transform 0.3s ease; }
        .lf-submit:hover .lf-submit-arrow { transform: translateX(4px); }

        .lf-footer {
          position: relative; z-index: 1;
          background: #080604; border-top: 1px solid rgba(74,56,36,0.25);
          padding: 1.25rem 2.5rem;
          display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
        }
        .lf-footer-text { font-size: 0.8rem; color: #52525b; text-align: center; }
        .lf-footer-link {
          color: #eab308; font-weight: 700; text-decoration: none;
          transition: all 0.2s ease; position: relative;
        }
        .lf-footer-link::after {
          content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;
          background: #eab308; transform: scaleX(0); transition: transform 0.25s ease;
        }
        .lf-footer-link:hover { color: #fbbf24; }
        .lf-footer-link:hover::after { transform: scaleX(1); }
        .lf-security { display: flex; align-items: center; gap: 5px; font-size: 0.7rem; color: #3f3f46; letter-spacing: 0.05em; }
        .lf-security-dot { width: 5px; height: 5px; border-radius: 50%; background: #22c55e; animation: lf-pulse-dot 2s ease-in-out infinite; }
      `}</style>

      <div className={`lf-wrapper${isVisible ? " visible" : ""}`}>
        <div
          className="lf-card"
          ref={cardRef}
          onMouseMove={handleMouseMove}
          style={{ "--mx": `${mousePos.x}%`, "--my": `${mousePos.y}%` } as React.CSSProperties}
        >
          <div className="lf-spotlight" />
          <div className="lf-ring lf-ring-1" />
          <div className="lf-ring lf-ring-2" />

          {/* Header */}
          <div className="lf-header">
            <div className="lf-icon-wrap">
              <div className="lf-icon-bg">
                <ChefHat size={36} color="#eab308" />
              </div>
              <div className="lf-orbit-dot" />
              <div className="lf-orbit-dot-2" />
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="lf-title">Acceso Administrativo</div>
              <div className="lf-subtitle" style={{ marginTop: "6px" }}>
                Ingresa tus credenciales para continuar
              </div>
            </div>
            <div className="lf-divider">
              <div className="lf-divider-line" />
              <div className="lf-divider-dot" />
              <div className="lf-divider-line" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="lf-body">

              {/* Email */}
              <div className={`lf-field${focused === "email" ? " focused" : ""}`}>
                <label className="lf-label">Correo electrónico</label>
                <div className="lf-input-wrap">
                  <Mail size={17} className="lf-input-icon" />
                  <input
                    {...emailReg}
                    type="email"
                    placeholder="usuario@deparraspitz.com"
                    className="lf-input"
                    onFocus={() => setFocused("email")}
                    onBlur={(e) => { emailReg.onBlur(e); setFocused(null); }}
                    autoComplete="email"
                  />
                  <div className="lf-input-underline" />
                </div>
                {errors.email && <span className="lf-error">{errors.email.message}</span>}
              </div>

              {/* Password */}
              <div className={`lf-field${focused === "pass" ? " focused" : ""}`}>
                <label className="lf-label">Contraseña</label>
                <div className="lf-input-wrap">
                  <Lock size={17} className="lf-input-icon" />
                  <input
                    {...passReg}
                    type="password"
                    placeholder="••••••••"
                    className="lf-input"
                    onFocus={() => setFocused("pass")}
                    onBlur={(e) => { passReg.onBlur(e); setFocused(null); }}
                    autoComplete="current-password"
                  />
                  <div className="lf-input-underline" />
                </div>
                {errors.password && <span className="lf-error">{errors.password.message}</span>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="lf-submit"
                disabled={isPending}
                onClick={(e) => {
                  if (isPending) return;
                  const btn = e.currentTarget;
                  const ripple = document.createElement("div");
                  ripple.className = "lf-submit-ripple";
                  const rect = btn.getBoundingClientRect();
                  ripple.style.left = `${e.clientX - rect.left}px`;
                  ripple.style.top = `${e.clientY - rect.top}px`;
                  btn.appendChild(ripple);
                  setTimeout(() => ripple.remove(), 600);
                }}
              >
                <span className="lf-submit-content">
                  {isPending
                    ? <Loader2 size={18} className="animate-spin" />
                    : <><span>Ingresar</span><span className="lf-submit-arrow">→</span></>
                  }
                </span>
              </button>

            </div>
          </form>

          {/* Footer */}
          <div className="lf-footer">
            <p className="lf-footer-text">
              ¿No tienes cuenta?{" "}
              <a href="/register" className="lf-footer-link">Regístrate aquí</a>
            </p>
            <div className="lf-security">
              <div className="lf-security-dot" />
              Conexión segura · SSL encriptado
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export function LoginForm() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginFormInner />
    </QueryClientProvider>
  );
}