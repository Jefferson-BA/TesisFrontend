import { ChevronRight, Calendar } from "lucide-react";

export const Hero = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=2070&auto=format&fit=crop')",
      }}
    >
      {/* Overlay oscuro con degradado para fusionar con el fondo de la web */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-[#0b0806]"></div>

      {/* Contenido Principal */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Kicker / Etiqueta Superior */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-xs font-black tracking-[0.2em] uppercase mb-6 animate-fade-in">
          ✨ Experiencias Gastronómicas Premium
        </span>

        {/* Título Principal (Combinando Sans y Serif para máxima elegancia) */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.15] text-white tracking-tight drop-shadow-xl">
          Servicio de Catering, <br />
          <span className="font-serif italic font-normal text-yellow-500 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Eventos y Parrillas
          </span>
        </h1>

        {/* Descripción */}
        <p className="mt-6 text-zinc-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Transformamos tus celebraciones en momentos inolvidables. Buffets exclusivos, carnes premium y una atención impecable diseñada a tu medida.
        </p>

        {/* Botones de Acción Estilizados */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          
          {/* Botón Principal */}
          <button className="group w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(234,179,8,0.3)] hover:shadow-[0_4px_25px_rgba(234,179,8,0.5)] flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer">
            Ver Menú
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Botón Secundario */}
          <button className="w-full sm:w-auto bg-zinc-900/40 backdrop-blur-md border border-zinc-700/50 hover:border-yellow-500/50 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:bg-zinc-900/60 transform hover:-translate-y-0.5 cursor-pointer">
            <Calendar className="w-4 h-4 text-yellow-500" />
            Cotizar ahora
          </button>
          
        </div>
      </div>

      {/* Decoración sutil: Línea difuminada inferior */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3d2c1f] to-transparent"></div>
    </section>
  );
};