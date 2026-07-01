"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight, Calendar, Sparkles, ChevronDown } from "lucide-react";

const BACKGROUND_IMAGES = [
  { src: "/imageLanding/parrilla.avif", alt: "Parrilla premium DeParraSpitz", label: "Parrilla" },
  { src: "/imageLanding/criollo.avif", alt: "Cocina criolla DeParraSpitz", label: "Criollo" },
  { src: "/imageLanding/arabe.avif", alt: "Cocina árabe DeParraSpitz", label: "Árabe" },
] as const;

const SLIDE_DURATION_MS = 9000;

const STATS = [
  { value: 500, prefix: "+", label: "Eventos Atendidos" },
  { value: 3, prefix: "", label: "Estilos de Cocina" },
] as const;

const TITLE_LINE_1 = ["Servicio", "de", "Catering,"];
const TITLE_LINE_2 = ["Eventos", "y", "Parrillas"];

// ─── Contador animado (IntersectionObserver, sin dependencias externas) ───
const CounterNumber = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const duration = 1800;
        const start = performance.now();
        let raf: number;

        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          setCount(Math.round(eased * value));
          if (progress < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{count}</span>;
};

// ─── Botón de acción — hover/active 100% Tailwind, sin tracking de mouse ───
const HeroButton = ({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) => {
  const base =
    "group relative w-full sm:w-auto font-bold px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer overflow-hidden active:scale-[0.96]";

  const styles =
    variant === "primary"
      ? "bg-ember hover:brightness-110 text-char-deep shadow-[0_4px_20px_color-mix(in_oklch,var(--ember)_30%,transparent)] hover:shadow-[0_4px_28px_color-mix(in_oklch,var(--ember)_55%,transparent)] hover:-translate-y-0.5"
      : "bg-char/40 backdrop-blur-md border border-char hover:border-ember/50 text-white font-semibold hover:bg-char/60 hover:-translate-y-0.5";

  return (
    <button className={`${base} ${styles}`}>
      {variant === "primary" && (
        <span
          className="absolute inset-0 pointer-events-none bg-[linear-gradient(115deg,transparent_30%,color-mix(in_oklch,white_50%,transparent)_50%,transparent_70%)] animate-shimmer"
          aria-hidden="true"
        />
      )}
      <span className="relative flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-0.5">
        {children}
      </span>
    </button>
  );
};

export const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [isPaused]);

  const goToSlide = useCallback((index: number) => setCurrentImageIndex(index), []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-char-deep"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* CARRUSEL DE FONDO — crossfade + Ken Burns, next/image optimizado */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {BACKGROUND_IMAGES.map((image, index) => (
          <div
            key={image.src}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              index === currentImageIndex ? "opacity-65 z-10" : "opacity-0 z-0"
            }`}
          >
            <div
              key={`${image.src}-${index === currentImageIndex ? currentImageIndex : "idle"}`}
              className={`absolute inset-0 ${
                index === currentImageIndex ? "animate-ken-burns" : ""
              } ${isPaused ? "[animation-play-state:paused]" : ""}`}
              style={
                index === currentImageIndex
                  ? { animationDuration: `${SLIDE_DURATION_MS}ms` }
                  : undefined
              }
            >
              <img
                src={image.src}
                alt={image.alt}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index === 0 ? "high" : "auto"}
                sizes="100vw"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Overlay oscuro para contraste del texto */}
      <div className="absolute inset-0 bg-gradient-to-b from-char-deep/60 via-char-deep/35 to-char-deep z-10" />

      {/* Textura de grano */}
      <div className="grain-overlay z-10" />

      {/* Indicadores del carrusel */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-2.5 z-20 hidden sm:flex">
        {BACKGROUND_IMAGES.map((image, index) => {
          const isActive = index === currentImageIndex;
          return (
            <button
              key={image.src}
              onClick={() => goToSlide(index)}
              className={`relative w-2 rounded-full overflow-hidden bg-white/20 hover:bg-white/40 transition-all duration-500 cursor-pointer ${
                isActive ? "h-7" : "h-2"
              }`}
              aria-label={`Ir a la imagen ${image.label}`}
            >
              {isActive && (
                <span
                  key={currentImageIndex}
                  className={`absolute inset-x-0 top-0 bg-ember rounded-full origin-top animate-progress ${
                    isPaused ? "[animation-play-state:paused]" : ""
                  }`}
                  style={{ animationDuration: `${SLIDE_DURATION_MS}ms` }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Contenido principal */}
      <div className="relative z-20 text-center px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center">

        {/* Kicker */}
        <span className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ember/10 border border-ember/30 text-ember text-xs font-black tracking-[0.2em] uppercase mb-6 animate-fade-in-up">
          <Sparkles className="w-3.5 h-3.5 animate-wiggle" />
          Experiencias Gastronómicas Premium
        </span>

        {/* Título — revelado palabra por palabra con delays escalonados */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-sans font-extrabold leading-[1.15] text-white tracking-tight drop-shadow-[0_4px_15px_rgba(0,0,0,0.95)]">
          <span className="block">
            {TITLE_LINE_1.map((word, i) => (
              <span
                key={word}
                className="inline-block mr-3 animate-fade-in-up"
                style={{ animationDelay: `${150 + i * 90}ms` }}
              >
                {word}
              </span>
            ))}
          </span>
          <span className="block font-display italic font-normal text-ember">
            {TITLE_LINE_2.map((word, i) => (
              <span
                key={word}
                className="inline-block mr-3 bg-[linear-gradient(90deg,var(--ember),color-mix(in_oklch,var(--ember)_65%,white))] bg-clip-text text-transparent animate-fade-in-up"
                style={{ animationDelay: `${150 + (TITLE_LINE_1.length + i) * 90}ms` }}
              >
                {word}
              </span>
            ))}
          </span>
        </h1>

        {/* Descripción */}
        <p
          className="mt-6 text-white/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md animate-fade-in-up"
          style={{ animationDelay: "550ms" }}
        >
          Transformamos tus celebraciones en momentos inolvidables. Buffets
          exclusivos, carnes premium y una atención impecable diseñada a tu
          medida.
        </p>

        {/* Botones */}
        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-fade-in-up"
          style={{ animationDelay: "700ms" }}
        >
          <HeroButton variant="primary">
            Ver Menú
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </HeroButton>

          <HeroButton variant="secondary">
            <Calendar className="w-4 h-4 text-ember" />
            Cotizar ahora
          </HeroButton>
        </div>

        {/* Franja de cifras */}
        <div
          className="relative z-20 mt-16 w-full max-w-3xl grid grid-cols-3 gap-2 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-char-deep/80 border border-char backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.7)] transition-colors duration-500 hover:border-ember/35 animate-fade-in-up"
          style={{ animationDelay: "850ms" }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center border-r border-char">
              <h4 className="text-xl sm:text-3xl font-black text-ember font-display">
                {stat.prefix}
                <CounterNumber value={stat.value} />
              </h4>
              <p className="text-[9px] sm:text-xs text-white/60 uppercase tracking-widest mt-1">
                {stat.label}
              </p>
            </div>
          ))}
          <div className="text-center">
            <h4 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-[linear-gradient(90deg,var(--ember),color-mix(in_oklch,var(--ember)_70%,white))] font-display">
              100%
            </h4>
            <p className="text-[9px] sm:text-xs text-white/60 uppercase tracking-widest mt-1">
              A tu Medida
            </p>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 z-20 animate-fade-in"
        style={{ animationDelay: "1200ms" }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-ember/40">
          Descubre más
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce-soft" />
      </div>

      {/* Línea inferior difuminada */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-char to-transparent z-20" />
    </section>
  );
};