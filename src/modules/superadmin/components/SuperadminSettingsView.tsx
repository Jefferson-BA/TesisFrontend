// src/modules/superadmin/components/SuperadminSettingsView.tsx

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Settings,
  Power,
  Key,
  ShieldCheck,
  ShieldAlert,
  Edit3,
  Lock,
  RefreshCw,
  AlertTriangle,
  Server,
  Database,
  Cpu,
  Layers,
} from 'lucide-react';

import { useSuperadminConfig } from '../hooks/useSuperadminConfig';
import { SuperadminPasswordModal } from './SuperadminPasswordModal';
import type { SystemConfig } from '../types/superadmin.types';

export function SuperadminSettingsView() {
  const {
    configs,
    isLoadingConfigs,
    refetchConfigs,
    maintenance,
    isLoadingMaintenance,
    refetchMaintenance,
    updateConfig,
    isUpdatingConfig,
    toggleMaintenance,
    isTogglingMaintenance,
  } = useSuperadminConfig();

  // Estados para Modal de Mantenimiento
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceCustomMessage, setMaintenanceCustomMessage] = useState(
    'El sistema se encuentra en mantenimiento programado. Volveremos pronto.'
  );

  // Estados para Edición de Configuración o Llave Secreta
  const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null);
  const [newConfigValue, setNewConfigValue] = useState('');
  const [newConfigDescription, setNewConfigDescription] = useState('');

  const isMaintenanceActive = maintenance?.maintenanceMode ?? false;

  const handleOpenMaintenanceModal = () => {
    setMaintenanceCustomMessage(
      maintenance?.customMessage ||
        'El sistema se encuentra en mantenimiento programado. Volveremos pronto.'
    );
    setShowMaintenanceModal(true);
  };

  const handleConfirmMaintenanceToggle = async ({
    superadminPassword,
  }: {
    superadminPassword: string;
    reason: string;
  }) => {
    await toggleMaintenance({
      enabled: !isMaintenanceActive,
      message: maintenanceCustomMessage.trim() || undefined,
      superadminPassword,
    });
    setShowMaintenanceModal(false);
  };

  const handleOpenEditConfig = (config: SystemConfig) => {
    setEditingConfig(config);
    setNewConfigValue('');
    setNewConfigDescription(config.description || '');
  };

  const handleConfirmEditConfig = async ({
    superadminPassword,
    reason,
  }: {
    superadminPassword: string;
    reason: string;
  }) => {
    if (!editingConfig) return;
    await updateConfig({
      key: editingConfig.key,
      dto: {
        value: newConfigValue.trim(),
        description: newConfigDescription.trim() || undefined,
        superadminPassword,
      },
    });
    setEditingConfig(null);
  };

  // Agrupar configuraciones por categoría
  const generalConfigs = configs.filter((c) => c.category === 'GENERAL');
  const financialConfigs = configs.filter((c) => c.category === 'FINANCIAL');
  const integrationConfigs = configs.filter((c) => c.category === 'INTEGRATIONS' || c.isSecret);

  return (
    <div className="space-y-6">
      {/* 🚨 SWITCH PRINCIPAL: Modo Mantenimiento Global */}
      <Card
        className={`border transition-all duration-300 ${
          isMaintenanceActive
            ? 'bg-rose-500/10 border-rose-500/50 shadow-rose-500/10 shadow-xl'
            : 'bg-card border-border'
        }`}
      >
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-2xl ${
                  isMaintenanceActive
                    ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                }`}
              >
                <Power className="h-7 w-7" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-foreground">
                    Modo Mantenimiento de la Plataforma
                  </h3>
                  {isMaintenanceActive ? (
                    <Badge className="bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40">
                      ACTIVO
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40">
                      EN LÍNEA
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
                  {isMaintenanceActive
                    ? 'El acceso a clientes y comensales está bloqueado actualmente. Solo el rol Superadmin puede acceder al sistema.'
                    : 'La plataforma está completamente disponible y recibiendo pedidos y reservas en tiempo real.'}
                </p>

                {isMaintenanceActive && maintenance?.customMessage && (
                  <div className="mt-3 p-2.5 rounded-lg bg-muted/40 border border-border text-xs text-rose-600 dark:text-rose-400 font-mono">
                    Mensaje mostrado: &quot;{maintenance.customMessage}&quot;
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleOpenMaintenanceModal}
              disabled={isLoadingMaintenance}
              className={`h-11 px-5 font-semibold text-sm gap-2 shrink-0 ${
                isMaintenanceActive
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg'
              }`}
            >
              <Power className="h-4 w-4" />
              {isMaintenanceActive ? 'Desactivar Mantenimiento' : 'Activar Mantenimiento'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 🔑 Credenciales e Integraciones Externas (Llaves Enmascaradas) */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <Key className="h-5 w-5 text-amber-500" />
                Llaves API y Credenciales Enmascaradas
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                Tokens y secretos protegidos. La edición exige reautenticación estricta con contraseña de Superadmin.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                refetchConfigs();
                refetchMaintenance();
              }}
              className="border-border bg-card text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 divide-y divide-border/80">
          {isLoadingConfigs ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="py-4 flex justify-between items-center">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-40 bg-muted" />
                  <Skeleton className="h-4 w-64 bg-muted" />
                </div>
                <Skeleton className="h-9 w-24 bg-muted" />
              </div>
            ))
          ) : integrationConfigs.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No se han registrado llaves secretas en la base de datos.
            </div>
          ) : (
            integrationConfigs.map((config) => (
              <div
                key={config.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">
                      {config.key}
                    </span>
                    <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 text-[10px] gap-1">
                      <Lock className="h-2.5 w-2.5" />
                      SECRETO
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/40 border border-border font-mono text-xs text-foreground">
                    <Lock className="h-3 w-3 text-muted-foreground" />
                    <span>{config.value}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEditConfig(config)}
                  className="border-border bg-card hover:bg-muted text-foreground gap-1.5 text-xs h-9 self-start md:self-center"
                >
                  <Edit3 className="h-3.5 w-3.5 text-amber-500" />
                  Actualizar Llave
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* ⚙️ Parámetros Globales del Sistema (Generales y Financieros) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Parámetros Financieros */}
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-500" />
              Parámetros Financieros
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {financialConfigs.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No hay parámetros financieros registrados.</p>
            ) : (
              financialConfigs.map((cfg) => (
                <div key={cfg.id} className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-semibold text-foreground block">
                      {cfg.key}
                    </span>
                    <span className="text-xs text-muted-foreground">{cfg.description}</span>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      {cfg.value}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEditConfig(cfg)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Parámetros Generales */}
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              Parámetros Generales
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {generalConfigs.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No hay parámetros generales registrados.</p>
            ) : (
              generalConfigs.map((cfg) => (
                <div key={cfg.id} className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-semibold text-foreground block">
                      {cfg.key}
                    </span>
                    <span className="text-xs text-muted-foreground">{cfg.description}</span>
                    <div className="text-sm font-medium text-foreground mt-1">
                      {cfg.value}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEditConfig(cfg)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* 🔐 MODAL: Confirmación Modo Mantenimiento con Password */}
      <SuperadminPasswordModal
        open={showMaintenanceModal}
        onOpenChange={setShowMaintenanceModal}
        title={isMaintenanceActive ? 'Desactivar Modo Mantenimiento' : 'Activar Modo Mantenimiento'}
        description={
          isMaintenanceActive
            ? 'Se reactivará el acceso público inmediatamente a comensales y administradores.'
            : 'Se restringirá el acceso a todos los usuarios salvo superadministradores.'
        }
        badgeText="Operación Crítica"
        actionLabel={isMaintenanceActive ? 'Reabrir Plataforma' : 'Bloquear Plataforma'}
        variant={isMaintenanceActive ? 'amber' : 'destructive'}
        requireReason={false}
        isLoading={isTogglingMaintenance}
        onConfirm={handleConfirmMaintenanceToggle}
      >
        {!isMaintenanceActive && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Mensaje público mostrado a los usuarios:
            </label>
            <Input
              value={maintenanceCustomMessage}
              onChange={(e) => setMaintenanceCustomMessage(e.target.value)}
              placeholder="Ej. Realizando mejoras en la infraestructura..."
              className="bg-background border-input text-foreground text-sm"
            />
          </div>
        )}
      </SuperadminPasswordModal>

      {/* 🔐 MODAL: Modificación de Configuración / Llave Secreta */}
      {editingConfig && (
        <SuperadminPasswordModal
          open={!!editingConfig}
          onOpenChange={(open) => !open && setEditingConfig(null)}
          title={`Actualizar Parámetro: ${editingConfig.key}`}
          description={
            editingConfig.isSecret
              ? 'Esta llave es crítica. El nuevo valor reemplazará las credenciales activas del sistema.'
              : 'Se modificará el comportamiento del parámetro global seleccionado.'
          }
          badgeText={editingConfig.isSecret ? 'Llave Secreta API' : 'Configuración del Sistema'}
          actionLabel="Guardar Nuevo Valor"
          variant="amber"
          isLoading={isUpdatingConfig}
          onConfirm={handleConfirmEditConfig}
        >
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Nuevo Valor para {editingConfig.key} <span className="text-red-500">*</span>
              </label>
              <Input
                value={newConfigValue}
                onChange={(e) => setNewConfigValue(e.target.value)}
                placeholder={
                  editingConfig.isSecret
                    ? 'Pega la nueva clave secreta...'
                    : 'Ingresa el nuevo valor...'
                }
                required
                className="bg-background border-input text-foreground font-mono text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Descripción / Nota adicional (Opcional)
              </label>
              <Input
                value={newConfigDescription}
                onChange={(e) => setNewConfigDescription(e.target.value)}
                placeholder="Motivo o detalle del parámetro..."
                className="bg-background border-input text-foreground text-sm"
              />
            </div>
          </div>
        </SuperadminPasswordModal>
      )}
    </div>
  );
}
