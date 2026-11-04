import type { AppRole } from '@/modules/auth/types/auth.types';
export type { AppRole } from '@/modules/auth/types/auth.types';

export function extractRole(user: unknown): AppRole {
  if (!user || typeof user !== 'object' || !('role' in user)) return 'user';
  const role = user.role;
  const raw =
    typeof role === 'string'
      ? role
      : role && typeof role === 'object' && 'name' in role
        ? role.name
        : undefined;
  const normalized = typeof raw === 'string' ? raw.toLowerCase().trim() : '';
  return normalized === 'admin' || normalized === 'superadmin'
    ? normalized
    : 'user';
}
export function getDefaultRouteByRole(role: AppRole): string {
  if (role === 'superadmin') return '/superadmin/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/';
}
