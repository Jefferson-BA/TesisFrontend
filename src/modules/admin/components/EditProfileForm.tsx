import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateUser } from "../../user/services/user.service";

export default function EditProfileForm() {
  const [user, setUser] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setForm({
        name: parsed.name || "",
        email: parsed.email || "",
      });
    }
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearHistory = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("promos");
    toast.success("Movimientos locales borrados");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const updatedUser = await updateUser(user.id, form);

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          ...updatedUser,
          ...form,
        })
      );

      toast.success("Perfil actualizado");
      window.location.reload();
    } catch (error: any) {
      console.error(error.response?.data || error);
      toast.error("No se pudo actualizar el perfil");
    }
  };

  return (
    <div
      id="editar-perfil"
      className="bg-[#140d0b] border border-[#3d2c1f] rounded-2xl p-8"
    >
      <h2 className="text-2xl font-bold mb-6">Editar Perfil</h2>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
          className="bg-black border border-[#3d2c1f] rounded-lg p-4"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Correo"
          className="bg-black border border-[#3d2c1f] rounded-lg p-4"
        />

        <button className="bg-yellow-500 text-black font-bold py-3 rounded-lg">
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