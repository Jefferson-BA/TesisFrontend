// src/modules/user/menu/components/MenuHero.tsx

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Flame, Utensils, Beef, Sparkles, ChevronDown } from "lucide-react";
import { CounterNumber } from "./CounterNumber";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────

const SLIDES = [
  { src: "/imageLanding/parrilla.avif", alt: "Parrilla" },
  { src: "/imageLanding/criollo.avif", alt: "Criollo" },
  { src: "/imageLanding/arabe.avif", alt: "Árabe" },
] as const;

const SLIDE_DURATION = 7000;

const STATS = [
  { value: 500, prefix: "+", label: "Eventos", accent: true },
  { value: 3, prefix: "", label: "Estilos", accent: false },
] as const;

const EXTRA_STAT = { value: "100%", label: "A tu Medida" };

const FLOATING_ICONS = [
  {
    icon: Flame,
    position: "top-1/4 left-[10%]",
    bg: "bg-ember/10 border-ember/30",
    iconClass: "text-ember/60",
    delay: "0s",
  },
  {
    icon: Beef,
    position: "bottom-1/3 right-[12%]",
    bg: "bg-amber-500/10 border-amber-500/20",
    iconClass: "text-amber-500/50",
    delay: "1s",
  },
] as const;

export const MenuHero = () => {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mvY, { stiffness: 60, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      mvX.set(relX * 14);
      mvY.set(relY * 8);
    },
    [mvX, mvY],
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSlide((p) => (p + 1) % SLIDES.length), SLIDE_DURATION);
    return () => clearInterval(t);
  }, [paused]);

  // Delays de reveal calculados, no repetidos a mano
  const revealDelay = useMemo(
    () => ({ badge: 0, title: 0.12, paragraph: 0.3, stats: 0.45, scroll: 0.65 }),
    [],
  );

  return (
    <header
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Carrusel */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {SLIDES.map((img, i) => (
          <div
            key={img.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1500ms]",
              i === slide ? "opacity-65 z-10" : "opacity-0 z-0",
            )}
          >
            <div
              className={cn("absolute inset-0", i === slide && "animate-ken-burns")}
              style={{ animationPlayState: paused ? "paused" : "running" }}
            >
              <img src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        ))}
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--background)_95%)] dark:bg-[radial-gradient(circle_at_center,transparent_20%,var(--char-deep)_95%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background dark:from-char-deep/60 dark:via-char-deep/30 dark:to-char-deep z-10" />

      {/* Indicadores con tooltip del estilo */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-2.5 z-20 hidden sm:flex">
        {SLIDES.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setSlide(i)}
            aria-label={`Ver estilo ${img.alt}`}
            aria-pressed={i === slide}
            className="group/dot relative flex items-center justify-end"
          >
            <span
              className={cn(
                "pointer-events-none absolute right-full mr-2.5 whitespace-nowrap rounded-full bg-card/90 border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground opacity-0 translate-x-1 transition-all duration-200 group-hover/dot:opacity-100 group-hover/dot:translate-x-0",
              )}
            >
              {img.alt}
            </span>
            <span
              className={cn(
                "relative w-2 rounded-full overflow-hidden bg-foreground/20 group-hover/dot:bg-foreground/40 transition-all cursor-pointer",
                i === slide ? "h-7" : "h-2",
              )}
            >
              {i === slide && (
                <span
                  className="absolute inset-x-0 top-0 bg-ember rounded-full origin-top animate-progress"
                  style={{
                    animationPlayState: paused ? "paused" : "running",
                    animationDuration: `${SLIDE_DURATION}ms`,
                  }}
                />
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Iconos flotantes */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {FLOATING_ICONS.map(({ icon: Icon, position, bg, iconClass, delay }, i) => (
          <div
            key={i}
            className={cn(
              "absolute p-3 rounded-full border backdrop-blur-sm hidden md:block animate-bounce-soft",
              position,
              bg,
            )}
            style={{ animationDelay: delay }}
          >
            <Icon className={cn("w-8 h-8", iconClass)} />
          </div>
        ))}
        <div className="absolute top-1/3 right-[20%] text-ember/40 hidden lg:block animate-glow-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
      </div>

      {/* Contenido */}
      <motion.div
        className="relative z-20 text-center max-w-4xl mx-auto space-y-6"
        style={{ x: springX, y: springY }}
      >
        <motion.span
          className="relative inline-flex items-center gap-2 px-4 py-1.5 bg-ember/20 border border-ember/40 text-ember text-xs font-black tracking-[0.3em] uppercase rounded-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: revealDelay.badge }}
        >
          <span className="absolute inset-0 rounded-full border border-ember/40 animate-pulse-ring" />
          <Flame className="w-3.5 h-3.5 animate-wiggle" /> CATERING & EVENTOS DE LUJO
        </motion.span>

        <h1 className="text-5xl sm:text-6xl md:text-8xl font-sans font-extrabold text-foreground drop-shadow-[0_4px_15px_rgba(0,0,0,0.3)] dark:text-white dark:drop-shadow-[0_4px_15px_rgba(0,0,0,0.95)]">
          <span className="inline-block overflow-hidden align-top">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: revealDelay.title, ease: [0.22, 1, 0.36, 1] }}
            >
              Nuestro{" "}
            </motion.span>
          </span>
          <span className="inline-block overflow-hidden align-top">
            <motion.span
              className="inline-block font-display italic font-normal text-transparent bg-clip-text bg-[linear-gradient(90deg,var(--ember),color-mix(in_oklch,var(--ember)_65%,white))]"
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
          className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: revealDelay.paragraph }}
        >
          Sinfonía de sabores exclusivos. Parrilla, cocina criolla y el misticismo de la gastronomía árabe.
        </motion.p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="relative z-20 mt-16 w-full max-w-3xl grid grid-cols-3 gap-2 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-card/80 border border-border backdrop-blur-md shadow-xl hover:border-ember/35 transition-colors"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: revealDelay.stats }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={cn("text-center", i < STATS.length - 1 && "border-r border-border")}
          >
            <h4
              className={cn(
                "text-xl sm:text-3xl font-black font-display",
                stat.accent ? "text-ember" : "text-foreground",
              )}
            >
              {stat.prefix}
              <CounterNumber value={stat.value} />
            </h4>
            <p className="text-[9px] sm:text-xs text-muted-foreground uppercase tracking-widest mt-1">
              {stat.label}
            </p>
          </div>
        ))}
        <div className="text-center">
          <h4 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-[linear-gradient(90deg,var(--ember),color-mix(in_oklch,var(--ember)_70%,white))] font-display">
            {EXTRA_STAT.value}
          </h4>
          <p className="text-[9px] sm:text-xs text-muted-foreground uppercase tracking-widest mt-1">
            {EXTRA_STAT.label}
          </p>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground z-20 flex flex-col items-center gap-1.5 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: revealDelay.scroll }}
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