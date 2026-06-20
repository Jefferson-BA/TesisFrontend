import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schema";
import { useSignup } from "../hooks/useSignup";
import { Loader2, Mail, Lock, User, Phone, UserPlus, ChefHat, Flame, Star, Clock, MapPin } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";

const queryClient = new QueryClient();

const CAROUSEL_IMAGES = [
  { url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&q=80", label: "Cortes Premium a la Brasa" },
  { url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=1600&q=80", label: "Parrilla Tradicional Argentina" },
  { url: "https://images.unsplash.com/photo-1558030006-450675393462?w=1600&q=80", label: "Costillas de Cerdo BBQ" },
  { url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80", label: "Brochetas Artesanales" },
  { url: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=1600&q=80", label: "Entrañas al Carbón" },
];

const INFO_ITEMS = [
  { icon: <Flame size={16} />, title: "Desde 1998", desc: "Más de 25 años perfeccionando el arte de la parrilla" },
  { icon: <Star size={16} />, title: "4.9 ★ Google", desc: "Más de 2,000 reseñas de nuestros clientes satisfechos" },
  { icon: <Clock size={16} />, title: "Horario", desc: "Lunes a Domingo · 12:00 pm – 11:00 pm" },
  { icon: <MapPin size={16} />, title: "Ubicación", desc: "Av. Principal 420, San Isidro · Lima, Perú" },
];

function RegisterFormInner() {
  const { mutate: signup, isPending } = useSignup();
  const [focused, setFocused] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
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

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    signup(data, {
      onSuccess: () => toast.success("¡Cuenta creada con éxito! 🎉"),
      onError: () => toast.error("Error al registrar usuario"),
    });
  };

  return (
    <div className="min-h-screen w-full bg-[var(--char-deep)] text-foreground grid grid-cols-1 lg:grid-cols-2">
      
      {/* ─── COLUMNA IZQUIERDA: CARRUSEL E INFO ─── */}
      <div className="relative isolate flex min-h-[50vh] flex-col justify-between gap-8 overflow-hidden px-8 py-10 text-white sm:px-12 lg:min-h-screen lg:px-14 lg:py-14 bg-[var(--char-deep)]">
        
        {/* Imágenes del Carrusel */}
        <div className="absolute inset-0 -z-10 bg-black" aria-hidden="true">
          {CAROUSEL_IMAGES.map((img, i) => (
            <div
              key={i}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                i === currentSlide ? "opacity-40 scale-100" : "opacity-0 scale-105"
              }`}
              style={{ backgroundImage: `url(${img.url})` }}
            />
          ))}
          {/* Degradado superpuesto (Overlay) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--char-deep)]/80 via-[var(--char-deep)]/40 to-[var(--char-deep)]" />
        </div>

        {/* Marca */}
        <div className="flex items-center gap-3">
          <ChefHat size={36} className="text-[var(--ember)]" />
          <div>
            <div className="font-display text-[1.65rem] font-bold leading-tight tracking-tight sm:text-3xl text-white">De Parras &amp; Pitz</div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ember)]/85">Parrilla &amp; Brasas</div>
          </div>
        </div>

        {/* Label Dinámico del Slide */}
        <div className="flex items-center gap-2 self-start text-[13px] font-medium text-white/70 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10 transition-all">
          <Flame size={14} className="text-[var(--ember)] animate-pulse" />
          <span>{CAROUSEL_IMAGES[currentSlide].label}</span>
        </div>

        {/* Grid de Información Inferior */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 border-t border-white/12 pt-6 sm:grid-cols-2">
            {INFO_ITEMS.map((item, i) => (
              <div className="flex items-start gap-2.5" key={i}>
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-[var(--ember)]/75">{item.icon}</div>
                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-wide text-white/85">{item.title}</div>
                  <div className="mt-0.5 text-[12.5px] leading-snug text-white/50">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicadores de Páginas (Dots) */}
          <div className="flex items-center gap-2">
            {CAROUSEL_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "w-8 bg-[var(--ember)]" : "w-2 bg-white/20"}`}
                aria-label={`Ir al slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── COLUMNA DERECHA: FORMULARIO ─── */}
      <div 
        onMouseMove={handleMouseMove}
        className="relative flex flex-col justify-center overflow-hidden px-6 py-14 sm:px-10 lg:px-16 bg-gradient-to-tr from-[var(--card)] via-[var(--card)] to-[var(--ember)]/5"
      >
        {/* Efecto Spotlight dinámico */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-0 lg:opacity-100 transition-opacity duration-300"
          style={{ background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, var(--ember-glow), transparent 70%)` }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--ember)]/20 bg-[var(--ember)]/10 text-[var(--ember)]">
              <UserPlus size={24} />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">Crear Cuenta</h2>
              <p className="text-sm text-muted-foreground mt-1">Regístrate para acceder al panel administrativo</p>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {[
              { id: "name", label: "Nombre completo", type: "text", placeholder: "Tu nombre y apellido", icon: <User size={18} /> },
              { id: "phone", label: "Número de celular", type: "tel", placeholder: "Ej: 987654321", icon: <Phone size={18} /> },
              { id: "email", label: "Correo electrónico", type: "email", placeholder: "usuario@deparraspitz.com", icon: <Mail size={18} /> },
              { id: "password", label: "Contraseña", type: "password", placeholder: "••••••••", icon: <Lock size={18} /> },
              { id: "confirmPassword", label: "Confirmar contraseña", type: "password", placeholder: "••••••••", icon: <Lock size={18} /> },
            ].map((field) => (
              <div key={field.id} className="flex flex-col gap-1.5">
                <label className={`text-xs font-semibold transition-colors ${focused === field.id ? "text-[var(--ember-deep)]" : "text-foreground"}`}>
                  {field.label}
                </label>
                <div className="relative flex items-center">
                  <span className={`absolute left-3 transition-colors ${focused === field.id ? "text-[var(--ember)]" : "text-muted-foreground"}`}>
                    {field.icon}
                  </span>
                  <input
                    {...register(field.id as keyof RegisterFormData)}
                    type={field.type}
                    placeholder={field.placeholder}
                    onFocus={() => setFocused(field.id)}
                    onBlur={() => setFocused(null)}
                    className="h-11 w-full rounded-xl border border-border/60 bg-muted/20 pl-10 pr-4 text-sm text-foreground outline-none transition-all focus:border-[var(--ember)] focus:ring-4 focus:ring-[var(--ember)]/10"
                  />
                </div>
                {errors[field.id as keyof RegisterFormData] && (
                  <span className="text-xs font-medium text-destructive">{errors[field.id as keyof RegisterFormData]?.message}</span>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isPending}
              className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-[var(--ember)] text-sm font-semibold text-[var(--char-deep)] hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? <Loader2 size={18} className="animate-spin" /> : "Registrarme"}
            </button>
          </form>

          {/* Footer */}
          <div className="flex flex-col items-start gap-4 border-t border-border/40 pt-4">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <a href="/login" className="font-semibold text-[var(--ember-deep)] hover:underline">Inicia sesión</a>
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Conexión segura · SSL encriptado
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export function RegisterForm() {
  return (
    <QueryClientProvider client={queryClient}>
      <RegisterFormInner />
    </QueryClientProvider>
  );
}