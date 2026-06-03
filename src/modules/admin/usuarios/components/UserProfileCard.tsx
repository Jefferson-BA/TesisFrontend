import { useEffect, useState } from "react";
import { toast } from "sonner";

type User = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};

export const useUser = () => {
  const [user, setUserState] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        setUserState(JSON.parse(savedUser));
      }
    } catch {
      localStorage.removeItem("user");
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const setUser = (newUser: User) => {
    localStorage.setItem("user", JSON.stringify(newUser));
    setUserState(newUser);
  };

  const updateLocalUser = (newData: Partial<User>) => {
    const updatedUser = {
      ...user,
      ...newData,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUserState(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("promos");

    document.cookie =
      "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    toast.success("Sesión cerrada correctamente");

    setTimeout(() => {
      window.location.href = "/login";
    }, 700);
  };

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  return {
    user,
    setUser,
    updateLocalUser,
    logout,
    loadingUser,
    isLoggedIn,
    isAdmin,
  };
};