import { useEffect, useState } from "react";
import { ShoppingCart, X, Clock, ShieldCheck, AlertCircle, Utensils, Award, Flame } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { getProducts } from "@/modules/admin/productos/services/product.service";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";

export const MenuProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    getProducts().then((res) =>
      setProducts(Array.isArray(res) ? res : res.data || [])
    );
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      category: product.category?.name || product.category || "Criollo",
    });

    toast.success(`${product.name} agregado al carrito`, {
      style: {
        background: '#120d0a',
        color: '#fff',
        border: '1px solid #4a3824',
      }
    });
  };

  return (
    <>
      {/* CUADRÍCULA DE PRODUCTOS PREMIUM */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-0">
        {products.map((product) => (
          <article
            key={product.id}
            className="group bg-[#0e0a08]/90 border border-[#3d2c1f]/50 rounded-3xl overflow-hidden transition-all duration-500 hover:border-yellow-500/30 hover:shadow-[0_20px_50px_rgba(234,179,8,0.04)] flex flex-col h-full relative"
          >
            {/* Contenedor de Imagen con Efecto Hover Complejo */}
            <div className="h-64 w-full overflow-hidden relative bg-zinc-950 shrink-0 ring-1 ring-white/5">
              <img
                src={product.imageUrl || "https://placehold.co/600x400"}
                alt={product.name}
                onClick={() => setSelectedProduct(product)}
                className="h-full w-full object-cover cursor-pointer transition-transform duration-1000 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
              />
              {/* Gradiente sutil para fusionar la imagen con el fondo de la tarjeta */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a08] via-transparent to-transparent opacity-90 pointer-events-none" />
              
              {/* Categoría flotante minimalista */}
              <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-yellow-500/90 text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full">
                {product.category?.name || product.category || "Criollo"}
              </span>
            </div>

            {/* Cuerpo de la Tarjeta */}
            <div className="p-6 flex flex-col flex-grow justify-between bg-gradient-to-b from-transparent to-[#0a0705]/50">
              <div className="flex-grow">
                {/* Estado de Disponibilidad */}
                <div className="mb-4 flex items-center gap-1.5">
                  {product.stock >= 10 ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/10">
                      <ShieldCheck size={12} /> Disponible hoy
                    </span>
                  ) : product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/10">
                      <Clock size={12} /> Bajo pedido
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/10">
                      <AlertCircle size={12} /> Agotado
                    </span>
                  )}
                </div>

                <h2 
                  onClick={() => setSelectedProduct(product)}
                  className="text-xl font-bold font-serif text-zinc-100 tracking-tight leading-snug cursor-pointer hover:text-yellow-500 transition-colors line-clamp-2 min-h-[56px]"
                >
                  {product.name}
                </h2>
              </div>

              {/* Precio y Acciones Estilizadas */}
              <div className="mt-6 pt-4 border-t border-[#3d2c1f]/40">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Inversión</span>
                  <p className="text-2xl font-black text-yellow-500 font-sans tracking-tight">
                    S/ {Number(product.price).toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col gap-3.5">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="text-xs text-zinc-400 font-bold uppercase tracking-widest hover:text-yellow-500 transition-colors text-center py-1"
                  >
                    Detalles del Platillo
                  </button>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-full font-bold uppercase tracking-widest text-xs py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-300 ${
                      product.stock === 0
                        ? "bg-zinc-800/50 text-zinc-500 cursor-not-allowed border border-zinc-700/30"
                        : "bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:from-yellow-400 hover:to-amber-400 shadow-lg shadow-yellow-500/5 hover:scale-[1.01]"
                    }`}
                  >
                    <ShoppingCart size={14} strokeWidth={2.5} />
                    {product.stock === 0 ? "No disponible" : "Agregar pedido"}
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* DETALLE DE PRODUCTO: MODAL BANQUETE EXPERIENCIA */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-[#110c09] border border-[#4a3824]/40 rounded-3xl overflow-hidden shadow-2xl md:grid md:grid-cols-12 max-h-[92vh] md:max-h-none flex flex-col ring-1 ring-white/5"
            >
              {/* Botón de Cierre Flotante */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-40 bg-black/50 hover:bg-yellow-500 hover:text-black text-zinc-300 rounded-full p-2.5 transition-all duration-200 border border-white/10"
              >
                <X size={16} />
              </button>

              {/* Panel Izquierdo: Imagen Cinematográfica */}
              <div className="relative md:col-span-6 h-72 md:h-[580px] bg-zinc-950 shrink-0">
                <img
                  src={selectedProduct.imageUrl || "https://placehold.co/600x400"}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#110c09] via-transparent to-transparent opacity-50 md:opacity-90" />
              </div>

              {/* Panel Derecho: Contenido Gastronómico */}
              <div className="relative md:col-span-6 p-8 md:p-10 flex flex-col justify-between overflow-y-auto bg-[#110c09]">
                <div className="space-y-6">
                  <div>
                    <span className="text-yellow-500 text-[10px] font-black tracking-[0.3em] uppercase block mb-2">
                      {selectedProduct.category?.name || selectedProduct.category || "Especialidad de la Casa"}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white font-serif tracking-tight">
                      {selectedProduct.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-5 pb-5 border-b border-[#3d2c1f]/50">
                    <p className="text-3xl font-black text-yellow-500 font-sans">
                      S/ {Number(selectedProduct.price).toFixed(2)}
                    </p>
                    <div className="h-4 w-[1px] bg-[#3d2c1f]" />
                    {selectedProduct.stock >= 10 ? (
                      <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/10">
                        Alta Disponibilidad
                      </span>
                    ) : (
                      <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/10">
                        Stock Limitado
                      </span>
                    )}
                  </div>

                  {/* Descripción del plato */}
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Reseña Gastronómica</h4>
                    <p className="text-zinc-300 text-sm font-light leading-relaxed">
                      {selectedProduct.description ||
                        "Este platillo de alta cocina ha sido minuciosamente estructurado por nuestro chef corporativo. Preparado con insumos frescos e ideal para banquetes y eventos privados de alta gama."}
                    </p>
                  </div>

                  {/* Beneficios / Notas del Servicio */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-900/40 border border-[#3d2c1f]/30">
                      <Flame size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-zinc-200">Menaje Premium</h5>
                        <p className="text-[11px] text-zinc-500 mt-0.5">Presentación impecable</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-900/40 border border-[#3d2c1f]/30">
                      <Award size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-zinc-200">Chef de Alta Cocina</h5>
                        <p className="text-[11px] text-zinc-500 mt-0.5">Sabor y técnica pura</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones de Compra del Modal */}
                <div className="pt-6 border-t border-[#3d2c1f]/40 mt-8">
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={selectedProduct.stock === 0}
                    className={`w-full font-bold uppercase tracking-widest text-xs py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl ${
                      selectedProduct.stock === 0
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
                        : "bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:from-yellow-400 hover:to-amber-400"
                    }`}
                  >
                    <ShoppingCart size={15} strokeWidth={2.5} />
                    {selectedProduct.stock === 0 ? "Sin Existencias" : "Confirmar e incluir pedido"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};