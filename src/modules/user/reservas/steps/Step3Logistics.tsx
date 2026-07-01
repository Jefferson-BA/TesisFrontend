import { Sparkles, MapPin, Calendar, Clock, Users } from "lucide-react";
import { StepHeader, InputField } from "../components/WizardUI";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Step3Logistics = ({ formData, handleChange, wizard }: any) => (
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