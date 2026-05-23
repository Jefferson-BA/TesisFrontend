import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateUser } from "../../user/services/user.service";
import { useUser } from "@/modules/user/hooks/useUser";

export default function EditProfileForm() {
  const { user, updateLocalUser } = useUser();

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const clearHistory = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("promos");

    toast.success("Movimientos locales borrados");
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!user) {
      toast.error("Usuario no encontrado");
      return;
    }

    if (!user.id) {
      toast.error("ID de usuario inválido");
      return;
    }

    try {
      const updatedUser = await updateUser(
        user.id,
        form
      );

      updateLocalUser({
        ...user,
        ...updatedUser,
        ...form,
      });

      toast.success("Perfil actualizado");
    } catch (error: any) {
      console.error(error.response?.data || error);

      toast.error(
        error.response?.data?.message ||
          "No se pudo actualizar el perfil"
      );
    }
  };

  return (
    <div
      id="editar-perfil"
      className="bg-[#140d0b] border border-[#3d2c1f] rounded-2xl p-8"
    >
      <h2 className="text-2xl font-bold mb-6">
        Editar Perfil
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
          className="bg-black border border-[#3d2c1f] rounded-lg p-4 text-white"
        />

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Correo"
          className="bg-black border border-[#3d2c1f] rounded-lg p-4 text-white"
        />

        <button
          type="submit"
          className="bg-yellow-500 text-black font-bold py-3 rounded-lg"
        >
          Guardar cambios
        </button>
      </form>

      <button
        onClick={clearHistory}
        className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg"
      >
        Borrar movimientos locales
      </button>
    </div>
  );
}