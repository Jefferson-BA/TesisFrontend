import { useEffect, useState, useMemo, useRef } from "react";
import { 
  ShoppingCart, X, ShieldCheck, AlertCircle, Award, 
  Flame, SlidersHorizontal, UtensilsCrossed, ChevronDown,
  Sparkles, Soup, Beef, Utensils, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { getProducts } from "@/modules/admin/productos/services/product.service";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";

// IMÁGENES TEMÁTICAS ACLARADAS Y EDITADAS
const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop", // Parrilla
  "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=2070&auto=format&fit=crop", // Lomo Saltado Criollo
  "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=2070&auto=format&fit=crop"  // Árabe
];

// Componente para animar los números del contador de prestigio
const CounterNumber = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    let totalDuration = 2000;
    let incrementTime = Math.floor(totalDuration / end);
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);
  return <>{count}</>;
};

export const MenuProducts = () => {
  const heroRef = useRef(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

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
      <header ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black px-4 pt-16">
        
        {/* Fondo con Carrusel Parallax Avanzado */}
        <motion.div style={{ y: yBg, opacity: opacityBg }} className="absolute inset-0 z-0">
          {BACKGROUND_IMAGES.map((image, index) => (
            <motion.div
              key={image}
              className="absolute inset-0 bg-cover bg-center"
              initial={{ opacity: 0, scale: 1 }}
              animate={{ 
                opacity: index === currentImageIndex ? 0.65 : 0, // Aclarado para que luzca vibrante
                scale: index === currentImageIndex ? 1.05 : 1
              }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              style={{ backgroundImage: `url('${image}')` }}
            />
          ))}
          {/* Capa de partículas dinámicas cruzadas */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#0b0806_95%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#0b0806] z-10" />
        </motion.div>

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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-black tracking-[0.3em] uppercase rounded-full shadow-[0_0_20px_rgba(234,179,8,0.15)]"
          >
            <Flame className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
            CATERING & EVENTOS DE LUJO
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.95)]"
          >
            Nuestro <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500">Menú</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md"
          >
            Sinfonía de sabores exclusivos. Desde crujientes cortes a la parrilla y el alma de la cocina criolla, hasta el misticismo aromático de la gastronomía árabe.
          </motion.p>
        </div>

        {/* SECCIÓN INTERACTIVA DE CONTADORES (Estilo tu Imagen Premium) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-20 mt-16 w-full max-w-3xl grid grid-cols-3 gap-2 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-[#0a0705]/80 border border-[#2d2016]/80 backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.7)]"
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

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-500 z-20 flex flex-col items-center gap-1 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          <span className="text-[9px] tracking-[0.3em] uppercase text-yellow-500/40">Explorar Platos</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-yellow-500/60" />
        </div>
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

          <div className="flex items-center gap-2 overflow-x-auto pb-3 lg:pb-0 scrollbar-none snap-x">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
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
                </button>
              );
            })}
          </div>
        </div>

        {/* GRILLA DE PRODUCTOS CON ANIMACIÓN MAGNÉTICA */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-zinc-900/40 border border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.section layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.article
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -8 }}
                  className="group bg-[#0d0907]/95 border border-[#2d2016] rounded-2xl overflow-hidden hover:border-yellow-500/40 hover:shadow-[0_15px_35px_rgba(0,0,0,0.9)] flex flex-col h-full relative"
                >
                  {/* Imagen y Badge */}
                  <div className="h-64 w-full overflow-hidden relative bg-zinc-950">
                    <img
                      src={product.imageUrl || "https://placehold.co/600x400"}
                      alt={product.name}
                      onClick={() => setSelectedProduct(product)}
                      className="h-full w-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-105 brightness-90 group-hover:brightness-100"
                    />
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-yellow-500/30 text-yellow-400 text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-lg shadow-lg">
                      {product.category?.name || product.category || "Especial de la Casa"}
                    </div>
                  </div>

                  {/* Cuerpo */}
                  <div className="p-5 flex flex-col flex-grow justify-between space-y-4 bg-gradient-to-b from-transparent to-black/20">
                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                        <ShieldCheck size={10} /> Alta Cocina Garantizada
                      </span>
                      <h2 onClick={() => setSelectedProduct(product)} className="text-lg font-bold font-serif text-zinc-100 cursor-pointer hover:text-yellow-400 line-clamp-2 min-h-[52px] transition-colors">
                        {product.name}
                      </h2>
                    </div>

                    <div className="pt-3 border-t border-[#2d2016]/60 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Inversión Cubierto</span>
                        <p className="text-2xl font-black text-yellow-400 font-mono">
                          {formatPrice(Number(product.price))}
                        </p>
                      </div>

                      <motion.button
                        onClick={() => handleAddToCart(product)}
                        whileTap={{ scale: 0.96 }}
                        className="w-full h-11 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black uppercase tracking-widest text-[11px] rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                      >
                        <ShoppingCart size={13} strokeWidth={2.5} />
                        Agregar al Pedido
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
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
            <motion.div initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl bg-[#0c0806] border border-[#3d2c1f] rounded-2xl overflow-hidden md:grid md:grid-cols-12 flex flex-col">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-40 w-9 h-9 bg-black/60 hover:bg-yellow-500 hover:text-black text-zinc-400 rounded-xl flex items-center justify-center border border-[#3d2c1f] cursor-pointer">
                <X size={15} />
              </button>
              <div className="md:col-span-5 h-64 md:h-[500px]">
                <img src={selectedProduct.imageUrl || "https://placehold.co/600x400"} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="text-yellow-500 text-[10px] font-black tracking-widest uppercase block mb-1">{selectedProduct.category?.name || selectedProduct.category}</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white font-serif">{selectedProduct.name}</h2>
                  </div>
                  <p className="text-3xl font-black text-yellow-400 font-mono">{formatPrice(Number(selectedProduct.price))}</p>
                  <p className="text-zinc-300 text-xs md:text-sm font-light leading-relaxed">{selectedProduct.description || "Insumos premium seleccionados especialmente para banquetes y eventos corporativos exigentes."}</p>
                </div>
                <div className="pt-4 border-t border-[#2d2016]/60 mt-6">
                  <button onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }} className="w-full h-12 font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-yellow-500 to-amber-500 text-black">
                    <ShoppingCart size={14} strokeWidth={2.5} /> Confirmar e incluir en cotización
                  </button>
                </div>
              </div>
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