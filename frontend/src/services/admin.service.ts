import api from '@/lib/api-client';
import { AuditLog } from '@/types';

export const AdminService = {
  getAuditLogs: async (limit: number = 50) => {
    const response = await api.get<AuditLog[]>('/admin/audit-logs', { params: { limit } });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<{
      total_users: number;
      role_counts: Record<string, number>;
      status: string;
    }>('/admin/stats');
    return response.data;
  }
};
