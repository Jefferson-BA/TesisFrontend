// src/modules/admin/usuarios/components/EditProfileModal.tsx

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { updateUser } from "@/modules/user/services/user.service";
import { useUser } from "@/modules/user/hooks/useUser";
import { X, User, Mail, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export const EditProfileModal = ({ open, onClose }: EditProfileModalProps) => {
  const { user, updateLocalUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    if (user && open) {
      setForm({ name: user.name || "", email: user.email || "" });
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) { toast.error("Usuario no encontrado"); return; }

    setIsSubmitting(true);
    try {
      const updatedUser = await updateUser(user.id, form);
      updateLocalUser({ ...user, ...updatedUser, ...form });
      toast.success("Perfil actualizado correctamente");
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "No se pudo actualizar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative w-full max-w-md rounded-2xl border shadow-2xl p-8 z-10",
              "bg-[#fffdf9] border-[#e0d5c5] dark:bg-char-deep dark:border-char"
            )}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>

            <h2 className="text-xl font-bold font-serif text-foreground mb-6">Editar Perfil</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nombre</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-10 pr-4 h-11 rounded-xl bg-muted border border-border text-foreground text-sm focus:border-ember/50 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-10 pr-4 h-11 rounded-xl bg-muted border border-border text-foreground text-sm focus:border-ember/50 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-ember hover:brightness-110 text-char-deep font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar cambios
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};