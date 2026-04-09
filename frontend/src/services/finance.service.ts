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
    const transactions = await FinanceService.getTransactions();
    const cash_available = transactions
      .filter(t => t.status === 'Cash')
      .reduce((acc, t) => acc + (t.transaction_type === 'Income' ? t.amount : -t.amount), 0);
    const receivables = transactions
      .filter(t => t.status === 'Receivable')
      .reduce((acc, t) => acc + t.amount, 0);
    const monthly_expenses = transactions
      .filter(t => t.transaction_type === 'Expense')
      .reduce((acc, t) => acc + t.amount, 0);
      
    return {
      cash_available,
      receivables,
      monthly_expenses
    };
  }
};
