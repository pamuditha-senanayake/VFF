import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FinanceService } from '@/services/finance.service';
import { Transaction, Program } from '@/types';

export function useTransactions(start_date?: string, end_date?: string) {
  return useQuery({
    queryKey: ['transactions', { start_date, end_date }],
    queryFn: () => FinanceService.getTransactions({ start_date, end_date })
  });
}

export function useFinanceSummary() {
  return useQuery({
    queryKey: ['finance-summary'],
    queryFn: FinanceService.getSummary
  });
}

export function useFinanceAging() {
  return useQuery({
    queryKey: ['finance-aging'],
    queryFn: FinanceService.getAging
  });
}

export function usePrograms() {
  return useQuery({
    queryKey: ['programs'],
    queryFn: FinanceService.getPrograms
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: FinanceService.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['finance-summary'] });
      queryClient.invalidateQueries({ queryKey: ['finance-aging'] });
    }
  });
}

export function useSettleTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: FinanceService.settleTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['finance-summary'] });
      queryClient.invalidateQueries({ queryKey: ['finance-aging'] });
    }
  });
}
