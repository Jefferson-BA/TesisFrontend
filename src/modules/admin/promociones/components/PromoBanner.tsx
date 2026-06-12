import { usePromoStore } from "@/modules/auth/store/promoStore";

export default function PromoBanner() {
  const promos = usePromoStore((state) => state.promos);

  if (promos.length === 0) return null;

  return (
    <section className="promo-banner-section">
      <div className="promo-banner-container">

        <div className="promo-banner-heading">
          <span className="promo-banner-eyebrow">Ofertas exclusivas</span>
          <h2 className="promo-banner-title">Promociones Especiales</h2>
          <p className="promo-banner-subtitle">Descuentos y beneficios disponibles por tiempo limitado</p>
        </div>

        <div className="promo-banner-grid">
          {promos.map((promo, index) => (
            <div
              key={promo.id}
              className="promo-banner-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="promo-banner-card-glow" />

              <div className="promo-banner-card-top">
                <span className="promo-banner-discount">{promo.discount}</span>
                <span className="promo-banner-tag">🔥 Limitado</span>
              </div>

              <h3 className="promo-banner-card-title">{promo.title}</h3>
              <p className="promo-banner-card-desc">{promo.description}</p>

              <div className="promo-banner-card-footer">
                <a href="/menu" className="promo-banner-cta">
                  <span>Ver menú</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <div className="promo-banner-active-badge">
                  <span className="promo-banner-dot" />
                  Activo
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}