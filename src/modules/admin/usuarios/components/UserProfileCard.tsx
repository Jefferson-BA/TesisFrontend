import { useUser } from "@/modules/user/hooks/useUser";
import { Mail, Shield, LogOut } from "lucide-react";

export default function UserProfileCard() {
  const { user, logout } = useUser();

  if (!user) {
    return (
      <div className="bg-[#0e0a08]/95 border border-[#3d2c1f]/40 rounded-2xl p-8 text-zinc-400 animate-pulse text-center">
        Cargando perfil de usuario...
      </div>
    );
  }

  return (
    <div className="bg-[#0e0a08]/95 border border-[#3d2c1f]/40 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white backdrop-blur-md w-full h-full flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold font-serif tracking-tight text-zinc-100 mb-6">
          Información de Cuenta
        </h2>

        {/* Avatar + Nombre */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-black font-bold text-2xl shadow-[0_0_15px_rgba(234,179,8,0.3)] shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-xl font-bold text-zinc-100 truncate">{user.name}</h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-wider border border-yellow-500/20 mt-1.5">
              <Shield className="w-3 h-3" />
              {user.role === 'admin' || user.role === 'superadmin' ? 'Administrador' : 'Cliente'}
            </span>
          </div>
        </div>

        {/* Datos en tarjetas */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-zinc-400 bg-[#14100d] p-4 rounded-xl border border-[#3d2c1f]/40">
            <Mail className="w-5 h-5 text-zinc-500 shrink-0" />
            <div className="flex flex-col overflow-hidden">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Correo Electrónico</span>
              <span className="text-sm text-zinc-200 truncate">{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="mt-8 pt-6 border-t border-[#3d2c1f]/30">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 text-rose-400 hover:text-rose-300 font-bold h-12 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-[0.99]"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}