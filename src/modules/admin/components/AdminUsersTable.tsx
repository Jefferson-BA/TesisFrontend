import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "@/modules/admin/services/user.service";

export default function AdminUsersTable() {
  const [users, setUsers] = useState<any[]>([]);

  const loadUsers = async () => {
    try {
      const data = await getUsers();

      if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error(error);
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: number | string) => {
    const confirmDelete = confirm("¿Seguro que deseas eliminar este usuario?");

    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      alert("Usuario eliminado correctamente");
      loadUsers();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar usuario");
    }
  };

  return (
    <div className="bg-[#15100e] border border-[#4a3824] rounded-xl p-8 mt-8 overflow-x-auto">
      <h2 className="text-2xl font-bold text-white mb-6">
        Usuarios Registrados
      </h2>

      <table className="w-full text-white">
        <thead>
          <tr className="border-b border-[#4a3824] text-[#f1d8b5]">
            <th className="text-left py-4">ID</th>
            <th className="text-left py-4">Nombre</th>
            <th className="text-left py-4">Correo</th>
            <th className="text-left py-4">Rol</th>
            <th className="text-left py-4">Estado</th>
            <th className="text-left py-4">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-6 text-zinc-400">
                No hay usuarios registrados
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="border-b border-[#2a1d14]">
                <td className="py-4">{user.id}</td>

                <td>{user.name || "Sin nombre"}</td>

                <td>{user.email}</td>

                <td>
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-md font-bold text-sm">
                    {user.role?.name || user.role || user.role_id || "user"}
                  </span>
                </td>

                <td>
                  <span className="bg-green-700 text-green-200 px-3 py-1 rounded-md text-sm font-bold">
                    {user.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-lg font-bold text-white"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}