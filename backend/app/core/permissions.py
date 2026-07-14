from enum import Enum

class UserRole(str, Enum):
    ADMIN = 'Admin'
    DIRECTOR = 'Director'
    HR_OFFICER = 'HR Officer'
    FINANCE_OFFICER = 'Finance Officer'
    STAFF = 'Staff'

class Permission(str, Enum):
    HR_MANAGE = 'hr:manage'
    HR_ATTENDANCE_SELF = 'hr:attendance:self'
    HR_ATTENDANCE_MANAGE = 'hr:attendance:manage'
    PAYROLL_GENERATE = 'payroll:generate'
    PAYROLL_APPROVE = 'payroll:approve'
    FINANCE_READ = 'finance:read'
    FINANCE_WRITE = 'finance:write'
    INVENTORY_READ = 'inventory:read'
    INVENTORY_ISSUE = 'inventory:issue'
    PROGRAMS_READ = 'programs:read'
    PROGRAMS_MANAGE = 'programs:manage'
    ADMIN_USERS = 'admin:users'
    AUDIT_READ = 'audit:read'

# NOTE: Must stay in sync with frontend/src/lib/permissions.ts
ROLE_PERMISSIONS = {
    UserRole.ADMIN.value: [
        Permission.HR_MANAGE.value, Permission.HR_ATTENDANCE_SELF.value, Permission.HR_ATTENDANCE_MANAGE.value,
        Permission.PAYROLL_GENERATE.value, Permission.PAYROLL_APPROVE.value, Permission.FINANCE_READ.value,
        Permission.FINANCE_WRITE.value, Permission.INVENTORY_READ.value, Permission.INVENTORY_ISSUE.value,
        Permission.PROGRAMS_READ.value, Permission.PROGRAMS_MANAGE.value, Permission.ADMIN_USERS.value, Permission.AUDIT_READ.value
    ],
    UserRole.DIRECTOR.value: [
        Permission.FINANCE_READ.value, Permission.PAYROLL_APPROVE.value, Permission.PROGRAMS_READ.value,
        Permission.INVENTORY_READ.value, Permission.AUDIT_READ.value
    ],
    UserRole.HR_OFFICER.value: [
        Permission.HR_MANAGE.value, Permission.HR_ATTENDANCE_MANAGE.value, Permission.HR_ATTENDANCE_SELF.value,
        Permission.PAYROLL_GENERATE.value
    ],
    UserRole.FINANCE_OFFICER.value: [
        Permission.FINANCE_READ.value, Permission.FINANCE_WRITE.value, Permission.PAYROLL_GENERATE.value,
        Permission.INVENTORY_READ.value
    ],
    UserRole.STAFF.value: [
        Permission.HR_ATTENDANCE_SELF.value, Permission.PROGRAMS_READ.value, Permission.INVENTORY_ISSUE.value
    ]
}

def has_permission(role: str, permission: str) -> bool:
    role_perms = ROLE_PERMISSIONS.get(role, [])
    return permission in role_perms
