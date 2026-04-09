export type UserRole = 'Admin' | 'Director';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  salary: number;
  date_joined: string;
  attendance_status: 'Present' | 'Absent' | 'Late';
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: 'Present' | 'Absent' | 'Late';
  is_locked: boolean;
}

export interface Transaction {
  id: string;
  type: 'Income' | 'Expense';
  is_receivable: boolean;
  amount: number;
  category: string;
  date: string;
  description: string;
  program_id?: string;
}

export interface Program {
  id: string;
  name: string;
  total_animals_treated: number;
  budget: number;
  total_expenses: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  min_stock: number;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity: string;
  entity_id: string;
  timestamp: string;
}
