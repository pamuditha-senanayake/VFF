export type UserRole = 'Admin' | 'Director';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}


export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  nic: string;
  base_salary: number;
  status: string;
  user_id?: string;
}

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  target_date: string;
  clock_in: string | null;
  clock_out: string | null;
  worked_hours: number | null;
  is_locked: boolean;
}

export interface Transaction {
  id: number;
  transaction_date: string;
  amount: number;
  transaction_type: 'Income' | 'Expense';
  status: 'Cash' | 'Receivable' | 'Voided';
  program_id: number | null;
  programs?: {
    program_name: string;
  };
}

export interface Program {
  id: number;
  program_name: string;
  total_animals_treated: number;
  status: string;
}

export interface InventoryItem {
  id: number;
  item_name: string;
  current_stock: number;
  unit_cost: number;
}

export interface InventoryTransaction {
  id: number;
  item_id: number;
  program_id: number | null;
  quantity: number;
  transaction_type: 'Issue' | 'Return';
  transaction_date: string;
  inventory_items?: {
    item_name: string;
  };
  programs?: {
    program_name: string;
  };
}

export interface AuditLog {
  id: number;
  user_id: string | null;
  action_type: string;
  table_name: string;
  old_payload: any;
  new_payload: any;
  timestamp: string;
}
