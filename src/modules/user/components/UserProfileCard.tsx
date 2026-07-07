"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/modules/user/hooks/useUser";
import { Mail, Shield, LogOut, Pencil, Phone, MapPin, Calendar, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditProfileModal } from "../components/EditProfileModal";

// Tipado explícito del usuario en vez de `as any`.
// Ideal: mover esto a la interface real cuando el backend la exponga tipada.
type UserProfile = {
  id: string | number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: string;
  memberSince?: string;
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  superadmin: "Administrador",
};

export default function UserProfileCard() {
  const { user, logout } = useUser();
  const profile = user as UserProfile | null;
  const [showEditModal, setShowEditModal] = useState(false);

  if (!profile) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-muted-foreground animate-pulse text-center">
        Cargando perfil de usuario...
      </div>
    );
  }

  const roleLabel = (profile.role && ROLE_LABELS[profile.role]) || "Cliente";
  const missingFieldsCount = [profile.phone, profile.address].filter((v) => !v).length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-border bg-card p-8 shadow-xl h-full flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-display tracking-tight text-foreground">
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
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ember to-amber-600 flex items-center justify-center text-char-deep font-bold text-2xl shadow-[0_0_15px_color-mix(in_oklch,var(--ember)_35%,transparent)] shrink-0">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-foreground truncate">{profile.name || "Usuario"}</h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ember/10 text-ember text-[10px] font-bold uppercase tracking-wider border border-ember/20 mt-1.5">
                <Shield className="w-3 h-3" />
                {roleLabel}
              </span>
            </div>
          </div>

          {/* Aviso de perfil incompleto: invita a completar, no se ve a error */}
          {missingFieldsCount > 0 && (
            <button
              onClick={() => setShowEditModal(true)}
              className="w-full text-left mb-4 px-4 py-3 rounded-xl bg-ember/5 border border-dashed border-ember/30 hover:border-ember/50 transition-colors group"
            >
              <p className="text-xs text-foreground">
                <span className="font-bold text-ember">Completa tu perfil</span> — te faltan{" "}
                {missingFieldsCount} {missingFieldsCount === 1 ? "dato" : "datos"} para agilizar tus próximas
                reservas.
              </p>
            </button>
          )}

          {/* Datos Dinámicos vinculados al backend */}
          <div className="space-y-3">
            <InfoRow icon={Mail} label="Correo Electrónico" value={profile.email || "No registrado"} />
            <InfoRow
              icon={Phone}
              label="Teléfono"
              value={profile.phone || "No registrado"}
              muted={!profile.phone}
              onEmptyClick={() => setShowEditModal(true)}
            />
            <InfoRow
              icon={MapPin}
              label="Dirección"
              value={profile.address || "No registrada"}
              muted={!profile.address}
              onEmptyClick={() => setShowEditModal(true)}
            />
            <InfoRow
              icon={Calendar}
              label="Miembro desde"
              value={profile.memberSince ? new Date(profile.memberSince).getFullYear().toString() : "2024"}
              muted={!profile.memberSince}
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
      </motion.div>

      <EditProfileModal open={showEditModal} onClose={() => setShowEditModal(false)} />
    </>
  );
}

// Subcomponente para filas de información
const InfoRow = ({
  icon: Icon,
  label,
  value,
  muted,
  onEmptyClick,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  muted?: boolean;
  onEmptyClick?: () => void;
}) => {
  const content = (
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

  if (muted && onEmptyClick) {
    return (
      <button onClick={onEmptyClick} className="w-full text-left hover:opacity-80 transition-opacity">
        {content}
      </button>
    );
  }

  return content;
};