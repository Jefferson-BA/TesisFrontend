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

    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <>
      {/* Contenedor Flotante Principal */}
      <div className={cn("navbar-wrapper", scrolled && "scrolled")}>
        <nav className="navbar-capsule-glass">
          <div className="absolute inset-0 bg-liquid-specular pointer-events-none rounded-full opacity-60 dark:opacity-40" />
          
          {/* ─── Logo con Animación Fluida ─── */}
          <a href="/" className="flex items-center gap-2.5 group shrink-0 select-none relative z-10">
            <div className="logo-icon-box-glass">
              <ChefHat className="text-ember w-5 h-5 transition-transform duration-600 ease-[0.34,1.56,0.64,1] group-hover:rotate-[-15deg] group-hover:scale-115" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-sm md:text-base font-black leading-none tracking-wide text-foreground">
                DeParraSpitz
              </h1>
              <p className="text-ember text-[8px] font-black tracking-[0.25em] mt-1 uppercase opacity-90">
                Catering & Eventos
              </p>
            </div>
          </a>

          {/* ─── Links Desktop (Efecto Píldora Líquida) ─── */}
          <div className="nav-links-pill-glass">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "nav-link-item-glass", 
                    active ? "text-char-deep font-extrabold mix-blend-normal" : "text-muted-foreground/90"
                  )}
                >
                  <span className="relative z-20">{link.label}</span>
                  {active && (
                    <motion.div
                      layoutId="liquidActivePill"
                      className="absolute inset-0 bg-ember rounded-full shadow-[0_4px_16px_color-mix(in_oklch,var(--ember)_50%,transparent)] border border-white/20"
                      /* Configuración elástica/líquida de la píldora activa */
                      transition={{ type: "spring", stiffness: 320, damping: 22, mass: 0.8 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* ─── Acciones de la Derecha ─── */}
          <div className="flex items-center gap-2 relative z-10">
            <ThemeToggle />

            {/* Usuario Desktop */}
            {!mounted ? (
              <div className="hidden md:block w-24 h-8 bg-muted/40 animate-pulse rounded-full" />
            ) : user ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button onClick={() => setDropdown(!dropdown)} className="user-dropdown-btn-glass">
                  <User size={14} className="text-ember shrink-0" />
                  <span className="truncate text-xs font-bold">
                    {user.name || user.email || "Mi Cuenta"}
                  </span>
                  <ChevronDown
                    size={12}
                    className={cn("text-muted-foreground transition-transform duration-500 ease-out", dropdown && "rotate-180")}
                  />
                </button>

                <AnimatePresence>
                  {dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.94 }}
                      transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                      className="dropdown-menu-glass"
                    >
                      <div className="px-4 py-2.5 border-b dark:border-white/5 border-stone-200/50">
                        <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-black">
                          Sesión activa
                        </p>
                        <p className="text-xs font-bold text-foreground truncate mt-0.5">
                          {user.name || "Usuario"}
                        </p>
                      </div>

                      <a href="/user/profile" onClick={() => setDropdown(false)} className="dropdown-link-glass">
                        <User size={14} /> Mi Perfil
                      </a>

                      {isAdmin && (
                        <a href="/admin/dashboard" onClick={() => setDropdown(false)} className="dropdown-link-glass">
                          <LayoutDashboard size={14} /> Dashboard
                        </a>
                      )}

                      <div className="h-[1px] bg-stone-200/50 dark:bg-white/5 my-1" />

                      <button
                        onClick={() => { logout(); setDropdown(false); }}
                        className="dropdown-link-glass text-red-500 dark:text-red-400 hover:bg-red-500/10"
                      >
                        <LogOut size={14} /> Cerrar Sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <a href="/login" className="login-nav-btn-glass">
                Ingresar
              </a>
            )}

            {/* Carrito de Compras */}
            <a href="/cart" className="cart-nav-icon-glass group">
              <ShoppingCart className="w-5 h-5 transition-all duration-500 ease-out group-hover:scale-115 group-hover:rotate-[-6deg]" />
              {mounted && cartTotal > 0 && (
                <span className="cart-badge-glass">
                  {cartTotal}
                </span>
              )}
            </a>

            {/* Menú Hamburguesa Mobile */}
            <button
              onClick={() => setMobile(!mobile)}
              className="md:hidden p-2 text-muted-foreground hover:text-ember transition-colors"
              aria-label="Menú"
            >
              {mobile ? (
                <X size={22} className="animate-in fade-in zoom-in-50 duration-300" />
              ) : (
                <Menu size={22} className="animate-in fade-in zoom-in-50 duration-300" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* ─── Menú Mobile Desplegable Liquid Glass ─── */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="navbar-mobile-wrapper"
          >
            <div className="navbar-mobile-panel-glass">
              <div className="absolute inset-0 bg-liquid-specular pointer-events-none opacity-40" />
              <div className="px-5 py-4 space-y-1 relative z-10">
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobile(false)}
                      className={cn(
                        "mobile-link-glass-item", 
                        active ? "bg-ember text-char-deep font-extrabold shadow-md" : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                    </a>
                  );
                })}

                {mounted && user ? (
                  <div className="pt-3 mt-3 border-t dark:border-white/5 border-stone-200/50 space-y-1">
                    <p className="text-[10px] text-muted-foreground px-4 uppercase tracking-wider font-bold">
                      Conectado como: {user.email}
                    </p>
                    <a href="/user/profile" onClick={() => setMobile(false)} className="mobile-sublink-glass">
                      Mi Perfil
                    </a>
                    {isAdmin && (
                      <a href="/admin/dashboard" onClick={() => setMobile(false)} className="mobile-sublink-glass">
                        Dashboard
                      </a>
                    )}
                    <button
                      onClick={() => { logout(); setMobile(false); }}
                      className="mobile-sublink-glass text-red-500 dark:text-red-400 font-bold hover:bg-red-500/10"
                    >
                      Salir
                    </button>
                  </div>
                ) : mounted && !user ? (
                  <a href="/login" onClick={() => setMobile(false)} className="mobile-login-glass-btn">
                    Ingresar a mi Cuenta
                  </a>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer Responsivo */}
      <div className="h-24" />
    </>
  );
}