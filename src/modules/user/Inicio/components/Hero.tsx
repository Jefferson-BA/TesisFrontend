// src/modules/user/Inicio/components/Hero.tsx
"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ChevronRight, Calendar, Sparkles, ChevronDown } from "lucide-react";
import { HeroButton } from "./HeroButton";
import { CounterNumber } from "./CounterNumber";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────
// CONFIG — todo el contenido vive aquí, nada hardcodeado en el JSX
// ─────────────────────────────────────────────────────────

const BACKGROUND_IMAGES = [
  { src: "/imageLanding/parrilla.avif", alt: "Parrilla premium", label: "Parrilla" },
  { src: "/imageLanding/criollo.avif", alt: "Cocina criolla", label: "Criollo" },
  { src: "/imageLanding/arabe.avif", alt: "Cocina árabe", label: "Árabe" },
] as const;

const SLIDE_DURATION = 9000;

const TITLE_WORDS = {
  line1: ["Servicio", "de", "Catering,"],
  line2: ["Eventos", "y", "Parrillas"],
};

const STATS = [
  { value: 500, prefix: "+", label: "Eventos Atendidos" },
  { value: 3, prefix: "", label: "Estilos de Cocina" },
] as const;

const EXTRA_STAT = { value: "100%", label: "A tu Medida" };

const CTAS = [
  {
    href: "/menu",
    variant: "primary" as const,
    label: "Ver Menú",
    icon: ChevronRight,
    iconClassName: "transition-transform group-hover:translate-x-1",
  },
  {
    href: "/reservas",
    variant: "secondary" as const,
    label: "Cotizar ahora",
    icon: Calendar,
    iconClassName: "text-ember",
  },
];

// Partículas ambientales tipo brasa — generadas, no una por una a mano.
const EMBER_PARTICLE_COUNT = 14;
const emberParticles = Array.from({ length: EMBER_PARTICLE_COUNT }, (_, i) => {
  // distribución pseudoaleatoria pero determinística (misma cada render/SSR)
  const seed = (i * 137.5) % 100; // ángulo áureo → dispersión pareja
  return {
    id: i,
    left: (seed).toFixed(2),
    delay: ((i % 7) * 0.6).toFixed(2),
    duration: (6 + (i % 5)).toFixed(2),
    size: i % 3 === 0 ? 3 : 2,
  };
});

// ─────────────────────────────────────────────────────────

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax sutil ligado al mouse
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mvY, { stiffness: 60, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    mvX.set(relX * 16);
    mvY.set(relY * 10);
  }, [mvX, mvY]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(
      () => setCurrentSlide((p) => (p + 1) % BACKGROUND_IMAGES.length),
      SLIDE_DURATION,
    );
    return () => clearInterval(timer);
  }, [isPaused]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Timings de reveal calculados, no números sueltos repetidos
  const wordDelays = useMemo(() => {
    const base = 0.15;
    const step = 0.09;
    const all = [...TITLE_WORDS.line1, ...TITLE_WORDS.line2];
    return all.map((_, i) => base + i * step);
  }, []);
  const line1Count = TITLE_WORDS.line1.length;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Carrusel de fondo */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="sync">
          {BACKGROUND_IMAGES.map((img, i) =>
            i === currentSlide ? (
              <motion.div
                key={img.src}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 0.65, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
                  style={{ animationPlayState: isPaused ? "paused" : "running" }}
                />
              </motion.div>
            ) : null,
          )}
        </AnimatePresence>
      </div>

      {/* Partículas ambientales (brasa/ceniza) */}
      <div className="absolute inset-0 z-[11] pointer-events-none overflow-hidden">
        {emberParticles.map((p) => (
          <span
            key={p.id}
            className="absolute bottom-0 rounded-full bg-ember/70 animate-ember-rise"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/35 to-background z-10" />

      {/* Contenido con parallax */}
      <motion.div
        className="relative z-20 text-center px-4 sm:px-6 max-w-5xl mx-auto"
        style={{ x: springX, y: springY }}
      >
        <motion.span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ember/10 border border-ember/30 text-ember text-xs font-black tracking-[0.2em] uppercase mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Sparkles className="w-3.5 h-3.5 animate-wiggle" />
          Experiencias Gastronómicas Premium
        </motion.span>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.15] text-foreground tracking-tight">
          <span className="block overflow-hidden">
            {TITLE_WORDS.line1.map((word, i) => (
              <span key={word} className="inline-block mr-3 overflow-hidden align-top">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: wordDelays[i], duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </span>
          <span className="block font-display italic font-normal text-ember">
            {TITLE_WORDS.line2.map((word, i) => (
              <span key={word} className="inline-block mr-3 overflow-hidden align-top">
                <motion.span
                  className="inline-block bg-gradient-to-r from-ember to-amber-300 bg-clip-text text-transparent"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: wordDelays[line1Count + i],
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </span>
        </h1>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {CTAS.map((cta) => {
            const Icon = cta.icon;
            return (
              <a key={cta.href} href={cta.href} className="w-full sm:w-auto group">
                <HeroButton variant={cta.variant} className="w-full">
                  {cta.label} <Icon className={cn("w-4 h-4", cta.iconClassName)} />
                </HeroButton>
              </a>
            );
          })}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-16 w-full max-w-3xl grid grid-cols-3 gap-2 sm:gap-6 p-4 sm:p-6 rounded-2xl backdrop-blur-md shadow-xl
    bg-[#0b0806]/80 dark:bg-card/80 border border-[#3d2c1f] dark:border-border
    bg-white/70 border-amber-200/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={cn("text-center", i < STATS.length - 1 && "border-r border-border")}
            >
              <h4 className="text-xl sm:text-3xl font-black text-ember font-display">
                {stat.prefix}
                <CounterNumber value={stat.value} />
              </h4>
              <p className="text-[9px] sm:text-xs text-muted-foreground uppercase tracking-widest mt-1">
                {stat.label}
              </p>
            </div>
          ))}
          <div className="text-center">
            <h4 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-ember to-amber-300 font-display">
              {EXTRA_STAT.value}
            </h4>
            <p className="text-[9px] sm:text-xs text-muted-foreground uppercase tracking-widest mt-1">
              {EXTRA_STAT.label}
            </p>
          </div>
        </motion.div>

        {/* Indicadores de estilo de cocina — controlan el carrusel, no decoran */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {BACKGROUND_IMAGES.map((img, i) => {
            const isActive = i === currentSlide;
            return (
              <button
                key={img.src}
                type="button"
                onClick={() => goToSlide(i)}
                aria-label={`Ver estilo ${img.label}`}
                aria-pressed={isActive}
                className="group relative flex flex-col items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 rounded-md px-1"
              >
                <span
                  className={cn(
                    "text-[10px] tracking-[0.15em] uppercase transition-colors",
                    isActive ? "text-ember font-bold" : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {img.label}
                </span>
                <span className="relative h-[3px] w-10 rounded-full bg-border/60 overflow-hidden">
                  {isActive && (
                    <motion.span
                      key={currentSlide}
                      className="absolute inset-y-0 left-0 bg-ember rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: isPaused ? "0%" : "100%" }}
                      transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-ember/40">
          Descubre más
        </span>
        <span className="relative h-8 w-px bg-border overflow-hidden">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-ember"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
};