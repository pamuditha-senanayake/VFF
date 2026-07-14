import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Package,
  Calendar,
  Wallet,
  FileText,
  Boxes,
  ArrowDownUp,
  RotateCcw,
  BookOpen,
  FolderOpen
} from 'lucide-react';
import type { Permission } from './permissions';

export interface NavItem {
  label: string;
  href: string;
  icon?: any;
  requiredPermission?: Permission;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAVIGATION_CONFIG: NavSection[] = [
  {
    title: 'GENERAL',
    items: [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'HUMAN RESOURCES',
    items: [
      { label: 'Employees', href: '/hr/employees', icon: Users, requiredPermission: 'hr:manage' },
      { label: 'Attendance', href: '/hr/attendance', icon: Calendar, requiredPermission: 'hr:attendance:manage' },
      { label: 'Payroll', href: '/hr/payroll', icon: Wallet, requiredPermission: 'payroll:generate' },
    ]
  },
  {
    title: 'FINANCE',
    items: [
      { label: 'Overview', href: '/finance/overview', icon: DollarSign, requiredPermission: 'finance:read' },
      { label: 'Ledger', href: '/finance/ledger', icon: FileText, requiredPermission: 'finance:write' },
      { label: 'Receivables', href: '/finance/receivables', icon: ArrowDownUp, requiredPermission: 'finance:read' },
      { label: 'Payables', href: '/finance/payables', icon: ArrowDownUp, requiredPermission: 'finance:read' },
      { label: 'Reports', href: '/finance/reports', icon: FileText, requiredPermission: 'finance:read' },
    ]
  },
  {
    title: 'INVENTORY',
    items: [
      { label: 'Stock', href: '/inventory/stock', icon: Package, requiredPermission: 'inventory:read' },
      { label: 'Issue', href: '/inventory/issue', icon: Boxes, requiredPermission: 'inventory:issue' },
      { label: 'Returns', href: '/inventory/returns', icon: RotateCcw, requiredPermission: 'inventory:issue' },
    ]
  },
  {
    title: 'PROGRAMS',
    items: [
      { label: 'Active Programs', href: '/programs', icon: FolderOpen, requiredPermission: 'programs:read' },
    ]
  },
  {
    title: 'SELF SERVICE',
    items: [
      { label: 'My Attendance', href: '/me/attendance', icon: BookOpen, requiredPermission: 'hr:attendance:self' },
    ]
  },
  {
    title: 'MANAGEMENT',
    items: [
      { label: 'System Admin', href: '/admin', icon: Users, requiredPermission: 'admin:users' }
    ]
  },
  {
    title: 'PERSONAL',
    items: [
      { label: 'Go to Website Home', href: '/', icon: LayoutDashboard },
      { label: 'Edit Profile', href: '/profile', icon: Users },
      { label: 'Account Settings', href: '/settings', icon: Wallet },
      { label: 'Support', href: '/support', icon: FileText },
    ]
  }
];
