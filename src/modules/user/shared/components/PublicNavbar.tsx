// src/modules/user/shared/components/PublicNavbar.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, LayoutDashboard, LogOut, ChefHat, User, ChevronDown, Menu, X } from "lucide-react";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import { useUser } from "@/modules/user/hooks/useUser";
import ThemeToggle from "@/modules/user/shared/components/Themetoggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/menu", label: "Menú" },
  { href: "/reservas", label: "Reservas" },
] as const;

export function PublicNavbar() {
  const cart = useCartStore((s) => s.cart);
  const { user, logout, isAdmin } = useUser();

  const [mounted, setMounted] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [path, setPath] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cartTotal = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
    setPath(window.location.pathname);

    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    if (!dropdown) return;
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [dropdown]);

  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  // ─── Clases dinámicas según tema y scroll ───
  const headerClasses = cn(
    "fixed top-0 inset-x-0 z-50 border-b backdrop-blur-md transition-all duration-300",
    scrolled ? "shadow-lg" : "",
    // Modo oscuro
    "dark:bg-char-deep/95 dark:border-char",
    !scrolled && "dark:bg-char-deep/80 dark:border-char/40",
    // Modo claro
    "bg-white/90 border-stone-200/60",
    !scrolled && "bg-white/70 border-stone-200/30",
  );

  const linkPillClasses = cn(
    "hidden md:flex items-center gap-1 rounded-full border px-1.5 py-1.5 backdrop-blur-sm",
    "dark:bg-char/60 dark:border-char/50",
    "bg-stone-100/80 border-stone-200/60",
  );

  const logoBgClasses = cn(
    "w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-300",
    "dark:bg-char dark:border-char dark:shadow-[0_0_20px_color-mix(in_oklch,var(--ember)_15%,transparent)]",
    "bg-amber-50 border-amber-200 shadow-[0_0_20px_rgba(201,151,74,0.15)]",
    "group-hover:border-ember/50 group-hover:shadow-[0_0_24px_color-mix(in_oklch,var(--ember)_25%,transparent)]",
  );

  return (
    <>
      <header className={headerClasses}>
        {/* Línea dorada superior */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-ember/50 to-transparent" />

        <nav className={cn(
          "max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between transition-all duration-300",
          scrolled ? "h-16" : "h-[76px]"
        )}>
          {/* ─── Logo ─── */}
          <a href="/" className="flex items-center gap-3 group shrink-0">
            <div className={logoBgClasses}>
              <ChefHat className="text-ember w-5 h-5 transition-transform duration-500 group-hover:-rotate-12" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-xl font-bold leading-none tracking-wide text-foreground">
                DeParraSpitz
              </h1>
              <p className="text-ember text-[10px] font-black tracking-[0.22em] mt-1.5">
                CATERING & EVENTOS
              </p>
            </div>
          </a>

          {/* ─── Links desktop ─── */}
          <div className={linkPillClasses}>
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    active
                      ? "text-char-deep bg-ember font-semibold shadow-[0_2px_12px_color-mix(in_oklch,var(--ember)_35%,transparent)]"
                      : "text-muted-foreground hover:text-ember hover:bg-accent/50",
                  )}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* ─── Acciones ─── */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Usuario desktop */}
            {!mounted ? (
              <div className="hidden md:block w-20 h-9 bg-muted animate-pulse rounded-lg" />
            ) : user ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className={cn(
                    "flex items-center gap-2 border px-4 py-2 rounded-xl transition-all cursor-pointer max-w-[220px]",
                    "dark:bg-char dark:border-char dark:hover:border-ember/40 dark:text-white/70",
                    "bg-stone-100 border-stone-200 hover:border-amber-300 text-stone-600",
                  )}
                >
                  <User size={16} className="text-ember shrink-0" />
                  <span className="truncate text-xs font-medium">
                    {user.name || user.email || "Mi Cuenta"}
                  </span>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "text-muted-foreground transition-transform duration-300",
                      dropdown && "rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence>
                  {dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className={cn(
                        "absolute right-0 mt-2 w-52 rounded-xl border shadow-2xl py-1.5 z-50 origin-top-right",
                        "dark:bg-char-deep dark:border-char",
                        "bg-white border-stone-200",
                      )}
                    >
                      <div className="px-4 py-2 border-b mb-1 dark:border-char/50 border-stone-100">
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-bold">
                          Sesión activa
                        </p>
                        <p className="text-xs font-semibold text-foreground truncate">
                          {user.name || "Usuario"}
                        </p>
                      </div>

                      <a
                        href="/user/profile"
                        onClick={() => setDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-amber-50 dark:hover:bg-ember/10 hover:text-ember transition-colors font-medium"
                      >
                        <User size={14} /> Mi Perfil
                      </a>

                      {isAdmin && (
                        <a
                          href="/admin/dashboard"
                          onClick={() => setDropdown(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-amber-50 dark:hover:bg-ember/10 hover:text-ember transition-colors font-medium"
                        >
                          <LayoutDashboard size={14} /> Dashboard
                        </a>
                      )}

                      <hr className="my-1 dark:border-char/50 border-stone-100" />

                      <button
                        onClick={() => { logout(); setDropdown(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-medium text-left"
                      >
                        <LogOut size={14} /> Cerrar Sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <a
                href="/login"
                className={cn(
                  "hidden md:inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all border",
                  "dark:text-white/50 dark:hover:text-ember dark:border-transparent dark:hover:border-char",
                  "text-stone-500 hover:text-amber-600 border-transparent hover:border-amber-200 hover:bg-amber-50",
                )}
              >
                Ingresar
              </a>
            )}

            {/* Carrito */}
            <a
              href="/cart"
              className="relative p-2 text-muted-foreground hover:text-ember transition-all group"
            >
              <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-110" />
              {mounted && cartTotal > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-ember text-char-deep text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_10px_color-mix(in_oklch,var(--ember)_50%,transparent)]">
                  {cartTotal}
                </span>
              )}
            </a>

            {/* Hamburguesa mobile */}
            <button
              onClick={() => setMobile(!mobile)}
              className="md:hidden p-2 text-muted-foreground hover:text-ember transition-colors"
              aria-label="Menú"
            >
              {mobile ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* ─── Menú mobile ─── */}
        <AnimatePresence>
          {mobile && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "md:hidden border-b overflow-hidden",
                "dark:bg-char-deep dark:border-char",
                "bg-white border-stone-200",
              )}
            >
              <div className="px-6 py-4 space-y-1">
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobile(false)}
                      className={cn(
                        "block font-medium py-2.5 rounded-xl px-4 transition-colors",
                        active
                          ? "text-char-deep bg-ember font-semibold"
                          : "text-muted-foreground hover:bg-accent dark:hover:bg-char",
                      )}
                    >
                      {link.label}
                    </a>
                  );
                })}

                {mounted && user ? (
                  <div className="pt-3 mt-2 border-t dark:border-char/60 border-stone-200 space-y-1">
                    <p className="text-[11px] text-muted-foreground px-4 uppercase tracking-wider">
                      Conectado: {user.email}
                    </p>
                    <a href="/user/profile" onClick={() => setMobile(false)} className="block text-sm py-2 px-4 text-muted-foreground hover:text-ember">
                      Mi Perfil
                    </a>
                    {isAdmin && (
                      <a href="/admin/dashboard" onClick={() => setMobile(false)} className="block text-sm py-2 px-4 text-muted-foreground hover:text-ember">
                        Dashboard
                      </a>
                    )}
                    <button
                      onClick={() => { logout(); setMobile(false); }}
                      className="block text-sm text-red-500 py-2 px-4 w-full text-left hover:bg-red-50 dark:hover:bg-red-500/5 rounded-lg"
                    >
                      Salir
                    </button>
                  </div>
                ) : mounted && !user ? (
                  <a
                    href="/login"
                    onClick={() => setMobile(false)}
                    className="block text-sm text-ember font-semibold py-2.5 px-4 rounded-xl border dark:border-char border-amber-200 text-center mt-2"
                  >
                    Ingresar
                  </a>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer */}
      <div className={cn("transition-all duration-300", scrolled ? "h-16" : "h-[76px]")} />
    </>
  );
}