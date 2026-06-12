import { useEffect, useState, useMemo } from "react";
import { ShoppingCart, X, Clock, ShieldCheck, AlertCircle, Award, Flame, SlidersHorizontal, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { getProducts } from "@/modules/admin/productos/services/product.service";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";

/* Variantes de animación: la grilla orquesta la entrada escalonada de cada tarjeta */
const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const MenuProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(Array.isArray(res) ? res : res.data || []))
      .finally(() => setIsLoading(false));
  }, []);

  // Extraer categorías dinámicas únicas de tus productos reales
  const categories = useMemo(() => {
    const rawCategories = products.map((p) => p.category?.name || p.category || "Criollo");
    return ["Todos", ...Array.from(new Set(rawCategories))];
  }, [products]);

  // Filtrado de productos en tiempo real
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
      style: {
        background: "#0d0907",
        color: "#fff",
        border: "1px solid #3d2c1f",
        fontFamily: "serif",
      },
    });
  };

  // Formateador de moneda de alta gama
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="w-full space-y-12 py-6 relative">
      {/* SECCIÓN DE FILTROS ULTRA DELICADA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2d2016]/40 px-4 sm:px-0">
        <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-zinc-400">
          <SlidersHorizontal className="w-3.5 h-3.5 text-yellow-500/80" />
          <span>
            Filtrar Menú Exclusivo / {filteredProducts.length} Variedad
            {filteredProducts.length === 1 ? "" : "es"}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors duration-300 whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? "text-black border-transparent"
                    : "bg-[#0f0b08]/50 border-[#2d2016]/60 text-zinc-400 hover:text-white hover:border-yellow-500/20"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="categoryPill"
                    className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl shadow-[0_4px_15px_rgba(234,179,8,0.25)] -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ESTADO DE CARGA: SKELETONS */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-[#2d2016]/60 bg-[#0d0907]/60 animate-pulse"
            >
              <div className="h-60 w-full bg-[#16100c]" />
              <div className="p-5 space-y-4">
                <div className="h-3 w-24 bg-[#16100c] rounded" />
                <div className="h-5 w-3/4 bg-[#16100c] rounded" />
                <div className="h-10 w-full bg-[#16100c] rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ESTADO VACÍO */}
      {!isLoading && filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0d0907] border border-[#2d2016]/60 flex items-center justify-center text-yellow-500/70 mb-5">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold font-serif text-white mb-2">
            Sin platillos en esta categoría
          </h3>
          <p className="text-zinc-500 text-sm font-light max-w-sm">
            Estamos preparando nuevas propuestas para esta sección. Mientras
            tanto, explora otra categoría de nuestra carta.
          </p>
        </div>
      )}

      {/* CUADRÍCULA DE PRODUCTOS PREMIUM */}
      {!isLoading && filteredProducts.length > 0 && (
        <motion.section
          layout
          variants={gridVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-0 relative z-10"
        >
          {/* Luces de ambiente sutiles detrás de la grilla */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-600/3 rounded-full blur-[120px] pointer-events-none" />

          {filteredProducts.map((product) => (
            <motion.article
              key={product.id}
              layout
              variants={cardVariants as any}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group bg-[#0d0907]/90 border border-[#2d2016]/60 rounded-2xl overflow-hidden hover:border-yellow-500/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col h-full relative backdrop-blur-sm"
            >
              {/* Contenedor de Imagen con Efecto Hover Complejo */}
              <div className="h-60 w-full overflow-hidden relative bg-zinc-950 shrink-0">
                <img
                  src={product.imageUrl || "https://placehold.co/600x400"}
                  alt={product.name}
                  onClick={() => setSelectedProduct(product)}
                  className="h-full w-full object-cover cursor-pointer transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.9] group-hover:brightness-100"
                />
                {/* Gradiente de fusión cinematográfico */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0907] via-transparent to-black/30 opacity-100 pointer-events-none" />

                {/* Categoría flotante minimalista */}
                <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-[#3d2c1f]/60 text-yellow-500 text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-md shadow-lg">
                  {product.category?.name || product.category || "Criollo"}
                </span>
              </div>

              {/* Cuerpo de la Tarjeta */}
              <div className="p-5 flex flex-col flex-grow justify-between space-y-4 bg-gradient-to-b from-transparent to-[#050302]/40">
                <div className="space-y-3 flex-grow">
                  {/* Estado de Disponibilidad Delicado */}
                  <div className="flex items-center gap-1.5">
                    {product.stock >= 10 ? (
                      <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-500/5 px-2.5 py-0.5 rounded border border-emerald-500/10">
                        <ShieldCheck size={11} /> Disponible hoy
                      </span>
                    ) : product.stock > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold text-amber-400 bg-amber-500/5 px-2.5 py-0.5 rounded border border-amber-500/10">
                        <Clock size={11} /> Bajo pedido
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold text-rose-400 bg-rose-500/5 px-2.5 py-0.5 rounded border border-rose-500/10">
                        <AlertCircle size={11} /> Agotado
                      </span>
                    )}
                  </div>

                  <h2
                    onClick={() => setSelectedProduct(product)}
                    className="text-lg font-bold font-serif text-zinc-100 tracking-wide leading-snug cursor-pointer hover:text-yellow-500 transition-colors line-clamp-2 min-h-[52px]"
                  >
                    {product.name}
                  </h2>
                </div>

                {/* Precio y Acciones Estilizadas */}
                <div className="pt-4 border-t border-[#2d2016]/40 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
                      Inversión del servicio
                    </span>
                    <p className="text-2xl font-black font-sans text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200">
                      {formatPrice(Number(product.price))}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-[11px] text-zinc-400 font-semibold uppercase tracking-widest hover:text-white transition-colors text-center py-1 underline underline-offset-4 cursor-pointer"
                    >
                      Detalles del Platillo
                    </button>

                    <motion.button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full h-11 font-bold uppercase tracking-widest text-[11px] rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                        product.stock === 0
                          ? "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800/60"
                          : "bg-gradient-to-br from-yellow-500 to-amber-500 text-black hover:from-yellow-400 hover:to-amber-400 shadow-md shadow-yellow-500/10"
                      }`}
                    >
                      <ShoppingCart size={13} strokeWidth={2.5} />
                      {product.stock === 0 ? "No disponible" : "Agregar pedido"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.section>
      )}

      {/* DETALLE DE PRODUCTO: MODAL BANQUETE EXPERIENCIA */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl bg-[#0c0806] border border-[#3d2c1f] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] md:grid md:grid-cols-12 flex flex-col max-h-[90vh] md:max-h-none"
            >
              {/* Botón de Cierre Flotante Premium */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-40 w-9 h-9 bg-black/60 hover:bg-yellow-500 hover:text-black text-zinc-400 rounded-xl flex items-center justify-center transition-all duration-200 border border-[#3d2c1f] cursor-pointer"
              >
                <X size={15} />
              </button>

              {/* Panel Izquierdo: Imagen Cinematográfica */}
              <div className="relative md:col-span-5 h-64 md:h-[520px] bg-zinc-950 shrink-0">
                <img
                  src={selectedProduct.imageUrl || "https://placehold.co/600x400"}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0c0806] via-transparent to-transparent opacity-80 md:opacity-100" />
              </div>

              {/* Panel Derecho: Contenido Gastronómico */}
              <div className="relative md:col-span-7 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-[#0c0806]">
                <div className="space-y-5">
                  <div>
                    <span className="text-yellow-500 text-[9px] font-black tracking-[0.25em] uppercase block mb-1">
                      {selectedProduct.category?.name || selectedProduct.category || "Especialidad de la Casa"}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white font-serif tracking-wide leading-tight">
                      {selectedProduct.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-4 pb-4 border-b border-[#2d2016]/60">
                    <p className="text-3xl font-black font-sans text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200">
                      {formatPrice(Number(selectedProduct.price))}
                    </p>
                    <div className="h-4 w-[1px] bg-[#2d2016]" />
                    {selectedProduct.stock >= 10 ? (
                      <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold bg-emerald-500/5 px-2.5 py-0.5 rounded border border-emerald-500/10">
                        Servicio Inmediato
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold bg-amber-500/5 px-2.5 py-0.5 rounded border border-amber-500/10">
                        Bajo Agenda / Limitado
                      </span>
                    )}
                  </div>

                  {/* Descripción */}
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Reseña Gastronómica</h4>
                    <p className="text-zinc-300 text-xs md:text-sm font-light leading-relaxed">
                      {selectedProduct.description ||
                        "Este servicio gastronómico exclusivo ha sido minuciosamente planificado por nuestro equipo culinario. Preparado con insumos premium seleccionados de alta gama, garantizando una presentación y sabor impecables para sus distinguidos invitados."}
                    </p>
                  </div>

                  {/* Beneficios Integrados */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#140f0c] border border-[#2d2016]/40">
                      <Flame size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-[11px] font-bold text-zinc-200">Menaje Premium</h5>
                        <p className="text-[10px] text-zinc-500">Logística e ingeniería visual</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#140f0c] border border-[#2d2016]/40">
                      <Award size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-[11px] font-bold text-zinc-200">Garantía DeParraSpitz</h5>
                        <p className="text-[10px] text-zinc-500">Alta cocina corporativa</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones del Modal */}
                <div className="pt-4 border-t border-[#2d2016]/60 mt-6">
                  <motion.button
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={selectedProduct.stock === 0}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full h-12 font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-lg ${
                      selectedProduct.stock === 0
                        ? "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800/60"
                        : "bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:from-yellow-400 hover:to-amber-400 shadow-yellow-500/5"
                    }`}
                  >
                    <ShoppingCart size={14} strokeWidth={2.5} />
                    {selectedProduct.stock === 0 ? "Sin existencias" : "Confirmar e incluir en mi orden"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};