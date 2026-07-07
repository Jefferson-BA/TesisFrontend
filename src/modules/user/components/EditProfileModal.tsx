"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { updateOwnProfile } from "@/modules/user/services/user.service";
import { useUser } from "@/modules/user/hooks/useUser";
import { X, User, Mail, Save, Loader2, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

// Campos del perfil tipados explícitamente en vez de `as any`.
type ProfileFields = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

const EMPTY_FORM: ProfileFields = { name: "", email: "", phone: "", address: "" };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{9}$/;

const FORM_FIELDS: Array<{
  key: keyof ProfileFields;
  label: string;
  icon: typeof User;
  type?: string;
  placeholder?: string;
  required?: boolean;
}> = [
  { key: "name", label: "Nombre", icon: User, required: true },
  { key: "email", label: "Email", icon: Mail, type: "email", required: true },
  { key: "phone", label: "Número de Celular", icon: Phone, placeholder: "Ej: 986218081" },
  { key: "address", label: "Dirección", icon: MapPin, placeholder: "Tu dirección de entrega" },
];

export const EditProfileModal = ({ open, onClose }: EditProfileModalProps) => {
  const { user, updateLocalUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ProfileFields>(EMPTY_FORM);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!user || !open) return;
    const profile = user as Partial<ProfileFields> & { id?: string | number };
    setForm({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      address: profile.address || "",
    });
  }, [user, open]);

  // Accesibilidad de modal: foco inicial, Escape para cerrar, scroll bloqueado, foco devuelto
  useEffect(() => {
    if (!open) return;

    lastFocusedRef.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      lastFocusedRef.current?.focus?.();
    };
  }, [open, onClose]);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof ProfileFields, string>> = {};
    if (!form.name.trim()) e.name = "El nombre es obligatorio";
    if (!EMAIL_REGEX.test(form.email)) e.email = "Ingresa un correo válido";
    if (form.phone && !PHONE_REGEX.test(form.phone)) e.phone = "Debe tener 9 dígitos";
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const handleFieldChange = (key: keyof ProfileFields, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = (user as { id?: string | number } | null)?.id;
    if (!userId) {
      toast.error("Usuario no encontrado");
      return;
    }
    if (!isValid) {
      toast.error("Revisa los campos marcados antes de guardar");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedUser = await updateOwnProfile(form);
      updateLocalUser({ ...user, ...updatedUser, ...form });

      toast.success("Perfil actualizado correctamente");
      onClose();

      // Sincronización visual: refresca Astro para reflejar los cambios del layout
      setTimeout(() => window.location.reload(), 800);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "No se pudo actualizar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-modal-titulo"
        >
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
              "bg-[#fffdf9] border-[#e0d5c5] dark:bg-char-deep dark:border-char",
            )}
          >
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Cerrar edición de perfil"
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60"
            >
              <X size={14} />
            </button>

            <h2 id="edit-profile-modal-titulo" className="text-xl font-bold font-display text-foreground mb-6">
              Editar Perfil
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {FORM_FIELDS.map((field) => {
                const Icon = field.icon;
                const fieldError = errors[field.key];
                const inputId = `modal-profile-${field.key}`;
                return (
                  <div key={field.key} className="space-y-2">
                    <label
                      htmlFor={inputId}
                      className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                    >
                      {field.label}
                    </label>
                    <div className="relative">
                      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        id={inputId}
                        name={field.key}
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        value={form[field.key]}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        aria-invalid={Boolean(fieldError)}
                        aria-describedby={fieldError ? `${inputId}-error` : undefined}
                        className={cn(
                          "w-full pl-10 pr-4 h-11 rounded-xl bg-muted border text-foreground text-sm outline-none transition-colors",
                          fieldError ? "border-rose-500/60 focus:border-rose-500/60" : "border-border focus:border-ember/50",
                        )}
                        required={field.required}
                      />
                    </div>
                    {fieldError && (
                      <p id={`${inputId}-error`} className="text-[11px] text-rose-400">
                        {fieldError}
                      </p>
                    )}
                  </div>
                );
              })}

              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full h-11 bg-ember hover:brightness-110 text-char-deep font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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