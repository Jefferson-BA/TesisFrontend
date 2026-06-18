import { useEffect, useState, useMemo, useRef } from "react";
import { 
  ShoppingCart, X, ShieldCheck, AlertCircle, Award, 
  Flame, SlidersHorizontal, UtensilsCrossed, ChevronDown,
  Sparkles, Soup, Beef, Utensils, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useInView, type Variants } from "framer-motion";
import { getProducts } from "@/modules/admin/productos/services/product.service";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";

// IMÁGENES TEMÁTICAS ACLARADAS Y EDITADAS
const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop", // Parrilla
  "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=2070&auto=format&fit=crop", // Lomo Saltado Criollo
  "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=2070&auto=format&fit=crop"  // Árabe
];

const SLIDE_DURATION = 7000; // ms

/* ─── Contador animado con easing (RAF), se activa al entrar en vista ─── */
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

/* ─── Precio animado: cuenta desde 0 cuando la tarjeta entra en vista ─── */
const AnimatedPrice = ({ value }: { value: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 900;
    const start = performance.now();
    let raf: number;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) raf = requestAnimationFrame(step);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value]);

  return <span ref={ref}>{formatPrice(display)}</span>;
};

/* ─── Variantes de stagger para grids / filtros ─── */
const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 22 } },
};

/* ─── Botón magnético con seguimiento sutil del cursor + brillo en barrido ─── */
const MagneticButton = ({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.18);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={`relative overflow-hidden cursor-pointer ${className}`}
    >
      <motion.span
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)" }}
        initial={{ x: "-130%" }}
        animate={{ x: "130%" }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
      />
      <span className="relative flex items-center justify-center gap-2 w-full">{children}</span>
    </motion.button>
  );
};

/* ─── Tarjeta de producto con tilt 3D sutil ─── */
const ProductCard = ({
  product,
  onView,
  onAdd,
}: {
  product: any;
  onView: () => void;
  onAdd: () => void;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [4, -4]);
  const rotateY = useTransform(x, [-100, 100], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      layout
      variants={staggerItem}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.3 } }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -8 }}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group bg-[#0d0907]/95 border border-[#2d2016] rounded-2xl overflow-hidden hover:border-yellow-500/40 hover:shadow-[0_15px_35px_rgba(0,0,0,0.9)] flex flex-col h-full relative"
    >
      {/* Imagen y Badge */}
      <div className="h-64 w-full overflow-hidden relative bg-zinc-950">
        <motion.img
          src={product.imageUrl || "https://placehold.co/600x400"}
          alt={product.name}
          onClick={onView}
          className="h-full w-full object-cover cursor-pointer brightness-90 group-hover:brightness-100"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-yellow-500/30 text-yellow-400 text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-lg shadow-lg"
        >
          {product.category?.name || product.category || "Especial de la Casa"}
        </motion.div>
      </div>

      {/* Cuerpo */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4 bg-gradient-to-b from-transparent to-black/20">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
            <ShieldCheck size={10} /> Alta Cocina Garantizada
          </span>
          <h2 onClick={onView} className="text-lg font-bold font-serif text-zinc-100 cursor-pointer hover:text-yellow-400 line-clamp-2 min-h-[52px] transition-colors">
            {product.name}
          </h2>
        </div>

        <div className="pt-3 border-t border-[#2d2016]/60 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Inversión Cubierto</span>
            <p className="text-2xl font-black text-yellow-400 font-mono">
              <AnimatedPrice value={Number(product.price)} />
            </p>
          </div>

          <MagneticButton
            onClick={onAdd}
            className="w-full h-11 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black uppercase tracking-widest text-[11px] rounded-xl shadow-lg transition-colors"
          >
            <ShoppingCart size={13} strokeWidth={2.5} />
            Agregar al Pedido
          </MagneticButton>
        </div>
      </div>
    </motion.article>
  );
};

export const MenuProducts = () => {
  const heroRef = useRef(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHeroHover, setIsHeroHover] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  
  // Efecto Parallax basado en scroll real
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(Array.isArray(res) ? res : res.data || []))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isHeroHover) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isHeroHover]);

  // Brasas / chispas flotantes ambientales
  const embers = useState(() =>
    Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: `${(i * 8.4) % 100}%`,
      size: 1.5 + (i % 3) * 1.2,
      delay: i * 0.45,
      duration: 7 + (i % 5) * 1.4,
    }))
  )[0];

  const categories = useMemo(() => {
    const rawCategories = products.map((p) => p.category?.name || p.category || "Criollo");
    return ["Todos", ...Array.from(new Set(rawCategories))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "Todos") return products;
    return products.filter((p) => (p.category?.name || p.category || "Criollo") === activeCategory);
  }, [products, activeCategory]);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      category: product.category?.name || product.category || "Criollo",
    });
    toast.success(`${product.name} añadido a tu orden`, {
      style: { background: "#0d0907", color: "#fff", border: "1px solid #eab308" },
    });
  };

  return (
    <div className="w-full bg-[#0b0806] text-white min-h-screen relative overflow-hidden">
      
      {/* ========================================== */}
      {/* HERO TEMÁTICO ULTRA MEJORADO               */}
      {/* ========================================== */}
      <header
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black px-4 pt-16"
        onMouseEnter={() => setIsHeroHover(true)}
        onMouseLeave={() => setIsHeroHover(false)}
      >
        
        {/* Fondo con Carrusel Parallax Avanzado */}
        <motion.div style={{ y: yBg, opacity: opacityBg }} className="absolute inset-0 z-0">
          <AnimatePresence>
            {BACKGROUND_IMAGES.map((image, index) =>
              index === currentImageIndex ? (
                <motion.div
                  key={image}
                  className="absolute inset-0 bg-cover bg-center"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: 0.65, scale: 1.08 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: 1.8, ease: "easeInOut" },
                    scale: { duration: SLIDE_DURATION / 1000, ease: "linear" },
                  }}
                  style={{ backgroundImage: `url('${image}')` }}
                />
              ) : null
            )}
          </AnimatePresence>
          {/* Capa de partículas dinámicas cruzadas */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#0b0806_95%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#0b0806] z-10" />
        </motion.div>

        {/* Brasas / chispas flotantes ambientales */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {embers.map((e) => (
            <motion.span
              key={e.id}
              className="absolute rounded-full bg-yellow-400/70"
              style={{ left: e.left, bottom: "-5%", width: e.size, height: e.size, boxShadow: "0 0 6px rgba(234,179,8,0.7)" }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.8, 0], y: -560, x: [0, 12, -8, 0] }}
              transition={{ duration: e.duration, delay: e.delay, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
        </div>

        {/* Indicadores del carrusel con barra de progreso */}
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
                    animate={{ scaleY: isHeroHover ? undefined : 1 }}
                    transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ICONOS FLOTANTES ANIMADOS EN EL ESPACIO (Estilo Chef Oro) */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          {/* Sombrero de Chef Animado Flotante de tu Imagen */}
          <motion.div 
            animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-[10%] p-3 rounded-full bg-yellow-500/10 border border-yellow-500/30 backdrop-blur-sm hidden md:block"
          >
            <Utensils className="w-8 h-8 text-yellow-500/60" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -8, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/3 right-[12%] p-3 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm hidden md:block"
          >
            <Beef className="w-8 h-8 text-amber-500/50" />
          </motion.div>

          <motion.div 
            animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/3 right-[20%] text-yellow-500/40 hidden lg:block"
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        </div>

        {/* CONTENIDO TEXTUAL DEL HERO */}
        <div className="relative z-20 text-center max-w-4xl mx-auto space-y-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-black tracking-[0.3em] uppercase rounded-full shadow-[0_0_20px_rgba(234,179,8,0.15)]"
          >
            <motion.span
              className="absolute inset-0 rounded-full border border-yellow-500/40"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <Flame className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
            CATERING & EVENTOS DE LUJO
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.95)]"
          >
            Nuestro{" "}
            <motion.span
              className="font-serif italic font-normal text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(90deg, #facc15, #fbbf24, #eab308, #facc15)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPositionX: ["0%", "200%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
              Menú
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md"
          >
            Sinfonía de sabores exclusivos. Desde crujientes cortes a la parrilla y el alma de la cocina criolla, hasta el misticismo aromático de la gastronomía árabe.
          </motion.p>
        </div>

        {/* BURBUJA FLOTANTE DE WHATSAPP */}
        <motion.a
          href="https://wa.me/51999999999?text=Hola%20DeParraSpitz,%20me%20gustar%C3%ADa%20cotizar%20un%20servicio%20de%20catering."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_25px_rgba(37,211,102,0.7)] active:scale-95 transition-colors duration-300 group"
          aria-label="Contactar por WhatsApp"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.8 }}
          whileHover={{ scale: 1.1 }}
        >
          {/* Tooltip elegante que aparece al pasar el cursor */}
          <span className="absolute left-16 scale-0 group-hover:scale-100 transition-all duration-200 origin-left bg-zinc-900/90 border border-zinc-800 text-white text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap shadow-xl">
            ¿Hablamos de tu evento? 💬
          </span>

          {/* SVG del Logo Oficial de WhatsApp */}
          <svg
            className="w-7 h-7 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.66.986 3.288 1.447 4.805 1.448 5.422-.002 9.835-4.42 9.838-9.843.002-2.628-1.022-5.1-2.882-6.962C16.505 1.933 14.03 .907 11.4 .905c-5.43 0-9.843 4.417-9.846 9.843-.001 1.713.465 3.393 1.348 4.885L1.879 21.05l5.768-1.896zM17.02 14.12c-.29-.145-1.72-.85-1.986-.944-.268-.096-.463-.145-.658.145-.195.29-.757.945-.928 1.14-.17.193-.342.217-.633.073-.29-.145-1.228-.453-2.338-1.444-.864-.77-1.447-1.72-1.617-2.012-.17-.29-.018-.447.127-.591.13-.13.29-.34.436-.508.145-.17.195-.29.293-.483.097-.193.048-.36-.024-.507-.073-.145-.658-1.594-.9-2.174-.237-.573-.478-.496-.658-.505-.17-.008-.365-.01-.56-.01s-.51.073-.778.365c-.268.29-1.022.997-1.022 2.43 0 1.434 1.045 2.82 1.19 3.015.145.195 2.057 3.14 4.984 4.403.696.3 1.24.48 1.666.616.7.222 1.338.19 1.843.115.56-.083 1.72-.702 1.962-1.38.243-.678.243-1.258.17-1.38-.072-.122-.268-.194-.56-.34z" />
          </svg>
        </motion.a>

        {/* SECCIÓN INTERACTIVA DE CONTADORES (Estilo tu Imagen Premium) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
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
            <h4 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300 font-serif">100%</h4>
            <p className="text-[9px] sm:text-xs text-zinc-400 uppercase tracking-widest mt-1">A tu Medida</p>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-500 z-20 flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase text-yellow-500/40">Explorar Platos</span>
          <ChevronDown className="w-4 h-4 text-yellow-500/60" />
        </motion.div>
      </header>

      {/* ========================================== */}
      {/* CUERPO DEL MENÚ (FILTROS Y GRILLA)        */}
      {/* ========================================== */}
      <main className="max-w-7xl mx-auto space-y-12 pb-32 pt-16 px-4 sm:px-6 lg:px-8 relative z-30">
        
        {/* Barra de Filtros Interactiva */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#2d2016]/40">
          <div className="flex items-center gap-2.5 text-xs font-semibold tracking-widest uppercase text-zinc-300">
            <SlidersHorizontal className="w-4 h-4 text-yellow-500" />
            <span>Categorías / <span className="text-yellow-500">{filteredProducts.length}</span> Delicias encontradas</span>
          </div>

          <motion.div
            className="flex items-center gap-2 overflow-x-auto pb-3 lg:pb-0 scrollbar-none snap-x"
            initial="hidden"
            animate="show"
            variants={staggerContainer}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <motion.button
                  key={cat}
                  variants={staggerItem}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer snap-center border ${
                    isActive
                      ? "text-black border-transparent shadow-[0_5px_15px_rgba(234,179,8,0.3)]"
                      : "bg-[#110d0a] border-[#322319] text-zinc-400 hover:text-white hover:border-yellow-500/40"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeThemePill"
                      className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {cat === "Todos" && <UtensilsCrossed size={12} />}
                    {cat.toLowerCase().includes("parri") && <Flame size={12} />}
                    {cat.toLowerCase().includes("arabe") && <Soup size={12} />}
                    {cat}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* GRILLA DE PRODUCTOS CON ANIMACIÓN MAGNÉTICA */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-zinc-900/40 border border-zinc-800 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(110deg, transparent 30%, rgba(234,179,8,0.08) 50%, transparent 70%)" }}
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            ))}
          </div>
        ) : (
          <motion.section
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="show"
            variants={staggerContainer}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={() => setSelectedProduct(product)}
                  onAdd={() => handleAddToCart(product)}
                />
              ))}
            </AnimatePresence>
          </motion.section>
        )}
      </main>

      {/* MODAL DETALLES PREMIUM (Mantenido intacto pero pulido) */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
            {/* Contenedor Modal */}
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.97, filter: "blur(6px)" }}
              animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ y: 30, opacity: 0, scale: 0.97, filter: "blur(6px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#0c0806] border border-[#3d2c1f] rounded-2xl overflow-hidden md:grid md:grid-cols-12 flex flex-col"
            >
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-40 w-9 h-9 bg-black/60 hover:bg-yellow-500 hover:text-black text-zinc-400 rounded-xl flex items-center justify-center border border-[#3d2c1f] cursor-pointer transition-colors"
              >
                <X size={15} />
              </motion.button>
              <div className="md:col-span-5 h-64 md:h-[500px] overflow-hidden">
                <motion.img
                  src={selectedProduct.imageUrl || "https://placehold.co/600x400"}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.15, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <motion.div
                className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <div className="space-y-4">
                  <div>
                    <span className="text-yellow-500 text-[10px] font-black tracking-widest uppercase block mb-1">{selectedProduct.category?.name || selectedProduct.category}</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white font-serif">{selectedProduct.name}</h2>
                  </div>
                  <p className="text-3xl font-black text-yellow-400 font-mono">{formatPrice(Number(selectedProduct.price))}</p>
                  <p className="text-zinc-300 text-xs md:text-sm font-light leading-relaxed">{selectedProduct.description || "Insumos premium seleccionados especialmente para banquetes y eventos corporativos exigentes."}</p>
                </div>
                <div className="pt-4 border-t border-[#2d2016]/60 mt-6">
                  <MagneticButton
                    onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
                    className="w-full h-12 font-bold uppercase tracking-widest text-xs rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black"
                  >
                    <ShoppingCart size={14} strokeWidth={2.5} /> Confirmar e incluir en cotización
                  </MagneticButton>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(price);
};