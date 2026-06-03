import { useState, useEffect } from "react";
import {
  ShoppingCart,
  LayoutDashboard,
  LogOut,
  ChefHat,
  User,
} from "lucide-react";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import { useUser } from "@/modules/user/hooks/useUser";

export function PublicNavbar() {
  const cart = useCartStore((state) => state.cart);
  const { user, logout, isAdmin } = useUser();
  
  // 👇 NUEVO: Estado para saber si ya estamos en el navegador
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0b0806]/95 border-b border-[#3d2c1f] backdrop-blur">
      <nav className="max-w-7xl mx-auto h-[82px] px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#120d0a] border border-[#3d2c1f] flex items-center justify-center shadow-[0_0_25px_rgba(234,179,8,0.25)]">
            <ChefHat className="text-yellow-500 w-6 h-6" />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold text-white leading-none">
              DeParraSpitz
            </h1>
            <p className="text-yellow-500 text-xs font-black tracking-[0.25em] mt-1">
              CATERING & EVENTOS
            </p>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-zinc-300">
          <a href="/" className="hover:text-yellow-500 transition-colors">
            Inicio
          </a>
          <a href="/menu" className="hover:text-yellow-500 transition-colors">
            Menú
          </a>
          <a href="/reservas" className="text-yellow-500 hover:text-yellow-400 transition-colors font-bold">
            Reservas
          </a>
          <a href="/#contacto" className="hover:text-yellow-500 transition-colors">
            Contacto
          </a>
        </div>

        <div className="flex items-center gap-5 text-sm">
          {/* 👇 Usamos isMounted para que el servidor y el cliente coincidan al inicio */}
          {!isMounted ? (
            // Mientras carga, mostramos un espacio vacío o un botón de login genérico
            <div className="w-20"></div> 
          ) : user ? (
            <>
              <a
                href="/user/profile"
                className="hidden md:flex items-center gap-2 text-zinc-300 hover:text-yellow-500 transition-colors"
              >
                <User size={17} />
                <span>
                  Hola,{" "}
                  <strong className="text-white">
                    {user.name || user.email || "Usuario"}
                  </strong>
                </span>
              </a>

              <a
                href="/user/profile"
                className="hidden md:block bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
              >
                Perfil
              </a>

              {isAdmin && (
                <a
                  href="/admin/dashboard"
                  className="hidden md:flex items-center gap-2 text-zinc-300 hover:text-yellow-500"
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </a>
              )}

              <button
                onClick={logout}
                className="hidden md:flex items-center gap-2 text-yellow-500 font-bold hover:text-yellow-400"
              >
                <LogOut size={17} />
                Salir
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="text-zinc-300 hover:text-yellow-500 font-semibold"
            >
              Admin Login
            </a>
          )}

          <a href="/cart" className="relative">
            <ShoppingCart className="w-8 h-8 text-white hover:text-yellow-500 transition-colors" />

            {/* 👇 También protegemos el globo del carrito con isMounted */}
            {isMounted && cart.length > 0 && (
              <span className="absolute -top-3 -right-3 bg-yellow-500 text-black text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </a>
        </div>
      </nav>
    </header>
  );
}