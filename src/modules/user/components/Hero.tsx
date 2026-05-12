export const Hero = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=2070&auto=format&fit=crop')",
      }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/65"></div>

      {/* Contenido */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white drop-shadow-lg">
          Servicio de Catering  Eventos y Parrillas 
        </h1>

        <p className="mt-6 text-zinc-200 text-lg md:text-2xl max-w-3xl mx-auto">
          Transformamos tus eventos en experiencias gastronómicas
          inolvidables con nuestros buffets premium
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg">
            Ver Menú
          </button>

          <button className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300">
            Cotizar ahora
          </button>
        </div>
      </div>
    </section>
  );
};