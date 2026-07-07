import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateOwnProfile } from "@/modules/user/services/user.service";
import { useUser } from "@/modules/user/hooks/useUser";

// Importaciones de tus componentes UI premium unificados
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Save, Trash2, Loader2 } from "lucide-react";

export default function EditProfileForm() {
  // 🟢 CORRECCIÓN SEGURA: Obtenemos el usuario de forma directa y limpia
  const { user, updateLocalUser } = useUser();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // 🔄 Sincroniza los valores del formulario cuando el usuario termina de cargar desde el backend
  useEffect(() => {
    if (user) {
      setForm({
        name: (user as any).name || "",
        email: (user as any).email || "",
        phone: (user as any).phone || "",    // 🟢 Extrae correctamente el teléfono de la base de datos
        address: (user as any).address || "", // 🟢 Extrae correctamente la dirección de la base de datos
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const clearHistory = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("promos");

    toast.success("Movimientos locales borrados con éxito", {
      style: {
        background: '#120d0a',
        color: '#fff',
        border: '1px solid #4a3824',
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Usuario no encontrado");
      return;
    }

    setIsSubmitting(true);

    try {
      // Llamada al servicio seguro de perfil propio
      const updatedUser = await updateOwnProfile(form);

      updateLocalUser({
        ...user,
        ...updatedUser,
        ...form,
      });

      toast.success("Perfil actualizado correctamente", {
        style: {
          background: '#120d0a',
          color: '#fff',
          border: '1px solid #4a3824',
        }
      });

      // 🔄 Sincronización visual: Refresca Astro para renderizar los nuevos datos desde el servidor
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error: any) {
      console.error(error.response?.data || error);

      toast.error(
        error.response?.data?.message || "No se pudo actualizar el perfil",
        {
          style: {
            background: '#120d0a',
            color: '#fff',
            border: '1px solid #e11d48',
          }
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="editar-perfil"
      className="bg-[#0e0a08]/95 border border-[#3d2c1f]/40 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white backdrop-blur-md max-w-xl mx-auto space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold font-serif tracking-tight text-zinc-100">
          Editar Perfil
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Actualiza tu información personal de cuenta.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* INPUT: NOMBRE */}
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 ml-1">
            Nombre Completo
          </Label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-yellow-500 transition-colors z-10" />
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              className="pl-12 bg-[#14100d] border border-[#3d2c1f]/60 h-12 text-zinc-100 rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-500/50 transition-all placeholder:text-zinc-600"
              required
            />
          </div>
        </div>

        {/* INPUT: EMAIL */}
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 ml-1">
            Correo Electrónico
          </Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-yellow-500 transition-colors z-10" />
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="usuario@deparraspitz.com"
              className="pl-12 bg-[#14100d] border border-[#3d2c1f]/60 h-12 text-zinc-100 rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-500/50 transition-all placeholder:text-zinc-600"
              required
            />
          </div>
        </div>

        {/* INPUT: NÚMERO DE CELULAR */}
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 ml-1">
            Número de Celular
          </Label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-yellow-500 transition-colors z-10" />
            <Input
              name="phone"
              type="text"
              value={form.phone}
              onChange={handleChange}
              placeholder="Ej: 986218081"
              className="pl-12 bg-[#14100d] border border-[#3d2c1f]/60 h-12 text-zinc-100 rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* INPUT: DIRECCIÓN */}
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 ml-1">
            Dirección de Entrega
          </Label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-yellow-500 transition-colors z-10" />
            <Input
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              placeholder="Tu dirección completa de domicilio"
              className="pl-12 bg-[#14100d] border border-[#3d2c1f]/60 h-12 text-zinc-100 rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* BOTÓN GUARDAR */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold h-12 rounded-xl text-xs uppercase tracking-widest shadow-[0_4px_20px_rgba(234,179,8,0.15)] transition-all active:scale-[0.99] border-none disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Guardar cambios
          </Button>
        </div>
      </form>

      {/* SECCIÓN DE SEGURIDAD / ACCIONES CRÍTICAS */}
      <div className="pt-6 border-t border-[#3d2c1f]/30">
        <div className="bg-[#1a110e]/40 border border-rose-950/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-rose-400">Datos temporales</h4>
            <p className="text-xs text-zinc-400 max-w-sm">
              Limpia el carrito activo y promociones guardadas en este navegador local.
            </p>
          </div>
          <Button
            type="button"
            onClick={clearHistory}
            variant="destructive"
            className="w-full sm:w-auto bg-rose-950/50 hover:bg-rose-900 border border-rose-800/60 text-rose-200 text-xs font-semibold px-4 h-10 rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
}