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

const EASE = [0.16, 1, 0.3, 1] as const;

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
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  // Mount + scroll state
  useEffect(() => {
    setMounted(true);
    setPath(window.location.pathname);
    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    if (!dropdown) return;
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdown(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [dropdown]);

  return (
    <>
      <motion.div
        className={cn("navbar-wrapper", scrolled && "scrolled")}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <nav className="navbar-capsule-glass">
          {/* Logo */}
          <a href="/" className="relative z-10 flex shrink-0 select-none items-center gap-2.5 group">
            <div className="logo-icon-box-glass">
              <ChefHat className="text-ember w-[17px] h-[17px] transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110" />
            </div>
            <div className="hidden sm:block leading-none">
              <h1 className="font-display text-[15px] md:text-base font-semibold tracking-tight text-foreground">
                DeParraSpitz
              </h1>
              <p className="text-ember text-[8px] font-bold tracking-[0.22em] mt-1 uppercase opacity-90">
                Catering &amp; Eventos
              </p>
            </div>
          </a>

          {/* Links desktop */}
          <div className="nav-links-pill-glass">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn("nav-link-item-glass", active && "font-bold")}
                  style={active ? { color: "var(--char-deep)" } : undefined}
                >
                  <span className="relative z-20">{link.label}</span>
                  {active && (
                    <motion.div
                      layoutId="activePill"
                      className="nav-pill-active"
                      transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.6 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Acciones derecha */}
          <div className="relative z-10 flex items-center gap-2">
            <ThemeToggle />
            <span className="navbar-divider-glass" />

            {!mounted ? (
              <div className="hidden md:block w-24 h-8 bg-muted/40 animate-pulse rounded-full" />
            ) : user ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button onClick={() => setDropdown(!dropdown)} className="user-dropdown-btn-glass">
                  <User size={14} className="text-ember shrink-0" />
                  <span className="truncate text-xs font-bold">{user.name || user.email || "Mi Cuenta"}</span>
                  <ChevronDown size={12} className={cn("transition-transform duration-300 ease-out", dropdown && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: EASE }}
                      className="dropdown-menu-glass"
                    >
                      <div className="px-4 py-2.5 border-b border-border">
                        <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold opacity-80">
                          Sesión activa
                        </p>
                        <p className="text-xs font-bold text-foreground truncate mt-0.5">{user.name || "Usuario"}</p>
                      </div>

                      <a href="/user/profile" onClick={() => setDropdown(false)} className="dropdown-link-glass">
                        <User size={14} /> Mi Perfil
                      </a>

                      {isAdmin && (
                        <a href="/admin/dashboard" onClick={() => setDropdown(false)} className="dropdown-link-glass">
                          <LayoutDashboard size={14} /> Dashboard
                        </a>
                      )}

                      <div className="h-[1px] bg-border my-1" />

                      <button
                        onClick={() => { logout(); setDropdown(false); }}
                        className="dropdown-link-glass text-red-500 dark:text-red-400 hover:!bg-red-500/10 hover:!text-red-500"
                      >
                        <LogOut size={14} /> Cerrar Sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <a href="/login" className="login-nav-btn-glass">Ingresar</a>
            )}

            {/* Carrito */}
            <a href="/cart" className="cart-nav-icon-glass group">
              <ShoppingCart className="w-[17px] h-[17px] transition-transform duration-300 ease-out group-hover:scale-110" />
              <AnimatePresence>
                {mounted && cartTotal > 0 && (
                  <motion.span
                    key={cartTotal}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="cart-badge-glass"
                  >
                    {cartTotal}
                  </motion.span>
                )}
              </AnimatePresence>
            </a>

            {/* Hamburguesa mobile */}
            <button
              onClick={() => setMobile(!mobile)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-foreground hover:text-ember transition-colors"
              aria-label="Menú"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobile ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  {mobile ? <X size={20} /> : <Menu size={20} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.div>

      {/* Menú mobile */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="navbar-mobile-wrapper"
          >
            <div className="navbar-mobile-panel-glass">
              <motion.div
                className="px-4 py-4 space-y-1 relative z-10"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              >
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobile(false)}
                      variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
                      className={cn("mobile-link-glass-item", active && "!bg-ember !text-on-ember")}
                    >
                      {link.label}
                    </motion.a>
                  );
                })}

                {mounted && user ? (
                  <motion.div
                    variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                    className="pt-3 mt-3 border-t border-border space-y-1"
                  >
                    <p className="text-[10px] text-muted-foreground px-4 uppercase tracking-wider font-bold opacity-80">
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
                      className="mobile-sublink-glass !text-red-500 dark:!text-red-400 font-bold hover:!bg-red-500/10"
                    >
                      Salir
                    </button>
                  </motion.div>
                ) : mounted && !user ? (
                  <motion.a
                    variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                    href="/login"
                    onClick={() => setMobile(false)}
                    className="mobile-login-glass-btn"
                  >
                    Ingresar a mi Cuenta
                  </motion.a>
                ) : null}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-24" />
    </>
  );
}