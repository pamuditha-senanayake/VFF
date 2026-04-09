import api from '@/lib/api-client';
import { Employee, AttendanceRecord } from '@/types';

// Mock data
const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'John Doe', position: 'Field Officer', salary: 45000, date_joined: '2023-01-15', attendance_status: 'Present' },
  { id: '2', name: 'Jane Smith', position: 'Veterinarian', salary: 75000, date_joined: '2022-06-10', attendance_status: 'Present' },
  { id: '3', name: 'Mike Ross', position: 'Financier', salary: 65000, date_joined: '2023-03-20', attendance_status: 'Late' },
  { id: '4', name: 'Sarah Connor', position: 'Program Lead', salary: 85000, date_joined: '2021-11-01', attendance_status: 'Absent' },
];

const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: '101', employee_id: '1', date: '2026-04-09', check_in: '08:45', check_out: '17:15', status: 'Present', is_locked: true },
  { id: '102', employee_id: '2', date: '2026-04-09', check_in: '09:05', check_out: '18:00', status: 'Present', is_locked: false },
  { id: '103', employee_id: '3', date: '2026-04-09', check_in: '09:45', check_out: null, status: 'Late', is_locked: false },
  { id: '104', employee_id: '4', date: '2026-04-09', check_in: null, check_out: null, status: 'Absent', is_locked: false },
];

export const HRService = {
  getEmployees: async () => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 500));
    return MOCK_EMPLOYEES;
  },
  
  getAttendance: async (date: string) => {
    await new Promise(r => setTimeout(r, 500));
    return MOCK_ATTENDANCE;
  },

  lockAttendance: async (date: string) => {
    await new Promise(r => setTimeout(r, 800));
    return { success: true };
  }
};
