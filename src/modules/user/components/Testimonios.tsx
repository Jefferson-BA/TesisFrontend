import { Star, Quote } from "lucide-react";

export const Testimonios = () => {
  const testimonios = [
    {
      nombre: "Lucía Mendoza",
      cargo: "Organizadora de eventos",
      comentario:
        "El servicio de DeParraSpitz superó todas nuestras expectativas. La calidad de la comida y la atención al detalle fueron excepcionales. Definitivamente los recomendaré.",
      inicial: "L",
    },
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

  return (
    <section className="bg-[#0b0806] py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Línea divisoria superior sutil */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3d2c1f]/40 to-transparent"></div>

      <div className="max-w-7xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="text-center mb-20">
          <span className="text-yellow-500 text-xs font-black tracking-[0.25em] uppercase block mb-3">
            Opiniones Reales
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white font-serif tracking-tight">
            Confianza en Cada <span className="italic font-normal text-yellow-500/90">Celebración</span>
          </h2>
          <div className="w-12 h-[2px] bg-yellow-500/40 mx-auto mt-5"></div>
          <p className="text-zinc-400 mt-5 text-base sm:text-lg max-w-2xl mx-auto font-light">
            La satisfacción de quienes confían en nosotros es nuestra mejor carta de presentación y mayor orgullo.
          </p>
        </div>

        {/* GRID DE TESTIMONIOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonios.map((testimonio, index) => (
            <div
              key={index}
              className="relative bg-[#120d0a] border border-[#3d2c1f]/50 rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:border-yellow-500/20 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Icono de comilla gigante decorativo en el fondo */}
              <Quote className="absolute right-6 top-6 w-24 h-24 text-[#3d2c1f]/10 pointer-events-none transform group-hover:scale-110 transition-transform duration-500" />

              <div className="relative z-10">
                {/* CALIFICACIÓN (ESTRELLAS DE LUCIDE) */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                {/* COMENTARIO */}
                <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-light font-serif italic text-balance">
                  "{testimonio.comentario}"
                </p>
              </div>

              {/* IDENTIFICACIÓN DEL USUARIO */}
              <div className="flex items-center gap-4 mt-8 pt-5 border-t border-[#3d2c1f]/30 relative z-10">
                {/* Avatar Estilizado con Inicial */}
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
          ))}
        </div>
      </div>
    </section>
  );
};