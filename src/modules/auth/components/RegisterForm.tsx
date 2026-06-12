import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schema";
import { useSignup } from "../hooks/useSignup";
import { Loader2, Mail, Lock, User, UserPlus } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";

const queryClient = new QueryClient();

function RegisterFormInner() {
  const { mutate: signup, isPending } = useSignup();
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

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const nameReg = register("name");
  const emailReg = register("email");
  const passReg = register("password");
  const confirmPassReg = register("confirmPassword");

  const onSubmit = (data: RegisterFormData) => {
    // VALIDACIÓN ESTRICTA DE GMAIL
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!gmailRegex.test(data.email)) {
      toast.error("Solo se permiten correos Gmail", {
        description: "Usa una cuenta @gmail.com para registrarte",
        style: {
          background: '#120d0a',
          color: '#fff',
          border: '1px solid #eab308'
        }
      });
      return;
    }

    signup(data);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

        @keyframes rf-slideUp   { from{opacity:0;transform:translateY(40px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes rf-float     { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-10px) rotate(2deg)} }
        @keyframes rf-spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes rf-shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes rf-ripple    { 0%{transform:scale(0);opacity:0.6} 100%{transform:scale(4);opacity:0} }
        @keyframes rf-inputGlow { 0%,100%{box-shadow:0 0 0 0 rgba(234,179,8,0)} 50%{box-shadow:0 0 20px 2px rgba(234,179,8,0.12)} }
        @keyframes rf-orbit     { 0%{transform:rotate(0deg) translateX(28px) rotate(0deg)} 100%{transform:rotate(360deg) translateX(28px) rotate(-360deg)} }
        @keyframes rf-pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

        .rf-wrapper {
          opacity: 0;
          transition: opacity 0.1s;
        }
        .rf-wrapper.visible {
          opacity: 1;
          animation: rf-slideUp 0.75s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        .rf-card {
          position: relative;
          width: 430px;
          background: #0c0906;
          border-radius: 32px;
          border: 1px solid rgba(74,56,36,0.35);
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.03) inset;
          transition: box-shadow 0.4s ease;
        }
        .rf-card:hover {
          box-shadow: 0 50px 100px rgba(0,0,0,0.95), 0 0 60px rgba(234,179,8,0.04);
        }

        /* Spotlight interactivo */
        .rf-spotlight {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          border-radius: 32px; overflow: hidden;
        }
        .rf-spotlight::after {
          content: '';
          position: absolute; width: 350px; height: 350px; border-radius: 50%;
          background: radial-gradient(circle, rgba(234,179,8,0.07) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          left: var(--mx, 50%); top: var(--my, 50%);
          transition: left 0.15s ease, top 0.15s ease;
          pointer-events: none;
        }

        /* Anillos de ambiente estéticos */
        .rf-ring {
          position: absolute; border-radius: 50%; pointer-events: none;
          border: 1px solid rgba(234,179,8,0.06);
        }
        .rf-ring-1 { width:260px; height:260px; top:-80px; right:-80px; animation: rf-spin-slow 20s linear infinite; }
        .rf-ring-2 { width:180px; height:180px; bottom:-40px; left:-40px; animation: rf-spin-slow 14s linear infinite reverse; border-color: rgba(234,179,8,0.04); }

        .rf-header { position: relative; z-index: 1; padding: 2.5rem 2.5rem 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 1.25rem; }

        /* Icono flotante con órbitas idénticas al Login */
        .rf-icon-wrap {
          position: relative; width: 80px; height: 80px;
          animation: rf-float 5s ease-in-out infinite;
        }
        .rf-icon-bg {
          width: 80px; height: 80px; border-radius: 24px;
          background: linear-gradient(135deg, #1c140e, #261a10);
          border: 1px solid rgba(74,56,36,0.6);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02) inset;
        }
        .rf-orbit-dot {
          position: absolute; width: 8px; height: 8px; border-radius: 50%;
          background: #eab308; top: 50%; left: 50%; margin: -4px 0 0 -4px;
          animation: rf-orbit 3s linear infinite;
          box-shadow: 0 0 8px rgba(234,179,8,0.8);
        }
        .rf-orbit-dot-2 {
          position: absolute; width: 5px; height: 5px; border-radius: 50%;
          background: #f59e0b; top: 50%; left: 50%; margin: -2.5px 0 0 -2.5px;
          animation: rf-orbit 3s linear infinite reverse;
          animation-delay: -1.5s;
          box-shadow: 0 0 6px rgba(245,158,11,0.7);
        }

        /* Título con máscara de Shimmer */
        .rf-title {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-size: 2rem; font-weight: 900; color: #f4f4f5;
          text-align: center; letter-spacing: -0.02em;
          background: linear-gradient(135deg, #f5f5f5 30%, #d4a017 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: rf-shimmer 4s linear infinite;
        }
        .rf-subtitle { font-size: 0.78rem; color: #71717a; text-align: center; letter-spacing: 0.04em; }

        .rf-divider { width: 100%; display: flex; align-items: center; gap: 12px; }
        .rf-divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(74,56,36,0.4), transparent); }
        .rf-divider-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(234,179,8,0.4); animation: rf-pulse-dot 2s ease-in-out infinite; }

        .rf-body { position: relative; z-index: 1; padding: 0 2.5rem 1.75rem; display: flex; flex-direction: column; gap: 1.15rem; }

        /* Focus en inputs */
        .rf-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .rf-label {
          font-size: 0.68rem; font-weight: 800; letter-spacing: 0.22em;
          text-transform: uppercase; color: #52525b;
          transition: color 0.25s ease;
        }
        .rf-field.focused .rf-label { color: #eab308; }

        .rf-input-wrap {
          position: relative; border-radius: 14px;
          transition: transform 0.2s ease;
        }
        .rf-input-wrap:focus-within { transform: translateY(-1px); }

        .rf-input-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: #52525b; pointer-events: none; z-index: 2;
          transition: color 0.25s ease, transform 0.25s ease;
        }
        .rf-field.focused .rf-input-icon { color: #eab308; transform: translateY(-50%) scale(1.1); }

        .rf-input {
          width: 100%; height: 50px; padding: 0 16px 0 48px;
          background: #100c09; border: 1px solid #3d2c1f;
          border-radius: 14px; color: #f4f4f5; font-size: 0.9rem;
          outline: none; transition: all 0.25s ease; font-family: inherit;
          box-sizing: border-box;
        }
        .rf-input::placeholder { color: #3f3f46; }
        .rf-input:focus {
          border-color: rgba(234,179,8,0.5);
          background: #120f0b;
          box-shadow: 0 0 0 3px rgba(234,179,8,0.08), 0 4px 16px rgba(0,0,0,0.4);
          animation: rf-inputGlow 2s ease-in-out infinite;
        }

        /* Línea inferior interactiva con efecto Spring */
        .rf-input-underline {
          position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #eab308, transparent);
          border-radius: 0 0 14px 14px; transform: scaleX(0);
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          transform-origin: center;
        }
        .rf-field.focused .rf-input-underline { transform: scaleX(1); }

        .rf-error { color: #f87171; font-size: 0.72rem; font-weight: 600; display: flex; align-items: center; gap: 4px; }
        .rf-error::before { content: '⚠'; font-size: 0.65rem; }

        /* Botón con efecto Ripple */
        .rf-submit {
          width: 100%; height: 52px; border: none; border-radius: 14px; cursor: pointer;
          background: linear-gradient(135deg, #d97706, #eab308, #f59e0b);
          background-size: 200% auto;
          color: #0c0906; font-weight: 900; font-size: 0.8rem;
          letter-spacing: 0.2em; text-transform: uppercase;
          transition: all 0.3s ease; font-family: inherit;
          position: relative; overflow: hidden;
          box-shadow: 0 6px 24px rgba(234,179,8,0.2);
          margin-top: 0.4rem;
        }
        .rf-submit:hover:not(:disabled) {
          background-position: right center;
          box-shadow: 0 10px 36px rgba(234,179,8,0.35);
          transform: translateY(-2px);
        }
        .rf-submit:active:not(:disabled) { transform: translateY(0) scale(0.99); }
        .rf-submit:disabled { background: #1c1c1c; color: #3f3f46; cursor: not-allowed; box-shadow: none; }
        .rf-submit-content { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .rf-submit-ripple {
          position: absolute; border-radius: 50%;
          background: rgba(255,255,255,0.2);
          width: 10px; height: 10px; margin: -5px 0 0 -5px;
          animation: rf-ripple 0.6s ease-out forwards;
          pointer-events: none;
        }
        .rf-submit-arrow { display: inline-block; transition: transform 0.3s ease; }
        .rf-submit:hover .rf-submit-arrow { transform: translateX(4px); }

        .rf-footer {
          position: relative; z-index: 1;
          background: #080604; border-top: 1px solid rgba(74,56,36,0.25);
          padding: 1.25rem 2.5rem;
          display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
        }
        .rf-footer-text { font-size: 0.8rem; color: #52525b; text-align: center; }
        .rf-footer-link {
          color: #eab308; font-weight: 700; text-decoration: none;
          transition: all 0.2s ease; position: relative;
        }
        .rf-footer-link::after {
          content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;
          background: #eab308; transform: scaleX(0); transition: transform 0.25s ease;
        }
        .rf-footer-link:hover { color: #fbbf24; }
        .rf-footer-link:hover::after { transform: scaleX(1); }
        
        .rf-security { display: flex; align-items: center; gap: 5px; font-size: 0.7rem; color: #3f3f46; letter-spacing: 0.05em; }
        .rf-security-dot { width: 5px; height: 5px; border-radius: 50%; background: #22c55e; animation: rf-pulse-dot 2s ease-in-out infinite; }
      `}</style>

      <div className={`rf-wrapper${isVisible ? " visible" : ""}`}>
        <div
          className="rf-card"
          ref={cardRef}
          onMouseMove={handleMouseMove}
          style={{ "--mx": `${mousePos.x}%`, "--my": `${mousePos.y}%` } as React.CSSProperties}
        >
          <div className="rf-spotlight" />
          <div className="rf-ring rf-ring-1" />
          <div className="rf-ring rf-ring-2" />

          {/* Header */}
          <div className="rf-header">
            <div className="rf-icon-wrap">
              <div className="rf-icon-bg">
                <UserPlus size={34} color="#eab308" />
              </div>
              <div className="rf-orbit-dot" />
              <div className="rf-orbit-dot-2" />
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="rf-title">Crear Cuenta</div>
              <div className="rf-subtitle" style={{ marginTop: "6px" }}>
                Regístrate en el sistema de banquetes y corporativo
              </div>
            </div>
            <div className="rf-divider">
              <div className="rf-divider-line" />
              <div className="rf-divider-dot" />
              <div className="rf-divider-line" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="rf-body">

              {/* Nombre Completo */}
              <div className={`rf-field${focused === "name" ? " focused" : ""}`}>
                <label className="rf-label">Nombre completo</label>
                <div className="rf-input-wrap">
                  <User size={17} className="rf-input-icon" />
                  <input
                    {...nameReg}
                    type="text"
                    placeholder="Tu nombre y apellido"
                    className="rf-input"
                    onFocus={() => setFocused("name")}
                    onBlur={(e) => { nameReg.onBlur(e); setFocused(null); }}
                    autoComplete="name"
                  />
                  <div className="rf-input-underline" />
                </div>
                {errors.name && <span className="rf-error">{errors.name.message}</span>}
              </div>

              {/* Email */}
              <div className={`rf-field${focused === "email" ? " focused" : ""}`}>
                <label className="rf-label">Correo electrónico</label>
                <div className="rf-input-wrap">
                  <Mail size={17} className="rf-input-icon" />
                  <input
                    {...emailReg}
                    type="email"
                    placeholder="usuario@gmail.com"
                    className="rf-input"
                    onFocus={() => setFocused("email")}
                    onBlur={(e) => { emailReg.onBlur(e); setFocused(null); }}
                    autoComplete="email"
                  />
                  <div className="rf-input-underline" />
                </div>
                {errors.email && <span className="rf-error">{errors.email.message}</span>}
              </div>

              {/* Password */}
              <div className={`rf-field${focused === "pass" ? " focused" : ""}`}>
                <label className="rf-label">Contraseña</label>
                <div className="rf-input-wrap">
                  <Lock size={17} className="rf-input-icon" />
                  <input
                    {...passReg}
                    type="password"
                    placeholder="••••••••"
                    className="rf-input"
                    onFocus={() => setFocused("pass")}
                    onBlur={(e) => { passReg.onBlur(e); setFocused(null); }}
                    autoComplete="new-password"
                  />
                  <div className="rf-input-underline" />
                </div>
                {errors.password && <span className="rf-error">{errors.password.message}</span>}
              </div>

              {/* Confirmar Password */}
              <div className={`rf-field${focused === "confirmPass" ? " focused" : ""}`}>
                <label className="rf-label">Confirmar contraseña</label>
                <div className="rf-input-wrap">
                  <Lock size={17} className="rf-input-icon" />
                  <input
                    {...confirmPassReg}
                    type="password"
                    placeholder="••••••••"
                    className="rf-input"
                    onFocus={() => setFocused("confirmPass")}
                    onBlur={(e) => { confirmPassReg.onBlur(e); setFocused(null); }}
                    autoComplete="new-password"
                  />
                  <div className="rf-input-underline" />
                </div>
                {errors.confirmPassword && <span className="rf-error">{errors.confirmPassword.message}</span>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="rf-submit"
                disabled={isPending}
                onClick={(e) => {
                  if (isPending) return;
                  const btn = e.currentTarget;
                  const ripple = document.createElement("div");
                  ripple.className = "rf-submit-ripple";
                  const rect = btn.getBoundingClientRect();
                  ripple.style.left = `${e.clientX - rect.left}px`;
                  ripple.style.top = `${e.clientY - rect.top}px`;
                  btn.appendChild(ripple);
                  setTimeout(() => ripple.remove(), 600);
                }}
              >
                <span className="rf-submit-content">
                  {isPending
                    ? <Loader2 size={18} className="animate-spin" />
                    : <><span>Registrarme</span><span className="rf-submit-arrow">→</span></>
                  }
                </span>
              </button>

            </div>
          </form>

          {/* Footer */}
          <div className="rf-footer">
            <p className="rf-footer-text">
              ¿Ya tienes cuenta?{" "}
              <a href="/login" className="rf-footer-link">Inicia sesión</a>
            </p>
            <div className="rf-security">
              <div className="rf-security-dot" />
              Protección de datos garantizada
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export function RegisterForm() {
  return (
    <QueryClientProvider client={queryClient}>
      <RegisterFormInner />
    </QueryClientProvider>
  );
}