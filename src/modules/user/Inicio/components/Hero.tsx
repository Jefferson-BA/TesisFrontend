// src/modules/user/Inicio/components/Hero.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Calendar, Sparkles, ChevronDown } from "lucide-react";
import { HeroButton } from "./HeroButton";
import { CounterNumber } from "./CounterNumber";
import { cn } from "@/lib/utils";

const BACKGROUND_IMAGES = [
  {
    src: "/imageLanding/parrilla.avif",
    alt: "Parrilla premium",
    label: "Parrilla",
  },
  {
    src: "/imageLanding/criollo.avif",
    alt: "Cocina criolla",
    label: "Criollo",
  },
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

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(
      () => setCurrentSlide((p) => (p + 1) % BACKGROUND_IMAGES.length),
      SLIDE_DURATION,
    );
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carrusel de fondo */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {BACKGROUND_IMAGES.map((img, i) => (
          <div
            key={img.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1500ms] ease-in-out",
              i === currentSlide ? "opacity-65 z-10" : "opacity-0 z-0",
            )}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading={i === 0 ? "eager" : "lazy"}
              className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
              style={{ animationPlayState: isPaused ? "paused" : "running" }}
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/35 to-background z-10" />

      {/* Contenido */}
      <div className="relative z-20 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ember/10 border border-ember/30 text-ember text-xs font-black tracking-[0.2em] uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5 animate-wiggle" />
          Experiencias Gastronómicas Premium
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.15] text-foreground tracking-tight">
          <span className="block">
            {TITLE_WORDS.line1.map((word, i) => (
              <motion.span
                key={word}
                className="inline-block mr-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.09 }}
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className="block font-display italic font-normal text-ember">
            {TITLE_WORDS.line2.map((word, i) => (
              <motion.span
                key={word}
                className="inline-block mr-3 bg-gradient-to-r from-ember to-amber-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.15 + (TITLE_WORDS.line1.length + i) * 0.09,
                }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <a href="/menu" className="w-full sm:w-auto">
            <HeroButton variant="primary" className="w-full">
              Ver Menú{" "}
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </HeroButton>
          </a>

          <a href="/reservas" className="w-full sm:w-auto">
            <HeroButton variant="secondary" className="w-full">
              <Calendar className="w-4 h-4 text-ember" /> Cotizar ahora
            </HeroButton>
          </a>
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
              className={cn(
                "text-center",
                i < STATS.length - 1 && "border-r border-border",
              )}
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
              100%
            </h4>
            <p className="text-[9px] sm:text-xs text-muted-foreground uppercase tracking-widest mt-1">
              A tu Medida
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground z-20">
        <span className="text-[10px] tracking-[0.3em] uppercase text-ember/40">
          Descubre más
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce-soft" />
      </div>
    </section>
  );
};
