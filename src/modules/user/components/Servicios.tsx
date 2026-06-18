import { useEffect, useRef, useState, useCallback } from "react";
import { Flame, Utensils, ChefHat, ArrowRight } from "lucide-react";

/* ── InView hook ── */
function useInView<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ── 3D Tilt Card ── */
interface TiltCardProps {
  children: React.ReactNode;
  delay?: number;
  inView: boolean;
  glowColor?: string;
}

function TiltCard({ children, delay = 0, inView, glowColor = "rgba(234,179,8,0.25)" }: TiltCardProps) {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const innerRef  = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect  = el.getBoundingClientRect();
    const x     = (e.clientX - rect.left) / rect.width  - 0.5;   // -0.5 → 0.5
    const y     = (e.clientY - rect.top)  / rect.height - 0.5;
    const rotX  = -y * 12;   // tilt up/down
    const rotY  =  x * 12;   // tilt left/right

    if (innerRef.current) {
      innerRef.current.style.transform =
        `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
    }
    /* Parallax: image moves opposite direction, slightly */
    const imgEl = el.querySelector<HTMLElement>(".s-img");
    if (imgEl) {
      imgEl.style.transform = `scale(1.1) translate(${x * -14}px, ${y * -14}px)`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    if (innerRef.current) {
      innerRef.current.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    }
    const imgEl = wrapRef.current?.querySelector<HTMLElement>(".s-img");
    if (imgEl) imgEl.style.transform = "scale(1) translate(0, 0)";
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`s-card relative ${inView ? "s-fade-up" : "opacity-0"}`}
      style={{ animationDelay: `${delay}s`, cursor: "default" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient glow behind card */}
      <div
        className="s-ambient absolute -inset-2 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 80%, ${glowColor} 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
          zIndex: 0,
        }}
      />

      {/* Card surface */}
      <div
        ref={innerRef}
        className="s-card-inner relative rounded-3xl overflow-hidden flex flex-col h-full"
        style={{
          background: "linear-gradient(160deg, #1a1208 0%, #120d0a 60%, #0e0b08 100%)",
          border: hovered ? "1px solid rgba(234,179,8,0.35)" : "1px solid rgba(61,44,31,0.55)",
          boxShadow: hovered
            ? "0 30px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(234,179,8,0.08)"
            : "0 10px 40px rgba(0,0,0,0.4)",
          transition: "border-color 0.35s ease, box-shadow 0.35s ease",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Main Section ── */
export const Servicios = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerIn, setHeaderIn] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeaderIn(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const servicios = [
    {
      titulo: "Buffet Parrillero",
      etiqueta: "Más solicitado",
      idealPara: "Eventos corporativos · Reuniones familiares",
      descripcion:
        "Carnes selectas a la parrilla, anticuchos, chorizo parrillero y guarniciones tradicionales. Perfecto para eventos corporativos y celebraciones familiares.",
      imagen:
        "https://images.unsplash.com/photo-1529692236671-f1dc6c7f7b1e?q=80&w=1974&auto=format&fit=crop",
      icono: <Flame className="w-5 h-5 text-yellow-400" />,
      glow: "rgba(234,179,8,0.28)",
      accentColor: "#eab308",
    },
    {
      titulo: "Buffet Árabe",
      etiqueta: "Experiencia internacional",
      idealPara: "Bodas · Eventos temáticos",
      descripcion:
        "Shawarma, falafel, hummus, tabule y panes árabes recién horneados. Una experiencia gastronómica única e internacional para tus invitados.",
      imagen:
        "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1974&auto=format&fit=crop",
      icono: <Utensils className="w-5 h-5 text-amber-400" />,
      glow: "rgba(251,191,36,0.22)",
      accentColor: "#f59e0b",
    },
    {
      titulo: "Buffet Criollo",
      etiqueta: "Sabor de casa",
      idealPara: "Cumpleaños · Celebraciones íntimas",
      descripcion:
        "Ají de gallina, lomo saltado, arroz con pollo y postres tradicionales. Sabor peruano auténtico y de alta cocina en cada bocado.",
      imagen:
        "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1974&auto=format&fit=crop",
      icono: <ChefHat className="w-5 h-5 text-orange-400" />,
      glow: "rgba(249,115,22,0.22)",
      accentColor: "#f97316",
    },
  ];

  const card0 = useInView<HTMLDivElement>();
  const card1 = useInView<HTMLDivElement>();
  const card2 = useInView<HTMLDivElement>();
  const cardRefs = [card0, card1, card2];

  return (
    <section
      className="relative py-28 px-4 sm:px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #080604 0%, #0b0806 40%, #0d0a07 100%)" }}
    >
      {/* ── Background atmosphere ── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(234,179,8,0.07) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(180,83,9,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Floating orbs */}
      <div
        className="absolute top-1/3 right-8 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(234,179,8,0.04) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── HEADER ── */}
        <div ref={headerRef} className="text-center mb-24">
          <div
            className={`inline-flex items-center gap-2 mb-5 ${headerIn ? "s-fade-up" : "opacity-0"}`}
            style={{ animationDelay: "0s" }}
          >
            <span
              className="block h-[1px] w-8"
              style={{ background: "linear-gradient(90deg, transparent, #eab308)" }}
            />
            <span
              className="text-[11px] font-black tracking-[0.28em] uppercase"
              style={{ color: "#eab308" }}
            >
              Nuestras Especialidades
            </span>
            <span
              className="block h-[1px] w-8"
              style={{ background: "linear-gradient(90deg, #eab308, transparent)" }}
            />
          </div>

          <h2
            className={`font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight ${headerIn ? "s-fade-up" : "opacity-0"}`}
            style={{ animationDelay: "0.1s" }}
          >
            Servicios de Buffet{" "}
            <em className="s-shimmer not-italic font-normal">Exclusive</em>
          </h2>

          {/* Divider */}
          <div
            className={`s-divider mx-auto mt-5 h-[1.5px] w-16 ${headerIn ? "s-divider-in" : ""}`}
            style={{
              background: "linear-gradient(90deg, transparent, #eab308, transparent)",
            }}
          />

          <p
            className={`mt-6 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed ${headerIn ? "s-fade-up" : "opacity-0"}`}
            style={{ color: "#7a6a52", animationDelay: "0.22s" }}
          >
            Propuestas culinarias conceptuales y personalizadas para hacer de tu
            evento una experiencia sensorial memorable.
          </p>
        </div>

        {/* ── CARDS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch">
          {servicios.map((servicio, index) => {
            const { ref, inView } = cardRefs[index];
            return (
              <div key={index} ref={ref} className="flex flex-col h-full">
                <TiltCard
                  delay={index * 0.13}
                  inView={inView}
                  glowColor={servicio.glow}
                >
                  {/* ── IMAGE ── */}
                  <div className="relative h-64 overflow-hidden" style={{ transformStyle: "preserve-3d" }}>
                    <img
                      src={servicio.imagen}
                      alt={servicio.titulo}
                      className="s-img w-full h-full object-cover"
                      style={{
                        transition: "transform 0.5s cubic-bezier(.22,1,.36,1)",
                        transform: "scale(1) translate(0,0)",
                      }}
                    />

                    {/* Multi-layer gradient */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(12,9,7,0.15) 55%, rgba(18,13,10,0.95) 100%)",
                      }}
                    />

                    {/* Color tint overlay */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        background: `radial-gradient(ellipse at 50% 100%, ${servicio.accentColor} 0%, transparent 65%)`,
                      }}
                    />

                    {/* Badge */}
                    <div
                      className="s-badge-float absolute top-4 left-4 text-[10px] font-bold uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full"
                      style={{
                        background: "rgba(12,9,7,0.80)",
                        backdropFilter: "blur(12px)",
                        border: `1px solid ${servicio.accentColor}50`,
                        color: servicio.accentColor,
                      }}
                    >
                      {servicio.etiqueta}
                    </div>

                    {/* Icon */}
                    <div
                      className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: "rgba(12,9,7,0.80)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(61,44,31,0.7)",
                        boxShadow: `0 0 16px ${servicio.glow}`,
                      }}
                    >
                      {servicio.icono}
                    </div>

                    {/* Bottom edge glow line */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[1px]"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${servicio.accentColor}60, transparent)`,
                      }}
                    />
                  </div>

                  {/* ── Ticket perforation ── */}
                  <div className="relative flex items-center px-0 -my-0">
                    <div
                      className="absolute -left-3 w-6 h-6 rounded-full"
                      style={{ background: "#080604" }}
                    />
                    <div
                      className="flex-1 mx-5 border-t border-dashed"
                      style={{ borderColor: "rgba(61,44,31,0.5)" }}
                    />
                    <div
                      className="absolute -right-3 w-6 h-6 rounded-full"
                      style={{ background: "#080604" }}
                    />
                  </div>

                  {/* ── CONTENT ── */}
                  <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                    <div>
                      <h3
                        className="text-2xl font-bold tracking-tight font-serif mb-1.5 transition-colors duration-300"
                        style={{ color: "#f0e6cc" }}
                      >
                        {servicio.titulo}
                      </h3>
                      <p
                        className="text-[11px] font-semibold uppercase tracking-wider mb-4"
                        style={{ color: `${servicio.accentColor}80` }}
                      >
                        {servicio.idealPara}
                      </p>
                      <p
                        className="leading-relaxed text-sm sm:text-base font-light"
                        style={{ color: "#6b5a42" }}
                      >
                        {servicio.descripcion}
                      </p>
                    </div>

                    {/* CTA */}
                    <div
                      className="mt-6 pt-5"
                      style={{ borderTop: "1px solid rgba(61,44,31,0.35)" }}
                    >
                      <button
                        className="s-arrow-bounce inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group/btn"
                        style={{ color: servicio.accentColor }}
                      >
                        <span
                          className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover/btn:after:w-full"
                        >
                          Explorar propuesta
                        </span>
                        <ArrowRight
                          className="arrow-icon w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5"
                        />
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>

        {/* ── BOTTOM CTA ── */}
        <div
          className={`text-center mt-20 ${headerIn ? "s-fade-up" : "opacity-0"}`}
          style={{ animationDelay: "0.5s" }}
        >
          <a
            href="/menu"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-300 group"
            style={{
              background: "linear-gradient(135deg, #eab308, #b45309)",
              color: "#0a0705",
              boxShadow: "0 8px 32px rgba(234,179,8,0.3)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(234,179,8,0.4)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(234,179,8,0.3)";
            }}
          >
            Ver menú completo
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <p
            className="mt-4 text-xs"
            style={{ color: "#4a3d2a" }}
          >
            Cotizaciones sin compromiso · Atención personalizada
          </p>
        </div>

      </div>
    </section>
  );
};