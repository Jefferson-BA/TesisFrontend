import { useState, useEffect, useRef } from "react";
import { ChevronRight, Calendar, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useInView, type Variants } from "framer-motion";

// IMÁGENES ACTUALIZADAS Y ACLARADAS
const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop", // Parrilla
  "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=2070&auto=format&fit=crop", // Criollo
  "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=2070&auto=format&fit=crop", // Árabe
];

const SLIDE_DURATION = 9000; // ms

/* ─── Contador animado con easing (ease-out cúbico), se activa al entrar en vista ─── */
const CounterNumber = ({ value }: { value: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const start = performance.now();
    let raf: number;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value]);

  return <span ref={ref}>{count}</span>;
};

/* ─── Variantes para revelar el titular palabra por palabra ─── */
const wordContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const wordItem: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 220, damping: 22 },
  },
};

/* ─── Botón magnético con seguimiento sutil del cursor + brillo en barrido ─── */
const MagneticButton = ({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "group relative w-full sm:w-auto font-bold px-8 py-4 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer overflow-hidden";

  const styles =
    variant === "primary"
      ? "bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_4px_20px_rgba(234,179,8,0.3)] hover:shadow-[0_4px_28px_rgba(234,179,8,0.55)]"
      : "bg-zinc-900/40 backdrop-blur-md border border-zinc-700/50 hover:border-yellow-500/50 text-white font-semibold hover:bg-zinc-900/60";

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={`${base} ${styles}`}
    >
      {variant === "primary" && (
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)" }}
          initial={{ x: "-130%" }}
          animate={{ x: "130%" }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
        />
      )}
      <span className="relative flex items-center gap-2 transform group-hover:-translate-y-0.5 transition-transform duration-300">
        {children}
      </span>
    </motion.button>
  );
};

export const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Parallax sutil con el movimiento del cursor
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const parallaxX = useSpring(useTransform(mx, [-0.5, 0.5], [-18, 18]), { stiffness: 60, damping: 20 });
  const parallaxY = useSpring(useTransform(my, [-0.5, 0.5], [-12, 12]), { stiffness: 60, damping: 20 });

  const handlePointerMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  // Cada imagen se muestra durante SLIDE_DURATION antes de cambiar
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Partículas ambientales (brasas / chispas doradas)
  const embers = useState(() =>
    Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: `${(i * 7.3) % 100}%`,
      size: 1.5 + (i % 3) * 1.2,
      delay: i * 0.4,
      duration: 7 + (i % 5) * 1.5,
    }))
  )[0];

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
      onMouseMove={handlePointerMove}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* CARRUSEL DE FONDO — crossfade + Ken Burns + parallax */}
      <motion.div className="absolute inset-0 z-0 overflow-hidden" style={{ x: parallaxX, y: parallaxY, scale: 1.05 }}>
        <AnimatePresence>
          {BACKGROUND_IMAGES.map((image, index) =>
            index === currentImageIndex ? (
              <motion.div
                key={image}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${image}')` }}
                initial={{ opacity: 0, scale: 1.0 }}
                animate={{ opacity: 0.65, scale: 1.08 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 2, ease: "easeInOut" },
                  scale: { duration: SLIDE_DURATION / 1000, ease: "linear" },
                }}
              />
            ) : null
          )}
        </AnimatePresence>
      </motion.div>

      {/* Overlay oscuro suavizado para que las fotos resalten más */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-[#0b0806] z-10"></div>

      {/* Textura de grano para profundidad */}
      <div className="grain-overlay z-10"></div>

      {/* Brasas / chispas flotantes ambientales */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {embers.map((e) => (
          <motion.span
            key={e.id}
            className="absolute rounded-full bg-yellow-400/70"
            style={{
              left: e.left,
              bottom: "-5%",
              width: e.size,
              height: e.size,
              boxShadow: "0 0 6px rgba(234,179,8,0.7)",
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.8, 0], y: -560, x: [0, 12, -8, 0] }}
            transition={{ duration: e.duration, delay: e.delay, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Indicadores del Carrusel laterales con barra de progreso */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-20 hidden sm:flex">
        {BACKGROUND_IMAGES.map((_, index) => {
          const isActive = index === currentImageIndex;
          return (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className="relative w-2 rounded-full overflow-hidden bg-zinc-500/30 hover:bg-zinc-400/50 transition-all duration-500 cursor-pointer"
              style={{ height: isActive ? 28 : 8 }}
              aria-label={`Ir a la imagen ${index + 1}`}
            >
              {isActive && (
                <motion.span
                  key={`prog-${currentImageIndex}`}
                  className="absolute inset-x-0 top-0 bg-yellow-500 rounded-full"
                  style={{ transformOrigin: "top" }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: isPaused ? undefined : 1 }}
                  transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Sello giratorio "estampa de catering" — elemento de firma */}
      <motion.div
        className="hidden lg:flex absolute top-28 right-12 w-28 h-28 items-center justify-center z-20"
        initial={{ opacity: 0, scale: 0.7, rotate: -25 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.4 }}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 spin-slow">
          <defs>
            <path id="circlePath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
          </defs>
          <text fill="rgba(234,179,8,0.55)" fontSize="6.2" letterSpacing="3" fontWeight="700">
            <textPath href="#circlePath">
              · CALIDAD PREMIUM · DESDE 2010 · DEPARRASPITZ
            </textPath>
          </text>
        </svg>
        <motion.div
          className="w-14 h-14 rounded-full border border-yellow-500/30 flex items-center justify-center bg-[#120d0a]/40 backdrop-blur-sm"
          animate={{ boxShadow: ["0 0 0px rgba(234,179,8,0)", "0 0 18px rgba(234,179,8,0.4)", "0 0 0px rgba(234,179,8,0)"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-serif italic text-yellow-500 text-sm">DPS</span>
        </motion.div>
      </motion.div>

      {/* Contenido Principal */}
      <div className="relative z-20 text-center px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center">

        {/* Kicker / Etiqueta Superior */}
        <motion.span
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-xs font-black tracking-[0.2em] uppercase mb-6"
        >
          <motion.span
            className="absolute inset-0 rounded-full border border-yellow-500/40"
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>✨</motion.span>
          Experiencias Gastronómicas Premium
        </motion.span>

        {/* Título Principal — revelado palabra por palabra */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-sans font-extrabold leading-[1.15] text-white tracking-tight drop-shadow-[0_4px_15px_rgba(0,0,0,0.95)]"
          initial="hidden"
          animate="show"
          variants={wordContainer}
        >
          <span className="block">
            {["Servicio", "de", "Catering,"].map((word, i) => (
              <motion.span key={i} variants={wordItem} className="inline-block mr-3">
                {word}
              </motion.span>
            ))}
          </span>
          <span className="block font-serif italic font-normal text-yellow-500">
            {["Eventos", "y", "Parrillas"].map((word, i) => (
              <motion.span
                key={i}
                variants={wordItem}
                className="inline-block mr-3 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent"
              >
                {word}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        {/* Descripción */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-zinc-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md"
        >
          Transformamos tus celebraciones en momentos inolvidables. Buffets
          exclusivos, carnes premium y una atención impecable diseñada a tu
          medida.
        </motion.p>

        {/* Botones de Acción Estilizados */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <MagneticButton variant="primary">
            Ver Menú
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </MagneticButton>

          <MagneticButton variant="secondary">
            <Calendar className="w-4 h-4 text-yellow-500" />
            Cotizar ahora
          </MagneticButton>
        </motion.div>

        {/* Franja de cifras — DISEÑO ULTRA SERIF BLACK DE ALTA CATEGORÍA ANIMADO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.85 }}
          whileHover={{ borderColor: "rgba(234,179,8,0.35)" }}
          className="relative z-20 mt-16 w-full max-w-3xl grid grid-cols-3 gap-2 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-[#0a0705]/80 border border-[#2d2016]/80 backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.7)] transition-colors duration-500"
        >
          <div className="text-center border-r border-[#2d2016]/60">
            <h4 className="text-xl sm:text-3xl font-black text-yellow-500 font-serif">
              +<CounterNumber value={500} />
            </h4>
            <p className="text-[9px] sm:text-xs text-zinc-400 uppercase tracking-widest mt-1">Eventos Atendidos</p>
          </div>
          <div className="text-center border-r border-[#2d2016]/60">
            <h4 className="text-xl sm:text-3xl font-black text-white font-serif">
              <CounterNumber value={3} />
            </h4>
            <p className="text-[9px] sm:text-xs text-zinc-400 uppercase tracking-widest mt-1">Estilos de Cocina</p>
          </div>
          <div className="text-center">
            <h4 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300 font-serif">
              100%
            </h4>
            <p className="text-[9px] sm:text-xs text-zinc-400 uppercase tracking-widest mt-1">A tu Medida</p>
          </div>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-zinc-500 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.2, duration: 0.6 }, y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-yellow-500/40">Descubre más</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>

      {/* Decoración sutil: Línea difuminada inferior */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3d2c1f] to-transparent z-20"></div>
    </section>
  );
};