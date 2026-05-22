import { useEffect, useState } from "react";
import { User, Mail, ShieldCheck, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { updateUser } from "../services/user.service";

export default function UserProfileCard() {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updated = await updateUser(user.id, {
        name: form.name,
        email: form.email,
      });

      const newUser = {
        ...user,
        ...updated,
        name: form.name,
        email: form.email,
      };

      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      setEditing(false);

      toast.success("Perfil actualizado en la base de datos");
    } catch (error: any) {
      console.error(error.response?.data || error);
      toast.error(error.response?.data?.message || "Error al actualizar perfil");
    }
  };

  if (!user) return null;

  return (
    <div className="bg-[#140d0b] border border-[#3d2c1f] rounded-2xl p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Datos del Usuario</h2>

        <button
          onClick={() => setEditing(!editing)}
          className="bg-yellow-500 text-black px-5 py-3 rounded-lg font-bold flex items-center gap-2"
        >
          {editing ? <X size={16} /> : <Pencil size={16} />}
          {editing ? "Cancelar" : "Editar"}
        </button>
      </div>

      {!editing ? (
        <div className="space-y-5">
          <p className="flex items-center gap-3">
            <User className="text-yellow-500" />
            {user.name}
          </p>

          <p className="flex items-center gap-3">
            <Mail className="text-yellow-500" />
            {user.email}
          </p>

          <p className="flex items-center gap-3">
            <ShieldCheck className="text-yellow-500" />
            {user.role}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-black border border-[#3d2c1f] rounded-lg p-4 text-white"
            placeholder="Nombre"
            required
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-black border border-[#3d2c1f] rounded-lg p-4 text-white"
            placeholder="Correo"
            required
          />

          <button className="bg-yellow-500 text-black font-bold py-3 rounded-lg">
            Guardar cambios
          </button>
        </form>
      )}
    </div>
  );
}