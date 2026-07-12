// src/modules/user/Inicio/components/Servicios.tsx

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Utensils, ChefHat, ArrowRight, X } from "lucide-react";
import { TiltCard } from "./TiltCard";

const SERVICIOS = [
  {
    numero: "01",
    titulo: "Buffet Parrillero",
    etiqueta: "Más solicitado",
    idealPara: "Eventos corporativos · Reuniones familiares",
    descripcion:
      "Carnes selectas a la parrilla, anticuchos, chorizo parrillero y guarniciones tradicionales.",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1dpMgV13LLejk4TtO7GPFAweKMwmBvLYRNgcgPReheueo0_RhLvzDtw8&s=10",
    icono: Flame,
    accentColor: "#eab308",
    glow: "rgba(234,179,8,0.28)",
  },
  {
    numero: "02",
    titulo: "Buffet Árabe",
    etiqueta: "Experiencia internacional",
    idealPara: "Bodas · Eventos temáticos",
    descripcion:
      "Shawarma, falafel, hummus, tabule y panes árabes recién horneados.",
    imagen:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1974&auto=format&fit=crop",
    icono: Utensils,
    accentColor: "#f59e0b",
    glow: "rgba(251,191,36,0.22)",
  },
  {
    numero: "03",
    titulo: "Buffet Criollo",
    etiqueta: "Sabor de casa",
    idealPara: "Cumpleaños · Celebraciones íntimas",
    descripcion:
      "Ají de gallina, lomo saltado, arroz con pollo y postres tradicionales.",
    imagen:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1974&auto=format&fit=crop",
    icono: ChefHat,
    accentColor: "#f97316",
    glow: "rgba(249,115,22,0.22)",
  },
] as const;

type ServicioType = (typeof SERVICIOS)[number];

// Textura de grano sutil (SVG feTurbulence embebido como data-uri)
const GRAIN_TEXTURE =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIiBvcGFjaXR5PSIwLjkiLz48L3N2Zz4=";

function useInView<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// Brasas ambientales flotantes — único elemento de movimiento decorativo extra
function Brasas() {
  const particulas = [
    { left: "8%", delay: 0, duration: 9, size: 3 },
    { left: "22%", delay: 2.4, duration: 11, size: 2 },
    { left: "68%", delay: 1.1, duration: 10, size: 2.5 },
    { left: "84%", delay: 3.6, duration: 8.5, size: 3 },
    { left: "45%", delay: 5, duration: 12, size: 2 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particulas.map((p, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 rounded-full bg-ember"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            boxShadow: "0 0 8px 2px rgba(234,179,8,0.6)",
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -520, opacity: [0, 0.7, 0.7, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export const Servicios = () => {
  const [headerIn, setHeaderIn] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const [servicioSeleccionado, setServicioSeleccionado] =
    useState<ServicioType | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const openServicio = useCallback((servicio: ServicioType) => {
    lastFocusedRef.current = document.activeElement as HTMLElement;
    setServicioSeleccionado(servicio);
  }, []);

  const closeServicio = useCallback(() => {
    setServicioSeleccionado(null);
    lastFocusedRef.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!servicioSeleccionado) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeServicio();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [servicioSeleccionado, closeServicio]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setHeaderIn(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cardRefs = [
    useInView<HTMLDivElement>(),
    useInView<HTMLDivElement>(),
    useInView<HTMLDivElement>(),
  ];

  return (
    <section className="relative py-28 px-4 sm:px-6 overflow-hidden bg-background">
      {/* Grano de fondo — le da densidad "material" a lo que sería negro plano */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url(${GRAIN_TEXTURE})` }}
      />

      {/* Atmósfera de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[650px] pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklch,var(--ember)_9%,transparent)_0%,transparent_65%)]" />
      <div className="absolute top-1/3 right-8 w-72 h-72 rounded-full pointer-events-none bg-[radial-gradient(circle,color-mix(in_oklch,var(--ember)_4%,transparent)_0%,transparent_70%)] blur-[50px]" />
      <div className="absolute bottom-0 left-8 w-64 h-64 rounded-full pointer-events-none bg-[radial-gradient(circle,color-mix(in_oklch,var(--ember)_3%,transparent)_0%,transparent_70%)] blur-[60px]" />

      <Brasas />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-24 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 mb-5"
          >
            <span className="block h-[1px] w-8 bg-gradient-to-r from-transparent to-ember" />
            <span className="text-[11px] font-black tracking-[0.28em] uppercase text-ember">
              Nuestras Especialidades
            </span>
            <span className="block h-[1px] w-8 bg-gradient-to-r from-ember to-transparent" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerIn ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight"
          >
            Servicios de Buffet{" "}
            <em className="bg-gradient-to-r from-ember to-amber-300 bg-clip-text text-transparent not-italic font-normal">
              Exclusive
            </em>
          </motion.h2>

          <div className="mx-auto mt-5 h-[1.5px] w-16 bg-gradient-to-r from-transparent via-ember to-transparent" />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerIn ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.22, duration: 0.5, ease: "easeOut" }}
            className="mt-6 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed text-muted-foreground"
          >
            Propuestas culinarias conceptuales y personalizadas para hacer de tu
            evento una experiencia sensorial memorable.
          </motion.p>
        </div>

        {/* Cards — estilo "comanda de cocina" */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch">
          {SERVICIOS.map((servicio, index) => {
            const { ref, inView } = cardRefs[index];
            const IconComponent = servicio.icono;
            return (
              <div key={servicio.titulo} ref={ref} className="flex flex-col h-full">
                <TiltCard delay={index * 0.13} inView={inView} glowColor={servicio.glow}>
                  <div
                    className="relative h-full flex flex-col rounded-[1.75rem] overflow-hidden border border-border/80 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.7)] transition-shadow duration-500 hover:shadow-[0_32px_90px_-18px_rgba(0,0,0,0.8)]"
                    style={{
                      backgroundImage: `linear-gradient(155deg, ${servicio.accentColor}14, transparent 40%)`,
                    }}
                  >
                    {/* Borde superior en gradiente de marca — el "sello" de calidad */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[3px] z-20"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${servicio.accentColor}, transparent)`,
                      }}
                    />

                    {/* Imagen */}
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`Ver detalle de ${servicio.titulo}`}
                      className="relative h-72 overflow-hidden cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                      onClick={() => openServicio(servicio)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openServicio(servicio);
                        }
                      }}
                    >
                      <img
                        src={servicio.imagen}
                        alt={servicio.titulo}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-black/10" />

                      {/* Número de pedido — estilo ticket de cocina */}
                      <span
                        className="absolute bottom-3 left-4 font-display italic text-6xl font-light select-none pointer-events-none"
                        style={{
                          color: `${servicio.accentColor}35`,
                          textShadow: "0 2px 12px rgba(0,0,0,0.4)",
                        }}
                      >
                        {servicio.numero}
                      </span>

                      {/* Badge */}
                      <div
                        className="absolute top-5 left-4 text-[10px] font-bold uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full bg-card/85 backdrop-blur-md border shadow-sm"
                        style={{
                          borderColor: `${servicio.accentColor}50`,
                          color: servicio.accentColor,
                        }}
                      >
                        {servicio.etiqueta}
                      </div>

                      {/* Sello circular — icono a modo de "wax seal" de cocina */}
                      <motion.div
                        className="absolute top-5 right-4 w-11 h-11 rounded-full flex items-center justify-center border-2 shadow-lg"
                        style={{
                          borderColor: `${servicio.accentColor}70`,
                          background:
                            "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.12), rgba(0,0,0,0.55))",
                        }}
                        whileHover={{ scale: 1.1, rotate: 8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <IconComponent
                          className="w-5 h-5"
                          style={{ color: servicio.accentColor }}
                        />
                      </motion.div>
                    </div>

                    {/* Perforación tipo comanda — separador entre imagen y contenido */}
                    <div
                      aria-hidden="true"
                      className="relative h-3 bg-card"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, var(--background) 3px, transparent 3.3px)",
                        backgroundSize: "18px 100%",
                        backgroundRepeat: "repeat-x",
                        backgroundPosition: "center",
                      }}
                    />

                    {/* Contenido */}
                    <div className="p-6 sm:p-8 pt-5 flex flex-col flex-grow justify-between bg-card">
                      <div>
                        <div className="flex items-baseline justify-between gap-3 mb-1.5">
                          <h3 className="text-2xl font-bold tracking-tight font-display text-foreground">
                            {servicio.titulo}
                          </h3>
                          <span
                            className="font-display italic text-sm shrink-0"
                            style={{ color: servicio.accentColor }}
                          >
                            N.º {servicio.numero}
                          </span>
                        </div>
                        <p
                          className="text-[11px] font-semibold uppercase tracking-wider mb-4 opacity-80"
                          style={{ color: servicio.accentColor }}
                        >
                          {servicio.idealPara}
                        </p>
                        <p className="leading-relaxed text-sm sm:text-base font-light text-muted-foreground">
                          {servicio.descripcion}
                        </p>
                      </div>
                      <div className="mt-6 pt-5 border-t border-dashed border-border">
                        <button
                          onClick={() => openServicio(servicio)}
                          className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 rounded-md"
                          style={{ color: servicio.accentColor }}
                        >
                          <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover/btn:after:w-full">
                            Explorar propuesta
                          </span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headerIn ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
          className="text-center mt-20"
        >
          <motion.a
            href="/menu"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold bg-gradient-to-r from-ember to-amber-600 text-char-deep shadow-[0_8px_32px_color-mix(in_oklch,var(--ember)_30%,transparent)] hover:shadow-[0_16px_40px_color-mix(in_oklch,var(--ember)_45%,transparent)] transition-shadow duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Ver menú completo{" "}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.a>
          <p className="mt-4 text-xs text-muted-foreground">
            Cotizaciones sin compromiso · Atención personalizada
          </p>
        </motion.div>
      </div>

      {/* ── MODAL DETALLE DE SERVICIO ── */}
      <AnimatePresence>
        {servicioSeleccionado && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="servicio-modal-titulo"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeServicio}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              className="relative w-full max-w-4xl bg-card text-card-foreground rounded-3xl overflow-hidden shadow-2xl border border-border flex flex-col md:flex-row z-10 max-h-[90vh] md:max-h-[600px]"
            >
              <button
                ref={closeButtonRef}
                onClick={closeServicio}
                aria-label="Cerrar detalle del servicio"
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-black/50 text-white md:bg-card/85 md:text-foreground backdrop-blur-md border border-border hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto relative shrink-0">
                <img
                  src={servicioSeleccionado.imagen}
                  alt={servicioSeleccionado.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-card/60 via-transparent to-transparent md:from-transparent md:to-card/10" />
                <span
                  className="absolute bottom-4 left-5 font-display italic text-7xl font-light select-none pointer-events-none"
                  style={{
                    color: `${servicioSeleccionado.accentColor}40`,
                    textShadow: "0 2px 12px rgba(0,0,0,0.4)",
                  }}
                >
                  {servicioSeleccionado.numero}
                </span>
              </div>

              <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center overflow-y-auto">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 inline-block self-start px-3 py-1 rounded-full bg-secondary border border-border"
                  style={{ color: servicioSeleccionado.accentColor }}
                >
                  {servicioSeleccionado.etiqueta}
                </span>

                <h3
                  id="servicio-modal-titulo"
                  className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-foreground mb-2"
                >
                  {servicioSeleccionado.titulo}
                </h3>

                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-6"
                  style={{ color: servicioSeleccionado.accentColor }}
                >
                  {servicioSeleccionado.idealPara}
                </p>

                <p className="text-base font-light text-muted-foreground leading-relaxed mb-8">
                  {servicioSeleccionado.descripcion}
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={closeServicio}
                    className="flex-1 py-3 px-5 rounded-xl text-sm font-semibold border border-border bg-secondary hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60"
                  >
                    Cerrar vista
                  </button>
                  <a
                    href="/menu"
                    className="flex-1 py-3 px-5 rounded-xl text-sm font-semibold text-center text-char-deep bg-gradient-to-r from-ember to-amber-500 shadow-md transition-transform active:scale-[0.98] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60"
                  >
                    Cotizar servicio
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};