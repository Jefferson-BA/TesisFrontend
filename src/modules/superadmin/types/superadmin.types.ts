// src/modules/superadmin/types/superadmin.types.ts

// ==========================================
// 1️⃣ GESTIÓN DE USUARIOS Y ROLES (PILAR 1)
// ==========================================

export type RoleType = 'superadmin' | 'admin' | 'user';

export interface Role {
  id: number;
  name: RoleType;
  description?: string;
}

export interface SuperadminUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  role: Role;
  createdAt: string;
  updatedAt: string;
  ordersCount?: number;
}

export interface UserStats {
  superadmin: number;
  admin: number;
  user: number;
}

export interface UsersResponse {
  data: SuperadminUser[];
  stats: UserStats;
  meta: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    lastPage: number;
  };
}

export interface UserQueryFilters {
  limit?: number;
  offset?: number;
  role?: RoleType;
  isActive?: boolean;
  search?: string;
}

export interface UpdateRoleDto {
  newRole: RoleType;
  reason: string;
  superadminPassword: string;
}

export interface UpdateUserStatusDto {
  isActive: boolean;
  reason: string;
  superadminPassword: string;
}

export interface UpdateUserProfileDto {
  name?: string;
  phone?: string;
  address?: string;
}

// ==========================================
// 2️⃣ FINANZAS, REEMBOLSOS Y CULQI (PILAR 2)
// ==========================================

export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'failed' | 'completed';
export type PaymentMethod = 'card' | 'yape' | 'plin' | 'cash';

export interface FinancialSummary {
  totalOrders: number;
  paidOrdersCount: number;
  cancelledOrdersCount: number;
  totalRevenue: number;
  averageTicket: number;
}

export interface RevenueByPaymentMethod {
  card: number;
  yape: number;
  plin: number;
  cash: number;
}

export interface CountByStatus {
  paid: number;
  cancelled: number;
  pending: number;
  [key: string]: number;
}

export interface TimelineItem {
  date: string;
  revenue: number;
  ordersCount: number;
}

export interface FinancialReportData {
  summary: FinancialSummary;
  revenueByPaymentMethod: RevenueByPaymentMethod;
  countByStatus: CountByStatus;
  timeline: TimelineItem[];
}

export interface FinancialReportResponse {
  success: boolean;
  data: FinancialReportData;
}

export interface FinancialQueryFilters {
  startDate?: string;
  endDate?: string;
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
}

export interface ForceCancelOrderDto {
  reason: string;
  superadminPassword: string;
  refundWithCulqi?: boolean;
}

export interface RefundOrderDto {
  chargeId: string;
  amount: number;
  reason: string;
  superadminPassword: string;
}

export interface AdjustAmountDto {
  newTotalAmount: number;
  reason: string;
  superadminPassword: string;
}

// ==========================================
// 3️⃣ BITÁCORA DE AUDITORÍA (PILAR 3)
// ==========================================

export type AuditActionType =
  | 'USER_ROLE_CHANGED'
  | 'USER_STATUS_CHANGED'
  | 'ORDER_FORCE_CANCELLED'
  | 'CULQI_REFUND_PROCESSED'
  | 'ORDER_AMOUNT_ADJUSTED'
  | 'SYSTEM_CONFIG_UPDATED'
  | 'MAINTENANCE_MODE_TOGGLED';

export interface AuditLog {
  id: number;
  action: AuditActionType;
  entity: string;
  entityId: string;
  performedById: number;
  performedByName: string;
  performedByEmail: string;
  performedByRole: string;
  ipAddress: string;
  userAgent?: string;
  details: Record<string, any>;
  createdAt: string;
}

export interface AuditQueryFilters {
  limit?: number;
  offset?: number;
  action?: AuditActionType;
  entity?: string;
  performedById?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

// ==========================================
// 4️⃣ CONFIGURACIÓN CRÍTICA Y MODO MANTENIMIENTO (PILAR 4)
// ==========================================

export type ConfigCategory = 'GENERAL' | 'FINANCIAL' | 'INTEGRATIONS' | 'SECURITY';

export interface SystemConfig {
  id: number;
  key: string;
  value: string;
  category: ConfigCategory;
  description?: string;
  isSecret: boolean;
  updatedAt?: string;
}

export interface UpdateSystemConfigDto {
  value: string;
  description?: string;
  superadminPassword?: string;
}

export interface ToggleMaintenanceDto {
  enabled: boolean;
  message?: string;
  superadminPassword: string;
}

export interface MaintenanceStatusResponse {
  maintenanceMode: boolean;
  customMessage?: string;
}
