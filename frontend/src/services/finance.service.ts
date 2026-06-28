import api from '@/lib/api-client';
import { Transaction, Program } from '@/types';

export const FinanceService = {
  getTransactions: async (params?: { start_date?: string, end_date?: string }) => {
    const response = await api.get<Transaction[]>('/finance/transactions', { params });
    return response.data;
  },
  
  createTransaction: async (transaction: Omit<Transaction, 'id'>) => {
    const response = await api.post<Transaction>('/finance/transactions', transaction);
    return response.data;
  },

  getPrograms: async () => {
    const response = await api.get<Program[]>('/finance/programs');
    return response.data;
  },

  createProgram: async (program: Omit<Program, 'id'>) => {
    const response = await api.post<Program>('/finance/programs', program);
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get<{
      cash_available: number;
      receivables: number;
      monthly_expenses: number;
    }>('/finance/summary');
    return response.data;
  }
};
