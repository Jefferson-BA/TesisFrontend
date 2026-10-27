// src/modules/superadmin/components/SuperadminAuditView.tsx

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Activity,
  Search,
  RefreshCw,
  Eye,
  ShieldAlert,
  Calendar,
  Globe,
  User,
  Copy,
  Check,
  Code2,
  ArrowRight,
  Sliders,
  DollarSign,
  Lock,
} from 'lucide-react';

import { useSuperadminAudit } from '../hooks/useSuperadminAudit';
import type { AuditLog, AuditActionType } from '../types/superadmin.types';

export function SuperadminAuditView() {
  const {
    filters,
    setFilters,
    logs,
    actions,
    meta,
    isLoading,
    isFetching,
    refetch,
  } = useSuperadminAudit({ limit: 25, offset: 0 });

  const [searchInput, setSearchInput] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      search: searchInput.trim() || undefined,
      offset: 0,
    }));
  };

  const handleActionFilterChange = (val: string) => {
    setFilters((prev) => ({
      ...prev,
      action: val === 'all' ? undefined : (val as AuditActionType),
      offset: 0,
    }));
  };

  const handleCopyJSON = () => {
    if (!selectedLog) return;
    navigator.clipboard.writeText(JSON.stringify(selectedLog.details, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper para renderizar insignia según tipo de acción
  const getActionBadge = (action: AuditActionType) => {
    switch (action) {
      case 'USER_ROLE_CHANGED':
        return (
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 font-medium">
            Rol Modificado
          </Badge>
        );
      case 'USER_STATUS_CHANGED':
        return (
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 font-medium">
            Estado de Usuario
          </Badge>
        );
      case 'ORDER_FORCE_CANCELLED':
        return (
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30 font-medium">
            Anulación Forzada
          </Badge>
        );
      case 'CULQI_REFUND_PROCESSED':
        return (
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 font-medium">
            Reembolso Culqi
          </Badge>
        );
      case 'ORDER_AMOUNT_ADJUSTED':
        return (
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-medium">
            Reajuste Monto
          </Badge>
        );
      case 'SYSTEM_CONFIG_UPDATED':
        return (
          <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 font-medium">
            Configuración
          </Badge>
        );
      case 'MAINTENANCE_MODE_TOGGLED':
        return (
          <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 font-medium">
            Modo Mantenimiento
          </Badge>
        );
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  // Helper para detectar diferencias previas vs nuevas en los detalles
  const renderDiffInspection = (details: Record<string, any>) => {
    const hasRoleDiff = 'previousRole' in details && 'newRole' in details;
    const hasAmountDiff = 'previousAmount' in details && 'newAmount' in details;
    const hasStatusDiff = 'previousStatus' in details && 'newStatus' in details;

    return (
      <div className="space-y-4">
        {/* Si encontramos un cambio de valor directo, renderizamos un comparador visual */}
        {(hasRoleDiff || hasAmountDiff || hasStatusDiff) && (
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-400">
              Diferencia Detectada (Antes vs. Después)
            </span>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex-1 p-2.5 rounded bg-red-950/30 border border-red-800/40 text-red-300">
                <span className="text-[10px] text-zinc-400 block font-mono">VALOR ANTERIOR</span>
                <span className="font-semibold">
                  {hasRoleDiff && String(details.previousRole)}
                  {hasAmountDiff && `S/ ${Number(details.previousAmount).toFixed(2)}`}
                  {hasStatusDiff && String(details.previousStatus)}
                </span>
              </div>

              <ArrowRight className="h-4 w-4 text-zinc-500 shrink-0" />

              <div className="flex-1 p-2.5 rounded bg-emerald-950/30 border border-emerald-800/40 text-emerald-300">
                <span className="text-[10px] text-zinc-400 block font-mono">VALOR ACTUAL</span>
                <span className="font-semibold">
                  {hasRoleDiff && String(details.newRole)}
                  {hasAmountDiff && `S/ ${Number(details.newAmount).toFixed(2)}`}
                  {hasStatusDiff && String(details.newStatus)}
                </span>
              </div>
            </div>

            {details.reason && (
              <p className="text-xs text-zinc-400 italic pt-1">
                Motivo: &quot;{details.reason}&quot;
              </p>
            )}
          </div>
        )}

        {/* Visor de Código JSON Completo */}
        <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2">
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5 text-primary" />
              Payload JSON de Auditoría
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyJSON}
              className="h-7 text-xs text-zinc-400 hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400 mr-1" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copiar JSON
                </>
              )}
            </Button>
          </div>
          <pre className="text-xs font-mono text-emerald-400 overflow-x-auto max-h-64 p-2">
            {JSON.stringify(details, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 🔍 Barra de Filtros */}
      <Card className="bg-zinc-900/70 border-zinc-800">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Buscar por usuario, IP, entidad o ID..."
                  className="pl-9 bg-zinc-950/60 border-zinc-800 text-white placeholder:text-zinc-500 text-sm focus-visible:ring-primary"
                />
              </div>
              <Button type="submit" variant="secondary" className="border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white">
                Buscar
              </Button>
            </form>

            <div className="flex items-center gap-2">
              <div className="w-48">
                <Select defaultValue="all" onValueChange={handleActionFilterChange}>
                  <SelectTrigger className="bg-zinc-950/60 border-zinc-800 text-white text-xs">
                    <SelectValue placeholder="Filtrar por Acción" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="all">Todas las acciones</SelectItem>
                    <SelectItem value="USER_ROLE_CHANGED">Cambio de Rol</SelectItem>
                    <SelectItem value="USER_STATUS_CHANGED">Cambio de Estado</SelectItem>
                    <SelectItem value="ORDER_FORCE_CANCELLED">Anulación Forzada</SelectItem>
                    <SelectItem value="CULQI_REFUND_PROCESSED">Reembolso Culqi</SelectItem>
                    <SelectItem value="ORDER_AMOUNT_ADJUSTED">Reajuste Monto</SelectItem>
                    <SelectItem value="SYSTEM_CONFIG_UPDATED">Configuración</SelectItem>
                    <SelectItem value="MAINTENANCE_MODE_TOGGLED">Modo Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={isFetching}
                title="Refrescar logs"
                className="border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 📜 Tabla de Bitácora de Auditoría */}
      <Card className="bg-zinc-900/90 border-zinc-800">
        <CardHeader className="border-b border-zinc-800 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Bitácora de Auditoría Maestra (Audit Trail)
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs">
                Registro inmutable de acciones críticas, dirección IP de origen y cambios realizados.
              </CardDescription>
            </div>
            <div className="text-xs text-zinc-500">
              Eventos totales: <span className="font-semibold text-zinc-300">{meta?.total ?? 0}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-950/50">
              <TableRow className="border-zinc-800">
                <TableHead className="text-zinc-400 font-semibold">Fecha y Hora</TableHead>
                <TableHead className="text-zinc-400 font-semibold">Acción</TableHead>
                <TableHead className="text-zinc-400 font-semibold">Entidad / Recurso</TableHead>
                <TableHead className="text-zinc-400 font-semibold">Ejecutado Por</TableHead>
                <TableHead className="text-zinc-400 font-semibold">Dirección IP</TableHead>
                <TableHead className="text-right text-zinc-400 font-semibold pr-6">Detalles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="border-zinc-800">
                    <TableCell><Skeleton className="h-5 w-28 bg-zinc-800" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24 bg-zinc-800" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 bg-zinc-800" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32 bg-zinc-800" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24 bg-zinc-800" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto bg-zinc-800" /></TableCell>
                  </TableRow>
                ))
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-zinc-500">
                    No hay registros de auditoría registrados para este criterio.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} className="border-zinc-800/80 hover:bg-zinc-800/40 transition-colors">
                    <TableCell>
                      <div className="text-xs text-zinc-300 font-mono">
                        {new Date(log.createdAt).toLocaleString('es-PE')}
                      </div>
                    </TableCell>

                    <TableCell>{getActionBadge(log.action)}</TableCell>

                    <TableCell>
                      <Badge variant="outline" className="border-zinc-700 text-zinc-300 font-mono text-xs">
                        {log.entity} #{log.entityId}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white flex items-center gap-1">
                          <User className="h-3 w-3 text-primary" />
                          {log.performedByName}
                        </span>
                        <span className="text-[11px] text-zinc-400">{log.performedByEmail}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                        <Globe className="h-3 w-3 text-zinc-500" />
                        {log.ipAddress || '127.0.0.1'}
                      </div>
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                        className="h-8 gap-1.5 text-xs border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                      >
                        <Eye className="h-3.5 w-3.5 text-primary" />
                        Inspeccionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 🔍 MODAL: Inspección de Diferencias JSON */}
      {selectedLog && (
        <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
          <DialogContent className="sm:max-w-xl bg-zinc-950 border-zinc-800 text-white shadow-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10 text-xs">
                  Auditoría #{selectedLog.id}
                </Badge>
                {getActionBadge(selectedLog.action)}
              </div>
              <DialogTitle className="text-lg font-bold text-white mt-1">
                Inspección de Registro #{selectedLog.id}
              </DialogTitle>
              <DialogDescription className="text-zinc-400 text-xs">
                Ejecutado por <span className="text-white font-medium">{selectedLog.performedByName}</span> ({selectedLog.performedByRole}) el {new Date(selectedLog.createdAt).toLocaleString('es-PE')} desde IP {selectedLog.ipAddress}.
              </DialogDescription>
            </DialogHeader>

            <div className="py-2">
              {renderDiffInspection(selectedLog.details)}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
