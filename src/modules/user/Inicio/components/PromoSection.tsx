// src/modules/user/Inicio/components/PromoSection.tsx
// Sección "Nuestras Promociones Temporales" que se muestra entre
// la sección de Testimonios y Nuestras Especialidades en la página principal.

"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Calendar, ArrowRight, Tag, ChevronLeft, ChevronRight, Percent, DollarSign, ShoppingCart } from "lucide-react";
import { getActivePromotions } from "@/modules/admin/promociones/services/promotion.service";
import type { Promotion } from "@/modules/admin/promociones/interfaces/promotion.interface";
import { getPromoLabel, formatPromoDates } from "@/modules/admin/promociones/utils/promoUtils";

/* ── Utils ── */
function getDiscountIcon(type: string) {
  const t = (type || '').toLowerCase();
  if (t === "percentage") return <Percent size={12} />;
  if (t === "fixed_amount") return <DollarSign size={12} />;
  return <ShoppingCart size={12} />;
}

/* ── Single Card ── */
function PromoCard({ promo, index }: { promo: Promotion; index: number }) {
  const label = getPromoLabel(promo);
  const dates = formatPromoDates(promo.startDate, promo.endDate);
  const typeLower = (promo.discountType || '').toLowerCase();

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-2xl overflow-hidden border border-border/60 shadow-xl shadow-black/20 flex flex-col h-full hover:-translate-y-1.5 transition-transform duration-500"
    >
      {/* Image layer */}
      <div className="relative h-56 overflow-hidden bg-muted shrink-0">
        {promo.imageUrl ? (
          <>
            <img
              src={promo.imageUrl}
              alt={promo.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-950 via-orange-900 to-red-950" />
        )}

        {/* Discount badge */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-amber-500 text-black px-3 py-1.5 rounded-full font-black text-sm shadow-lg shadow-amber-500/50 uppercase tracking-wide">
          <Flame size={12} strokeWidth={3} />
          {label}
        </div>

        {/* Type badge */}
        <div className="absolute top-4 right-4 inline-flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white/80 text-[10px] font-bold px-2.5 py-1.5 rounded-full border border-white/10 uppercase tracking-wider">
          {getDiscountIcon(promo.discountType)}
          {typeLower === "percentage" ? "% Dto." : typeLower === "fixed_amount" ? "Monto fijo" : "Combo"}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow bg-card">
        <h3 className="text-lg font-black text-foreground leading-tight mb-2 line-clamp-2">
          {promo.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-grow">
          {promo.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between pt-4 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
            <Calendar size={11} className="text-amber-500" />
            <span>{dates}</span>
          </div>
          {promo.applyTo !== "all" && (
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {promo.applyTo === "product" ? "Producto" : "Categoría"}
            </span>
          )}
          {promo.applyTo === "all" && (
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Todo el menú
            </span>
          )}
        </div>

        {/* CTA */}
        <a
          href="/menu"
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 hover:border-amber-500/50 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider transition-all group/cta"
        >
          Ver en menú
          <ArrowRight size={12} className="transition-transform group-hover/cta:translate-x-1" />
        </a>
      </div>
    </motion.article>
  );
}

/* ── Carousel controls ── */
function CarouselDots({ total, current, onChange }: { total: number; current: number; onChange: (i: number) => void }) {
  return (
    <div className="flex items-center gap-2 justify-center mt-8">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className={`rounded-full transition-all duration-300 ${i === current ? "w-8 h-2 bg-amber-500" : "w-2 h-2 bg-border hover:bg-amber-500/40"}`}
          aria-label={`Ver promoción ${i + 1}`}
        />
      ))}
    </div>
  );
}

/* ── Main Section ── */
export function PromoSection() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerIn, setHeaderIn] = useState(false);

  // Cols: 1 col mobile, 2 tablet, 3 desktop — group by 3 for carousel
  const CARDS_PER_PAGE = 3;
  const totalPages = Math.ceil(promos.length / CARDS_PER_PAGE);
  const page = Math.min(current, totalPages - 1);
  const visiblePromos = promos.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);

  useEffect(() => {
    getActivePromotions()
      .then((d) => setPromos(Array.isArray(d) ? d : []))
      .catch(() => setPromos([]))
      .finally(() => setLoading(false));
  }, []);

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

  // Don't render if no active promos
  if (loading || promos.length === 0) return null;

  return (
    <section className="relative py-24 px-4 sm:px-6 bg-background overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklch,var(--ember)_7%,transparent)_0%,transparent_65%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-5"
          >
            <span className="block h-[1px] w-8 bg-gradient-to-r from-transparent to-amber-500" />
            <span className="text-[11px] font-black tracking-[0.28em] uppercase text-amber-500 flex items-center gap-1.5">
              <Tag size={11} />
              Ofertas por tiempo limitado
            </span>
            <span className="block h-[1px] w-8 bg-gradient-to-r from-amber-500 to-transparent" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerIn ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight"
          >
            Nuestras Promociones{" "}
            <em className="bg-gradient-to-r from-amber-500 to-orange-400 bg-clip-text text-transparent not-italic font-normal">
              Temporales
            </em>
          </motion.h2>

          <div className="mx-auto mt-5 h-[1.5px] w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerIn ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 text-base max-w-xl mx-auto font-light leading-relaxed text-muted-foreground"
          >
            Descuentos exclusivos disponibles por tiempo limitado. Aprovecha estas ofertas especiales antes de que expiren.
          </motion.p>
        </div>

        {/* Cards grid with animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`grid gap-6 ${
              visiblePromos.length === 1
                ? "grid-cols-1 max-w-sm mx-auto"
                : visiblePromos.length === 2
                  ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {visiblePromos.map((promo, i) => (
              <PromoCard key={promo.id} promo={promo} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Carousel dots & arrows — only when more than CARDS_PER_PAGE */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={() => setCurrent((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-border text-muted-foreground hover:border-amber-500/50 hover:text-amber-500 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <CarouselDots total={totalPages} current={page} onChange={setCurrent} />
            <button
              type="button"
              onClick={() => setCurrent((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-border text-muted-foreground hover:border-amber-500/50 hover:text-amber-500 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headerIn ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-14"
        >
          <a
            href="/menu"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-[0_8px_32px_rgba(251,191,36,0.3)] hover:shadow-[0_16px_48px_rgba(251,191,36,0.45)] transition-shadow duration-300 group"
          >
            Ver todo el menú con precios
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <p className="mt-3 text-xs text-muted-foreground">
            Promociones válidas mientras duren · Aplican condiciones
          </p>
        </motion.div>
      </div>
    </section>
  );
}
