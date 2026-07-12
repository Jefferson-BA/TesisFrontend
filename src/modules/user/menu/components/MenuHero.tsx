"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
// 🟢 Agregamos UtensilsCrossed y Compass para los tipos de comida adicionales
import { Flame, Beef, Sparkles, UtensilsCrossed, Compass } from "lucide-react";
import { CounterNumber } from "./CounterNumber";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────
// CONFIG — todo el contenido vive aquí, nada hardcodeado en el JSX
// ─────────────────────────────────────────────────────────

const SLIDES = [
  {
    src: "/imageLanding/parrilla.avif",
    // 🟢 Cambiamos la ruta string 'thumb' por la referencia directa del Icono
    icon: Flame,
    alt: "Parrilla",
    kicker: "Sabor al fuego",
    quote: "La brasa perfecta no se apura, se domina.",
  },
  {
    src: "/imageLanding/criollo.avif",
    icon: UtensilsCrossed,
    alt: "Criollo",
    kicker: "Tradición peruana",
    quote: "Cada receta, una historia de familia.",
  },
  {
    src: "/imageLanding/arabe.avif",
    icon: Compass,
    alt: "Árabe",
    kicker: "Especias de oriente",
    quote: "Donde cada especia cuenta una ruta distinta.",
  },
] as const;

const SLIDE_DURATION = 7000;

const STATS = [
  { value: 500, prefix: "+", label: "Eventos", accent: true },
  { value: 3, prefix: "", label: "Estilos", accent: false },
] as const;

const EXTRA_STAT = { value: "100%", label: "A tu Medida" };

const FLOATING_ICONS = [
  { icon: Flame, position: "top-1/4 left-[6%]", delay: "0s" },
  { icon: Beef, position: "bottom-1/4 left-[10%]", delay: "1s" },
] as const;

const imageVariants: Record<string, any> = {
  enter: { opacity: 0, scale: 1.1, clipPath: "circle(0% at 50% 45%)" },
  center: {
    opacity: 1,
    scale: 1,
    clipPath: "circle(75% at 50% 45%)",
    transition: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 1,
    scale: 1.03,
    clipPath: "circle(75% at 50% 45%)",
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

const contentVariants: Record<string, any> = {
  enter: { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
};

// ─────────────────────────────────────────────────────────

export const MenuHero = () => {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const current = SLIDES[slide];
  const otherStyles = SLIDES.length - 1;

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const parallaxX = useSpring(useTransform(mvX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 60,
    damping: 20,
  });
  const parallaxY = useSpring(useTransform(mvY, [-0.5, 0.5], [-5, 5]), {
    stiffness: 60,
    damping: 20,
  });

  const tiltRotateX = useSpring(useTransform(mvY, [-0.5, 0.5], [9, -9]), {
    stiffness: 150,
    damping: 18,
  });
  const tiltRotateY = useSpring(useTransform(mvX, [-0.5, 0.5], [-11, 11]), {
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
    setPaused(false);
    mvX.set(0);
    mvY.set(0);
  }, [mvX, mvY]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSlide((p) => (p + 1) % SLIDES.length), SLIDE_DURATION);
    return () => clearInterval(t);
  }, [paused]);

  const goTo = useCallback((i: number) => {
    setSlide(i);
    setPaused(true);
  }, []);

  const revealDelay = useMemo(
    () => ({ badge: 0, title: 0.12, paragraph: 0.3, stats: 0.5, media: 0.25 }),
    [],
  );

  return (
    <header
      className="menu-hero relative min-h-screen flex items-center overflow-hidden px-4 pt-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={resetTilt}
      onMouseMove={handleMouseMove}
    >
      <div className="menu-hero-vignette" />

      {/* Íconos flotantes ambientales */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {FLOATING_ICONS.map(({ icon: Icon, position, delay }, i) => (
          <div
            key={i}
            className={cn("absolute p-3 rounded-full menu-hero-float-icon hidden md:block animate-bounce-soft", position)}
            style={{ animationDelay: delay }}
          >
            <Icon className="w-7 h-7" />
          </div>
        ))}
        <div className="absolute top-[18%] left-[22%] text-ember/40 hidden lg:block animate-glow-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center py-16 lg:py-0">
        {/* ───────────── Columna izquierda: texto ───────────── */}
        <motion.div style={{ x: parallaxX, y: parallaxY }} className="relative text-center lg:text-left">
          <motion.span
            className="menu-hero-badge"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: revealDelay.badge }}
          >
            <Flame className="w-3.5 h-3.5 animate-wiggle" />
            <span className="tracking-wide">Catering & Eventos de Lujo</span>
          </motion.span>

          <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-sans font-extrabold leading-[1.05] text-foreground">
            <span className="inline-block overflow-hidden align-top">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: revealDelay.title, ease: [0.22, 1, 0.36, 1] }}
              >
                Nuestro
              </motion.span>
            </span>
            <br />
            <span className="inline-block overflow-hidden align-top">
              <motion.span
                className="inline-block font-display italic font-normal menu-hero-title-accent"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: revealDelay.title + 0.09,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Menú
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mt-5 max-w-md mx-auto lg:mx-0 text-base text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: revealDelay.paragraph }}
          >
            Sinfonía de sabores exclusivos. Parrilla, cocina criolla y el misticismo de la gastronomía árabe.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="menu-hero-stats mt-12 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: revealDelay.stats }}
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="menu-hero-stat">
                <h4 className={cn("menu-hero-stat-value", !stat.accent && "menu-hero-stat-value-neutral")}>
                  {stat.prefix}
                  <CounterNumber value={stat.value} />
                </h4>
                <p className="menu-hero-stat-label">{stat.label}</p>
              </div>
            ))}
            <div className="menu-hero-stat">
              <h4 className="menu-hero-stat-value menu-hero-stat-value-gradient">
                {EXTRA_STAT.value}
              </h4>
              <p className="menu-hero-stat-label">{EXTRA_STAT.label}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* ───────────── Columna derecha: imagen 3D + cards flotantes ───────────── */}
        <motion.div
          className="relative h-[400px] sm:h-[500px] lg:h-[calc(100vh-13rem)] lg:max-h-[760px] lg:min-h-[560px]"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: revealDelay.media, ease: [0.22, 1, 0.36, 1] }}
        >
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
              className="menu-hero-media-frame hero-media-frame"
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
                  loading={slide === 0 ? "eager" : "lazy"}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="menu-hero-media-image"
                />
              </AnimatePresence>
              <div className="menu-hero-media-overlay" />
              <div className="hero-glass-sheen" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.src}
                  className="menu-hero-quote-card"
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <span className="menu-hero-quote-kicker">{current.kicker}</span>
                  <p>{current.quote}</p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Bento de thumbnails flotando sobre la imagen */}
          <motion.div
            className="menu-hero-thumb-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {SLIDES.map((img, i) => {
              const isActive = i === slide;
              const ThumbIcon = img.icon; // 🟢 Obtenemos el componente de icono dinámico

              return (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Ver estilo ${img.alt}`}
                  aria-pressed={isActive}
                  className={cn("menu-hero-thumb", isActive && "menu-hero-thumb-active")}
                >
                  {/* 🟢 Reemplazamos la etiqueta <img> por un contenedor flex para el icono */}
                  <span className="menu-hero-thumb-image-wrap flex items-center justify-center bg-black/50 backdrop-blur-md rounded-lg border border-white/10">
                    <ThumbIcon 
                      className={cn(
                        "w-5 h-5 transition-transform duration-300", 
                        isActive ? "text-amber-500 scale-110" : "text-zinc-400"
                      )} 
                    />
                  </span>
                  <span className="menu-hero-thumb-meta">
                    <span className={cn(
                      "menu-hero-thumb-label truncate font-medium transition-colors",
                      isActive ? "text-amber-500" : "text-zinc-300"
                    )}>
                      {img.alt}
                    </span>
                    <span className="menu-hero-progress-track">
                      {isActive && (
                        <motion.span
                          key={`${i}-${paused}`}
                          className="menu-hero-progress-fill"
                          initial={{ width: "0%" }}
                          animate={{ width: paused ? "100%" : "100%" }}
                          transition={{
                            duration: paused ? 0.4 : SLIDE_DURATION / 1000,
                            ease: paused ? "easeOut" : "linear",
                          }}
                        />
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground z-20 flex flex-col items-center gap-1.5 cursor-pointer bg-transparent border-none outline-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <span className="text-[9px] tracking-[0.3em] uppercase text-ember/40">Explorar</span>
        <span className="relative h-8 w-px bg-border overflow-hidden">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-ember"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.button>
    </header>
  );
};