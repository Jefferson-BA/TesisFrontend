import { useEffect, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";

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

export const Testimonios = () => {
  const destacado = {
    nombre: "Lucía Mendoza",
    cargo: "Organizadora de eventos",
    comentario:
      "El servicio de DeParraSpitz superó todas nuestras expectativas. La calidad de la comida y la atención al detalle fueron excepcionales. Definitivamente los recomendaré.",
    inicial: "L",
  };

  const testimonios = [
    {
      nombre: "Carlos Ramírez",
      cargo: "Cliente corporativo",
      comentario:
        "Contratamos el buffet parrillero para nuestro evento anual y fue un éxito total. Las carnes estaban en su punto perfecto y el servicio fue impecable.",
      inicial: "C",
    },
    {
      nombre: "Ana Torres",
      cargo: "Celebración familiar",
      comentario:
        "Organizamos el cumpleaños de mi madre con el buffet criollo. Todos quedaron encantados con los sabores auténticos y la presentación de los platos.",
      inicial: "A",
    },
    {
      nombre: "Miguel Ángel Soto",
      cargo: "Evento empresarial",
      comentario:
        "La variedad del buffet árabe fue increíble. Nuestros invitados internacionales quedaron fascinados con la calidad y autenticidad de cada platillo.",
      inicial: "M",
    },
  ];

  const { ref: featRef, inView: featInView } = useInView<HTMLDivElement>();

  return (
    <section className="bg-[#0b0806] py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Línea divisoria superior sutil */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3d2c1f]/40 to-transparent"></div>

      <div className="max-w-7xl mx-auto">
        {/* ENCABEZADO */}
        <div className="text-center mb-16">
          <span className="text-yellow-500 text-xs font-black tracking-[0.25em] uppercase block mb-3">
            Opiniones Reales
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white font-serif tracking-tight">
            Confianza en Cada{" "}
            <span className="italic font-normal text-yellow-500/90">Celebración</span>
          </h2>
          <div className="w-12 h-[2px] bg-yellow-500/40 mx-auto mt-5"></div>
          <p className="text-zinc-400 mt-5 text-base sm:text-lg max-w-2xl mx-auto font-light">
            La satisfacción de quienes confían en nosotros es nuestra mejor
            carta de presentación y mayor orgullo.
          </p>
        </div>

        {/* TESTIMONIO DESTACADO */}
        <div
          ref={featRef}
          className={`relative bg-gradient-to-br from-[#1c1510] to-[#120d0a] border border-yellow-500/15 rounded-3xl p-8 sm:p-12 mb-8 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.35)] ${
            featInView ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <Quote className="absolute -right-2 -top-2 w-40 h-40 text-yellow-500/[0.06] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-white text-xl sm:text-2xl md:text-3xl leading-snug font-serif italic text-balance">
                "{destacado.comentario}"
              </p>
            </div>

            <div className="flex items-center gap-4 md:flex-col md:items-start md:text-left md:border-l md:border-[#3d2c1f]/50 md:pl-8 shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1c1510] to-[#120d0a] border-2 border-yellow-500/40 text-yellow-500 flex items-center justify-center font-bold text-xl shadow-inner">
                {destacado.inicial}
              </div>
              <div>
                <h3 className="text-white font-semibold text-base tracking-wide">
                  {destacado.nombre}
                </h3>
                <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">
                  {destacado.cargo}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* GRID DE TESTIMONIOS SECUNDARIOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonios.map((testimonio, index) => {
            const { ref, inView } = useInView<HTMLDivElement>();
            return (
              <div
                key={index}
                ref={ref}
                className={`relative bg-[#120d0a] border border-[#3d2c1f]/50 rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:border-yellow-500/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                  inView ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Quote className="absolute right-6 top-6 w-20 h-20 text-[#3d2c1f]/10 pointer-events-none transform group-hover:scale-110 transition-transform duration-500" />

                <div className="relative z-10">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>

                  <p className="text-zinc-300 text-base leading-relaxed font-light font-serif italic text-balance">
                    "{testimonio.comentario}"
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-8 pt-5 border-t border-[#3d2c1f]/30 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1c1510] to-[#120d0a] border border-[#3d2c1f] text-yellow-500 flex items-center justify-center font-bold text-lg shadow-inner group-hover:border-yellow-500/30 transition-colors">
                    {testimonio.inicial}
                  </div>

                  <div>
                    <h3 className="text-white font-semibold text-base tracking-wide">
                      {testimonio.nombre}
                    </h3>
                    <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">
                      {testimonio.cargo}
                    </p>
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