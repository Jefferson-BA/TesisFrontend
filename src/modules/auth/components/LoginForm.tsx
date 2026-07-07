import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { useLogin } from "../hooks/useLogin";
import { Loader2, Mail, Lock, ChefHat, Flame, Star, Clock, MapPin, ArrowRight, Eye, EyeOff, type LucideIcon } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, useEffect, useRef, useCallback, type MouseEvent } from "react";

const localQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const SLIDE_DURATION_MS = 5000;

const CAROUSEL_IMAGES = [
  { url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80", label: "Parrilla Tradicional Argentina" },
  { url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80", label: "Cortes Premium a la Brasa" },
  { url: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80", label: "Costillas de Cerdo BBQ" },
];

type InfoItem = { icon: LucideIcon; title: string; desc: string };

const INFO_ITEMS: InfoItem[] = [
  { icon: Flame, title: "DESDE 1998", desc: "Más de 25 años perfeccionando el arte de la parrilla." },
  { icon: Star, title: "4.9 ★ GOOGLE", desc: "Más de 2,000 reseñas de nuestros clientes satisfechos." },
  { icon: Clock, title: "HORARIO", desc: "Lunes a Domingo · 12:00 pm – 11:00 pm" },
  { icon: MapPin, title: "UBICACIÓN", desc: "Av. Principal 420, San Isidro - Lima, Perú" },
];

let rippleSeq = 0;
type Ripple = { id: number; x: number; y: number };

function LoginFormContent() {
  const { mutate: login, isPending } = useLogin();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, []);

  // .lf-spotlight in globals.css already reads var(--mx)/var(--my), and
  // :root already declares them — but nothing was ever setting them locally,
  // so the glow silently sat frozen at the global 50%/50% default. This
  // drives them from the real cursor position on the card.
  const handlePointerMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  // globals.css already ships .lf-submit-ripple + @keyframes lf-ripple —
  // this just triggers it at the real click coordinates and cleans up after.
  const handleSubmitRipple = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple: Ripple = { id: rippleSeq++, x: e.clientX - rect.left, y: e.clientY - rect.top };
    setRipples((prev) => [...prev, ripple]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
    }, 600);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => toast.success("¡Bienvenido al sistema! 🔥"),
      onError: () => toast.error("Credenciales incorrectas"),
    });
  };

  return (
   
    <div className="lp-root dark select-none">
      <div className="lp-layout">

        {/* ── PANEL IZQUIERDO: MARCA E HISTORIA ── */}
        <div className="lp-info">
          <div className="lp-carousel">
            {CAROUSEL_IMAGES.map((img, i) => (
              <div
                key={img.url}
                className={`lp-slide ${i === currentSlide ? "active" : ""}`}
                style={{ backgroundImage: `url(${img.url})` }}
              />
            ))}
            <div className="lp-overlay" />
          </div>

          <div className="lp-brand">
            <ChefHat size={36} className="lp-brand-icon" />
            <div>
              <h1 className="lp-brand-name">De Parras &amp; Pitz</h1>
              <p className="lp-brand-tagline">Parrilla &amp; Brasas</p>
            </div>
          </div>

          <div className="lp-slide-label">
            <Flame size={14} />
            <span>{CAROUSEL_IMAGES[currentSlide].label}</span>
          </div>

          <div className="space-y-5">
            <div className="lp-info-grid">
              {INFO_ITEMS.map((item) => (
                <div key={item.title} className="lp-info-card">
                  <span className="lp-info-icon">
                    <item.icon size={14} />
                  </span>
                  <div>
                    <h3 className="lp-info-title">{item.title}</h3>
                    <p className="lp-info-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lp-dots">
              {CAROUSEL_IMAGES.map((img, i) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  className={`lp-dot ${i === currentSlide ? "active" : ""}`}
                  aria-label={`Ir al slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── PANEL DERECHO: FORMULARIO ── */}
        <div className="lf-card" ref={cardRef} onMouseMove={handlePointerMove}>
          <div className="lf-spotlight" />
          <div className="lf-ring lf-ring-1" />
          <div className="lf-ring lf-ring-2" />

          <div className="lf-header">
            <div className="lf-icon-bg">
              <ChefHat size={22} className="text-[var(--ember)]" />
            </div>
            <h2 className="lf-title">Iniciar sesión</h2>
            <p className="lf-subtitle">Ingresa tus credenciales para acceder al panel administrativo.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="lf-body">

            <div className={`lf-field ${focusedField === "email" ? "focused" : ""}`}>
              <label className="lf-label" htmlFor="email">Correo electrónico</label>
              <div className="lf-input-wrap">
                <Mail size={16} className="lf-input-icon" />
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="usuario@deparraspitz.com"
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="lf-input"
                />
                <div className="lf-input-underline" />
              </div>
              {errors.email && <p className="lf-error">{errors.email.message}</p>}
            </div>

            <div className={`lf-field ${focusedField === "password" ? "focused" : ""}`}>
              <label className="lf-label" htmlFor="password">Contraseña</label>
              <div className="lf-input-wrap">
                <Lock size={16} className="lf-input-icon" />
                <input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="lf-input pr-10"
                />
                <button
                  type="button"
                  className="lf-toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <div className="lf-input-underline" />
              </div>
              {errors.password && <p className="lf-error">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="lf-submit"
              onClick={handleSubmitRipple}
            >
              {ripples.map((r) => (
                <span
                  key={r.id}
                  className="lf-submit-ripple"
                  style={{ left: r.x, top: r.y }}
                />
              ))}
              {isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <div className="lf-submit-content">
                  <span>Ingresar al sistema</span>
                  <ArrowRight size={16} className="lf-submit-arrow" />
                </div>
              )}
            </button>
          </form>

          <div className="lf-footer">
            <p className="lf-footer-text">
              ¿No tienes una cuenta?{" "}
              <a href="/register" className="lf-footer-link">Regístrate</a>
            </p>
            <div className="lf-security">
              <span className="lf-security-dot" />
              <span>Conexión segura · SSL encriptado</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export function LoginForm() {
  return (
    <QueryClientProvider client={localQueryClient}>
      <LoginFormContent />
    </QueryClientProvider>
  );
}