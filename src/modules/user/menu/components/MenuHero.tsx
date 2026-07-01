"use client";
import { useState, useEffect } from "react";
import { Flame, Utensils, Beef, Sparkles, ChevronDown } from "lucide-react";
import { CounterNumber } from "./CounterNumber";

const SLIDES = [
  { src: "/imageLanding/parrilla.avif", alt: "Parrilla" },
  { src: "/imageLanding/criollo.avif", alt: "Criollo" },
  { src: "/imageLanding/arabe.avif", alt: "Árabe" },
] as const;

const SLIDE_DURATION = 7000;

export const MenuHero = () => {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSlide(p => (p + 1) % SLIDES.length), SLIDE_DURATION);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <header
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Carrusel */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {SLIDES.map((img, i) => (
          <div key={img.src} className={`absolute inset-0 transition-opacity duration-[1500ms] ${i === slide ? "opacity-65 z-10" : "opacity-0 z-0"}`}>
            <div className={`absolute inset-0 ${i === slide ? "animate-ken-burns" : ""} ${paused ? "[animation-play-state:paused]" : ""}`}
              style={i === slide ? { animationDuration: `${SLIDE_DURATION}ms` } : undefined}>
              <img src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--char-deep)_95%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-char-deep/60 via-char-deep/30 to-char-deep z-10" />

      {/* Indicadores */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-2.5 z-20 hidden sm:flex">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)}
            className={`relative w-2 rounded-full overflow-hidden bg-white/20 hover:bg-white/40 transition-all cursor-pointer ${i === slide ? "h-7" : "h-2"}`}>
            {i === slide && <span className={`absolute inset-x-0 top-0 bg-ember rounded-full origin-top animate-progress ${paused ? "[animation-play-state:paused]" : ""}`}
              style={{ animationDuration: `${SLIDE_DURATION}ms` }} />}
          </button>
        ))}
      </div>

      {/* Iconos flotantes */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        <div className="absolute top-1/4 left-[10%] p-3 rounded-full bg-ember/10 border border-ember/30 backdrop-blur-sm hidden md:block animate-bounce-soft"><Utensils className="w-8 h-8 text-ember/60" /></div>
        <div className="absolute bottom-1/3 right-[12%] p-3 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm hidden md:block animate-bounce-soft [animation-delay:1s]"><Beef className="w-8 h-8 text-amber-500/50" /></div>
        <div className="absolute top-1/3 right-[20%] text-ember/40 hidden lg:block animate-glow-pulse"><Sparkles className="w-6 h-6" /></div>
      </div>

      {/* Contenido */}
      <div className="relative z-20 text-center max-w-4xl mx-auto space-y-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-ember/20 border border-ember/40 text-ember text-xs font-black tracking-[0.3em] uppercase rounded-full">
          <span className="absolute inset-0 rounded-full border border-ember/40 animate-pulse-ring" />
          <Flame className="w-3.5 h-3.5 animate-wiggle" /> CATERING & EVENTOS DE LUJO
        </span>
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-sans font-extrabold text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.95)]">
          Nuestro{" "}<span className="font-display italic font-normal text-transparent bg-clip-text bg-[linear-gradient(90deg,var(--ember),color-mix(in_oklch,var(--ember)_65%,white))]">Menú</span>
        </h1>
        <p className="text-white/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light">
          Sinfonía de sabores exclusivos. Parrilla, cocina criolla y el misticismo de la gastronomía árabe.
        </p>
      </div>

      {/* Stats */}
      <div className="relative z-20 mt-16 w-full max-w-3xl grid grid-cols-3 gap-2 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-char-deep/80 border border-char backdrop-blur-md hover:border-ember/35 transition-colors">
        <div className="text-center border-r border-char">
          <h4 className="text-xl sm:text-3xl font-black text-ember font-display">+<CounterNumber value={500} /></h4>
          <p className="text-[9px] sm:text-xs text-white/60 uppercase tracking-widest mt-1">Eventos</p>
        </div>
        <div className="text-center border-r border-char">
          <h4 className="text-xl sm:text-3xl font-black text-white font-display"><CounterNumber value={3} /></h4>
          <p className="text-[9px] sm:text-xs text-white/60 uppercase tracking-widest mt-1">Estilos</p>
        </div>
        <div className="text-center">
          <h4 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-[linear-gradient(90deg,var(--ember),color-mix(in_oklch,var(--ember)_70%,white))] font-display">100%</h4>
          <p className="text-[9px] sm:text-xs text-white/60 uppercase tracking-widest mt-1">A tu Medida</p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 z-20 flex flex-col items-center gap-1 cursor-pointer">
        <span className="text-[9px] tracking-[0.3em] uppercase text-ember/40">Explorar</span>
        <ChevronDown className="w-4 h-4 text-ember/60 animate-bounce-soft" />
      </div>
    </header>
  );
};