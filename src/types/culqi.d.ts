// src/types/culqi.d.ts
export {}; // Asegura que esto sea tratado como un módulo

declare global {
  interface Window {
    Culqi: any;
    culqi: () => void;
  }
}