// src/modules/superadmin/hooks/useSuperadminFinance.ts

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { superadminService } from '../services/superadmin.service';
import type {
  FinancialQueryFilters,
  ForceCancelOrderDto,
  RefundOrderDto,
  AdjustAmountDto,
} from '../types/superadmin.types';

export function useSuperadminFinance(initialFilters: FinancialQueryFilters = {}) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<FinancialQueryFilters>(initialFilters);

  // 1. Consulta de reportes financieros consolidados
  const reportsQuery = useQuery({
    queryKey: ['superadmin-finance-reports', filters],
    queryFn: () => superadminService.getFinancialReports(filters),
  });

  // 2. Anulación forzada de orden
  const forceCancelMutation = useMutation({
    mutationFn: ({ orderId, dto }: { orderId: number; dto: ForceCancelOrderDto }) =>
      superadminService.forceCancelOrder(orderId, dto),
    onSuccess: (data) => {
      toast.success(data.message || 'Orden anulada forzosamente');
      queryClient.invalidateQueries({ queryKey: ['superadmin-finance-reports'] });
      queryClient.invalidateQueries({ queryKey: ['superadmin-audit-logs'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Error al anular orden';
      toast.error(msg);
    },
  });

  // 3. Reembolso directo en Culqi
  const refundCulqiMutation = useMutation({
    mutationFn: ({ orderId, dto }: { orderId: number; dto: RefundOrderDto }) =>
      superadminService.refundCulqiOrder(orderId, dto),
    onSuccess: (data) => {
      toast.success(data.message || 'Reembolso procesado en Culqi exitosamente');
      queryClient.invalidateQueries({ queryKey: ['superadmin-finance-reports'] });
      queryClient.invalidateQueries({ queryKey: ['superadmin-audit-logs'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Error al procesar reembolso en Culqi';
      toast.error(msg);
    },
  });

  // 4. Reajuste de monto por reclamo
  const adjustAmountMutation = useMutation({
    mutationFn: ({ orderId, dto }: { orderId: number; dto: AdjustAmountDto }) =>
      superadminService.adjustOrderAmount(orderId, dto),
    onSuccess: (data) => {
      toast.success(data.message || 'Monto reajustado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['superadmin-finance-reports'] });
      queryClient.invalidateQueries({ queryKey: ['superadmin-audit-logs'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Error al reajustar el monto';
      toast.error(msg);
    },
  });

  return {
    filters,
    setFilters,
    report: reportsQuery.data?.data,
    isLoading: reportsQuery.isLoading,
    isFetching: reportsQuery.isFetching,
    isError: reportsQuery.isError,
    refetch: reportsQuery.refetch,
    forceCancelOrder: forceCancelMutation.mutateAsync,
    isForceCancelling: forceCancelMutation.isPending,
    refundCulqiOrder: refundCulqiMutation.mutateAsync,
    isRefunding: refundCulqiMutation.isPending,
    adjustOrderAmount: adjustAmountMutation.mutateAsync,
    isAdjusting: adjustAmountMutation.isPending,
  };
}
