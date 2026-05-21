import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { CustomTrigger } from "@/components/shared/CustomTrigger";
import { QueryProvider } from "@/components/shared/QueryProvider";

export default function AdminLayoutReact({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SidebarProvider>
        <AppSidebar role="admin" />
        
        <main className="w-full min-h-screen flex flex-col flex-1 overflow-x-hidden">
          {/* Cabecera superior con el botón hamburguesa */}
          <header className="sticky top-0 z-40 p-4 flex items-center border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
            <CustomTrigger />
            <h1 className="ml-4 font-bold text-zinc-100 text-lg tracking-tight">
              Dashboard Administrativo
            </h1>
          </header>
          
          {/* Contenedor dinámico donde Astro inyectará las páginas */}
          <div className="p-6 flex-1 w-full max-w-7xl mx-auto min-w-0">
            {children}
          </div>
        </main>

      </SidebarProvider>
    </QueryProvider>
  );
}