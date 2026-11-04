import { useUser } from '@/modules/user/hooks/useUser';
// src/components/shared/AppSidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { extractRole } from '@/lib/auth-utils';
import {
  Activity,
  Calendar,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  Tag,
  Tags,
  Users,
  UtensilsCrossed,
} from 'lucide-react';

const baseMenuByRole = {
  admin: [
    { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Pedidos', url: '/admin/pedidos', icon: ShoppingBag },
    { title: 'Reservas', url: '/admin/reservas', icon: Calendar },
    { title: 'Productos', url: '/admin/productos', icon: UtensilsCrossed },
    { title: 'Categorías', url: '/admin/categorias', icon: Tags },
    { title: 'Promociones', url: '/admin/promociones', icon: Tag },
    { title: 'Configuración', url: '/admin/configuracion', icon: Settings },
  ],
  superadmin: [
    { title: 'Panel Maestro', url: '/superadmin/dashboard', icon: ShieldCheck },
    {
      title: 'Gestión de Usuarios',
      url: '/superadmin/manage-admins',
      icon: Users,
    },
    { title: 'Finanzas & Culqi', url: '/superadmin/finance', icon: CreditCard },
    {
      title: 'Bitácora de Auditoría',
      url: '/superadmin/audit',
      icon: Activity,
    },
    {
      title: 'Configuración Crítica',
      url: '/superadmin/settings',
      icon: Sliders,
    },
    {
      title: 'Ver Restaurante (Admin)',
      url: '/admin/dashboard',
      icon: UtensilsCrossed,
    },
  ],
};

interface AppSidebarProps {
  role: 'admin' | 'superadmin';
}

export function AppSidebar({ role }: AppSidebarProps) {
  const { user, logout } = useUser();
  const actualUserRole = extractRole(user);
  const currentPath =
    typeof window !== 'undefined' ? window.location.pathname : '';

  // Si el usuario real es Superadmin pero está navegando en el panel de Admin,
  // le agregamos un acceso directo arriba para regresar a su Panel Maestro
  let items = [...baseMenuByRole[role]];
  if (role === 'admin' && actualUserRole === 'superadmin') {
    items = [
      {
        title: '⚡ Volver a Superadmin',
        url: '/superadmin/dashboard',
        icon: ShieldCheck,
      },
      ...items,
    ];
  }

  const handleLogout = () => {
    void logout();
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarContent className="bg-sidebar text-sidebar-foreground">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 uppercase text-xs font-bold tracking-wider px-4 py-2 flex items-center justify-between">
            <span>
              {role === 'superadmin' ? 'SUPERADMIN MAESTRO' : 'ADMINISTRACIÓN'}
            </span>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {items.map((item) => {
                const isActive = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`transition-colors py-5 rounded-lg ${
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-bold shadow-sm'
                          : 'hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground'
                      }`}
                    >
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon
                          className={`h-5 w-5 ${isActive ? 'text-primary scale-110' : 'text-primary/80'}`}
                        />
                        <span className="text-sm">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
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
