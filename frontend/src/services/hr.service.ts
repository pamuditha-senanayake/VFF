import api from '@/lib/api-client';
import { Employee, AttendanceRecord } from '@/types';

export const HRService = {
  getEmployees: async () => {
    const response = await api.get<Employee[]>('/hr/employees');
    return response.data;
  },
  
  createEmployee: async (employee: Omit<Employee, 'id'>) => {
    const response = await api.post<Employee>('/hr/employees', employee);
    return response.data;
  },

  updateEmployee: async (id: number, employee: Partial<Employee>) => {
    const response = await api.put<Employee>(`/hr/employees/${id}`, employee);
    return response.data;
  },

  getAttendance: async (date?: string, month?: number, year?: number) => {
    const params: any = {};
    if (date) params.target_date = date;
    if (month && year) {
      params.month = month;
      params.year = year;
    }
    const response = await api.get<AttendanceRecord[]>('/hr/attendance', { params });
    return response.data;
  },

  getMyAttendance: async (month?: number, year?: number) => {
    const params = (month && year) ? { month, year } : {};
    const response = await api.get<AttendanceRecord[]>('/hr/attendance/me', { params });
    return response.data;
  },

  clockIn: async () => {
    const response = await api.post<AttendanceRecord>('/hr/attendance/clock-in');
    return response.data;
  },

  clockOut: async () => {
    const response = await api.post<AttendanceRecord>('/hr/attendance/clock-out');
    return response.data;
  },

  logAttendance: async (attendance: Omit<AttendanceRecord, 'id'>) => {
    const response = await api.post<AttendanceRecord>('/hr/attendance', attendance);
    return response.data;
  },

  lockAttendance: async (date: string) => {
    const response = await api.post(`/hr/attendance/lock-day`, null, { params: { target_date: date } });
    return response.data;
  },

  generatePayroll: async (month: number, year: number) => {
    const response = await api.post(`/hr/payroll/generate`, null, { params: { month, year } });
    return response.data;
  }
};
