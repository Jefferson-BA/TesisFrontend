import { CreditCard, Smartphone } from "lucide-react";
import { StepHeader } from "../components/WizardUI";

export const Step4Payment = ({ formData, setFormData, cartTotal }: any) => {
  const methods = [
    { id: "card", label: "Tarjeta", desc: "Crédito / Débito", icon: CreditCard },
    { id: "yape", label: "Yape", desc: "Billetera BCP", icon: Smartphone },
  ];

  return (
    <div className="flex flex-col gap-6">
      <StepHeader icon={<CreditCard className="w-4 h-4"/>} title="Resumen y Pago" sub="Seleccione su método de pago preferido para más adelante." center />
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center max-w-sm mx-auto w-full">
        <p className="text-zinc-400 text-xs mb-1">Total estimado de la reserva</p>
        <p className="text-3xl font-serif text-amber-500">S/ {cartTotal.toFixed(2)}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto w-full">
        {methods.map(({ id, label, desc, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setFormData({ ...formData, paymentMethod: id })}
            className={`p-4 rounded-xl flex items-center gap-4 text-left transition-all border ${
              formData.paymentMethod === id ? "bg-amber-500/10 border-amber-500" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <Icon className={`w-6 h-6 ${formData.paymentMethod === id ? "text-amber-500" : "text-zinc-500"}`} />
            <div>
              <span className={`block text-sm font-bold ${formData.paymentMethod === id ? "text-amber-500" : "text-zinc-300"}`}>{label}</span>
              <span className="block text-xs text-zinc-500">{desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};