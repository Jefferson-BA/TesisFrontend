import {
  LayoutDashboard,
  Users,
  Settings,
  Package,
  ShieldCheck,
  ShoppingBag,
  UtensilsCrossed,
  Tag,
  Tags, // 🔹 NUEVO: Ícono para Categorías
  LogOut,
  Calendar,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { useAuthStore } from "@/modules/auth/store/authStore";

// 🔹 Menús fusionados sin perder lógica original
const menuByRole = {
  admin: [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },

    // 🔹 Nuevos módulos agregados
    { title: "Pedidos", url: "/admin/pedidos", icon: ShoppingBag },
    { title: "Reservas", url: "/admin/reservas", icon: Calendar },
    { title: "Productos", url: "/admin/productos", icon: UtensilsCrossed },
    { title: "Categorías", url: "/admin/categorias", icon: Tags }, // 🔹 NUEVA LÍNEA AQUÍ
    { title: "Promociones", url: "/admin/promociones", icon: Tag },

    // 🔹 Originales
    { title: "Usuarios", url: "/admin/users", icon: Users },
    { title: "Configuración", url: "/admin/configuracion", icon: Settings },
  ],

  superadmin: [
    { title: "Panel Global", url: "/superadmin/dashboard", icon: ShieldCheck },
    { title: "Gestionar Admins", url: "/superadmin/manage-admins", icon: Users },
    { title: "Logs del Sistema", url: "/superadmin/settings", icon: Settings },
  ],
};

interface AppSidebarProps {
  role: "admin" | "superadmin";
}

export function AppSidebar({ role }: AppSidebarProps) {
  const items = menuByRole[role];

  // 🔹 Usuario desde Zustand
  const user = useAuthStore((state) => state.user);

  // 🔹 Logout conservando tu lógica nueva
  const handleLogout = () => {
    document.cookie =
      "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    window.location.href = "/login";
  };

  return (
    <Sidebar className="border-r border-zinc-800 bg-zinc-950 text-zinc-100">

      {/* 🔹 CONTENIDO */}
      <SidebarContent className="bg-zinc-950 text-zinc-200">
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500 uppercase text-xs font-bold tracking-wider px-4 py-2">
            MENU PRINCIPAL
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-zinc-900 hover:text-cyan-400 transition-colors py-5 rounded-lg"
                  >
                    <a href={item.url} className="flex items-center gap-3">

                      {/* 🔹 Mantiene estilo moderno */}
                      <item.icon className="h-5 w-5 text-emerald-500" />

                      <span className="font-medium text-sm">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 🔹 FOOTER ORIGINAL + lógica nueva */}
      <SidebarFooter className="p-4 border-t border-zinc-800 bg-zinc-950">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}