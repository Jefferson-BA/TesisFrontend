import { create } from 'zustand';

interface ReservationState {
  step: number;
  eventDetails: { date: string; time: string; address: string; city: string; attendees: number; phone: string };
  selectedPackage: any | null;
  setStep: (step: number) => void;
  setEventDetails: (details: Partial<ReservationState['eventDetails']>) => void;
  setSelectedPackage: (pkg: any) => void;
}

export const useReservationStore = create<ReservationState>((set) => ({
  step: 1,
  eventDetails: { date: '', time: '', address: '', city: '', attendees: 50, phone: '' },
  selectedPackage: null,
  setStep: (step) => set({ step }),
  setEventDetails: (details) => set((state) => ({ 
    eventDetails: { ...state.eventDetails, ...details } 
  })),
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
}));