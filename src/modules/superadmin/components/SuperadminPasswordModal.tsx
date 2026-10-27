// src/modules/superadmin/components/SuperadminPasswordModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Eye, EyeOff, Loader2, KeyRound, AlertTriangle } from 'lucide-react';

export interface SuperadminPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  badgeText?: string;
  actionLabel?: string;
  variant?: 'destructive' | 'default' | 'amber';
  requireReason?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
  onConfirm: (data: { superadminPassword: string; reason: string }) => Promise<void> | void;
}

export function SuperadminPasswordModal({
  open,
  onOpenChange,
  title,
  description,
  badgeText = 'Confirmación de Seguridad',
  actionLabel = 'Confirmar Acción',
  variant = 'destructive',
  requireReason = true,
  reasonLabel = 'Motivo o Justificación Obligatoria',
  reasonPlaceholder = 'Explica la razón de esta acción para el registro de auditoría...',
  isLoading = false,
  children,
  onConfirm,
}: SuperadminPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setPassword('');
      setReason('');
      setShowPassword(false);
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError('Debes ingresar tu contraseña de superadmin para validar tu identidad.');
      return;
    }

    if (requireReason && !reason.trim()) {
      setError('Debes ingresar un motivo válido para la bitácora de auditoría.');
      return;
    }

    try {
      await onConfirm({
        superadminPassword: password.trim(),
        reason: reason.trim(),
      });
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Error al ejecutar la acción.');
    }
  };

  const isDestructive = variant === 'destructive';
  const isAmber = variant === 'amber';

  return (
    <Dialog open={open} onOpenChange={(val) => !isLoading && onOpenChange(val)}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white shadow-2xl">
        <DialogHeader className="gap-2">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={`gap-1.5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${
                isDestructive
                  ? 'border-red-500/30 text-red-400 bg-red-950/30'
                  : isAmber
                  ? 'border-amber-500/30 text-amber-400 bg-amber-950/30'
                  : 'border-primary/30 text-primary bg-primary/10'
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              {badgeText}
            </Badge>
          </div>

          <DialogTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            {title}
          </DialogTitle>

          {description && (
            <DialogDescription className="text-zinc-400 text-sm">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Alerta de impacto / auditoría */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Esta operación crítica quedará registrada en el <span className="text-white font-medium">Audit Trail</span> junto con tu usuario, dirección IP y sello de tiempo.
            </p>
          </div>

          {/* Children personalizados para parámetros adicionales */}
          {children}

          {/* Campo Motivo */}
          {requireReason && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                {reasonLabel} <span className="text-red-400">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={reasonPlaceholder}
                disabled={isLoading}
                rows={2}
                className="w-full resize-none rounded-md border border-zinc-800 bg-zinc-900/60 p-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              />
            </div>
          )}

          {/* Campo Contraseña Superadmin */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-zinc-400" />
              Contraseña de Superadmin <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña para autorizar"
                disabled={isLoading}
                autoComplete="current-password"
                className="pr-10 bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="p-2.5 rounded-md bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className={`gap-2 ${
                isDestructive
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : isAmber
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                actionLabel
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
