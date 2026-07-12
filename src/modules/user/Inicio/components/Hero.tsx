"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
// Importamos los nuevos iconos de comida/estilo aquí 👇
import { ChevronRight, Calendar, Sparkles, Quote, Flame, UtensilsCrossed, Compass } from "lucide-react";
import { HeroButton } from "./HeroButton";
import { CounterNumber } from "./CounterNumber";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────
// CONFIG — todo el contenido vive aquí, nada hardcodeado en el JSX
// ─────────────────────────────────────────────────────────

const BACKGROUND_IMAGES = [
  {
    src: "/imageLanding/parrilla.avif",
    // Cambiamos 'thumb' por una referencia al componente del Icono 👇
    icon: Flame,
    alt: "Parrilla premium",
    label: "Parrilla",
    kicker: "Sabor al fuego",
    title1: "Parrilla",
    title2: "Premium",
    description:
      "Cortes seleccionados y brasa lenta para eventos que se recuerdan por el sabor.",
    quote: "La brasa perfecta no se apura, se domina.",
    ctaLabel: "Ver menú de parrilla",
    ctaHref: "/menu?estilo=parrilla",
  },
  {
    src: "/imageLanding/criollo.avif",
    icon: UtensilsCrossed,
    alt: "Cocina criolla",
    label: "Criollo",
    kicker: "Tradición peruana",
    title1: "Cocina",
    title2: "Criolla",
    description:
      "Recetas de siempre, reinventadas para tu evento con la calidez de casa.",
    quote: "Cada receta, una historia de familia.",
    ctaLabel: "Ver menú criollo",
    ctaHref: "/menu?estilo=criollo",
  },
  {
    src: "/imageLanding/arabe.avif",
    icon: Compass, // Ideal para simular la ruta de las especias / oriente
    alt: "Cocina árabe",
    label: "Árabe",
    kicker: "Especias de oriente",
    title1: "Cocina",
    title2: "Árabe",
    description:
      "Un viaje de especias y texturas para sorprender a tus invitados.",
    quote: "Donde cada especia cuenta una ruta distinta.",
    ctaLabel: "Ver menú árabe",
    ctaHref: "/menu?estilo=arabe",
  },
] as const;

const SLIDE_DURATION = 8000;

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
    iconClassName: "",
  },
];

// Cambiamos : Variants por : Record<string, any>
const textContainerVariants: Record<string, any> = {
  enter: {},
  center: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  exit: {},
};

const textItemVariants: Record<string, any> = {
  enter: { opacity: 0, y: 22, filter: "blur(6px)" },
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -14, filter: "blur(4px)" },
};

const imageVariants: Record<string, any> = {
  enter: { opacity: 0, scale: 1.1, clipPath: "circle(0% at 50% 45%)" },
  center: {
    opacity: 1,
    scale: 1,
    clipPath: "circle(75% at 50% 45%)",
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 1,
    scale: 1.03,
    clipPath: "circle(75% at 50% 45%)",
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

const quoteVariants: Record<string, any> = {
  enter: { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.45 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
};

// ─────────────────────────────────────────────────────────

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const current = BACKGROUND_IMAGES[currentSlide];
  const otherStyles = BACKGROUND_IMAGES.length - 1;

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const parallaxX = useSpring(useTransform(mvX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 60,
    damping: 20,
  });
  const parallaxY = useSpring(useTransform(mvY, [-0.5, 0.5], [-6, 6]), {
    stiffness: 60,
    damping: 20,
  });

  const tiltRotateX = useSpring(useTransform(mvY, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 18,
  });
  const tiltRotateY = useSpring(useTransform(mvX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 150,
    damping: 18,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      mvX.set(relX);
      mvY.set(relY);

      if (frameRef.current) {
        const fr = frameRef.current.getBoundingClientRect();
        const px = ((e.clientX - fr.left) / fr.width) * 100;
        const py = ((e.clientY - fr.top) / fr.height) * 100;
        frameRef.current.style.setProperty("--mx", `${px}%`);
        frameRef.current.style.setProperty("--my", `${py}%`);
      }
    },
    [mvX, mvY],
  );

  const resetTilt = useCallback(() => {
    setIsPaused(false);
    mvX.set(0);
    mvY.set(0);
  }, [mvX, mvY]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(
      () => setCurrentSlide((p) => (p + 1) % BACKGROUND_IMAGES.length),
      SLIDE_DURATION,
    );
    return () => clearInterval(timer);
  }, [isPaused]);

  const goToSlide = useCallback((index: number) => setCurrentSlide(index), []);

  return (
    <section
      ref={sectionRef}
      className="hero-section relative min-h-screen flex items-center overflow-hidden bg-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={resetTilt}
      onMouseMove={handleMouseMove}
    >
      <div className="hero-vignette" />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center py-28 lg:py-0">
        {/* Columna izquierda: texto */}
        <motion.div style={{ x: parallaxX, y: parallaxY }} className="relative">
          <motion.span
            className="hero-badge"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Experiencias Gastronómicas Premium
          </motion.span>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.src}
              variants={textContainerVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="mt-6"
            >
              <motion.span variants={textItemVariants} className="hero-kicker block">
                {current.kicker}
              </motion.span>
              <motion.h1
                variants={textItemVariants}
                className="mt-2 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-foreground tracking-tight"
              >
                {current.title1}
                <br />
                <span className="font-display italic font-normal hero-title-accent">
                  {current.title2}
                </span>
              </motion.h1>
              <motion.p
                variants={textItemVariants}
                className="mt-5 max-w-md text-base text-muted-foreground leading-relaxed"
              >
                {current.description}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {CTAS.map((cta) => {
              const Icon = cta.icon;
              return (
                <a key={cta.href} href={cta.href} className="group">
                  <HeroButton variant={cta.variant}>
                    {cta.label} <Icon className={cn("w-4 h-4", cta.iconClassName)} />
                  </HeroButton>
                </a>
              );
            })}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="hero-stats mt-14"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="hero-stat">
                <h4 className="hero-stat-value">
                  {stat.prefix}
                  <CounterNumber value={stat.value} />
                </h4>
                <p className="hero-stat-label">{stat.label}</p>
              </div>
            ))}
            <div className="hero-stat">
              <h4 className="hero-stat-value hero-stat-value-gradient">
                {EXTRA_STAT.value}
              </h4>
              <p className="hero-stat-label">{EXTRA_STAT.label}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Columna derecha: imagen 3D + cards flotantes */}
        <div className="relative h-[440px] sm:h-[560px] lg:h-[calc(100vh-11rem)] lg:max-h-[820px] lg:min-h-[600px]">
          <div className="hero-media-wrap">
            {Array.from({ length: otherStyles }).map((_, i) => (
              <div
                key={`stack-${i}`}
                className="hero-stack-card"
                style={{ "--stack-i": i + 1 } as React.CSSProperties}
                aria-hidden="true"
              />
            ))}

            <motion.div
              ref={frameRef}
              className="hero-media-frame"
              style={{
                rotateX: tiltRotateX,
                rotateY: tiltRotateY,
              }}
            >
              <AnimatePresence mode="sync">
                <motion.img
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  loading={currentSlide === 0 ? "eager" : "lazy"}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="hero-media-image"
                />
              </AnimatePresence>
              <div className="hero-media-overlay" />
              <div className="hero-glass-sheen" />

              {/* Quote flotante */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.src}
                  className="hero-quote-card"
                  variants={quoteVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <Quote className="w-4 h-4 hero-quote-icon" />
                  <p>{current.quote}</p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Bento de thumbnails */}
          <motion.div
            className="hero-thumb-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {BACKGROUND_IMAGES.map((img, i) => {
              const isActive = i === currentSlide;
              const ThumbIcon = img.icon; // Instanciamos el icono dinámico aquí 👇

              return (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => goToSlide(i)}
                  aria-label={`Ver estilo ${img.label}`}
                  aria-pressed={isActive}
                  className={cn("hero-thumb", isActive && "hero-thumb-active")}
                >
                  {/* Contenedor del Icono reemplazando el <img> roto */}
                  <span className="hero-thumb-image-wrap flex items-center justify-center bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
                    <ThumbIcon 
                      className={cn(
                        "w-5 h-5 transition-transform duration-300", 
                        isActive ? "text-amber-400 scale-110" : "text-zinc-400"
                      )} 
                    />
                    <span className="hero-thumb-shine" />
                  </span>
                  <span className="hero-thumb-meta">
                    <span className={cn(
                      "hero-thumb-label truncate font-medium transition-colors",
                      isActive ? "text-amber-400" : "text-zinc-300"
                    )}>
                      {img.label}
                    </span>
                    <span className="hero-progress-track">
                      {isActive && (
                        <motion.span
                          key={`${i}-${isPaused}`}
                          className="hero-progress-fill"
                          initial={{ width: "0%" }}
                          animate={{ width: isPaused ? "0%" : "100%" }}
                          transition={{
                            duration: isPaused ? 0 : SLIDE_DURATION / 1000,
                            ease: "linear",
                          }}
                        />
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase hero-scroll-label">
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