// src/modules/superadmin/hooks/useSuperadminUsers.ts

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { superadminService } from '../services/superadmin.service';
import type {
  UserQueryFilters,
  UpdateRoleDto,
  UpdateUserStatusDto,
  UpdateUserProfileDto,
} from '../types/superadmin.types';

export function useSuperadminUsers(initialFilters: UserQueryFilters = { limit: 10, offset: 0 }) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<UserQueryFilters>(initialFilters);

  // 1. Consulta de usuarios
  const usersQuery = useQuery({
    queryKey: ['superadmin-users', filters],
    queryFn: () => superadminService.getUsers(filters),
  });

  // 2. Mutación para cambio de Rol
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateRoleDto }) =>
      superadminService.updateUserRole(id, dto),
    onSuccess: (data) => {
      toast.success(data.message || 'Rol actualizado con éxito');
      queryClient.invalidateQueries({ queryKey: ['superadmin-users'] });
      queryClient.invalidateQueries({ queryKey: ['superadmin-audit-logs'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Error al actualizar el rol';
      toast.error(msg);
    },
  });

  // 3. Mutación para cambiar Estado (Activo / Suspendido)
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateUserStatusDto }) =>
      superadminService.updateUserStatus(id, dto),
    onSuccess: (data) => {
      toast.success(data.message || 'Estado de usuario modificado');
      queryClient.invalidateQueries({ queryKey: ['superadmin-users'] });
      queryClient.invalidateQueries({ queryKey: ['superadmin-audit-logs'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Error al cambiar estado';
      toast.error(msg);
    },
  });

  // 4. Mutación para editar datos personales del usuario
  const updateProfileMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateUserProfileDto }) =>
      superadminService.updateUserProfile(id, dto),
    onSuccess: (data) => {
      toast.success(data.message || 'Perfil de usuario actualizado');
      queryClient.invalidateQueries({ queryKey: ['superadmin-users'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Error al editar perfil';
      toast.error(msg);
    },
  });

  return {
    filters,
    setFilters,
    users: usersQuery.data?.data || [],
    stats: usersQuery.data?.stats,
    meta: usersQuery.data?.meta,
    isLoading: usersQuery.isLoading,
    isFetching: usersQuery.isFetching,
    isError: usersQuery.isError,
    refetch: usersQuery.refetch,
    updateRole: updateRoleMutation.mutateAsync,
    isUpdatingRole: updateRoleMutation.isPending,
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
}
