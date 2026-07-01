import { User, Mail, Phone, MapPin } from "lucide-react";
import { StepHeader, InputField } from "../components/WizardUI";

export const Step1Contact = ({ formData, handleChange }: any) => (
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