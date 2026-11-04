import { todayInLima } from '@/modules/reservations/schemas/reservation.schema';
import type { useReservationWizard } from '../hooks/useReservationWizard';
// src/modules/user/reservas/steps/Step3Logistics.tsx

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Calendar, Clock, MapPin, Sparkles, Users } from 'lucide-react';
import { InputField, StepHeader } from '../components/WizardUI';

export const Step3Logistics = ({
  formData,
  handleChange,
  wizard,
}: {
  formData: ReturnType<typeof useReservationWizard>['formData'];
  handleChange: ReturnType<typeof useReservationWizard>['handleChange'];
  wizard: ReturnType<typeof useReservationWizard>;
}) => (
  <div className="space-y-6">
    <StepHeader
      icon={<Sparkles className="w-4 h-4" />}
      title="Logística del evento"
      sub="Coordenadas para el despliegue técnico."
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="md:col-span-2">
        <InputField
          label="Dirección exacta"
          name="address"
          value={formData.address}
          onChange={handleChange}
          icon={<MapPin className="w-4 h-4" />}
        />
      </div>
      <InputField
        label="Fecha"
        name="date"
        type="date"
        min={todayInLima()}
        value={formData.date}
        onChange={handleChange}
        icon={<Calendar className="w-4 h-4" />}
      />
      <InputField
        label="Hora"
        name="time"
        type="time"
        value={formData.time}
        onChange={handleChange}
        icon={<Clock className="w-4 h-4" />}
      />
      <InputField
        label="N° de invitados"
        name="guests"
        type="number"
        min={1}
        step={1}
        value={formData.guests}
        onChange={handleChange}
        icon={<Users className="w-4 h-4" />}
      />

      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Tipo de evento
        </Label>
        <Select
          value={formData.eventType}
          onValueChange={(v) =>
            wizard.setFormData({ ...formData, eventType: v })
          }
        >
          <SelectTrigger
            className={cn('bg-muted border-border text-foreground')}
          >
            <SelectValue placeholder="Seleccione formato" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border text-foreground">
            <SelectItem value="Boda">Boda / Matrimonio</SelectItem>
            <SelectItem value="Corporativo">Corporativo</SelectItem>
            <SelectItem value="Cumpleaños">Fiesta Privada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Notas adicionales
        </Label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full p-3 rounded-xl text-xs bg-muted border-border text-foreground focus:border-ember/50 focus:outline-none resize-none placeholder:text-muted-foreground/60"
          placeholder="Alergias, requerimientos dietéticos..."
        />
      </div>
    </div>
  </div>
);
