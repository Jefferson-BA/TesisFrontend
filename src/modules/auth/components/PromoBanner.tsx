import { usePromoStore } from "@/modules/auth/store/promoStore";

export default function PromoBanner() {
  const promos = usePromoStore((state) => state.promos);

  if (promos.length === 0) return null;

  return (
    <section className="bg-[#120d0a] py-16 border-y border-[#4a3824]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-serif font-bold text-white mb-8">
          Promociones Especiales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="bg-[#18110e] border border-yellow-600 rounded-2xl p-8 shadow-lg"
            >
              <span className="bg-yellow-500 text-black font-black px-4 py-2 rounded-full">
                {promo.discount}
              </span>

              <h3 className="text-3xl font-bold mt-6">
                {promo.title}
              </h3>

              <p className="text-[#f1d8b5] mt-4">
                {promo.description}
              </p>

              <a
                href="/menu"
                className="inline-block mt-6 bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold"
              >
                Ver menú
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}