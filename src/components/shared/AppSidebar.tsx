import { LayoutDashboard, Users, Settings, Package, ShieldCheck, ShoppingBag, UtensilsCrossed, Tag, Tags, LogOut, Calendar } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar";
import { useAuthStore } from "@/modules/auth/store/authStore";

const menuByRole = {
  admin: [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Pedidos", url: "/admin/pedidos", icon: ShoppingBag },
    { title: "Reservas", url: "/admin/reservas", icon: Calendar },
    { title: "Productos", url: "/admin/productos", icon: UtensilsCrossed },
    { title: "Categorías", url: "/admin/categorias", icon: Tags },
    { title: "Promociones", url: "/admin/promociones", icon: Tag },
    // Eliminada la sección de Usuarios de aquí
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
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarContent className="bg-sidebar text-sidebar-foreground">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 uppercase text-xs font-bold tracking-wider px-4 py-2">
            MENU PRINCIPAL
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors py-5 rounded-lg"
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-primary" />
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

      <SidebarFooter className="p-4 border-t border-sidebar-border bg-sidebar">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}