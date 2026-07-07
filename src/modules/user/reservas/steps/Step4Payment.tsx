// src/modules/user/reservas/steps/Step4Payment.tsx

import { CreditCard, Smartphone } from "lucide-react";
import { StepHeader } from "../components/WizardUI";
import { cn } from "@/lib/utils";

export const Step4Payment = ({ formData, setFormData, cartTotal }: any) => {
  const methods = [
    { id: "card", label: "Tarjeta", desc: "Crédito / Débito", icon: CreditCard },
    { id: "yape", label: "Yape", desc: "Billetera BCP", icon: Smartphone },
  ];

  return (
    <div className="flex flex-col gap-6">
      <StepHeader icon={<CreditCard className="w-4 h-4" />} title="Resumen y Pago" sub="Seleccione su método de pago preferido para más adelante." center />

      <div className="rounded-xl p-6 text-center max-w-sm mx-auto w-full bg-muted border border-border">
        <p className="text-muted-foreground text-xs mb-1">Total estimado de la reserva</p>
        <p className="text-3xl font-serif text-ember">S/ {cartTotal.toFixed(2)}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto w-full">
        {methods.map(({ id, label, desc, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setFormData({ ...formData, paymentMethod: id })}
            className={cn(
              "p-4 rounded-xl flex items-center gap-4 text-left transition-all border",
              formData.paymentMethod === id
                ? "bg-ember/10 border-ember"
                : "bg-card border-border hover:border-ember/30 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700"
            )}
          >
            <Icon className={cn("w-6 h-6", formData.paymentMethod === id ? "text-ember" : "text-muted-foreground")} />
            <div>
              <span className={cn("block text-sm font-bold", formData.paymentMethod === id ? "text-ember" : "text-foreground")}>{label}</span>
              <span className="block text-xs text-muted-foreground">{desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};