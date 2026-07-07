"use client";

import { useState } from "react";
import { useUser } from "@/modules/user/hooks/useUser";
import { Mail, Shield, LogOut, User, Pencil, Phone, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditProfileModal } from "../components/EditProfileModal";

export default function UserProfileCard() {
  const { user: anyUser, logout } = useUser();
  const user = anyUser as any; // 👈 Evita los errores de TypeScript en las propiedades nuevas
  const [showEditModal, setShowEditModal] = useState(false);

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-muted-foreground animate-pulse text-center">
        Cargando perfil de usuario...
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-8 shadow-xl h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-serif tracking-tight text-foreground">
              Información de Cuenta
            </h2>
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ember/10 border border-ember/20 text-ember text-xs font-bold hover:bg-ember/20 transition-colors"
            >
              <Pencil size={12} />
              Editar
            </button>
          </div>

          {/* Avatar + Nombre */}
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ember to-amber-600 flex items-center justify-center text-char-deep font-bold text-2xl shadow-[0_0_15px_rgba(201,151,74,0.3)] shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground truncate">{user.name || "Usuario"}</h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ember/10 text-ember text-[10px] font-bold uppercase tracking-wider border border-ember/20 mt-1.5">
                <Shield className="w-3 h-3" />
                {user.role === 'admin' || user.role === 'superadmin' ? 'Administrador' : 'Cliente'}
              </span>
            </div>
          </div>

          {/* Datos Dinámicos vinculados al backend */}
          <div className="space-y-3">
            <InfoRow 
              icon={Mail} 
              label="Correo Electrónico" 
              value={user.email || "No registrado"} 
            />
            <InfoRow 
              icon={Phone} 
              label="Teléfono" 
              value={user.phone || "No registrado"} 
              muted={!user.phone} 
            />
            <InfoRow 
              icon={MapPin} 
              label="Dirección" 
              value={user.address || "No registrada"} 
              muted={!user.address} 
            />
            <InfoRow 
              icon={Calendar} 
              label="Miembro desde" 
              value={user.memberSince ? new Date(user.memberSince).getFullYear().toString() : "2024"} 
              muted={!user.memberSince} 
            />
          </div>
        </div>

        {/* Logout */}
        <div className="mt-8 pt-6 border-t border-border">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive hover:text-destructive font-bold h-12 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-[0.99]"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Modal de edición */}
      <EditProfileModal open={showEditModal} onClose={() => setShowEditModal(false)} />
    </>
  );
}

// Subcomponente para filas de información
const InfoRow = ({ icon: Icon, label, value, muted }: { icon: any; label: string; value: string; muted?: boolean }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
    <Icon className={cn("w-5 h-5 shrink-0", muted ? "text-muted-foreground/40" : "text-ember")} />
    <div className="flex flex-col overflow-hidden">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className={cn("text-sm truncate", muted ? "text-muted-foreground/60 italic" : "text-foreground")}>
        {value}
      </span>
    </div>
  </div>
);