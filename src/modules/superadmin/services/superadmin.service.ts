// src/modules/superadmin/services/superadmin.service.ts

import { api } from '@/api/axios';
import type {
  SuperadminUser,
  UsersResponse,
  UserQueryFilters,
  UpdateRoleDto,
  UpdateUserStatusDto,
  UpdateUserProfileDto,
  FinancialReportResponse,
  FinancialQueryFilters,
  ForceCancelOrderDto,
  RefundOrderDto,
  AdjustAmountDto,
  AuditLog,
  AuditLogsResponse,
  AuditQueryFilters,
  SystemConfig,
  UpdateSystemConfigDto,
  ToggleMaintenanceDto,
  MaintenanceStatusResponse,
} from '../types/superadmin.types';

export const superadminService = {
  // ==========================================
  // 1️⃣ PILAR 1: GESTIÓN DE USUARIOS Y ROLES
  // ==========================================

  async getUsers(filters?: UserQueryFilters): Promise<UsersResponse> {
    const { data } = await api.get<UsersResponse>('/superadmin/users', {
      params: filters,
    });
    return data;
  },

  async getUserById(id: number): Promise<{ user: SuperadminUser; ordersCount: number }> {
    const { data } = await api.get<{ user: SuperadminUser; ordersCount: number }>(
      `/superadmin/users/${id}`
    );
    return data;
  },

  async updateUserRole(
    id: number,
    dto: UpdateRoleDto
  ): Promise<{ success: boolean; message: string; user: SuperadminUser }> {
    const { data } = await api.patch<{ success: boolean; message: string; user: SuperadminUser }>(
      `/superadmin/users/${id}/role`,
      dto
    );
    return data;
  },

  async updateUserStatus(
    id: number,
    dto: UpdateUserStatusDto
  ): Promise<{ success: boolean; message: string; user: SuperadminUser }> {
    const { data } = await api.patch<{ success: boolean; message: string; user: SuperadminUser }>(
      `/superadmin/users/${id}/status`,
      dto
    );
    return data;
  },

  async updateUserProfile(
    id: number,
    dto: UpdateUserProfileDto
  ): Promise<{ success: boolean; message: string; user: SuperadminUser }> {
    const { data } = await api.patch<{ success: boolean; message: string; user: SuperadminUser }>(
      `/superadmin/users/${id}/profile`,
      dto
    );
    return data;
  },

  // ==========================================
  // 2️⃣ PILAR 2: FINANZAS Y REEMBOLSOS (CULQI)
  // ==========================================

  async getFinancialReports(filters?: FinancialQueryFilters): Promise<FinancialReportResponse> {
    const { data } = await api.get<FinancialReportResponse>('/superadmin/finance/reports', {
      params: filters,
    });
    return data;
  },

  async forceCancelOrder(
    orderId: number,
    dto: ForceCancelOrderDto
  ): Promise<{ success: boolean; message: string; order: any; refund?: any }> {
    const { data } = await api.post<{ success: boolean; message: string; order: any; refund?: any }>(
      `/superadmin/finance/orders/${orderId}/force-cancel`,
      dto
    );
    return data;
  },

  async refundCulqiOrder(
    orderId: number,
    dto: RefundOrderDto
  ): Promise<{ success: boolean; message: string; refundId: string; isFullRefund: boolean; culqiData: any }> {
    const { data } = await api.post<{
      success: boolean;
      message: string;
      refundId: string;
      isFullRefund: boolean;
      culqiData: any;
    }>(`/superadmin/finance/orders/${orderId}/refund`, dto);
    return data;
  },

  async adjustOrderAmount(
    orderId: number,
    dto: AdjustAmountDto
  ): Promise<{ success: boolean; message: string; order: any }> {
    const { data } = await api.patch<{ success: boolean; message: string; order: any }>(
      `/superadmin/finance/orders/${orderId}/adjust-amount`,
      dto
    );
    return data;
  },

  // ==========================================
  // 3️⃣ PILAR 3: SISTEMA DE AUDITORÍA (AUDIT TRAIL)
  // ==========================================

  async getAuditActions(): Promise<string[]> {
    const { data } = await api.get<string[]>('/superadmin/audit/actions');
    return data;
  },

  async getAuditLogs(filters?: AuditQueryFilters): Promise<AuditLogsResponse> {
    const { data } = await api.get<AuditLogsResponse>('/superadmin/audit/logs', {
      params: filters,
    });
    return data;
  },

  async getAuditLogById(id: number): Promise<AuditLog> {
    const { data } = await api.get<AuditLog>(`/superadmin/audit/logs/${id}`);
    return data;
  },

  // ==========================================
  // 4️⃣ PILAR 4: CONFIGURACIÓN CRÍTICA Y MODO MANTENIMIENTO
  // ==========================================

  async getMaintenanceStatus(): Promise<MaintenanceStatusResponse> {
    const { data } = await api.get<MaintenanceStatusResponse>(
      '/superadmin/config/maintenance-mode/status'
    );
    return data;
  },

  async getSystemConfigs(): Promise<SystemConfig[]> {
    const { data } = await api.get<SystemConfig[]>('/superadmin/config');
    return data;
  },

  async getSystemConfigByKey(key: string): Promise<SystemConfig> {
    const { data } = await api.get<SystemConfig>(`/superadmin/config/${key}`);
    return data;
  },

  async updateSystemConfig(
    key: string,
    dto: UpdateSystemConfigDto
  ): Promise<{ success: boolean; message: string; config: SystemConfig }> {
    const { data } = await api.patch<{ success: boolean; message: string; config: SystemConfig }>(
      `/superadmin/config/${key}`,
      dto
    );
    return data;
  },

  async toggleMaintenanceMode(
    dto: ToggleMaintenanceDto
  ): Promise<{ success: boolean; message: string; maintenanceMode: boolean; customMessage?: string }> {
    const { data } = await api.post<{
      success: boolean;
      message: string;
      maintenanceMode: boolean;
      customMessage?: string;
    }>('/superadmin/config/maintenance-mode/toggle', dto);
    return data;
  },
};
