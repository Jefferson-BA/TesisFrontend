import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { useLogin } from "../hooks/useLogin";
import { Loader2, Mail, Lock, ChefHat, Flame, Star, Clock, MapPin, ArrowRight } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const localQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const CAROUSEL_IMAGES = [
  { url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80", label: "Parrilla Tradicional Argentina" },
  { url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80", label: "Cortes Premium a la Brasa" },
  { url: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80", label: "Costillas de Cerdo BBQ" }
];

const INFO_ITEMS = [
  { icon: <Flame size={14} />, title: "DESDE 1998", desc: "Más de 25 años perfeccionando el arte de la parrilla." },
  { icon: <Star size={14} />, title: "4.9 ★ GOOGLE", desc: "Más de 2,000 reseñas de nuestros clientes satisfechos." },
  { icon: <Clock size={14} />, title: "HORARIO", desc: "Lunes a Domingo - 12:00 pm – 11:00 pm" },
  { icon: <MapPin size={14} />, title: "UBICACIÓN", desc: "Av. Principal 420, San Isidro - Lima, Perú" },
];

function LoginFormContent() {
  const { mutate: login, isPending } = useLogin();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
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
    <div className="lp-root select-none">
      <div className="lp-layout">
        
        {/* ── PANEL IZQUIERDO: MARCA E HISTORIA ── */}
        <div className="lp-info">
          <div className="lp-carousel">
            {CAROUSEL_IMAGES.map((img, i) => (
              <div
                key={i}
                className={`lp-slide ${i === currentSlide ? "active" : ""}`}
                style={{ backgroundImage: `url(${img.url})` }}
              />
            ))}
            <div className="lp-overlay" />
          </div>

          {/* Logotipo Corporativo */}
          <div className="lp-brand">
            <ChefHat size={36} className="lp-brand-icon" />
            <div>
              <h1 className="lp-brand-name">De Parras &amp; Pitz</h1>
              <p className="lp-brand-tagline">Parrilla &amp; Brasas</p>
            </div>
          </div>

          {/* Estado del Carrusel Dinámico */}
          <div className="lp-slide-label">
            <Flame size={14} className="animate-pulse" />
            <span>{CAROUSEL_IMAGES[currentSlide].label}</span>
          </div>

          {/* Grid de Información de pié */}
          <div className="space-y-5">
            <div className="lp-info-grid">
              {INFO_ITEMS.map((item, i) => (
                <div key={i} className="lp-info-card">
                  <span className="lp-info-icon">{item.icon}</span>
                  <div>
                    <h3 className="lp-info-title">{item.title}</h3>
                    <p className="lp-info-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            <div className="lp-dots">
              {CAROUSEL_IMAGES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  className={`lp-dot ${i === currentSlide ? "active" : ""}`}
                  aria-label={`Ir al slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── PANEL DERECHO: FORMULARIO MAQUETADO EXCLUSIVO ── */}
        <div className="lf-card">
          <div className="lf-spotlight" style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties} />
          <div className="lf-ring lf-ring-1" />
          <div className="lf-ring lf-ring-2" />

          {/* Encabezado del Formulario */}
          <div className="lf-header">
            <div className="lf-icon-bg">
              <ChefHat size={22} className="text-[var(--ember)]" />
            </div>
            <h2 className="lf-title">Iniciar sesión</h2>
            <p className="lf-subtitle">Ingresa tus credenciales para acceder al panel administrativo.</p>
          </div>

          {/* Cuerpo de Inputs */}
          <form onSubmit={handleSubmit(onSubmit)} className="lf-body">
            
            {/* Input Correo */}
            <div className={`lf-field ${focusedField === "email" ? "focused" : ""}`}>
              <label className="lf-label">Correo electrónico</label>
              <div className="lf-input-wrap">
                <Mail size={16} className="lf-input-icon" />
                <input
                  {...register("email")}
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

            {/* Input Contraseña */}
            <div className={`lf-field ${focusedField === "password" ? "focused" : ""}`}>
              <label className="lf-label">Contraseña</label>
              <div className="lf-input-wrap">
                <Lock size={16} className="lf-input-icon" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="lf-input"
                />
                <div className="lf-input-underline" />
              </div>
              {errors.password && <p className="lf-error">{errors.password.message}</p>}
            </div>

            {/* Botón de Envíos Estilizado */}
            <button type="submit" disabled={isPending} className="lf-submit">
              {isPending ? (
                <Loader2 size={18} className="animate-spin text-[var(--char-deep)]" />
              ) : (
                <div className="lf-submit-content">
                  <span>Ingresar al sistema</span>
                  <ArrowRight size={16} className="lf-submit-arrow" />
                </div>
              )}
            </button>
          </form>

          {/* Enlaces de pie de página */}
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