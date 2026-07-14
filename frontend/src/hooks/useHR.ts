import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HRService } from '@/services/hr.service';
import { toast } from 'sonner';

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: HRService.getEmployees,
  });
}

export function useAttendance(date?: string, month?: number, year?: number) {
  return useQuery({
    queryKey: ['attendance', { date, month, year }],
    queryFn: () => HRService.getAttendance(date, month, year),
  });
}

export function useMyAttendance(month?: number, year?: number) {
  return useQuery({
    queryKey: ['my-attendance', { month, year }],
    queryFn: () => HRService.getMyAttendance(month, year),
  });
}

export function useClockIn() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: HRService.clockIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-attendance'] });
      toast.success('Successfully clocked in');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || 'Failed to clock in');
    }
  });
}

export function useClockOut() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: HRService.clockOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-attendance'] });
      toast.success('Successfully clocked out');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || 'Failed to clock out');
    }
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

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: HRService.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee record created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || 'Failed to add employee');
    }
  });
}
