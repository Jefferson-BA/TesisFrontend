import { useAuthStore } from "@/modules/auth/store/authStore";
import { Button } from "@/components/ui/button";

export function PublicNavbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.reload(); 
  };

  return (
    <nav className="w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
        {/* Logo del Restaurante */}
        <div className="font-extrabold text-xl md:text-2xl tracking-tighter text-white uppercase">
          Hojas de Parra <span className="text-emerald-500">Spitz</span>
        </div>

        {/* Menú de Usuario */}
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-300">
                Hola, <span className="font-bold text-white">{user.name}</span>
              </span>
              <Button variant="outline" size="sm" className="border-zinc-700 text-white hover:bg-zinc-800" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          ) : (
            <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
              <a href="/login">Iniciar Sesión</a>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}