import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { useLogin } from "../hooks/useLogin";
import { Loader2, Mail, Lock, ChefHat, Flame, Star, Clock, MapPin } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import "../../../styles/globals.css";

const queryClient = new QueryClient();

const CAROUSEL_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&q=80",
    label: "Cortes Premium a la Brasa",
  },
  {
    url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=1600&q=80",
    label: "Parrilla Tradicional Argentina",
  },
  {
    url: "https://images.unsplash.com/photo-1558030006-450675393462?w=1600&q=80",
    label: "Costillas de Cerdo BBQ",
  },
  {
    url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80",
    label: "Brochetas Artesanales",
  },
  {
    url: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=1600&q=80",
    label: "Entrañas al Carbón",
  },
];

const INFO_ITEMS = [
  { icon: <Flame size={18} />, title: "Desde 1998", desc: "Más de 25 años perfeccionando el arte de la parrilla" },
  { icon: <Star size={18} />, title: "4.9 ★ Google", desc: "Más de 2,000 reseñas de nuestros clientes satisfechos" },
  { icon: <Clock size={18} />, title: "Horario", desc: "Lunes a Domingo · 12:00 pm – 11:00 pm" },
  { icon: <MapPin size={18} />, title: "Ubicación", desc: "Av. Principal 420, San Isidro · Lima, Perú" },
];

function LoginFormInner() {
  const { mutate: login, isPending } = useLogin();
  const [focused, setFocused] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 4500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
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
      onSuccess: () =>
        toast.success("Bienvenido de nuevo 👋", {
          style: { background: "#120d0a", color: "#fff", border: "1px solid #4a3824" },
        }),
      onError: () =>
        toast.error("Credenciales incorrectas", {
          style: { background: "#120d0a", color: "#fff", border: "1px solid #e11d48" },
        }),
    });
  };

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 4500);
  };

  return (
    <div className="lp-root">
      {/* ── Background Carousel ── */}
      <div className="lp-carousel" aria-hidden="true">
        {CAROUSEL_IMAGES.map((img, i) => (
          <div
            key={i}
            className={`lp-slide${i === currentSlide ? " active" : ""}`}
            style={{ backgroundImage: `url(${img.url})` }}
          />
        ))}
        <div className="lp-overlay" />
      </div>

      {/* ── Main Layout ── */}
      <div className={`lp-layout${isVisible ? " visible" : ""}`}>

        {/* ─── Left · Info Panel ─── */}
        <div className="lp-info">
          <div className="lp-brand">
            <ChefHat size={40} color="#eab308" />
            <div>
              <div className="lp-brand-name">De Parras &amp; Pitz</div>
              <div className="lp-brand-tagline">Parrilla &amp; Brasas</div>
            </div>
          </div>

          <div className="lp-slide-label">
            <Flame size={14} />
            <span>{CAROUSEL_IMAGES[currentSlide].label}</span>
          </div>

          <div className="lp-info-grid">
            {INFO_ITEMS.map((item, i) => (
              <div className="lp-info-card" key={i}>
                <div className="lp-info-icon">{item.icon}</div>
                <div>
                  <div className="lp-info-title">{item.title}</div>
                  <div className="lp-info-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel dots */}
          <div className="lp-dots">
            {CAROUSEL_IMAGES.map((_, i) => (
              <button
                key={i}
                className={`lp-dot${i === currentSlide ? " active" : ""}`}
                onClick={() => goToSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ─── Right · Login Card ─── */}
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
                <ChefHat size={34} color="#eab308" />
              </div>
              <div className="lf-orbit-dot" />
              <div className="lf-orbit-dot-2" />
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="lf-title">Acceso Administrativo</div>
              <div className="lf-subtitle">Ingresa tus credenciales para continuar</div>
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
    </div>
  );
}

export function LoginForm() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginFormInner />
    </QueryClientProvider>
  );
}