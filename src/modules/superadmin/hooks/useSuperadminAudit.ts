// src/modules/superadmin/hooks/useSuperadminAudit.ts

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { superadminService } from '../services/superadmin.service';
import type { AuditQueryFilters } from '../types/superadmin.types';

export function useSuperadminAudit(initialFilters: AuditQueryFilters = { limit: 20, offset: 0 }) {
  const [filters, setFilters] = useState<AuditQueryFilters>(initialFilters);

  // 1. Bitácora de auditoría
  const auditLogsQuery = useQuery({
    queryKey: ['superadmin-audit-logs', filters],
    queryFn: () => superadminService.getAuditLogs(filters),
    refetchInterval: 15000, // Actualización automática periódica
  });

  // 2. Acciones disponibles para filtro
  const auditActionsQuery = useQuery({
    queryKey: ['superadmin-audit-actions'],
    queryFn: () => superadminService.getAuditActions(),
    staleTime: 1000 * 60 * 10,
  });

  return {
    filters,
    setFilters,
    logs: auditLogsQuery.data?.data || [],
    meta: auditLogsQuery.data?.meta,
    actions: auditActionsQuery.data || [],
    isLoading: auditLogsQuery.isLoading,
    isFetching: auditLogsQuery.isFetching,
    isError: auditLogsQuery.isError,
    refetch: auditLogsQuery.refetch,
  };
}
