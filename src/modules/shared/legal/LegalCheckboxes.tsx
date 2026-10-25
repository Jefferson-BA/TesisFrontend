// src/modules/shared/legal/LegalCheckboxes.tsx
// Componente reutilizable para aceptación de T&C y política de privacidad.
// Úsalo en Login, Register y Step4Payment.

import { useState } from 'react';
import { Shield, ScrollText, ExternalLink } from 'lucide-react';
import { TermsModal } from './TermsModal';
import { PrivacyModal } from './PrivacyModal';

export interface LegalCheckboxesValue {
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
}

interface LegalCheckboxesProps {
  value: LegalCheckboxesValue;
  onChange: (v: LegalCheckboxesValue) => void;
  /** Error externo (ej. de react-hook-form) */
  error?: string;
  /** Clase CSS adicional para el contenedor */
  className?: string;
}

export function LegalCheckboxes({ value, onChange, error, className = '' }: LegalCheckboxesProps) {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const setTerms = (v: boolean) => onChange({ ...value, acceptedTerms: v });
  const setPrivacy = (v: boolean) => onChange({ ...value, acceptedPrivacy: v });

  return (
    <>
      <div className={`space-y-3 ${className}`}>
        {/* Terms checkbox */}
        <label
          htmlFor="accept-terms"
          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${
            value.acceptedTerms
              ? 'bg-amber-500/5 border-amber-500/30'
              : 'bg-muted/30 border-border hover:border-amber-500/20'
          }`}
        >
          <input
            id="accept-terms"
            type="checkbox"
            checked={value.acceptedTerms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-0.5 shrink-0 w-4 h-4 rounded border-border accent-amber-500 cursor-pointer"
          />
          <span className="flex-1 text-xs text-muted-foreground leading-relaxed">
            He leído y acepto los{' '}
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setShowTerms(true); }}
              className="inline-flex items-center gap-1 text-amber-500 hover:text-amber-400 font-semibold underline underline-offset-2 transition-colors"
            >
              <ScrollText size={11} />
              Términos y Condiciones
              <ExternalLink size={10} />
            </button>
            {' '}del servicio.
          </span>
        </label>

        {/* Privacy checkbox */}
        <label
          htmlFor="accept-privacy"
          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${
            value.acceptedPrivacy
              ? 'bg-emerald-500/5 border-emerald-500/30'
              : 'bg-muted/30 border-border hover:border-emerald-500/20'
          }`}
        >
          <input
            id="accept-privacy"
            type="checkbox"
            checked={value.acceptedPrivacy}
            onChange={(e) => setPrivacy(e.target.checked)}
            className="mt-0.5 shrink-0 w-4 h-4 rounded border-border accent-emerald-500 cursor-pointer"
          />
          <span className="flex-1 text-xs text-muted-foreground leading-relaxed">
            Acepto la{' '}
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }}
              className="inline-flex items-center gap-1 text-emerald-500 hover:text-emerald-400 font-semibold underline underline-offset-2 transition-colors"
            >
              <Shield size={11} />
              Política de Privacidad
              <ExternalLink size={10} />
            </button>
            {' '}y el tratamiento de mis datos personales.
          </span>
        </label>

        {/* Validation error */}
        {error && (
          <p className="text-xs text-destructive flex items-center gap-1.5 px-1">
            <span className="w-1 h-1 rounded-full bg-destructive shrink-0" />
            {error}
          </p>
        )}
      </div>

      {/* Modals */}
      <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal open={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </>
  );
}
