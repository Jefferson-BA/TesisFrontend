import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReservationWizard } from "../hooks/useReservationWizard";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";

// --- IMPORTAMOS LOS PASOS REFACTORIZADOS ---
import { Step1Contact } from "../steps/Step1Contact";
import { Step2Menu } from "../steps/Step2Menu";
import { Step3Logistics } from "../steps/Step3Logistics";
import { Step4Payment } from "../steps/Step4Payment";

import {
  User, Calendar, Utensils, CreditCard, CheckCircle2, ChefHat, Loader2
} from "lucide-react";

const steps = [
  { id: 1, label: "Contacto", desc: "Datos del titular", icon: User },
  { id: 2, label: "Menú", desc: "Selección culinaria", icon: Utensils },
  { id: 3, label: "Evento", desc: "Logística", icon: Calendar },
  { id: 4, label: "Garantía", desc: "Asegurar fecha", icon: CreditCard },
];

export default function ReservationWizard() {
  const wizard = useReservationWizard();
  const cart = useCartStore((s) => s.cart);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 px-4 sm:px-0 relative">
      <div className="bg-zinc-950 border border-amber-500/20 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
        <Header />
        <Stepper currentStep={wizard.currentStep} />

        <div className="min-h-[420px] px-6 md:px-10 py-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={wizard.currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {wizard.currentStep === 1 && (
                <Step1Contact formData={wizard.formData} handleChange={wizard.handleChange} />
              )}
              {wizard.currentStep === 2 && (
                <Step2Menu products={wizard.products} isLoading={wizard.isLoadingProducts} />
              )}
              {wizard.currentStep === 3 && (
                <Step3Logistics formData={wizard.formData} handleChange={wizard.handleChange} wizard={wizard} />
              )}
              {wizard.currentStep === 4 && (
                <Step4Payment formData={wizard.formData} setFormData={wizard.setFormData} cartTotal={cartTotal} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <NavBar
          currentStep={wizard.currentStep}
          totalSteps={steps.length}
          prevStep={wizard.prevStep}
          nextStep={wizard.nextStep}
          submitReservation={wizard.submitReservation}
          isLoading={wizard.isLoadingSubmit}
        />
      </div>
    </div>
  );
}

// --- SUBCOMPONENTES DE DISEÑO (Headers y Nav) ---

const Header = () => (
  <div className="relative px-8 md:px-10 pt-10 pb-8 border-b border-zinc-800/50 bg-zinc-900/50">
    <div className="flex items-center gap-2 mb-4">
      <ChefHat className="w-4 h-4 text-amber-500" />
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-500">
        DeParraSpitz Catering
      </span>
    </div>
    <h1 className="text-3xl md:text-4xl font-serif text-white">
      Reserva tu <span className="italic text-amber-500">evento exclusivo</span>
    </h1>
    <p className="text-sm mt-2 text-zinc-400 font-light">Diseña tu propuesta de alta cocina en cuatro pasos guiados.</p>
  </div>
);

const Stepper = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-start justify-center px-6 md:px-10 pt-6 pb-2 bg-zinc-950">
    {steps.map((step, idx) => {
      const isActive = currentStep === step.id;
      const isCompleted = currentStep > step.id;
      const Icon = step.icon;
      
      return (
        <div key={step.id} className="flex flex-col items-center flex-1 relative">
          {idx < steps.length - 1 && (
            <div className="absolute top-5 left-[calc(50%+20px)] h-[2px] w-[calc(100%-40px)] bg-zinc-800 rounded-full">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                style={{ width: isCompleted ? "100%" : "0%" }} 
              />
            </div>
          )}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border transition-all ${
            isActive ? "bg-amber-500 border-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]" : 
            isCompleted ? "bg-amber-500/10 border-amber-500/30 text-amber-500" : "bg-zinc-900 border-zinc-800 text-zinc-600"
          }`}>
            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
          </div>
          <span className={`text-[10px] tracking-widest uppercase font-bold mt-3 hidden md:block ${isActive ? "text-amber-500" : isCompleted ? "text-zinc-400" : "text-zinc-600"}`}>
            {step.label}
          </span>
        </div>
      );
    })}
  </div>
);

const NavBar = ({ currentStep, totalSteps, prevStep, nextStep, submitReservation, isLoading }: any) => (
  <div className="flex items-center justify-between p-6 bg-zinc-900/80 border-t border-zinc-800">
    <button
      onClick={prevStep}
      disabled={currentStep === 1 || isLoading}
      className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
        currentStep === 1 ? "opacity-0 pointer-events-none" : "text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700"
      }`}
    >
      Atrás
    </button>

    {currentStep < totalSteps ? (
      <button
        onClick={nextStep}
        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-sm transition-colors"
      >
        Continuar
      </button>
    ) : (
      <button
        onClick={submitReservation}
        disabled={isLoading}
        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-sm flex items-center gap-2 disabled:opacity-70"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
        Confirmar y Enviar reserva
      </button>
    )}
  </div>
);