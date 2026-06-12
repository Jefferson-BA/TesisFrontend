import { useEffect, useRef, useState } from "react";
import { Flame, Utensils, ChefHat, ArrowRight } from "lucide-react";

/* Hook ligero para animar elementos al entrar en pantalla */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export const Servicios = () => {
  const servicios = [
    {
      titulo: "Buffet Parrillero",
      etiqueta: "Más solicitado",
      idealPara: "Eventos corporativos · Reuniones familiares",
      descripcion:
        "Carnes selectas a la parrilla, anticuchos, chorizo parrillero y guarniciones tradicionales. Perfecto para eventos corporativos y celebraciones familiares.",
      imagen:
        "https://images.unsplash.com/photo-1529692236671-f1dc6c7f7b1e?q=80&w=1974&auto=format&fit=crop",
      icono: <Flame className="w-5 h-5 text-yellow-500" />,
    },
    {
      titulo: "Buffet Árabe",
      etiqueta: "Experiencia internacional",
      idealPara: "Bodas · Eventos temáticos",
      descripcion:
        "Shawarma, falafel, hummus, tabule y panes árabes recién horneados. Una experiencia gastronómica única e internacional para tus invitados.",
      imagen:
        "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1974&auto=format&fit=crop",
      icono: <Utensils className="w-5 h-5 text-yellow-500" />,
    },
    {
      titulo: "Buffet Criollo",
      etiqueta: "Sabor de casa",
      idealPara: "Cumpleaños · Celebraciones íntimas",
      descripcion:
        "Ají de gallina, lomo saltado, arroz con pollo y postres tradicionales. Sabor peruano auténtico y de alta cocina en cada bocado.",
      imagen:
        "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1974&auto=format&fit=crop",
      icono: <ChefHat className="w-5 h-5 text-yellow-500" />,
    },
  ];

  return (
    <section className="bg-[#0b0806] py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Sutil resplandor de fondo ambiental */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ENCABEZADO */}
        <div className="text-center mb-20">
          <span className="text-yellow-500 text-xs font-black tracking-[0.25em] uppercase block mb-3">
            Nuestras Especialidades
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white font-serif tracking-tight">
            Servicios de Buffet{" "}
            <span className="italic font-normal text-yellow-500/90">Exclusive</span>
          </h2>
          <div className="w-12 h-[2px] bg-yellow-500/40 mx-auto mt-5"></div>
          <p className="text-zinc-400 mt-5 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Ofrecemos propuestas culinarias conceptuales y personalizadas para
            hacer de tu evento una experiencia sensorial memorable.
          </p>
        </div>

        {/* GRILLA DE TARJETAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {servicios.map((servicio, index) => {
            const { ref, inView } = useInView<HTMLDivElement>();
            return (
              <div
                key={index}
                ref={ref}
                className={`group bg-[#120d0a] border border-[#3d2c1f]/60 rounded-3xl overflow-hidden hover:border-yellow-500/30 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:-translate-y-2 flex flex-col h-full ${
                  inView ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                {/* CONTENEDOR DE IMAGEN */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={servicio.imagen}
                    alt={servicio.titulo}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Degradado sofisticado sobre la imagen */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120d0a] via-black/20 to-transparent"></div>

                  {/* Etiqueta de carta */}
                  <div className="absolute top-4 left-4 bg-[#120d0a]/85 backdrop-blur-md border border-yellow-500/30 text-yellow-500 text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full">
                    {servicio.etiqueta}
                  </div>

                  {/* Icono flotante minimalista */}
                  <div className="absolute top-4 right-4 bg-[#120d0a]/80 backdrop-blur-md border border-[#3d2c1f] w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                    {servicio.icono}
                  </div>
                </div>

                {/* Perforación tipo "boleto de menú" */}
                <div className="ticket-divider"></div>

                {/* CONTENIDO DE LA TARJETA */}
                <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1.5 tracking-tight font-serif group-hover:text-yellow-500 transition-colors">
                      {servicio.titulo}
                    </h3>
                    <p className="text-yellow-500/60 text-[11px] font-semibold uppercase tracking-wider mb-4">
                      {servicio.idealPara}
                    </p>
                    <p className="text-zinc-400 leading-relaxed text-sm sm:text-base font-light">
                      {servicio.descripcion}
                    </p>
                  </div>

                  {/* BOTÓN DE ACCIÓN ACCIONABLE */}
                  <div className="mt-6 pt-5 border-t border-[#3d2c1f]/40">
                    <button className="inline-flex items-center gap-2 text-yellow-500 font-semibold text-sm group/btn cursor-pointer">
                      <span>Explorar propuesta</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};