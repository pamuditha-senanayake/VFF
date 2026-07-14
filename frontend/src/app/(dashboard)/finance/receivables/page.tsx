'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useTransactions, useSettleTransaction } from '@/hooks/useFinance';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { differenceInDays, parseISO } from 'date-fns';

export default function ReceivablesPage() {
  const { hasPermission } = useAuthStore();
  const canWrite = hasPermission('finance:write');
  
  const { data: transactions, isLoading } = useTransactions();
  const { mutate: settleTransaction, isPending } = useSettleTransaction();
  
  const receivables = transactions?.filter(t => t.transaction_type === 'Income' && t.status === 'Receivable') || [];
  
  const getAgingCategory = (dateStr: string) => {
    const days = differenceInDays(new Date(), parseISO(dateStr));
    if (days <= 30) return '0-30 Days';
    if (days <= 60) return '31-60 Days';
    return 'Overdue (61+ Days)';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading text-text-primary">Accounts Receivable</h1>
      </div>

      <Card className="bg-surface border-border-brand">
        <CardHeader>
          <CardTitle>Open Receivables</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="space-y-4">
               {[1, 2, 3].map(i => <Skeleton key={i} className="w-full h-12" />)}
             </div>
          ) : receivables.length > 0 ? (
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
                  {receivables.map(t => {
                    const aging = getAgingCategory(t.transaction_date);
                    const isOverdue = aging.includes('Overdue');
                    return (
                      <tr key={t.id} className="hover:bg-bg-subtle/50 transition-colors">
                        <td className="px-4 py-4 text-text-secondary">{t.transaction_date}</td>
                        <td className="px-4 py-4 text-text-secondary">
                          {t.programs?.program_name || 'General Income'}
                        </td>
                        <td className="px-4 py-4 font-medium">LKR {Number(t.amount).toLocaleString()}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isOverdue ? 'bg-rose-500/10 text-rose-500' : 
                            aging.includes('31-60') ? 'bg-amber-500/10 text-amber-500' : 
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
                            className="border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                          >
                            Mark Settled
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
               <p>No open receivables found.</p>
               <p className="text-sm mt-1">All incoming payments are settled.</p>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
