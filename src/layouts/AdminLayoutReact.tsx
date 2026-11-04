import { AppSidebar } from '@/components/shared/AppSidebar';
import { CustomTrigger } from '@/components/shared/CustomTrigger';
import { SidebarProvider } from '@/components/ui/sidebar';
import ThemeToggle from '@/modules/user/shared/components/Themetoggle';
import { ShieldAlert } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

export default function AdminLayoutReact({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: 'admin' | 'superadmin';
}) {
  const [currentRole, setCurrentRole] = useState<'admin' | 'superadmin'>(
    role || 'admin',
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/superadmin')) {
        setCurrentRole('superadmin');
      } else {
        setCurrentRole('admin');
      }
    }
  }, [role]);

  const isSuperadmin = currentRole === 'superadmin';

  return (
    <>
      <SidebarProvider>
        <AppSidebar role={currentRole} />

        <main className="w-full min-h-screen flex flex-col flex-1 overflow-x-hidden bg-background">
          <header className="sticky top-0 z-40 p-4 flex items-center justify-between border-b border-border bg-background/90 backdrop-blur-md">
            <div className="flex items-center">
              <CustomTrigger />
              <div className="ml-4 flex items-center gap-2">
                <h1 className="font-bold text-foreground text-lg tracking-tight">
                  {isSuperadmin
                    ? 'Panel Maestro del Sistema'
                    : 'Dashboard Administrativo'}
                </h1>
                {isSuperadmin && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
                    <ShieldAlert className="h-3 w-3" />
                    SUPERADMIN
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </header>

          <div className="p-6 flex-1 w-full max-w-7xl mx-auto min-w-0">
            {children}
          </div>
        </main>

        {/* Notificaciones Toast adaptables al tema */}
        <Toaster richColors position="top-right" closeButton />
      </SidebarProvider>
    </>
  );
}
