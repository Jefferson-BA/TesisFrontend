"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Trash2, Loader2, Users } from "lucide-react";
import { getUsers, deleteUser } from "@/modules/user/services/user.service";
import { cn } from "@/lib/utils";

// Tipado explícito en vez de `any[]`.
type AdminUser = {
  id: number | string;
  name?: string;
  email: string;
  role?: string | { name: string };
  role_id?: string | number;
  isActive: boolean;
};

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-ember text-char-deep",
  superadmin: "bg-ember text-char-deep",
  user: "bg-muted text-muted-foreground border border-border",
};

const getRoleLabel = (user: AdminUser) => {
  if (typeof user.role === "string") return user.role;
  if (user.role?.name) return user.role.name;
  return String(user.role_id || "user");
};

const getRoleStyle = (roleLabel: string) => ROLE_STYLES[roleLabel.toLowerCase()] || ROLE_STYLES.user;

export default function AdminUsersTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<AdminUser["id"] | null>(null);
  const [confirmingId, setConfirmingId] = useState<AdminUser["id"] | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray(data?.data)) {
        setUsers(data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("No se pudo cargar la lista de usuarios");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDeleteClick = (id: AdminUser["id"]) => {
    if (confirmingId !== id) {
      setConfirmingId(id);
      window.setTimeout(() => setConfirmingId((cur) => (cur === id ? null : cur)), 3000);
      return;
    }
    void handleConfirmedDelete(id);
  };

  const handleConfirmedDelete = async (id: AdminUser["id"]) => {
    setConfirmingId(null);
    setDeletingId(id);
    try {
      await deleteUser(id);
      toast.success("Usuario eliminado correctamente");
      await loadUsers();
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar usuario");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-8 mt-8 overflow-x-auto shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-display text-foreground">Usuarios Registrados</h2>
        {!isLoading && <span className="text-xs text-muted-foreground">{users.length} usuarios</span>}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <table className="w-full text-foreground">
          <thead>
            <tr className="border-b border-border text-ember">
              <th className="text-left py-4 text-[11px] font-bold uppercase tracking-widest">ID</th>
              <th className="text-left py-4 text-[11px] font-bold uppercase tracking-widest">Nombre</th>
              <th className="text-left py-4 text-[11px] font-bold uppercase tracking-widest">Correo</th>
              <th className="text-left py-4 text-[11px] font-bold uppercase tracking-widest">Rol</th>
              <th className="text-left py-4 text-[11px] font-bold uppercase tracking-widest">Estado</th>
              <th className="text-left py-4 text-[11px] font-bold uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const roleLabel = getRoleLabel(user);
                const isConfirming = confirmingId === user.id;
                const isDeleting = deletingId === user.id;

                return (
                  <tr key={user.id} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                    <td className="py-4 text-sm text-muted-foreground font-mono">{user.id}</td>
                    <td className="py-4 text-sm">{user.name || "Sin nombre"}</td>
                    <td className="py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="py-4">
                      <span className={cn("px-3 py-1 rounded-md font-bold text-[11px] uppercase tracking-wide", getRoleStyle(roleLabel))}>
                        {roleLabel}
                      </span>
                    </td>
                    <td className="py-4">
                      {/* Antes este badge era siempre verde sin importar isActive */}
                      <span
                        className={cn(
                          "px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border",
                          user.isActive
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20",
                        )}
                      >
                        {user.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => handleDeleteClick(user.id)}
                        disabled={isDeleting}
                        className={cn(
                          "px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed",
                          isConfirming
                            ? "bg-red-600 hover:bg-red-500 text-white"
                            : "bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400",
                        )}
                      >
                        {isDeleting ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        {isConfirming ? "¿Confirmar?" : "Eliminar"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}