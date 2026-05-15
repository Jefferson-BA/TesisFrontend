export const Servicios = () => {
  const servicios = [
    {
      titulo: "Buffet Parrillero",
      descripcion:
        "Carnes selectas a la parrilla, anticuchos, chorizo parrillero y guarniciones tradicionales. Perfecto para eventos corporativos y celebraciones familiares.",
      imagen:
        "https://images.unsplash.com/photo-1529692236671-f1dc6c7f7b1e?q=80&w=1974&auto=format&fit=crop",
      icono: "🔥",
    },
    {
      titulo: "Buffet Árabe",
      descripcion:
        "Shawarma, falafel, hummus, tabule y panes árabes recién horneados. Una experiencia gastronómica única para tus invitados.",
      imagen:
        "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1974&auto=format&fit=crop",
      icono: "🍴",
    },
    {
      titulo: "Buffet Criollo",
      descripcion:
        "Ají de gallina, lomo saltado, arroz con pollo y postres tradicionales. Sabor peruano auténtico en cada bocado.",
      imagen:
        "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1974&auto=format&fit=crop",
      icono: "👨‍🍳",
    },
  ];

  return (
    <section className="bg-black py-28 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* TITULO */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white">
            Nuestros Servicios
          </h2>

          <p className="text-zinc-400 mt-5 text-lg max-w-2xl mx-auto">
            Ofrecemos tres tipos de buffets especializados para hacer de tu
            evento una experiencia única
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicios.map((servicio, index) => (
            <div
              key={index}
              className="bg-[#120d0a] border border-yellow-500/20 rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-xl"
            >
              {/* IMAGEN */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={servicio.imagen}
                  alt={servicio.titulo}
                  className="w-full h-full object-cover hover:scale-110 transition-all duration-500"
                />

                <div className="absolute inset-0 bg-black/40"></div>

                {/* TITULO SOBRE IMAGEN */}
                <div className="absolute bottom-5 left-5 flex items-center gap-3">
                  <div className="bg-yellow-500 text-black w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg">
                    {servicio.icono}
                  </div>

                  <h3 className="text-3xl font-bold text-white">
                    {servicio.titulo}
                  </h3>
                </div>
              </div>

              {/* CONTENIDO */}
              <div className="p-7">
                <p className="text-zinc-300 leading-8 text-lg">
                  {servicio.descripcion}
                </p>

                <button className="mt-6 text-yellow-500 font-semibold hover:text-yellow-400 transition-all">
                  Ver menú →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};