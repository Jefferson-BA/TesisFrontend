export const Contacto = () => {
  return (
    <section className="bg-[#120d0a] py-28">
      
      {/* CONTACTO */}
      <div className="max-w-7xl mx-auto px-6">
        
        {/* TITULO */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-white">
            Contáctanos
          </h2>

          <p className="text-zinc-400 mt-5 text-lg">
            Estamos listos para hacer de tu evento algo memorable
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* TELEFONO */}
          <div className="bg-[#0b0806] border border-yellow-500/20 rounded-3xl p-10 text-center hover:scale-[1.02] transition-all duration-300">
            
            <div className="w-20 h-20 mx-auto rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 text-4xl mb-8">
              📞
            </div>

            <h3 className="text-3xl font-bold text-white mb-5">
              Teléfono
            </h3>

            <p className="text-zinc-300 text-xl">
              +51 987 654 321
            </p>
          </div>

          {/* EMAIL */}
          <div className="bg-[#0b0806] border border-yellow-500/20 rounded-3xl p-10 text-center hover:scale-[1.02] transition-all duration-300">
            
            <div className="w-20 h-20 mx-auto rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 text-4xl mb-8">
              ✉️
            </div>

            <h3 className="text-3xl font-bold text-white mb-5">
              Email
            </h3>

            <p className="text-zinc-300 text-xl break-all">
              contacto@deparraspitz.com
            </p>
          </div>

          {/* UBICACION */}
          <div className="bg-[#0b0806] border border-yellow-500/20 rounded-3xl p-10 text-center hover:scale-[1.02] transition-all duration-300">
            
            <div className="w-20 h-20 mx-auto rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 text-4xl mb-8">
              📍
            </div>

            <h3 className="text-3xl font-bold text-white mb-5">
              Ubicación
            </h3>

            <p className="text-zinc-300 text-xl">
              Av. Principal 123, Lima, Perú
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-yellow-500/10 mt-28">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* LOGO */}
          <div>
            <h2 className="text-4xl font-bold text-yellow-500">
              DeParraSpitz
            </h2>

            <p className="text-zinc-400 mt-6 leading-8">
              Servicio de catering premium para eventos especiales.
              Especialistas en parrillas, buffets árabes y comida criolla.
            </p>
          </div>

          {/* CONTACTO */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">
              Contacto
            </h3>

            <div className="space-y-4 text-zinc-400">
              <p>📞 +51 999 999 999</p>
              <p>✉️ contacto@deparraspitz.com</p>
              <p>📍 Av. Principal 123, Lima, Perú</p>
            </div>
          </div>

          {/* HORARIOS */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">
              Horarios
            </h3>

            <div className="space-y-5 text-zinc-400">
              <div>
                <p className="font-semibold text-white">
                  Lunes a Viernes
                </p>

                <p>10:00 AM - 8:00 PM</p>
              </div>

              <div>
                <p className="font-semibold text-white">
                  Sábados y Domingos
                </p>

                <p>11:00 AM - 9:00 PM</p>
              </div>
            </div>
          </div>

          {/* REDES */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">
              Síguenos
            </h3>

            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/5 hover:bg-yellow-500 hover:text-black transition-all flex items-center justify-center text-xl cursor-pointer">
                f
              </div>

              <div className="w-14 h-14 rounded-xl bg-white/5 hover:bg-yellow-500 hover:text-black transition-all flex items-center justify-center text-xl cursor-pointer">
                📸
              </div>

              <div className="w-14 h-14 rounded-xl bg-white/5 hover:bg-yellow-500 hover:text-black transition-all flex items-center justify-center text-xl cursor-pointer">
                🐦
              </div>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-yellow-500/10 py-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-5">
            
            <p className="text-zinc-500 text-center">
              © 2026 DeParraSpitz. Todos los derechos reservados.
            </p>

            <div className="flex gap-6 text-zinc-500">
              <p className="hover:text-yellow-500 cursor-pointer transition-all">
                Política de Privacidad
              </p>

              <p className="hover:text-yellow-500 cursor-pointer transition-all">
                Términos de Servicio
              </p>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};