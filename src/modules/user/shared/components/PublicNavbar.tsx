"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, LayoutDashboard, LogOut, ChefHat, User, ChevronDown, Menu, X } from "lucide-react";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import { useUser } from "@/modules/user/hooks/useUser";
import ThemeToggle from "@/modules/user/shared/components/Themetoggle";
export function PublicNavbar() {
  const cart = useCartStore((s) => s.cart);
  const { user, logout, isAdmin } = useUser();

  const [mounted, setMounted] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [path, setPath] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPath(window.location.pathname);

    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─── Cierra dropdown al hacer clic fuera ─── */
  useEffect(() => {
    if (!dropdown) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as Element).closest("[data-dropdown]")) setDropdown(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [dropdown]);

  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/menu", label: "Menú" },
    { href: "/reservas", label: "Reservas" },
  ];

  const cartTotal = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {/* ═══ Navbar ═══ */}
      <header
        className={`fixed top-0 inset-x-0 z-50 border-b backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? "bg-char-deep/95 border-char shadow-[0_4px_30px_rgba(0,0,0,0.35)]"
            : "bg-char-deep/80 border-char/40"
        }`}
      >
        {/* Línea dorada superior */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-ember/50 to-transparent" />

        <nav className={`max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ${scrolled ? "h-16" : "h-[76px]"}`}>
          
          {/* ─── Logo ─── */}
          <a href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 rounded-xl bg-char border border-char flex items-center justify-center shadow-[0_0_20px_color-mix(in_oklch,var(--ember)_15%,transparent)] group-hover:border-ember/50 transition-all duration-300">
              <ChefHat className="text-ember w-5 h-5 transition-transform duration-500 group-hover:-rotate-12" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-xl font-bold text-white leading-none tracking-wide">DeParraSpitz</h1>
              <p className="text-ember text-[10px] font-black tracking-[0.22em] mt-1.5">CATERING & EVENTOS</p>
            </div>
          </a>

          {/* ─── Links desktop ─── */}
          <div className="hidden md:flex items-center gap-1 bg-char/60 border border-char/50 rounded-full px-1.5 py-1.5">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    active
                      ? "text-char-deep bg-ember font-semibold shadow-[0_2px_12px_color-mix(in_oklch,var(--ember)_35%,transparent)]"
                      : "text-white/50 hover:text-ember hover:bg-white/[0.03]"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* ─── Acciones ─── */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Usuario desktop */}
            {!mounted ? (
              <div className="hidden md:block w-20 h-9 bg-white/5 animate-pulse rounded-lg" />
            ) : user ? (
              <div className="relative hidden md:block" data-dropdown>
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-2 bg-char border border-char hover:border-ember/40 text-white/70 px-4 py-2 rounded-xl transition-all cursor-pointer max-w-[220px]"
                >
                  <User size={16} className="text-ember shrink-0" />
                  <span className="truncate text-xs font-medium">{user.name || user.email || "Mi Cuenta"}</span>
                  <ChevronDown size={14} className={`text-white/30 transition-transform duration-300 ${dropdown ? "rotate-180" : ""}`} />
                </button>

                {dropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-char-deep border border-char rounded-xl shadow-2xl py-1.5 z-50 animate-fade-in-up origin-top-right">
                    <div className="px-4 py-2 border-b border-char/50 mb-1">
                      <p className="text-[11px] text-white/30 uppercase tracking-wider font-bold">Sesión activa</p>
                      <p className="text-xs text-white/70 truncate font-semibold">{user.name || "Usuario"}</p>
                    </div>
                    <a href="/user/profile" className="flex items-center gap-2 px-4 py-2 text-white/60 hover:bg-ember hover:text-char-deep transition-colors text-xs font-medium">
                      <User size={14} /> Mi Perfil
                    </a>
                    {isAdmin && (
                      <a href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-white/60 hover:bg-ember hover:text-char-deep transition-colors text-xs font-medium">
                        <LayoutDashboard size={14} /> Dashboard
                      </a>
                    )}
                    <hr className="border-char/50 my-1" />
                    <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors text-xs font-medium text-left">
                      <LogOut size={14} /> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a href="/login" className="hidden md:block text-white/50 hover:text-ember font-medium transition-colors border border-transparent hover:border-char px-4 py-2 rounded-full text-sm">
                Ingresar
              </a>
            )}

            {/* Carrito */}
            <a href="/cart" className="relative p-2 text-white/60 hover:text-ember transition-all group">
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
              className="md:hidden p-2 text-white/60 hover:text-ember transition-colors"
              aria-label="Menú"
            >
              {mobile ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* ─── Menú mobile ─── */}
        {mobile && (
          <div className="md:hidden bg-char-deep border-b border-char px-6 py-4 space-y-1 animate-fade-in-up">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobile(false)}
                  className={`block font-medium py-2.5 rounded-xl px-4 transition-colors ${
                    active ? "text-char-deep bg-ember font-semibold" : "text-white/60 hover:bg-char"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}

            {mounted && user ? (
              <div className="pt-3 mt-2 border-t border-char/60 space-y-1">
                <p className="text-[11px] text-white/30 px-4 uppercase tracking-wider">Conectado: {user.email}</p>
                <a href="/user/profile" onClick={() => setMobile(false)} className="block text-sm text-white/60 py-2 px-4 hover:text-ember">Mi Perfil</a>
                {isAdmin && <a href="/admin/dashboard" onClick={() => setMobile(false)} className="block text-sm text-white/60 py-2 px-4 hover:text-ember">Dashboard</a>}
                <button onClick={() => { logout(); setMobile(false); }} className="block text-sm text-red-400 py-2 px-4 w-full text-left hover:bg-red-500/5 rounded-lg">Salir</button>
              </div>
            ) : mounted && !user ? (
              <a href="/login" onClick={() => setMobile(false)} className="block text-sm text-ember font-semibold py-2.5 px-4 rounded-xl border border-char text-center mt-2">Ingresar</a>
            ) : null}
          </div>
        )}
      </header>

      {/* ═══ Spacer automático para no tapar contenido ═══ */}
      <div className={`transition-all duration-300 ${scrolled ? "h-16" : "h-[76px]"}`} />
    </>
  );
}