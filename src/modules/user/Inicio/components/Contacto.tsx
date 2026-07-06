// src/modules/user/Inicio/components/Contacto.tsx

"use client";

import { PhoneIcon } from "@/modules/user/shared/icons/PhoneIcon";
import { MailIcon } from "@/modules/user/shared/icons/MailIcon";
import { MapPinIcon } from "@/modules/user/shared/icons/MapPinIcon";
import { cn } from "@/lib/utils";

interface ContactItem {
  icon: typeof PhoneIcon;
  titulo: string;
  valor: string;
  href?: string;
}

const CONTACTO: ContactItem[] = [
  {
    icon: PhoneIcon,
    titulo: "Teléfono",
    valor: "+51 987 654 321",
    href: "tel:+51987654321",
  },
  {
    icon: MailIcon,
    titulo: "Email",
    valor: "contacto@deparraspitz.com",
    href: "mailto:contacto@deparraspitz.com",
  },
  {
    icon: MapPinIcon,
    titulo: "Ubicación",
    valor: "Av. Principal 123, Lima, Perú",
  },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "#",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...props} viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...props} viewBox="0 0 24 24">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "#",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...props} viewBox="0 0 24 24">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
];

export const Contacto = () => {
  return (
    <section
      id="contacto"
      className="relative pt-28 overflow-hidden bg-[#faf7f2] dark:bg-[#120d0a]"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-ember text-xs font-black tracking-[0.25em] uppercase block mb-3">
            Hablemos de tu evento
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground font-serif tracking-tight">
            Contáctanos
          </h2>
          <div className="w-12 h-[2px] bg-ember/40 mx-auto mt-4" />
          <p className="text-muted-foreground mt-5 text-lg max-w-xl mx-auto font-light leading-relaxed">
            Estamos listos para transformar tu celebración en algo memorable.
            Escríbenos o visítanos.
          </p>
        </div>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CONTACTO.map((item, i) => (
            <div
              key={i}
              className="group rounded-3xl p-10 text-center hover:border-ember/30 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col items-center
                bg-[#fffdf9] border-[#e0d5c5] dark:bg-card dark:border-border shadow-amber-900/5 dark:shadow-xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-ember mb-6 group-hover:border-ember/40 group-hover:scale-110 transition-all duration-300 shadow-md">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 tracking-wide font-serif">
                {item.titulo}
              </h3>
              {"href" in item && item.href ? (
                <a
                  href={item.href}
                  className="text-muted-foreground hover:text-ember text-base font-light transition-colors"
                >
                  {item.valor}
                </a>
              ) : (
                <p className="text-muted-foreground text-base font-light">
                  {item.valor}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-16 mb-4 relative rounded-3xl border border-amber-200 dark:border-ember/20 px-8 sm:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden
            bg-[#fffdf9] dark:bg-card"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-ember/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 text-center sm:text-left">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              ¿Tienes una fecha en mente?
            </h3>
            <p className="text-muted-foreground mt-2 font-light">
              Cuéntanos los detalles de tu evento y te enviamos una propuesta a
              tu medida.
            </p>
          </div>
          <a
            href="/reservas"
            className="relative z-10 shrink-0 bg-ember hover:brightness-110 text-char-deep font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_4px_20px_color-mix(in_oklch,var(--ember)_30%,transparent)] hover:-translate-y-0.5"
          >
            Reservar fecha
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 bg-card/60 backdrop-blur-md relative z-10 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center text-ember">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 18H18v-3H6v3z" />
                  <path d="M12 2v3" />
                  <path d="M5 11h14v2H5v-2z" />
                  <path d="M9 5h6v4H9V5z" />
                </svg>
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-foreground leading-none">
                  DeParraSpitz
                </h2>
                <p className="text-ember text-[9px] font-black tracking-[0.22em] mt-1 uppercase">
                  Catering & Eventos
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-light leading-relaxed mt-2">
              Servicio de catering premium para eventos especiales.
              Especialistas en parrillas selectas, buffets árabes y refinada
              comida criolla.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-6">
              Contacto
            </h3>
            <ul className="space-y-4 text-sm font-light text-muted-foreground">
              <li className="flex items-center gap-3">
                <PhoneIcon className="w-4 h-4 text-ember/80 shrink-0" />
                <span>+51 987 654 321</span>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon className="w-4 h-4 text-ember/80 shrink-0" />
                <span className="truncate">contacto@deparraspitz.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPinIcon className="w-4 h-4 text-ember/80 shrink-0" />
                <span>Av. Principal 123, Lima, Perú</span>
              </li>
            </ul>
          </div>

          {/* Horarios */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-6">
              Horarios
            </h3>
            <div className="space-y-4 text-sm font-light text-muted-foreground">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <p className="font-medium text-foreground">Lun – Vie</p>
                <p className="text-xs">10:00 AM – 8:00 PM</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-foreground">Sáb – Dom</p>
                <p className="text-xs">11:00 AM – 9:00 PM</p>
              </div>
            </div>
          </div>

          {/* Newsletter + Redes */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-6">
              Mantente al tanto
            </h3>
            <p className="text-sm font-light text-muted-foreground mb-4 leading-relaxed">
              Recibe novedades de nuestros menús de temporada y promociones
              para eventos.
            </p>
            <form className="flex items-stretch gap-2 mb-5">
              <input
                type="email"
                placeholder="tu@correo.com"
                className="flex-1 min-w-0 bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ember/50 outline-none transition-colors"
              />
              <button
                type="submit"
                className="bg-ember hover:brightness-110 text-char-deep font-bold px-4 rounded-xl transition-colors shrink-0"
              >
                Unirme
              </button>
            </form>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-muted border border-border hover:border-ember/40 text-muted-foreground hover:text-ember transition-all flex items-center justify-center shadow-md"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border py-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-muted-foreground">
            <p>© 2026 DeParraSpitz. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-ember transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="hover:text-ember transition-colors">
                Términos de Servicio
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};