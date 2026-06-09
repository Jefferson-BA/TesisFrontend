import { useState, useEffect } from "react";
import {
  ShoppingCart,
  LayoutDashboard,
  LogOut,
  ChefHat,
  User,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import { useUser } from "@/modules/user/hooks/useUser";

export function PublicNavbar() {
  const cart = useCartStore((state) => state.cart);
  const { user, logout, isAdmin } = useUser();
  
  const [isMounted, setIsMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setIsMounted(true);
    // Captura de forma segura la URL del navegador en el cliente
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  // Función auxiliar para determinar de forma limpia si una pestaña está activa
  const isTabActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0b0806]/90 border-b border-[#3d2c1f]/60 backdrop-blur-md transition-all">
      <nav className="max-w-7xl mx-auto h-[76px] px-4 sm:px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-[#120d0a] border border-[#3d2c1f] flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.15)] group-hover:border-yellow-500/50 transition-colors">
            <ChefHat className="text-yellow-500 w-5 h-5" />
          </div>

          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-white leading-none tracking-wide">
              DeParraSpitz
            </h1>
            <p className="text-yellow-500 text-[10px] font-black tracking-[0.22em] mt-1.5">
              CATERING & EVENTOS
            </p>
          </div>
        </a>

        {/* NAVIGATION LINKS (DESKTOP) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a 
            href="/" 
            className={`transition-all py-2 border-b-2 ${
              isTabActive("/") 
                ? "text-yellow-500 font-semibold border-yellow-500/80" 
                : "text-zinc-400 hover:text-yellow-500 border-transparent"
            }`}
          >
            Inicio
          </a>
          <a 
            href="/menu" 
            className={`transition-all py-2 border-b-2 ${
              isTabActive("/menu") 
                ? "text-yellow-500 font-semibold border-yellow-500/80" 
                : "text-zinc-400 hover:text-yellow-500 border-transparent"
            }`}
          >
            Menú
          </a>
          <a 
            href="/reservas" 
            className={`transition-all py-2 border-b-2 ${
              isTabActive("/reservas") 
                ? "text-yellow-500 font-semibold border-yellow-500/80" 
                : "text-zinc-400 hover:text-yellow-500 border-transparent"
            }`}
          >
            Reservas
          </a>
        </div>

        {/* ACTIONS AREA */}
        <div className="flex items-center gap-4 text-sm">
          
          {/* USER SECTIONS */}
          {!isMounted ? (
            <div className="w-20 h-9 bg-zinc-800/20 animate-pulse rounded-lg hidden md:block"></div> 
          ) : user ? (
            /* USER DROPDOWN COMPONENT */
            <div className="relative hidden md:block">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-[#120d0a] border border-[#3d2c1f] hover:border-yellow-500/40 text-zinc-300 px-4 py-2 rounded-xl transition-all cursor-pointer max-w-[240px]"
              >
                <User size={16} className="text-yellow-500 shrink-0" />
                <span className="truncate text-xs font-medium">
                  {user.name || user.email || "Mi Cuenta"}
                </span>
                <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* DROPDOWN MENU */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#0f0c0a] border border-[#3d2c1f] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-[#3d2c1f]/50 mb-1">
                    <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Sesión activa</p>
                    <p className="text-xs text-zinc-300 truncate font-semibold">{user.name || 'Usuario'}</p>
                  </div>
                  
                  <a href="/user/profile" className="flex items-center gap-2 px-4 py-2 text-zinc-300 hover:bg-yellow-500 hover:text-black transition-colors text-xs font-medium">
                    <User size={14} />
                    Mi Perfil
                  </a>

                  {isAdmin && (
                    <a href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-zinc-300 hover:bg-yellow-500 hover:text-black transition-colors text-xs font-medium">
                      <LayoutDashboard size={14} />
                      Dashboard Admin
                    </a>
                  )}

                  <hr className="border-[#3d2c1f]/50 my-1" />

                  <button 
                    onClick={logout} 
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors text-xs font-medium text-left"
                  >
                    <LogOut size={14} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" className="hidden md:block text-zinc-400 hover:text-yellow-500 font-medium transition-colors border border-transparent hover:border-[#3d2c1f] px-3 py-1.5 rounded-lg">
              Ingresar
            </a>
          )}

          {/* SHOPPING CART */}
          <a href="/cart" className="relative p-2 text-zinc-300 hover:text-yellow-500 transition-all group">
            <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-105" />
            {isMounted && cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(234,179,8,0.5)] transform translate-x-1 -translate-y-1">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </a>

          {/* MOBILE MENU BUTTON */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-zinc-300 hover:text-yellow-500 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0b0806] border-b border-[#3d2c1f] px-6 py-4 space-y-2 animate-in fade-in slide-in-from-top-5">
          <a 
            href="/" 
            className={`block font-medium py-2 rounded-lg px-3 transition-colors ${
              isTabActive("/") ? "text-yellow-500 bg-[#120d0a]" : "text-zinc-300"
            }`}
          >
            Inicio
          </a>
          <a 
            href="/menu" 
            className={`block font-medium py-2 rounded-lg px-3 transition-colors ${
              isTabActive("/menu") ? "text-yellow-500 bg-[#120d0a]" : "text-zinc-300"
            }`}
          >
            Menú
          </a>
          <a 
            href="/reservas" 
            className={`block font-medium py-2 rounded-lg px-3 transition-colors ${
              isTabActive("/reservas") ? "text-yellow-500 bg-[#120d0a]" : "text-zinc-300"
            }`}
          >
            Reservas
          </a>
          
          {isMounted && user && (
            <div className="pt-3 border-t border-[#3d2c1f]/60 space-y-1">
              <p className="text-[11px] text-zinc-500 px-3 truncate">Conectado como: {user.email}</p>
              <a href="/user/profile" className="block text-sm text-zinc-300 py-2 px-3 hover:text-yellow-500">Mi Perfil</a>
              {isAdmin && <a href="/admin/dashboard" className="block text-sm text-zinc-300 py-2 px-3 hover:text-yellow-500">Dashboard</a>}
              <button onClick={logout} className="block text-sm text-red-400 py-2 px-3 text-left w-full hover:bg-red-500/5 rounded-lg">Salir</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}