import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HRService } from '@/services/hr.service';
import { toast } from 'sonner';

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: HRService.getEmployees,
  });
}

export function useAttendance(date: string) {
  return useQuery({
    queryKey: ['attendance', date],
    queryFn: () => HRService.getAttendance(date),
  });
}

export function useLockAttendance() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: HRService.lockAttendance,
    onSuccess: (_, date) => {
      queryClient.invalidateQueries({ queryKey: ['attendance', date] });
      toast.success('Attendance records locked for this date');
    },
    onError: () => {
      toast.error('Failed to lock attendance');
    }
  });
}
export function useRunPayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ month, year }: { month: number; year: number }) =>
      HRService.generatePayroll(month, year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      toast.success('Payroll generated successfully');
    },
    onError: (error: any) => {
      const detail = error?.response?.data?.detail;
      const message = typeof detail === 'string' ? detail : 'Failed to generate payroll';
      toast.error(message);
    },
  });
}
