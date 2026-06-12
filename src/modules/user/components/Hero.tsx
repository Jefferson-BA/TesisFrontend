import { ChevronRight, Calendar, ChevronDown } from "lucide-react";

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

      {/* Textura de grano para profundidad */}
      <div className="grain-overlay"></div>

      {/* Sello giratorio "estampa de catering" — elemento de firma */}
      <div className="hidden lg:flex absolute top-28 right-12 w-28 h-28 items-center justify-center z-10">
        <svg viewBox="0 0 100 100" className="absolute inset-0 spin-slow">
          <defs>
            <path id="circlePath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
          </defs>
          <text fill="rgba(234,179,8,0.55)" fontSize="6.2" letterSpacing="3" fontWeight="700">
            <textPath href="#circlePath">
              · CALIDAD PREMIUM · DESDE 2010 · DEPARRASPITZ
            </textPath>
          </text>
        </svg>
        <div className="w-14 h-14 rounded-full border border-yellow-500/30 flex items-center justify-center bg-[#120d0a]/40 backdrop-blur-sm">
          <span className="font-serif italic text-yellow-500 text-sm">DPS</span>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center">

        {/* Kicker / Etiqueta Superior */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-xs font-black tracking-[0.2em] uppercase mb-6 animate-fade-in-up glow-pulse">
          ✨ Experiencias Gastronómicas Premium
        </span>

        {/* Título Principal (Combinando Sans y Serif para máxima elegancia) */}
        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.15] text-white tracking-tight drop-shadow-xl animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          Servicio de Catering, <br />
          <span className="font-serif italic font-normal text-yellow-500 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Eventos y Parrillas
          </span>
        </h1>

        {/* Descripción */}
        <p
          className="mt-6 text-zinc-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Transformamos tus celebraciones en momentos inolvidables. Buffets
          exclusivos, carnes premium y una atención impecable diseñada a tu
          medida.
        </p>

        {/* Botones de Acción Estilizados */}
        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
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

        {/* Franja de cifras — credibilidad rápida */}
        <div
          className="mt-14 flex items-center gap-6 sm:gap-12 px-6 sm:px-10 py-4 rounded-2xl bg-[#120d0a]/50 border border-[#3d2c1f]/60 backdrop-blur-md animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="text-center">
            <p className="font-serif text-2xl sm:text-3xl font-bold text-yellow-500">+500</p>
            <p className="text-zinc-400 text-[10px] sm:text-xs tracking-wider uppercase mt-1">Eventos atendidos</p>
          </div>
          <div className="w-px h-10 bg-[#3d2c1f]"></div>
          <div className="text-center">
            <p className="font-serif text-2xl sm:text-3xl font-bold text-yellow-500">3</p>
            <p className="text-zinc-400 text-[10px] sm:text-xs tracking-wider uppercase mt-1">Estilos de buffet</p>
          </div>
          <div className="w-px h-10 bg-[#3d2c1f]"></div>
          <div className="text-center">
            <p className="font-serif text-2xl sm:text-3xl font-bold text-yellow-500">100%</p>
            <p className="text-zinc-400 text-[10px] sm:text-xs tracking-wider uppercase mt-1">A tu medida</p>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-zinc-500 animate-bounce-soft">
        <span className="text-[10px] tracking-[0.3em] uppercase">Descubre más</span>
        <ChevronDown className="w-4 h-4" />
      </div>

      {/* Decoración sutil: Línea difuminada inferior */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3d2c1f] to-transparent"></div>
    </section>
  );
};