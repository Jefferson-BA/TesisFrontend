import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Package, 
  ShieldCheck,
  LogOut 
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

// Definimos los menús según el rol
const menuByRole = {
  admin: [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Productos", url: "/admin/productos", icon: Package },
    { title: "Usuarios", url: "/admin/users", icon: Users },
    { title: "Configuración", url: "/admin/settings", icon: Settings },
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

  // 🔹 NUEVO: obtener usuario del store
  const user = useAuthStore((state) => state.user);

  return (
    <Sidebar className="border-zinc-800 bg-zinc-950 text-zinc-100">
      
      {/* 🔹 HEADER ORIGINAL + USER INFO */}
      <SidebarHeader className="p-4 border-b border-zinc-800">
        <h2 className="text-xl font-bold text-cyan-500 tracking-tight italic">
          NOVA PANEL
        </h2>

        {/* 🔹 INFO DEL USUARIO (sin romper tu diseño) */}
        <div className="mt-3 flex flex-col">
          <span className="text-sm font-bold text-white">
            {user?.name || "Cargando..."}
          </span>
          <span className="text-xs text-zinc-500">
            {user?.email}
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500 uppercase text-xs font-bold">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="hover:bg-zinc-900 hover:text-cyan-400 transition-colors"
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-zinc-800">
        <button className="flex items-center gap-3 text-zinc-400 hover:text-red-400 transition-colors w-full">
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}