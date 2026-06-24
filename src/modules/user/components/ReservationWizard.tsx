import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReservationWizard } from "../hooks/useReservationWizard";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import type { Product } from "@/modules/user/interfaces/product.interface";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  User, Mail, Phone, MapPin, Calendar, Clock, Users,
  CreditCard, Smartphone, CheckCircle2, Utensils, 
  Sparkles, Minus, Plus, ChefHat, Loader2
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

// --- SUBCOMPONENTES ---

const StepHeader = ({ icon, title, sub, center = false }: { icon: React.ReactNode; title: string; sub: string; center?: boolean }) => (
  <div className={`mb-6 ${center ? "text-center flex flex-col items-center" : ""}`}>
    <h2 className={`text-xl font-serif text-white flex items-center gap-2.5 ${center ? "justify-center" : ""}`}>
      <span className="text-amber-500">{icon}</span> {title}
    </h2>
    <p className="text-xs mt-1 text-zinc-400 font-light">{sub}</p>
  </div>
);

const InputField = ({ label, icon, type = "text", ...props }: any) => (
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

// --- PASOS DEL FORMULARIO ---

const Step1Contact = ({ formData, handleChange }: any) => (
  <div className="space-y-6">
    <StepHeader icon={<User className="w-4 h-4" />} title="Datos de contacto" sub="Información para personalizar su propuesta." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <InputField label="Nombre completo" name="name" value={formData.name} onChange={handleChange} placeholder="Ej. Juan Pérez" icon={<User className="w-4 h-4"/>} />
      <InputField label="Correo electrónico" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="juan@ejemplo.com" icon={<Mail className="w-4 h-4"/>} />
      <InputField label="Teléfono / WhatsApp" name="phone" value={formData.phone} onChange={handleChange} placeholder="Ej. +51 987 654 321" icon={<Phone className="w-4 h-4"/>} />
      <InputField label="Ciudad" name="city" value={formData.city} onChange={handleChange} placeholder="Ej. Lima" icon={<MapPin className="w-4 h-4"/>} />
    </div>
  </div>
);

const Step2Menu = ({ products, isLoading }: { products: Product[]; isLoading: boolean }) => {
  const { cart, addToCart, removeFromCart } = useCartStore();

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 text-amber-500">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      <p className="text-xs uppercase tracking-widest font-bold animate-pulse">Cargando carta...</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <StepHeader icon={<Utensils className="w-4 h-4"/>} title="Menú Premium" sub="Seleccione los servicios gastronómicos." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {products.map((p) => {
          const inCart = cart.find((i) => i.id === p.id);
          const imgSrc = (p as any).imageUrl || (p as any).image;

          return (
            <div key={p.id} className={`rounded-xl overflow-hidden border transition-colors ${inCart ? "border-amber-500 bg-zinc-900" : "border-zinc-800 bg-zinc-900/50"}`}>
              {imgSrc && (
                <div className="h-32 overflow-hidden relative">
                  <img src={imgSrc} alt={p.name} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-amber-500 text-xs font-bold rounded">
                    S/ {Number(p.price).toFixed(2)}
                  </div>
                </div>
              )}
              <div className="p-4 flex flex-col gap-2">
                <h4 className="text-sm font-serif text-zinc-200 truncate">{p.name}</h4>
                <p className="text-[10px] text-zinc-400 line-clamp-2">{p.description}</p>
                <div className="mt-2 pt-3 border-t border-zinc-800/50">
                  {inCart ? (
                    <div className="flex items-center justify-between">
                      <button type="button" onClick={() => removeFromCart(p.id)} className="p-1.5 rounded-md bg-zinc-800 text-amber-500 hover:bg-zinc-700"><Minus className="w-4 h-4"/></button>
                      <span className="text-sm font-bold text-amber-500">{inCart.quantity}</span>
                      <button type="button" onClick={() => addToCart({ id: p.id, name: p.name, price: Number(p.price) })} className="p-1.5 rounded-md bg-amber-500 text-black hover:bg-amber-400"><Plus className="w-4 h-4"/></button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => addToCart({ id: p.id, name: p.name, price: Number(p.price) })} className="w-full py-2 rounded-lg text-xs font-bold uppercase tracking-widest border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black transition-colors">
                      Agregar
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Step3Logistics = ({ formData, handleChange, wizard }: any) => (
  <div className="space-y-6">
    <StepHeader icon={<Sparkles className="w-4 h-4"/>} title="Logística del evento" sub="Coordenadas para el despliegue técnico." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="md:col-span-2">
        <InputField label="Dirección exacta" name="address" value={formData.address} onChange={handleChange} icon={<MapPin className="w-4 h-4"/>} />
      </div>
      <InputField label="Fecha" name="date" type="date" value={formData.date} onChange={handleChange} icon={<Calendar className="w-4 h-4"/>} />
      <InputField label="Hora" name="time" type="time" value={formData.time} onChange={handleChange} icon={<Clock className="w-4 h-4"/>} />
      <InputField label="N° de invitados" name="guests" type="number" value={formData.guests} onChange={handleChange} icon={<Users className="w-4 h-4"/>} />
      
      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Tipo de evento</Label>
        <Select value={formData.eventType} onValueChange={(v) => wizard.setFormData({ ...formData, eventType: v })}>
          <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <SelectValue placeholder="Seleccione formato" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <SelectItem value="Boda">Boda / Matrimonio</SelectItem>
            <SelectItem value="Corporativo">Corporativo</SelectItem>
            <SelectItem value="Cumpleaños">Fiesta Privada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Notas adicionales</Label>
        <textarea
          name="notes" value={formData.notes} onChange={handleChange} rows={3}
          className="w-full p-3 rounded-xl text-xs bg-zinc-900 border-zinc-800 text-zinc-200 focus:border-amber-500 focus:outline-none resize-none"
          placeholder="Alergias, requerimientos dietéticos..."
        />
      </div>
    </div>
  </div>
);

const Step4Payment = ({ formData, setFormData, cartTotal }: any) => {
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

// --- BARRA DE NAVEGACIÓN INFERIOR ---

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