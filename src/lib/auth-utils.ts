// src/lib/auth-utils.ts

export type AppRole = 'superadmin' | 'admin' | 'user';

/**
 * Extrae y normaliza el rol de un usuario de forma segura,
 * tolerando strings simples, objetos TypeORM { id, name }, campos alternos o arrays.
 */
export function extractRole(user: any): AppRole {
  if (!user) return 'user';

  let raw: any = null;

  // 1. Si role es string directo: "superadmin", "admin", "user"
  if (typeof user.role === 'string') {
    raw = user.role;
  }
  // 2. Si role es un objeto TypeORM / NestJS: { id: 1, name: "superadmin" }
  else if (user.role && typeof user.role === 'object' && typeof user.role.name === 'string') {
    raw = user.role.name;
  }
  // 3. Campo alterno en español: rol (string u objeto)
  else if (typeof user.rol === 'string') {
    raw = user.rol;
  } else if (user.rol && typeof user.rol === 'object' && typeof user.rol.name === 'string') {
    raw = user.rol.name;
  }
  // 4. Array de roles: roles: [{ name: "superadmin" }] o roles: ["superadmin"]
  else if (Array.isArray(user.roles) && user.roles.length > 0) {
    const first = user.roles[0];
    raw = typeof first === 'string' ? first : first?.name;
  }
  // 5. Enum alterno: roleType
  else if (typeof user.roleType === 'string') {
    raw = user.roleType;
  }

  const clean = String(raw || '').toLowerCase().trim();

  if (clean === 'superadmin') return 'superadmin';
  if (clean === 'admin') return 'admin';
  return 'user';
}

/**
 * Obtiene la ruta inicial correcta del usuario según su rol
 */
export function getDefaultRouteByRole(role: AppRole): string {
  switch (role) {
    case 'superadmin':
      return '/superadmin/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/';
  }
}
