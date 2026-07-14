'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useTransactions, useSettleTransaction } from '@/hooks/useFinance';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Plus, ArrowDownUp, Check, X, Search } from 'lucide-react';
import { formatLKR } from '@/lib/formatters';
import { hasPermission } from '@/lib/permissions';
import { differenceInDays, parseISO } from 'date-fns';

export default function PayablesPage() {
  const { user } = useAuthStore();
  const canWrite = hasPermission(user?.role as string, 'finance:write');
  
  const { data: transactions, isLoading } = useTransactions();
  const { mutate: settleTransaction, isPending } = useSettleTransaction();
  
  const payables = transactions?.filter(t => t.transaction_type === 'Expense' && t.status === 'Receivable') || [];
  
  const getAgingCategory = (dateStr: string) => {
    const days = differenceInDays(new Date(), parseISO(dateStr));
    if (days <= 15) return '0-15 Days';
    if (days <= 30) return '16-30 Days';
    return 'Overdue (31+ Days)';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading text-text-primary">Accounts Payable</h1>
      </div>

      <Card className="bg-surface border-border-brand">
        <CardHeader>
          <CardTitle>Open Payables</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="space-y-4">
               {[1, 2, 3].map(i => <Skeleton key={i} className="w-full h-12" />)}
             </div>
          ) : payables.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-secondary uppercase bg-bg-subtle/50">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Program</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Aging</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-brand">
                  {payables.map(t => {
                    const aging = getAgingCategory(t.transaction_date);
                    const isOverdue = aging.includes('Overdue');
                    return (
                      <tr key={t.id} className="hover:bg-bg-subtle/50 transition-colors">
                        <td className="px-4 py-4 text-text-secondary">{t.transaction_date}</td>
                        <td className="px-4 py-4 text-text-secondary">
                          {t.programs?.program_name || 'General Expense'}
                        </td>
                        <td className="px-4 py-4 font-medium">{formatLKR(Number(t.amount))}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isOverdue ? 'bg-rose-500/10 text-rose-500' : 
                            aging.includes('16-30') ? 'bg-amber-500/10 text-amber-500' : 
                            'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            {aging}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={!canWrite || isPending}
                            onClick={() => settleTransaction(t.id)}
                            className="border-accent text-accent hover:bg-accent hover:text-bg-brand"
                          >
                            Mark Paid
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="text-center py-12 text-text-secondary bg-bg-subtle/30 rounded-lg border border-dashed border-border-brand">
               <p>No open payables found.</p>
               <p className="text-sm mt-1">All outgoing expenses are paid.</p>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
