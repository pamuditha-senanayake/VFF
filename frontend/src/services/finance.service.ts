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

  updateTransaction: async (id: number, transaction: Omit<Transaction, 'id' | 'programs'>) => {
  const response = await api.put<Transaction>(`/finance/transactions/${id}`, transaction);
  return response.data;
},

voidTransaction: async (id: number) => {
  const response = await api.patch<Transaction>(`/finance/transactions/${id}/void`);
  return response.data;
},

settleTransaction: async (id: number) => {
  const response = await api.patch<Transaction>(`/finance/transactions/${id}/settle`);
  return response.data;
},

  getSummary: async () => {
    const response = await api.get<{
      cash_available: number;
      receivables: number;
      monthly_expenses: number;
    }>('/finance/summary');
    return response.data;
  },

  getAging: async () => {
    const response = await api.get<Record<string, number>>('/finance/aging');
    return response.data;
  }
};
