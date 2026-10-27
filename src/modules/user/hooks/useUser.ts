// src/modules/user/hooks/useUser.ts
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { extractRole } from "@/lib/auth-utils";

type User = {
  id?: string | number;
  name?: string;
  email?: string;
  role?: any;
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

  const userRole = extractRole(user);
  const isLoggedIn = !!user;
  const isSuperAdmin = userRole === "superadmin";
  const isAdmin = userRole === "admin" || isSuperAdmin;

  return {
    user,
    role: userRole,
    setUser,
    updateLocalUser,
    logout,
    loadingUser,
    isLoggedIn,
    isAdmin,
    isSuperAdmin,
  };
};