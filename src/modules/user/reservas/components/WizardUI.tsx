import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const StepHeader = ({ icon, title, sub, center = false }: { icon: React.ReactNode; title: string; sub: string; center?: boolean }) => (
  <div className={`mb-6 ${center ? "text-center flex flex-col items-center" : ""}`}>
    <h2 className={`text-xl font-serif text-white flex items-center gap-2.5 ${center ? "justify-center" : ""}`}>
      <span className="text-amber-500">{icon}</span> {title}
    </h2>
    <p className="text-xs mt-1 text-zinc-400 font-light">{sub}</p>
  </div>
);

export const InputField = ({ label, icon, type = "text", ...props }: any) => (
  <div className="space-y-2 flex flex-col w-full">
    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</Label>
    <div className="relative flex items-center w-full">
      {icon && <span className="absolute left-4 z-10 text-zinc-500">{icon}</span>}
      <Input
        type={type}
        className={`h-11 rounded-xl text-xs bg-zinc-900 border-zinc-800 text-zinc-200 focus:border-amber-500 ${icon ? "pl-11" : "px-4"}`}
        {...props}
      />
    </div>
  </div>
);