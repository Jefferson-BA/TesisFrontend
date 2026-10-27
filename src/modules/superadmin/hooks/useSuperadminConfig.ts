// src/modules/superadmin/hooks/useSuperadminConfig.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { superadminService } from '../services/superadmin.service';
import type {
  UpdateSystemConfigDto,
  ToggleMaintenanceDto,
} from '../types/superadmin.types';

export function useSuperadminConfig() {
  const queryClient = useQueryClient();

  // 1. Configuraciones del sistema
  const configsQuery = useQuery({
    queryKey: ['superadmin-configs'],
    queryFn: () => superadminService.getSystemConfigs(),
  });

  // 2. Estado de modo mantenimiento
  const maintenanceQuery = useQuery({
    queryKey: ['superadmin-maintenance-status'],
    queryFn: () => superadminService.getMaintenanceStatus(),
  });

  // 3. Mutación para actualizar parámetro o llave API
  const updateConfigMutation = useMutation({
    mutationFn: ({ key, dto }: { key: string; dto: UpdateSystemConfigDto }) =>
      superadminService.updateSystemConfig(key, dto),
    onSuccess: (data) => {
      toast.success(data.message || 'Configuración actualizada');
      queryClient.invalidateQueries({ queryKey: ['superadmin-configs'] });
      queryClient.invalidateQueries({ queryKey: ['superadmin-audit-logs'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Error al actualizar configuración';
      toast.error(msg);
    },
  });

  // 4. Mutación para activar/desactivar modo mantenimiento
  const toggleMaintenanceMutation = useMutation({
    mutationFn: (dto: ToggleMaintenanceDto) =>
      superadminService.toggleMaintenanceMode(dto),
    onSuccess: (data) => {
      toast.success(data.message || 'Modo mantenimiento actualizado');
      queryClient.invalidateQueries({ queryKey: ['superadmin-maintenance-status'] });
      queryClient.invalidateQueries({ queryKey: ['superadmin-configs'] });
      queryClient.invalidateQueries({ queryKey: ['superadmin-audit-logs'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Error al cambiar modo mantenimiento';
      toast.error(msg);
    },
  });

  return {
    configs: configsQuery.data || [],
    isLoadingConfigs: configsQuery.isLoading,
    isErrorConfigs: configsQuery.isError,
    refetchConfigs: configsQuery.refetch,

    maintenance: maintenanceQuery.data,
    isLoadingMaintenance: maintenanceQuery.isLoading,
    refetchMaintenance: maintenanceQuery.refetch,

    updateConfig: updateConfigMutation.mutateAsync,
    isUpdatingConfig: updateConfigMutation.isPending,

    toggleMaintenance: toggleMaintenanceMutation.mutateAsync,
    isTogglingMaintenance: toggleMaintenanceMutation.isPending,
  };
}
