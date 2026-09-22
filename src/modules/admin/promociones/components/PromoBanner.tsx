// src/modules/admin/promociones/components/PromoBanner.tsx

import { useEffect, useState } from 'react';
import { Flame, ArrowRight, Calendar, Tag } from 'lucide-react';
import { getActivePromotions } from '../services/promotion.service';
import type { Promotion } from '../interfaces/promotion.interface';
import { getPromoLabel, formatPromoDates } from '../utils/promoUtils';

/* ─── SINGLE CARD ─── */
function PromoCard({ promo, index }: { promo: Promotion; index: number }) {
  const label = getPromoLabel(promo);
  const dates = formatPromoDates(promo.startDate, promo.endDate);

  return (
    <div
      className="promo-card group relative overflow-hidden rounded-2xl border border-border bg-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Background image */}
      {promo.imageUrl ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 group-hover:scale-110 transition-transform duration-700"
            style={{ backgroundImage: `url(${promo.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950 via-orange-900 to-red-950" />
      )}

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full min-h-[240px] justify-between">
        {/* Top badges */}
        <div className="flex items-start justify-between gap-2">
          {/* Discount badge */}
          <div className="inline-flex items-center gap-1.5 bg-amber-500 text-black px-3 py-1.5 rounded-full font-black text-sm shadow-lg shadow-amber-500/40 uppercase tracking-wide">
            <Flame size={13} />
            {label}
          </div>

          {/* Active indicator */}
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white/80 text-[10px] font-semibold px-2.5 py-1.5 rounded-full border border-white/10 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Activo
          </div>
        </div>

        {/* Title & description */}
        <div className="space-y-2 mt-4">
          <h3 className="text-xl font-black text-white leading-tight line-clamp-2 drop-shadow-lg">
            {promo.title}
          </h3>
          <p className="text-white/75 text-sm line-clamp-2 leading-relaxed">
            {promo.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/15">
          {/* Dates */}
          <div className="flex items-center gap-1.5 text-white/60 text-[11px]">
            <Calendar size={11} />
            <span>{dates}</span>
          </div>

          {/* CTA */}
          <a
            href="/menu"
            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold text-xs px-4 py-2 rounded-full transition-all hover:gap-2.5"
          >
            Ver menú
            <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN BANNER ─── */
export default function PromoBanner() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivePromotions()
      .then((data) => setPromos(Array.isArray(data) ? data : []))
      .catch(() => setPromos([]))
      .finally(() => setLoading(false));
  }, []);

  // Don't render while loading or if no active promos
  if (loading || promos.length === 0) return null;

  return (
    <section className="promo-banner-section py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            <Tag size={12} />
            Ofertas exclusivas
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Promociones Especiales
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Descuentos y beneficios disponibles por tiempo limitado. ¡No te los pierdas!
          </p>
        </div>

        {/* Grid */}
        <div className={`grid gap-6 ${
          promos.length === 1
            ? 'grid-cols-1 max-w-xl mx-auto'
            : promos.length === 2
              ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}>
          {promos.map((promo, i) => (
            <PromoCard key={promo.id} promo={promo} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}