// src/modules/user/Inicio/components/Testimonios.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

function useInView<T extends HTMLElement>(threshold = 0.15) {
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

const DESTACADO = {
  nombre: "Lucía Mendoza",
  cargo: "Organizadora de eventos",
  comentario: "El servicio de DeParraSpitz superó todas nuestras expectativas. La calidad de la comida y la atención al detalle fueron excepcionales.",
  inicial: "L",
};

const TESTIMONIOS = [
  { nombre: "Carlos Ramírez", cargo: "Cliente corporativo", comentario: "Contratamos el buffet parrillero para nuestro evento anual y fue un éxito total.", inicial: "C" },
  { nombre: "Ana Torres", cargo: "Celebración familiar", comentario: "Organizamos el cumpleaños de mi madre con el buffet criollo. Todos quedaron encantados.", inicial: "A" },
  { nombre: "Miguel Ángel Soto", cargo: "Evento empresarial", comentario: "La variedad del buffet árabe fue increíble. Nuestros invitados quedaron fascinados.", inicial: "M" },
];

const Stars = () => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-ember text-ember" />)}
  </div>
);

export const Testimonios = () => {
  const { ref: featRef, inView: featInView } = useInView<HTMLDivElement>();

  return (
    <section className="relative py-24 px-4 sm:px-6 overflow-hidden bg-muted/30 dark:bg-[#0b0806]">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-ember text-xs font-black tracking-[0.25em] uppercase block mb-3">Opiniones Reales</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground font-serif tracking-tight">
            Confianza en Cada <span className="italic font-normal text-ember/90">Celebración</span>
          </h2>
          <div className="w-12 h-[2px] bg-ember/40 mx-auto mt-5" />
          <p className="text-muted-foreground mt-5 text-base sm:text-lg max-w-2xl mx-auto font-light">
            La satisfacción de quienes confían en nosotros es nuestra mejor carta de presentación.
          </p>
        </div>

        {/* Destacado */}
        <motion.div
          ref={featRef}
          initial={{ opacity: 0, y: 30 }}
          animate={featInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative bg-card border border-border rounded-3xl p-8 sm:p-12 mb-8 overflow-hidden shadow-xl"
        >
          <Quote className="absolute -right-2 -top-2 w-40 h-40 text-ember/5 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <Stars />
              <p className="text-foreground text-xl sm:text-2xl md:text-3xl leading-snug font-serif italic text-balance mt-4">"{DESTACADO.comentario}"</p>
            </div>
            <div className="flex items-center gap-4 md:flex-col md:items-start md:border-l md:border-border md:pl-8 shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-card border-2 border-ember/40 text-ember flex items-center justify-center font-bold text-xl">{DESTACADO.inicial}</div>
              <div>
                <h3 className="text-foreground font-semibold text-base">{DESTACADO.nombre}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">{DESTACADO.cargo}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIOS.map((t, index) => {
            const { ref, inView } = useInView<HTMLDivElement>();
            return (
              <motion.div
                key={index}
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-lg hover:border-ember/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <Quote className="absolute right-6 top-6 w-20 h-20 text-muted/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                <div className="relative z-10">
                  <Stars />
                  <p className="text-muted-foreground text-base leading-relaxed font-light font-serif italic text-balance mt-5">"{t.comentario}"</p>
                </div>
                <div className="flex items-center gap-4 mt-8 pt-5 border-t border-border relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-card border border-border text-ember flex items-center justify-center font-bold text-lg group-hover:border-ember/30 transition-colors">{t.inicial}</div>
                  <div>
                    <h3 className="text-foreground font-semibold text-base">{t.nombre}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">{t.cargo}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};