import { ShoppingCart, LayoutDashboard, LogOut, ChefHat } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/modules/auth/store/cartStore";

export function PublicNavbar() {
  const cart = useCartStore((state) => state.cart);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

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
          <a href="/#contacto" className="hover:text-yellow-500 transition-colors">
            Contacto
          </a>
        </div>

        <div className="flex items-center gap-6 text-sm">
          {user ? (
            <>
              <span className="text-zinc-300 hidden md:block">
                Hola,{" "}
                <strong className="text-white">
                  {user.name || user.email || "Usuario"}
                </strong>
              </span>

              {(user.role === "admin" || user.role === "superadmin") && (
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

            {cart.length > 0 && (
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