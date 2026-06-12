export const Contacto = () => {
  return (
    <section id="contacto" className="bg-[#120d0a] pt-28 relative overflow-hidden">
      {/* Línea sutil divisoria superior */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3d2c1f]/60 to-transparent"></div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* ENCABEZADO DE LA SECCIÓN */}
        <div className="text-center mb-20">
          <span className="text-yellow-500 text-xs font-black tracking-[0.25em] uppercase block mb-3">
            Hablemos de tu evento
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white font-serif tracking-tight">
            Contáctanos
          </h2>
          <div className="w-12 h-[2px] bg-yellow-500/40 mx-auto mt-4"></div>
          <p className="text-zinc-400 mt-5 text-lg max-w-xl mx-auto font-light leading-relaxed">
            Estamos listos para transformar tu celebración en algo memorable.
            Escríbenos o visítanos.
          </p>
        </div>

        {/* TARJETAS DE CONTACTO DIRECTO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* TARJETA: TELÉFONO */}
          <div className="group bg-[#0b0806] border border-[#3d2c1f]/50 rounded-3xl p-10 text-center hover:border-yellow-500/30 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1c1510] to-[#120d0a] border border-[#3d2c1f] flex items-center justify-center text-yellow-500 mb-6 group-hover:border-yellow-500/40 group-hover:scale-110 transition-all duration-300 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-wide font-serif">
              Teléfono
            </h3>
            <a href="tel:+51987654321" className="text-zinc-400 hover:text-yellow-500 text-base font-light transition-colors">
              +51 987 654 321
            </a>
          </div>

          {/* TARJETA: EMAIL */}
          <div className="group bg-[#0b0806] border border-[#3d2c1f]/50 rounded-3xl p-10 text-center hover:border-yellow-500/30 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1c1510] to-[#120d0a] border border-[#3d2c1f] flex items-center justify-center text-yellow-500 mb-6 group-hover:border-yellow-500/40 group-hover:scale-110 transition-all duration-300 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-wide font-serif">
              Email
            </h3>
            <a href="mailto:contacto@deparraspitz.com" className="text-zinc-400 hover:text-yellow-500 text-base font-light transition-colors break-all">
              contacto@deparraspitz.com
            </a>
          </div>

          {/* TARJETA: UBICACIÓN */}
          <div className="group bg-[#0b0806] border border-[#3d2c1f]/50 rounded-3xl p-10 text-center hover:border-yellow-500/30 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1c1510] to-[#120d0a] border border-[#3d2c1f] flex items-center justify-center text-yellow-500 mb-6 group-hover:border-yellow-500/40 group-hover:scale-110 transition-all duration-300 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 14.25-4.75"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-wide font-serif">
              Ubicación
            </h3>
            <p className="text-zinc-400 text-base font-light">
              Av. Principal 123, Lima, Perú
            </p>
          </div>
        </div>

        {/* FRANJA CTA — Reserva tu fecha */}
        <div className="mt-16 mb-4 relative rounded-3xl border border-yellow-500/20 bg-gradient-to-r from-[#1c1510] to-[#0b0806] px-8 sm:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 text-center sm:text-left">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              ¿Tienes una fecha en mente?
            </h3>
            <p className="text-zinc-400 mt-2 font-light">
              Cuéntanos los detalles de tu evento y te enviamos una propuesta a tu medida.
            </p>
          </div>
          <a
            href="/reservas"
            className="relative z-10 shrink-0 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(234,179,8,0.3)] hover:shadow-[0_4px_25px_rgba(234,179,8,0.5)] transform hover:-translate-y-0.5"
          >
            Reservar fecha
          </a>
        </div>
      </div>

      {/* FOOTER PREMIUM */}
      <footer className="mt-20 bg-[#0b0806]/60 backdrop-blur-md relative z-10">
        {/* Divisor estilo "boleto" entre la sección y el footer */}
        <div className="ticket-divider"></div>

        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* LOGO E IDENTIDAD */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#120d0a] border border-[#3d2c1f] flex items-center justify-center text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18H18v-3H6v3z"/><path d="M12 2v3"/><path d="M5 11h14v2H5v-2z"/><path d="M9 5h6v4H9V5z"/></svg>
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-white leading-none tracking-wide">
                  DeParraSpitz
                </h2>
                <p className="text-yellow-500 text-[9px] font-black tracking-[0.22em] mt-1 uppercase">
                  Catering & Eventos
                </p>
              </div>
            </div>
            <p className="text-zinc-400 text-sm font-light leading-relaxed mt-2">
              Servicio de catering premium para eventos especiales.
              Especialistas en parrillas selectas, buffets árabes y refinada
              comida criolla.
            </p>
          </div>

          {/* COLUMNA: CONTACTO */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6">
              Contacto
            </h3>
            <ul className="space-y-4 text-sm font-light text-zinc-400">
              <li className="flex items-center gap-3">
                <span className="text-yellow-500/80 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                <span>+51 987 654 321</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-yellow-500/80 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </span>
                <span className="truncate">contacto@deparraspitz.com</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-yellow-500/80 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 14.25-4.75"/><circle cx="12" cy="10" r="3"/></svg>
                </span>
                <span>Av. Principal 123, Lima, Perú</span>
              </li>
            </ul>
          </div>

          {/* COLUMNA: HORARIOS */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6">
              Horarios
            </h3>
            <div className="space-y-4 text-sm font-light text-zinc-400">
              <div className="flex items-center justify-between border-b border-[#3d2c1f]/30 pb-3">
                <p className="font-medium text-zinc-200">Lun – Vie</p>
                <p className="text-xs text-zinc-500">10:00 AM – 8:00 PM</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-zinc-200">Sáb – Dom</p>
                <p className="text-xs text-zinc-500">11:00 AM – 9:00 PM</p>
              </div>
            </div>
          </div>

          {/* COLUMNA: NEWSLETTER + REDES */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6">
              Mantente al tanto
            </h3>
            <p className="text-sm font-light text-zinc-400 mb-4 leading-relaxed">
              Recibe novedades de nuestros menús de temporada y promociones para eventos.
            </p>
            <form className="flex items-stretch gap-2 mb-5">
              <input
                type="email"
                placeholder="tu@correo.com"
                className="flex-1 min-w-0 bg-zinc-900/40 border border-[#3d2c1f] rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-yellow-500/50 outline-none transition-colors"
              />
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 rounded-xl transition-colors shrink-0"
              >
                Unirme
              </button>
            </form>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-zinc-900/40 border border-[#3d2c1f] hover:border-yellow-500/40 hover:text-yellow-500 transition-all flex items-center justify-center text-zinc-400 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-zinc-900/40 border border-[#3d2c1f] hover:border-yellow-500/40 hover:text-yellow-500 transition-all flex items-center justify-center text-zinc-400 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-zinc-900/40 border border-[#3d2c1f] hover:border-yellow-500/40 hover:text-yellow-500 transition-all flex items-center justify-center text-zinc-400 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* PIE DE PÁGINA (COPYRIGHT) */}
        <div className="border-t border-[#3d2c1f]/40 py-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-zinc-500">
            <p className="text-center sm:text-left">
              © 2026 DeParraSpitz. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-yellow-500 transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="hover:text-yellow-500 transition-colors">
                Términos de Servicio
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};