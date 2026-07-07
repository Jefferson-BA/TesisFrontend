// src/modules/user/reservas/components/WizardUI.tsx

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const StepHeader = ({ icon, title, sub, center = false }: { icon: React.ReactNode; title: string; sub: string; center?: boolean }) => (
  <div className={cn("mb-6", center && "text-center flex flex-col items-center")}>
    <h2 className={cn("text-xl font-serif text-foreground flex items-center gap-2.5", center && "justify-center")}>
      <span className="text-ember">{icon}</span> {title}
    </h2>
    <p className="text-xs mt-1 text-muted-foreground font-light">{sub}</p>
  </div>
);

export const InputField = ({ label, icon, type = "text", ...props }: any) => (
  <div className="space-y-2 flex flex-col w-full">
    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</Label>
    <div className="relative flex items-center w-full">
      {icon && <span className="absolute left-4 z-10 text-muted-foreground">{icon}</span>}
      <Input
        type={type}
        className={cn(
          "h-11 rounded-xl text-xs bg-muted border-border text-foreground focus:border-ember/50 placeholder:text-muted-foreground/60",
          icon ? "pl-11" : "px-4"
        )}
        {...props}
      />
    </div>
  </div>
);