// src/modules/user/Inicio/components/Servicios.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Utensils, ChefHat, ArrowRight } from "lucide-react";
import { TiltCard } from "./TiltCard";
import { cn } from "@/lib/utils";

const SERVICIOS = [
  {
    titulo: "Buffet Parrillero",
    etiqueta: "Más solicitado",
    idealPara: "Eventos corporativos · Reuniones familiares",
    descripcion: "Carnes selectas a la parrilla, anticuchos, chorizo parrillero y guarniciones tradicionales.",
    imagen: "https://images.unsplash.com/photo-1529692236671-f1dc6c7f7b1e?q=80&w=1974&auto=format&fit=crop",
    icono: Flame,
    accentColor: "#eab308",
    glow: "rgba(234,179,8,0.28)",
  },
  {
    titulo: "Buffet Árabe",
    etiqueta: "Experiencia internacional",
    idealPara: "Bodas · Eventos temáticos",
    descripcion: "Shawarma, falafel, hummus, tabule y panes árabes recién horneados.",
    imagen: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1974&auto=format&fit=crop",
    icono: Utensils,
    accentColor: "#f59e0b",
    glow: "rgba(251,191,36,0.22)",
  },
  {
    titulo: "Buffet Criollo",
    etiqueta: "Sabor de casa",
    idealPara: "Cumpleaños · Celebraciones íntimas",
    descripcion: "Ají de gallina, lomo saltado, arroz con pollo y postres tradicionales.",
    imagen: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1974&auto=format&fit=crop",
    icono: ChefHat,
    accentColor: "#f97316",
    glow: "rgba(249,115,22,0.22)",
  },
] as const;

// Hook reutilizable de intersección
function useInView<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export const Servicios = () => {
  const [headerIn, setHeaderIn] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeaderIn(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cardRefs = [useInView<HTMLDivElement>(), useInView<HTMLDivElement>(), useInView<HTMLDivElement>()];

  return (
    <section className="relative py-28 px-4 sm:px-6 overflow-hidden bg-background">
      {/* Background atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklch,var(--ember)_7%,transparent)_0%,transparent_65%)]" />
      <div className="absolute top-1/3 right-8 w-72 h-72 rounded-full pointer-events-none bg-[radial-gradient(circle,color-mix(in_oklch,var(--ember)_4%,transparent)_0%,transparent_70%)] blur-[40px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={headerIn ? { opacity: 1, y: 0 } : {}} className="inline-flex items-center gap-2 mb-5">
            <span className="block h-[1px] w-8 bg-gradient-to-r from-transparent to-ember" />
            <span className="text-[11px] font-black tracking-[0.28em] uppercase text-ember">Nuestras Especialidades</span>
            <span className="block h-[1px] w-8 bg-gradient-to-r from-ember to-transparent" />
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={headerIn ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Servicios de Buffet <em className="bg-gradient-to-r from-ember to-amber-300 bg-clip-text text-transparent not-italic font-normal">Exclusive</em>
          </motion.h2>

          <div className="mx-auto mt-5 h-[1.5px] w-16 bg-gradient-to-r from-transparent via-ember to-transparent" />

          <motion.p initial={{ opacity: 0, y: 20 }} animate={headerIn ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.22 }} className="mt-6 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed text-muted-foreground">
            Propuestas culinarias conceptuales y personalizadas para hacer de tu evento una experiencia sensorial memorable.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch">
          {SERVICIOS.map((servicio, index) => {
            const { ref, inView } = cardRefs[index];
            const IconComponent = servicio.icono;
            return (
              <div key={index} ref={ref} className="flex flex-col h-full">
                <TiltCard delay={index * 0.13} inView={inView} glowColor={servicio.glow}>
                  {/* Imagen */}
                  <div className="relative h-64 overflow-hidden" style={{ transformStyle: "preserve-3d" }}>
                    <img src={servicio.imagen} alt={servicio.titulo} className="tilt-img w-full h-full object-cover transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/15 to-transparent" />
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_50%_100%,var(--accent-color),transparent_65%)]" style={{ "--accent-color": servicio.accentColor } as React.CSSProperties} />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full bg-card/80 backdrop-blur-md border" style={{ borderColor: `${servicio.accentColor}50`, color: servicio.accentColor }}>
                      {servicio.etiqueta}
                    </div>

                    {/* Icono */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center bg-card/80 backdrop-blur-md border border-border shadow-lg">
                      <IconComponent className="w-5 h-5" style={{ color: servicio.accentColor }} />
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight font-serif mb-1.5 text-foreground">{servicio.titulo}</h3>
                      <p className="text-[11px] font-semibold uppercase tracking-wider mb-4 opacity-80" style={{ color: servicio.accentColor }}>{servicio.idealPara}</p>
                      <p className="leading-relaxed text-sm sm:text-base font-light text-muted-foreground">{servicio.descripcion}</p>
                    </div>
                    <div className="mt-6 pt-5 border-t border-border">
                      <button className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group/btn" style={{ color: servicio.accentColor }}>
                        <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover/btn:after:w-full">Explorar propuesta</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={headerIn ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }} className="text-center mt-20">
          <a href="/menu" className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold bg-gradient-to-r from-ember to-amber-600 text-char-deep shadow-[0_8px_32px_color-mix(in_oklch,var(--ember)_30%,transparent)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_color-mix(in_oklch,var(--ember)_40%,transparent)] transition-all duration-300 group">
            Ver menú completo <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <p className="mt-4 text-xs text-muted-foreground">Cotizaciones sin compromiso · Atención personalizada</p>
        </motion.div>
      </div>
    </section>
  );
};