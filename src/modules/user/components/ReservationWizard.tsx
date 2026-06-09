import React from "react";
import { useReservationWizard } from "../hooks/useReservationWizard";
import { useCartStore } from "@/modules/admin/promociones/store/cartStore";
import type { Product } from "@/modules/user/interfaces/product.interface";

// Componentes unificados de la interfaz
import { Button } from "@/components/ui/button";
import { Input as CustomInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Iconografía contextual
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Users,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Utensils,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export default function ReservationWizard() {
  const wizard = useReservationWizard();

  const steps = [
    { id: 1, label: "Contacto", desc: "Datos del titular" },
    { id: 2, label: "Carta y Promos", desc: "Selección culinaria" },
    { id: 3, label: "Logística", desc: "Coordenadas" },
    { id: 4, label: "Garantía", desc: "Asegurar fecha" },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-6">
      {/* Luces ambientales de fondo */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative bg-[#0e0a08]/95 border border-[#3d2c1f]/40 p-6 md:p-10 rounded-[32px] max-w-4xl mx-auto shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-white backdrop-blur-md">
        
        {/* Indicador Visual de Pasos */}
        <div className="mb-10 flex justify-between items-center border-b border-[#3d2c1f]/30 pb-6 relative">
          <div className="absolute h-[1px] bg-zinc-800/50 left-0 right-0 top-6 -z-10" />
          
          {steps.map((step) => {
            const isActive = wizard.currentStep === step.id;
            const isCompleted = wizard.currentStep > step.id;

            return (
              <div key={step.id} className="flex flex-col items-center flex-1 relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 border ${
  wizard.currentStep >= step.id // 🔥 Cambiado 'step' por 'step.id'
    ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-black border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.35)] font-black"
    : "bg-[#14100d] border-[#3d2c1f]/60 text-zinc-500"
}`}>
  {isCompleted ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> : step.id}
</div>
                
                <span className={`text-[10px] tracking-widest uppercase font-bold mt-3 hidden md:block ${
                  isActive ? "text-yellow-500" : isCompleted ? "text-zinc-300" : "text-zinc-600"
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Cuerpo Dinámico del Formulario */}
        <div className="min-h-[300px]">
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
            <Step4Payment formData={wizard.formData} setFormData={wizard.setFormData} />
          )}
        </div>

        {/* Controles Inferiores de Navegación */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-zinc-900/60">
          {wizard.currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={wizard.prevStep}
              className="border-zinc-800 bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50 px-5 rounded-xl h-11 text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Volver
            </Button>
          ) : (
            <div />
          )}

          {wizard.currentStep < 4 ? (
            <Button
              type="button"
              onClick={wizard.nextStep}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:brightness-110 font-bold px-6 rounded-xl h-11 text-xs uppercase tracking-widest shadow-[0_4px_20px_rgba(234,179,8,0.15)] transition-all flex items-center gap-2"
            >
              Continuar <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={wizard.submitReservation}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-black hover:brightness-110 font-black px-7 rounded-xl h-11 text-xs uppercase tracking-widest shadow-[0_4px_25px_rgba(16,185,129,0.2)] transition-all flex items-center gap-2"
            >
              Finalizar Reserva ✓
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-componentes internos de los pasos del formulario
const Step1Contact = ({ formData, handleChange }: any) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-serif font-semibold text-zinc-100 tracking-wide flex items-center gap-2.5">
        <User className="w-5 h-5 text-yellow-500/80" /> Coordenadas del Titular
      </h2>
      <p className="text-xs text-zinc-500 mt-1">Por favor complete la información para personalizar su propuesta de catering.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
      <InputField label="Nombre Completo" name="name" value={formData.name} onChange={handleChange} placeholder="Ej. Juan Pérez" icon={<User className="w-4 h-4" />} />
      <InputField label="Correo Electrónico" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="juan@ejemplo.com" icon={<Mail className="w-4 h-4" />} />
      <InputField label="Teléfono / WhatsApp" name="phone" value={formData.phone} onChange={handleChange} placeholder="Ej. 987654321" icon={<Phone className="w-4 h-4" />} />
      <InputField label="Ciudad de Residencia" name="city" value={formData.city} onChange={handleChange} placeholder="Ej. Lima" icon={<MapPin className="w-4 h-4" />} />
    </div>
  </div>
);

const Step2Menu = ({ products, isLoading }: { products: Product[]; isLoading: boolean }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const cart = useCartStore((state) => state.cart);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-yellow-500/80 tracking-widest uppercase font-medium">Consultando propuestas culinarias...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
        <div>
          <h2 className="text-xl font-serif font-semibold text-zinc-100 tracking-wide flex items-center gap-2.5">
            <Utensils className="w-5 h-5 text-yellow-500/80" /> Menú & Estaciones Premium
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Seleccione las experiencias gastronómicas para su banquete.</p>
        </div>
        <div className="bg-[#16110e] border border-[#3d2c1f]/40 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
          <ShoppingBag className="w-3.5 h-3.5 text-yellow-500" />
          <span className="text-[11px] text-zinc-300 font-bold uppercase tracking-wider">Añadidos: {cart.reduce((acc, i) => acc + i.quantity, 0)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-h-[350px] overflow-y-auto pr-1">
        {products.map((p) => {
          const cartItem = cart.find((item) => item.id === p.id);
          return (
            <div
              key={p.id}
              className={`p-4 rounded-xl flex flex-col justify-between bg-[#0d0908] border transition-all duration-300 ${
                p.isPromo ? "border-red-950/60 bg-gradient-to-b from-[#0d0908] to-[#170c0c]" : "border-zinc-900"
              } hover:border-amber-500/30`}
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-sm font-bold text-zinc-100 font-serif">{p.name}</h3>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1.5 line-clamp-2">{p.description || "Servicio gourmet exclusivo listo para el despliegue."}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-900/60 flex justify-between items-center">
                <span className="text-sm font-black text-yellow-500">S/ {Number(p.price).toFixed(2)}</span>
                <Button
                  type="button"
                  onClick={() => addToCart({ id: p.id, name: p.name, price: Number(p.price) })}
                  className="bg-zinc-900 hover:bg-amber-500 text-zinc-300 hover:text-black h-8 px-3 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all"
                >
                  Agregar {cartItem && `(${cartItem.quantity})`}
                </Button>
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
    <div>
      <h2 className="text-xl font-serif font-semibold text-zinc-100 tracking-wide flex items-center gap-2.5">
        <Sparkles className="w-5 h-5 text-yellow-500/80" /> Logística Operativa
      </h2>
      <p className="text-xs text-zinc-500 mt-1">Coordenadas logísticas esenciales para el correcto despliegue del personal.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
      <div className="md:col-span-2">
        <InputField label="Dirección de la Locación / Local" name="address" value={formData.address} onChange={handleChange} placeholder="Ej. Hacienda Los Ficus, Pachacamac" icon={<MapPin className="w-4 h-4" />} />
      </div>
      <InputField label="Fecha Programada" name="date" type="date" value={formData.date} onChange={handleChange} icon={<Calendar className="w-4 h-4" />} />
      <InputField label="Hora de Inicio" name="time" type="time" value={formData.time} onChange={handleChange} icon={<Clock className="w-4 h-4" />} />
      <InputField label="Número de Invitados (Aforo)" name="guests" type="number" value={formData.guests} onChange={handleChange} placeholder="Ej. 150" icon={<Users className="w-4 h-4" />} />
      
      <div className="space-y-2 flex flex-col justify-end">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Tipo de Celebración</Label>
        <Select 
          value={formData.eventType || "Boda"} 
          onValueChange={(value) => wizard.setFormData({ ...formData, eventType: value })}
        >
          <SelectTrigger className="bg-[#0e0a08] border-zinc-800 text-zinc-300 h-11 rounded-xl px-4 focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 text-xs font-medium">
            <SelectValue placeholder="Seleccione formato" />
          </SelectTrigger>
          <SelectContent className="bg-[#0e0a08] border-zinc-800 text-zinc-300 rounded-xl">
            <SelectItem value="Boda">💍 Boda / Matrimonio</SelectItem>
            <SelectItem value="Corporativo">💼 Evento Corporativo</SelectItem>
            <SelectItem value="Cumpleaños">🎉 Cumpleaños / Fiesta Privada</SelectItem>
            <SelectItem value="Aniversario">✨ Aniversario / Gala</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

const Step4Payment = ({ formData, setFormData }: any) => (
  <div className="space-y-6 flex flex-col items-center justify-center">
    <div className="text-center w-full">
      <h2 className="text-xl font-serif font-semibold text-zinc-100 tracking-wide flex items-center justify-center gap-2.5">
        <CreditCard className="w-5 h-5 text-yellow-500/80" /> Método de Reserva (Garantía)
      </h2>
      <p className="text-xs text-zinc-500 mt-1">Seleccione el ecosistema con el que desea asegurar la fecha.</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl pt-4">
      {[
        { id: "card", label: "Tarjeta", desc: "Crédito o Débito", color: "hover:border-yellow-500/40", active: "bg-yellow-500 text-black border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]" },
        { id: "yape", label: "Yape", desc: "Banca Móvil BCP", color: "hover:border-purple-500/40", active: "bg-purple-600 text-white border-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.2)]" },
        { id: "plin", label: "Plin", desc: "Transferencia Directa", color: "hover:border-cyan-500/40", active: "bg-cyan-600 text-white border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]" }
      ].map((method) => {
        const isSelected = formData.paymentMethod === method.id;
        return (
          <button
            key={method.id}
            type="button"
            onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
            className={`p-4 rounded-xl text-left border transition-all duration-300 flex flex-col justify-between h-24 ${
              isSelected ? method.active : `bg-[#0d0908] border-zinc-900 text-zinc-400 ${method.color}`
            }`}
          >
            <span className="text-xs font-black uppercase tracking-wider">{method.label}</span>
            <span className={`text-[10px] font-medium block ${isSelected ? "opacity-80" : "text-zinc-600"}`}>{method.desc}</span>
          </button>
        );
      })}
    </div>
  </div>
);

const InputField = ({ label, icon, ...props }: any) => (
  <div className="space-y-2 flex flex-col">
    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</Label>
    <div className="relative flex items-center group">
      {icon && <div className="absolute left-4 text-zinc-600 group-focus-within:text-yellow-500/80 transition-colors duration-300">{icon}</div>}
      <CustomInput
        className={`bg-[#0e0a08] border-zinc-800 text-zinc-200 placeholder-zinc-700 h-11 rounded-xl text-xs font-medium focus-visible:ring-1 focus-visible:ring-amber-500/50 focus-visible:border-amber-500/50 transition-all ${
          icon ? "pl-11" : "px-4"
        }`}
        {...props}
      />
    </div>
  </div>
);