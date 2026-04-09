import { Transaction } from '@/types';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'T1', type: 'Income', is_receivable: false, amount: 15000, category: 'Donation', date: '2026-04-01', description: 'Monthly grant' },
  { id: 'T2', type: 'Expense', is_receivable: false, amount: 2500, category: 'Medical', date: '2026-04-03', description: 'Animal vaccines', program_id: 'P1' },
  { id: 'T3', type: 'Income', is_receivable: true, amount: 8000, category: 'Sponsorship', date: '2026-04-05', description: 'Pending corporate sponsor' },
  { id: 'T4', type: 'Expense', is_receivable: false, amount: 1200, category: 'Operations', date: '2026-04-07', description: 'Rent payment' },
];

export const FinanceService = {
  getTransactions: async () => {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_TRANSACTIONS;
  },
  
  getSummary: async () => {
    await new Promise(r => setTimeout(r, 400));
    return {
      cash_available: 245632,
      receivables: 42890,
      monthly_expenses: 128450
    };
  }
};
