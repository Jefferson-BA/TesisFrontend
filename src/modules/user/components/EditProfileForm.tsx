import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { updateOwnProfile } from "@/modules/user/services/user.service";
import { useUser } from "@/modules/user/hooks/useUser";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Save, Trash2, Loader2 } from "lucide-react";

// Campos del perfil tipados explícitamente en vez de `as any`.
// Ideal: mover esto a la interface real de usuario cuando el backend la exponga tipada.
type ProfileFields = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

const EMPTY_FORM: ProfileFields = { name: "", email: "", phone: "", address: "" };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{9}$/;

// Estilo de toast unificado con los tokens del tema, no hex repetidos.
const TOAST_STYLE = {
  base: {
    background: "var(--card)",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
  },
  error: {
    background: "var(--card)",
    color: "var(--foreground)",
    border: "1px solid #e11d48",
  },
};

const FORM_FIELDS: Array<{
  key: keyof ProfileFields;
  label: string;
  icon: typeof User;
  type?: string;
  placeholder: string;
  required?: boolean;
}> = [
  { key: "name", label: "Nombre Completo", icon: User, placeholder: "Tu nombre completo", required: true },
  { key: "email", label: "Correo Electrónico", icon: Mail, type: "email", placeholder: "usuario@deparraspitz.com", required: true },
  { key: "phone", label: "Número de Celular", icon: Phone, placeholder: "Ej: 986218081" },
  { key: "address", label: "Dirección de Entrega", icon: MapPin, placeholder: "Tu dirección completa de domicilio" },
];

export default function EditProfileForm() {
  const { user, updateLocalUser } = useUser();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ProfileFields>(EMPTY_FORM);
  const [confirmingClear, setConfirmingClear] = useState(false);

  useEffect(() => {
    if (!user) return;
    const profile = user as Partial<ProfileFields>;
    setForm({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      address: profile.address || "",
    });
  }, [user]);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof ProfileFields, string>> = {};
    if (!form.name.trim()) e.name = "El nombre es obligatorio";
    if (!EMAIL_REGEX.test(form.email)) e.email = "Ingresa un correo válido";
    if (form.phone && !PHONE_REGEX.test(form.phone)) e.phone = "Debe tener 9 dígitos";
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClearClick = useCallback(() => {
    if (!confirmingClear) {
      setConfirmingClear(true);
      window.setTimeout(() => setConfirmingClear(false), 3000);
      return;
    }
    localStorage.removeItem("cart");
    localStorage.removeItem("promos");
    setConfirmingClear(false);
    toast.success("Movimientos locales borrados con éxito", { style: TOAST_STYLE.base });
  }, [confirmingClear]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Usuario no encontrado");
      return;
    }
    if (!isValid) {
      toast.error("Revisa los campos marcados antes de guardar", { style: TOAST_STYLE.error });
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedUser = await updateOwnProfile(form);
      updateLocalUser({ ...user, ...updatedUser, ...form });

      toast.success("Perfil actualizado correctamente", { style: TOAST_STYLE.base });

      // Sincronización visual: refresca Astro para renderizar los nuevos datos desde el servidor
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error(err.response?.data || error);
      toast.error(err.response?.data?.message || "No se pudo actualizar el perfil", {
        style: TOAST_STYLE.error,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="editar-perfil"
      className="bg-card/95 border border-border rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)] text-foreground backdrop-blur-md max-w-xl mx-auto space-y-8"
    >
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-2xl font-bold font-display tracking-tight text-foreground">Editar Perfil</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Actualiza tu información personal de cuenta.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {FORM_FIELDS.map((field, i) => {
          const Icon = field.icon;
          const fieldError = errors[field.key];
          const inputId = `profile-${field.key}`;
          return (
            <motion.div
              key={field.key}
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 + i * 0.06 }}
            >
              <Label
                htmlFor={inputId}
                className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1"
              >
                {field.label}
              </Label>
              <div className="relative group">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-ember transition-colors z-10" />
                <Input
                  id={inputId}
                  name={field.key}
                  type={field.type || "text"}
                  value={form[field.key]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  aria-invalid={Boolean(fieldError)}
                  aria-describedby={fieldError ? `${inputId}-error` : undefined}
                  className={`pl-12 bg-input border h-12 text-foreground rounded-xl text-sm focus-visible:ring-1 transition-all placeholder:text-muted-foreground/60 ${
                    fieldError
                      ? "border-rose-500/60 focus-visible:ring-rose-500/50 focus-visible:border-rose-500/50"
                      : "border-border focus-visible:ring-ember/50 focus-visible:border-ember/50"
                  }`}
                  required={field.required}
                />
              </div>
              {fieldError && (
                <p id={`${inputId}-error`} className="text-[11px] text-rose-400 ml-1">
                  {fieldError}
                </p>
              )}
            </motion.div>
          );
        })}

        <motion.div
          className="pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 + FORM_FIELDS.length * 0.06 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full bg-gradient-to-r from-ember to-amber-500 hover:brightness-110 text-char-deep font-bold h-12 rounded-xl text-xs uppercase tracking-widest shadow-[0_4px_20px_color-mix(in_oklch,var(--ember)_25%,transparent)] transition-all active:scale-[0.99] border-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Guardar cambios
          </Button>
        </motion.div>
      </form>

      {/* SECCIÓN DE SEGURIDAD / ACCIONES CRÍTICAS */}
      <div className="pt-6 border-t border-border">
        <div className="bg-rose-950/10 border border-rose-900/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-rose-400">Datos temporales</h4>
            <p className="text-xs text-muted-foreground max-w-sm">
              Limpia el carrito activo y promociones guardadas en este navegador local.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleClearClick}
            variant="destructive"
            className={`w-full sm:w-auto text-xs font-semibold px-4 h-10 rounded-xl transition-all border ${
              confirmingClear
                ? "bg-rose-600 hover:bg-rose-500 border-rose-500 text-white"
                : "bg-rose-950/50 hover:bg-rose-900 border-rose-800/60 text-rose-200"
            }`}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {confirmingClear ? "¿Seguro? Click para confirmar" : "Limpiar"}
          </Button>
        </div>
      </div>
    </div>
  );
}