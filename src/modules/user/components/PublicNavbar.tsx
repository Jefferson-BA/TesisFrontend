import { useAuthStore } from "@/modules/auth/store/authStore";
import { ShoppingCart, ChefHat } from "lucide-react";

export function PublicNavbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();

    document.cookie =
      "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    window.location.reload();
  };

  return (
    <nav className="w-full bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50 px-8 py-4 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="bg-[#1a1608] p-2 rounded-lg border border-[#3a3010]">
            <ChefHat className="w-6 h-6 text-[#eab308]" />
          </div>

          <div className="flex flex-col">
            <span className="font-['Playfair_Display'] font-bold text-xl leading-tight text-white tracking-tight">
              DeParraSpitz
            </span>

            <span className="text-[10px] uppercase tracking-[0.3em] text-[#eab308] font-bold">
              Catering & Eventos
            </span>
          </div>
        </div>

        {/* MENÚ */}
        <div className="hidden md:flex items-center gap-10">

          <a
            href="/"
            className="text-sm font-medium text-white relative group"
          >
            Inicio

            <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#eab308] rounded-full scale-x-100 transition-transform"></span>
          </a>

          <a
            href="/menu"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Menú
          </a>

          <a
            href="/contacto"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Contacto
          </a>

        </div>

        {/* DERECHA */}
        <div className="flex items-center gap-8">

          {user ? (
            <div className="flex items-center gap-4">

              <span className="text-[12px] text-zinc-400">
                Hola,{" "}
                <span className="text-white font-semibold">
                  {user.name}
                </span>
              </span>

              <button
                onClick={handleLogout}
                className="text-[12px] uppercase tracking-widest text-[#eab308] font-bold hover:text-yellow-500 transition-colors"
              >
                Salir
              </button>

            </div>
          ) : (
            <a
              href="/login"
              className="text-[12px] uppercase tracking-[0.2em] font-bold text-zinc-400 hover:text-white transition-colors"
            >
              Admin Login
            </a>
          )}

          {/* CARRITO */}
          <a
            href="/cart"
            className="relative cursor-pointer group"
          >
            <ShoppingCart className="w-6 h-6 text-white group-hover:text-[#eab308] transition-colors" />

            <span className="absolute -top-2 -right-2 bg-[#eab308] text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0a0a0a]">
              1
            </span>
          </a>

        </div>
      </div>
    </nav>
  );
}