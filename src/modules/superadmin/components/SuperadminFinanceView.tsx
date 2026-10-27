// src/modules/superadmin/components/SuperadminFinanceView.tsx

import React, { useState } from 'react';
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
  DollarSign,
  TrendingUp,
  CreditCard,
  RotateCcw,
  AlertOctagon,
  Sliders,
  Calendar,
  Wallet,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Receipt,
} from 'lucide-react';

import { useSuperadminFinance } from '../hooks/useSuperadminFinance';
import { SuperadminPasswordModal } from './SuperadminPasswordModal';
import type { OrderStatus, PaymentMethod } from '../types/superadmin.types';

export function SuperadminFinanceView() {
  const {
    filters,
    setFilters,
    report,
    isLoading,
    isFetching,
    refetch,
    forceCancelOrder,
    isForceCancelling,
    refundCulqiOrder,
    isRefunding,
    adjustOrderAmount,
    isAdjusting,
  } = useSuperadminFinance({});

  // 1. Estado para Anulación Forzada
  const [forceCancelOrderId, setForceCancelOrderId] = useState('');
  const [refundWithCulqi, setRefundWithCulqi] = useState(true);
  const [showForceCancelModal, setShowForceCancelModal] = useState(false);

  // 2. Estado para Reembolso Culqi Directo
  const [refundOrderId, setRefundOrderId] = useState('');
  const [refundChargeId, setRefundChargeId] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [showRefundModal, setShowRefundModal] = useState(false);

  // 3. Estado para Reajuste de Monto
  const [adjustOrderId, setAdjustOrderId] = useState('');
  const [adjustNewAmount, setAdjustNewAmount] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  // Handlers para abrir modales tras validaciones básicas
  const handleOpenForceCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forceCancelOrderId || isNaN(Number(forceCancelOrderId))) return;
    setShowForceCancelModal(true);
  };

  const handleOpenRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundOrderId || isNaN(Number(refundOrderId))) return;
    if (!refundAmount || isNaN(Number(refundAmount)) || Number(refundAmount) <= 0) return;
    setShowRefundModal(true);
  };

  const handleOpenAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustOrderId || isNaN(Number(adjustOrderId))) return;
    if (!adjustNewAmount || isNaN(Number(adjustNewAmount)) || Number(adjustNewAmount) < 0) return;
    setShowAdjustModal(true);
  };

  // Confirmaciones con contraseña de superadmin
  const handleConfirmForceCancel = async ({
    superadminPassword,
    reason,
  }: {
    superadminPassword: string;
    reason: string;
  }) => {
    await forceCancelOrder({
      orderId: Number(forceCancelOrderId),
      dto: {
        reason,
        superadminPassword,
        refundWithCulqi,
      },
    });
    setForceCancelOrderId('');
    setShowForceCancelModal(false);
  };

  const handleConfirmRefund = async ({
    superadminPassword,
    reason,
  }: {
    superadminPassword: string;
    reason: string;
  }) => {
    await refundCulqiOrder({
      orderId: Number(refundOrderId),
      dto: {
        chargeId: refundChargeId.trim(),
        amount: Number(refundAmount),
        reason,
        superadminPassword,
      },
    });
    setRefundOrderId('');
    setRefundChargeId('');
    setRefundAmount('');
    setShowRefundModal(false);
  };

  const handleConfirmAdjust = async ({
    superadminPassword,
    reason,
  }: {
    superadminPassword: string;
    reason: string;
  }) => {
    await adjustOrderAmount({
      orderId: Number(adjustOrderId),
      dto: {
        newTotalAmount: Number(adjustNewAmount),
        reason,
        superadminPassword,
      },
    });
    setAdjustOrderId('');
    setAdjustNewAmount('');
    setShowAdjustModal(false);
  };

  const summary = report?.summary;
  const methods = report?.revenueByPaymentMethod;

  return (
    <div className="space-y-6">
      {/* 📊 Métricas Financieras Principales */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Totales (PEN)</CardTitle>
            <DollarSign className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {isLoading ? (
                <Skeleton className="h-7 w-28 bg-muted" />
              ) : (
                `S/ ${(summary?.totalRevenue ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Facturación consolidada</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Promedio</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">
              {isLoading ? (
                <Skeleton className="h-7 w-24 bg-muted" />
              ) : (
                `S/ ${(summary?.averageTicket ?? 0).toFixed(2)}`
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Por orden completada</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Órdenes Pagadas</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">
              {isLoading ? <Skeleton className="h-7 w-16 bg-muted" /> : summary?.paidOrdersCount ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total transacciones aprobadas</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Órdenes Anuladas</CardTitle>
            <XCircle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-red-600 dark:text-red-400">
              {isLoading ? <Skeleton className="h-7 w-16 bg-muted" /> : summary?.cancelledOrdersCount ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Reembolsadas o revocadas</p>
          </CardContent>
        </Card>
      </div>

      {/* 💳 Desglose por Método de Pago */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            Recaudación por Pasarela y Método de Pago
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid gap-4 sm:grid-cols-4">
          <div className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <CreditCard className="h-3.5 w-3.5 text-blue-500" /> Tarjeta (Culqi)
              </span>
              <div className="text-lg font-bold text-foreground mt-1">
                S/ {(methods?.card ?? 0).toFixed(2)}
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-600 dark:text-blue-400">Culqi API</Badge>
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <DollarSign className="h-3.5 w-3.5 text-purple-500" /> Yape
              </span>
              <div className="text-lg font-bold text-foreground mt-1">
                S/ {(methods?.yape ?? 0).toFixed(2)}
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-600 dark:text-purple-400">Móvil</Badge>
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <DollarSign className="h-3.5 w-3.5 text-cyan-500" /> Plin
              </span>
              <div className="text-lg font-bold text-foreground mt-1">
                S/ {(methods?.plin ?? 0).toFixed(2)}
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-cyan-500/30 text-cyan-600 dark:text-cyan-400">Móvil</Badge>
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <Receipt className="h-3.5 w-3.5 text-amber-500" /> Efectivo
              </span>
              <div className="text-lg font-bold text-foreground mt-1">
                S/ {(methods?.cash ?? 0).toFixed(2)}
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-600 dark:text-amber-400">Caja</Badge>
          </div>
        </CardContent>
      </Card>

      {/* ⚡ Controles Críticos de Intervención Financiera */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Panel 1: Anulación Forzada de Orden */}
        <Card className="bg-card border-red-500/30 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-red-500/40 text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-950/20 text-xs gap-1">
                <AlertOctagon className="h-3 w-3" />
                Intervención Forzada
              </Badge>
            </div>
            <CardTitle className="text-base font-bold text-foreground mt-2">
              Anulación Forzada de Orden
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs">
              Revoca el estado de una orden pagada, libera la reserva asociada y revierte el stock.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOpenForceCancel} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">ID de la Orden</label>
                <Input
                  type="number"
                  value={forceCancelOrderId}
                  onChange={(e) => setForceCancelOrderId(e.target.value)}
                  placeholder="Ej. 105"
                  required
                  className="bg-background border-input text-foreground text-sm"
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-md bg-muted/40 border border-border">
                <input
                  type="checkbox"
                  id="refundCulqiCheck"
                  checked={refundWithCulqi}
                  onChange={(e) => setRefundWithCulqi(e.target.checked)}
                  className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
                />
                <label htmlFor="refundCulqiCheck" className="text-xs text-foreground cursor-pointer">
                  Procesar devolución en pasarela Culqi si existe cargo
                </label>
              </div>

              <Button
                type="submit"
                disabled={!forceCancelOrderId}
                className="w-full bg-red-600 hover:bg-red-700 text-white gap-2 text-xs font-semibold"
              >
                <AlertOctagon className="h-3.5 w-3.5" />
                Iniciar Anulación Forzada
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Panel 2: Reembolso Directo en Culqi */}
        <Card className="bg-card border-blue-500/30 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-950/20 text-xs gap-1">
                <RotateCcw className="h-3 w-3" />
                Culqi Refunds v2
              </Badge>
            </div>
            <CardTitle className="text-base font-bold text-foreground mt-2">
              Reembolso en Pasarela Culqi
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs">
              Ejecuta una devolución total o parcial del cargo bancario directo a la tarjeta del comensal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOpenRefund} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">ID de Orden</label>
                <Input
                  type="number"
                  value={refundOrderId}
                  onChange={(e) => setRefundOrderId(e.target.value)}
                  placeholder="Ej. 89"
                  required
                  className="bg-background border-input text-foreground text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Charge ID de Culqi (Opcional si la orden lo tiene)</label>
                <Input
                  value={refundChargeId}
                  onChange={(e) => setRefundChargeId(e.target.value)}
                  placeholder="chr_live_... / chr_test_..."
                  className="bg-background border-input text-foreground text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Monto a Devolver (S/)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder="Ej. 45.00"
                  required
                  className="bg-background border-input text-foreground text-sm"
                />
              </div>

              <Button
                type="submit"
                disabled={!refundOrderId || !refundAmount}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs font-semibold"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Ejecutar Reembolso Culqi
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Panel 3: Reajuste de Monto por Reclamo */}
        <Card className="bg-card border-amber-500/30 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-950/20 text-xs gap-1">
                <Sliders className="h-3 w-3" />
                Compensación
              </Badge>
            </div>
            <CardTitle className="text-base font-bold text-foreground mt-2">
              Reajuste de Monto
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs">
              Modifica el total cobrado por resolución de disputas o compensaciones al cliente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOpenAdjust} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">ID de Orden</label>
                <Input
                  type="number"
                  value={adjustOrderId}
                  onChange={(e) => setAdjustOrderId(e.target.value)}
                  placeholder="Ej. 89"
                  required
                  className="bg-background border-input text-foreground text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Nuevo Total Reajustado (S/)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={adjustNewAmount}
                  onChange={(e) => setAdjustNewAmount(e.target.value)}
                  placeholder="Ej. 75.50"
                  required
                  className="bg-background border-input text-foreground text-sm"
                />
              </div>

              <Button
                type="submit"
                disabled={!adjustOrderId || !adjustNewAmount}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white gap-2 text-xs font-semibold"
              >
                <Sliders className="h-3.5 w-3.5" />
                Aplicar Reajuste
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* 🔐 MODALES DE CONFIRMACIÓN CON CONTRASEÑA */}
      <SuperadminPasswordModal
        open={showForceCancelModal}
        onOpenChange={setShowForceCancelModal}
        title={`Anulación Forzada de Orden #${forceCancelOrderId}`}
        description="Esta acción cambiará el estado de la orden a 'cancelled', liberará la mesa reservada y registrará la auditoría financiera."
        badgeText="Anulación Crítica"
        actionLabel="Confirmar Anulación Forzada"
        variant="destructive"
        isLoading={isForceCancelling}
        onConfirm={handleConfirmForceCancel}
      />

      <SuperadminPasswordModal
        open={showRefundModal}
        onOpenChange={setShowRefundModal}
        title={`Procesar Reembolso Culqi para Orden #${refundOrderId}`}
        description={`Se enviará una orden de devolución por un monto de S/ ${Number(refundAmount || 0).toFixed(2)} directamente a Culqi.`}
        badgeText="Transacción Bancaria"
        actionLabel="Autorizar Reembolso Culqi"
        variant="amber"
        isLoading={isRefunding}
        onConfirm={handleConfirmRefund}
      />

      <SuperadminPasswordModal
        open={showAdjustModal}
        onOpenChange={setShowAdjustModal}
        title={`Reajustar Total de Orden #${adjustOrderId}`}
        description={`El nuevo total de la orden será de S/ ${Number(adjustNewAmount || 0).toFixed(2)}. La diferencia será registrada en la bitácora.`}
        badgeText="Ajuste Financiero"
        actionLabel="Confirmar Reajuste"
        variant="amber"
        isLoading={isAdjusting}
        onConfirm={handleConfirmAdjust}
      />
    </div>
  );
}
