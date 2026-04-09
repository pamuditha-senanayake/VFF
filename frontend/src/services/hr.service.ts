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

  getAttendance: async (date?: string) => {
    const params = date ? { target_date: date } : {};
    const response = await api.get<AttendanceRecord[]>('/hr/attendance', { params });
    return response.data;
  },

  logAttendance: async (attendance: Omit<AttendanceRecord, 'id'>) => {
    const response = await api.post<AttendanceRecord>('/hr/attendance', attendance);
    return response.data;
  },

  lockAttendance: async (date: string) => {
    const response = await api.post(`/hr/attendance/lock`, null, { params: { target_date: date } });
    return response.data;
  }
};
