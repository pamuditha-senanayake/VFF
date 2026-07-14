export type UserRole = 'Admin' | 'Director' | 'HR Officer' | 'Finance Officer' | 'Staff';

export type Permission = 
  | 'hr:manage'
  | 'hr:attendance:self'
  | 'hr:attendance:manage'
  | 'payroll:generate'
  | 'payroll:approve'
  | 'finance:read'
  | 'finance:write'
  | 'inventory:read'
  | 'inventory:issue'
  | 'programs:read'
  | 'programs:manage'
  | 'admin:users'
  | 'audit:read';

// NOTE: Must stay in sync with backend/app/core/permissions.py
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Admin: [
    'hr:manage', 'hr:attendance:self', 'hr:attendance:manage',
    'payroll:generate', 'payroll:approve', 'finance:read',
    'finance:write', 'inventory:read', 'inventory:issue',
    'programs:read', 'programs:manage', 'admin:users', 'audit:read'
  ],
  Director: [
    'finance:read', 'payroll:approve', 'programs:read',
    'inventory:read', 'audit:read'
  ],
  'HR Officer': [
    'hr:manage', 'hr:attendance:manage', 'hr:attendance:self',
    'payroll:generate'
  ],
  'Finance Officer': [
    'finance:read', 'finance:write', 'payroll:generate',
    'inventory:read'
  ],
  Staff: [
    'hr:attendance:self', 'programs:read', 'inventory:issue'
  ]
};

export function hasPermission(role: string, permission: Permission): boolean {
  if (!role || !(role in ROLE_PERMISSIONS)) return false;
  return ROLE_PERMISSIONS[role as UserRole].includes(permission);
}
