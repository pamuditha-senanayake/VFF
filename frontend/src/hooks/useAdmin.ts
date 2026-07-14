import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '@/services/admin.service';

export function useAuditLogs(limit: number = 50) {
  return useQuery({
    queryKey: ['audit-logs', limit],
    queryFn: () => AdminService.getAuditLogs(limit),
  });
}

export function useSystemStats() {
  return useQuery({
    queryKey: ['system-stats'],
    queryFn: AdminService.getStats,
  });
}
