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
    <section className="bg-[#0b0806] py-28 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* TITULO */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-white">
            Lo que dicen nuestros clientes
          </h2>

          <p className="text-zinc-400 mt-5 text-lg">
            La satisfacción de nuestros clientes es nuestra mejor carta de
            presentación
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonios.map((testimonio, index) => (
            <div
              key={index}
              className="bg-[#120d0a] border border-yellow-500/20 rounded-3xl p-8 shadow-xl hover:scale-[1.01] transition-all duration-300"
            >
              {/* ESTRELLAS */}
              <div className="flex gap-1 text-yellow-500 text-xl mb-6">
                ★ ★ ★ ★ ★
              </div>

              {/* COMENTARIO */}
              <p className="text-zinc-200 text-lg leading-9 italic">
                "{testimonio.comentario}"
              </p>

              {/* USER */}
              <div className="flex items-center gap-4 mt-8">
                <div className="w-14 h-14 rounded-xl bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold text-xl">
                  {testimonio.inicial}
                </div>

                <div>
                  <h3 className="text-white font-bold text-lg">
                    {testimonio.nombre}
                  </h3>

                  <p className="text-zinc-400">
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