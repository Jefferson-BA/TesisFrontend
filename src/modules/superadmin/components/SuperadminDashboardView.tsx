// src/modules/superadmin/components/SuperadminDashboardView.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShieldAlert,
  Users,
  DollarSign,
  Activity,
  Power,
  Key,
  CreditCard,
  RotateCcw,
  Sliders,
  ChevronRight,
  TrendingUp,
  Server,
  CheckCircle2,
} from 'lucide-react';

import { useSuperadminUsers } from '../hooks/useSuperadminUsers';
import { useSuperadminFinance } from '../hooks/useSuperadminFinance';
import { useSuperadminAudit } from '../hooks/useSuperadminAudit';
import { useSuperadminConfig } from '../hooks/useSuperadminConfig';

export function SuperadminDashboardView() {
  const { stats, isLoading: loadingUsers } = useSuperadminUsers({ limit: 1 });
  const { report, isLoading: loadingFinance } = useSuperadminFinance({});
  const { meta: auditMeta, isLoading: loadingAudit } = useSuperadminAudit({ limit: 5 });
  const { maintenance, isLoadingMaintenance } = useSuperadminConfig();

  const isMaintenance = maintenance?.maintenanceMode ?? false;
  const summary = report?.summary;
  const methods = report?.revenueByPaymentMethod;

  return (
    <div className="space-y-8">
      {/* 👑 Banner de Bienvenida y Estado Global */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/60 via-zinc-900 to-zinc-950 p-6 md:p-8 border border-purple-900/40 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs gap-1.5 px-3 py-1 font-semibold">
                <ShieldAlert className="h-3.5 w-3.5 text-purple-400" />
                ACCESO MAESTRO SUPERADMIN
              </Badge>
              {isMaintenance ? (
                <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs">
                  Mantenimiento Activo
                </Badge>
              ) : (
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs">
                  Plataforma Operativa
                </Badge>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Panel de Control Maestro
            </h1>
            <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">
              Supervisión integral de usuarios y roles, intervenciones financieras con Culqi, trazabilidad mediante bitácora de auditoría y configuración de credenciales del sistema.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg text-xs h-9">
              <a href="/superadmin/manage-admins">
                <Users className="h-4 w-4 mr-1.5" />
                Gestionar Usuarios
              </a>
            </Button>
            <Button asChild variant="outline" className="border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-white text-xs h-9">
              <a href="/superadmin/finance">
                <CreditCard className="h-4 w-4 mr-1.5 text-emerald-400" />
                Finanzas & Culqi
              </a>
            </Button>
            <Button asChild variant="outline" className="border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-white text-xs h-9">
              <a href="/superadmin/settings">
                <Sliders className="h-4 w-4 mr-1.5 text-cyan-400" />
                Configuración
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* 📊 Métricas Cuatro Pilares */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pilar 1: Usuarios y Admins */}
        <Card className="bg-zinc-900/90 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Administradores</CardTitle>
            <Users className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-purple-400">
              {loadingUsers ? <Skeleton className="h-8 w-14 bg-zinc-800" /> : stats?.admin ?? 0}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              +{stats?.superadmin ?? 0} Superadmins | {stats?.user ?? 0} Clientes
            </p>
          </CardContent>
        </Card>

        {/* Pilar 2: Ingresos Totales */}
        <Card className="bg-zinc-900/90 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Recaudación Global</CardTitle>
            <DollarSign className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-emerald-400">
              {loadingFinance ? (
                <Skeleton className="h-8 w-28 bg-zinc-800" />
              ) : (
                `S/ ${(summary?.totalRevenue ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {summary?.paidOrdersCount ?? 0} órdenes pagadas registradas
            </p>
          </CardContent>
        </Card>

        {/* Pilar 3: Auditoría */}
        <Card className="bg-zinc-900/90 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Eventos de Auditoría</CardTitle>
            <Activity className="h-5 w-5 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-cyan-400">
              {loadingAudit ? <Skeleton className="h-8 w-16 bg-zinc-800" /> : auditMeta?.total ?? 0}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Acciones críticas registradas</p>
          </CardContent>
        </Card>

        {/* Pilar 4: Estado del Sistema */}
        <Card className="bg-zinc-900/90 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Estado de Servidor</CardTitle>
            <Server className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-white flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              Óptimo
            </div>
            <p className="text-xs text-zinc-500 mt-1">Conexión con NestJS y DB Neon activa</p>
          </CardContent>
        </Card>
      </div>

      {/* 🚀 Atajos Directos a los 4 Módulos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Atajo 1: Gestión de Usuarios */}
        <Card className="bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 transition-all">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              Gestión Avanzada de Usuarios y Roles
            </CardTitle>
            <CardDescription className="text-zinc-400 text-xs">
              Promueve o degrada roles entre comensales y administradores, y suspende cuentas sospechosas con validación de contraseña.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400 p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <span>Superadmins con acceso maestro:</span>
              <span className="font-bold text-white">{stats?.superadmin ?? 0}</span>
            </div>
            <Button asChild className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs justify-between">
              <a href="/superadmin/manage-admins">
                <span>Ir al Directorio de Usuarios</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Atajo 2: Finanzas y Pasarela Culqi */}
        <Card className="bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 transition-all">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-400" />
              Permisos Financieros y Reembolsos Culqi
            </CardTitle>
            <CardDescription className="text-zinc-400 text-xs">
              Ejecuta devoluciones bancarias directas con la API Culqi v2, reajusta montos por reclamos y anula órdenes forzosamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400 p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <span>Pagos procesados con tarjeta:</span>
              <span className="font-bold text-white">S/ {(methods?.card ?? 0).toFixed(2)}</span>
            </div>
            <Button asChild className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs justify-between">
              <a href="/superadmin/finance">
                <span>Ir al Panel Financiero y Reembolsos</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Atajo 3: Bitácora de Auditoría */}
        <Card className="bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 transition-all">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-400" />
              Bitácora de Auditoría (Audit Trail)
            </CardTitle>
            <CardDescription className="text-zinc-400 text-xs">
              Inspección forense de diferencias JSON en tiempo real con registro de IPs, timestamps y usuarios que autorizaron cambios.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400 p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <span>Últimas acciones registradas:</span>
              <span className="font-bold text-white">{auditMeta?.total ?? 0} eventos</span>
            </div>
            <Button asChild className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs justify-between">
              <a href="/superadmin/audit">
                <span>Inspeccionar Bitácora de Auditoría</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Atajo 4: Configuración y Mantenimiento */}
        <Card className="bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 transition-all">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="h-5 w-5 text-amber-400" />
              Configuración Crítica y Modo Mantenimiento
            </CardTitle>
            <CardDescription className="text-zinc-400 text-xs">
              Modifica llaves API enmascaradas (Culqi, OpenAI, etc.) y activa el interruptor de bloqueo global por mantenimiento.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400 p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <span>Estado del modo mantenimiento:</span>
              <span className={`font-bold ${isMaintenance ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isMaintenance ? 'ACTIVADO' : 'DESACTIVADO'}
              </span>
            </div>
            <Button asChild className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs justify-between">
              <a href="/superadmin/settings">
                <span>Configurar Sistema y Llaves API</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
