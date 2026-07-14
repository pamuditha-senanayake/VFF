'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTransactions, useCreateTransaction, usePrograms } from '@/hooks/useFinance';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { formatLKR } from '@/lib/formatters';
import { hasPermission } from '@/lib/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function LedgerPage() {
  const { user } = useAuthStore();
  const canWrite = hasPermission(user?.role as string, 'finance:write');
  
  const { data: transactions, isLoading } = useTransactions();
  const { data: programs, isLoading: isProgramsLoading } = usePrograms();
  const { mutate: createTransaction, isPending } = useCreateTransaction();
  
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'Income' | 'Expense'>('Income');
  const [status, setStatus] = useState<'Cash' | 'Receivable'>('Cash');
  const [programId, setProgramId] = useState<string>('');
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState('');

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    
    setConfirmOpen(true);
  };
  
  const handleSubmit = () => {
    createTransaction({
      amount: Number(amount),
      transaction_type: type,
      status: status,
      program_id: programId ? Number(programId) : null,
      transaction_date: format(new Date(), 'yyyy-MM-dd')
    }, {
      onSuccess: () => {
        setConfirmOpen(false);
        setAmount('');
        setProgramId('');
      },
      onError: (e: any) => {
        setError(e.message || 'Failed to create transaction');
        setConfirmOpen(false);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading text-text-primary">General Ledger</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-surface border-border-brand h-fit">
          <CardHeader>
            <CardTitle>New Entry</CardTitle>
          </CardHeader>
          <CardContent>
            {!canWrite ? (
              <div className="text-sm text-amber-500 bg-amber-500/10 p-3 rounded border border-amber-500/20">
                You do not have permission to add ledger entries.
              </div>
            ) : (
              <form onSubmit={handlePreview} className="space-y-4">
                {error && <div className="text-sm text-rose-500">{error}</div>}
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Type</label>
                  <select 
                    value={type} 
                    onChange={e => setType(e.target.value as any)}
                    className="w-full bg-bg-subtle border border-border-brand rounded p-2 text-text-primary outline-none focus:border-accent transition-colors"
                  >
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Amount (LKR)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-bg-subtle border border-border-brand rounded p-2 text-text-primary outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
                  <select 
                    value={status} 
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-bg-subtle border border-border-brand rounded p-2 text-text-primary outline-none focus:border-accent transition-colors"
                  >
                    <option value="Cash">Cash (Settled)</option>
                    <option value="Receivable">{type === 'Income' ? 'Receivable (Pending)' : 'Payable (Pending)'}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Program (Optional)</label>
                  <select 
                    value={programId} 
                    onChange={e => setProgramId(e.target.value)}
                    className="w-full bg-bg-subtle border border-border-brand rounded p-2 text-text-primary outline-none focus:border-accent transition-colors"
                  >
                    <option value="">-- None --</option>
                    {programs?.map(p => (
                      <option key={p.id} value={p.id}>{p.program_name}</option>
                    ))}
                  </select>
                </div>

                <Button type="submit" className="w-full bg-accent text-bg-brand hover:bg-accent/90">
                  Preview Entry
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-surface border-border-brand">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="w-full h-12" />)}
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-text-secondary uppercase bg-bg-subtle/50">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Program</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-brand">
                    {transactions.map(t => (
                      <tr key={t.id} className="hover:bg-bg-subtle/50 transition-colors">
                        <td className="px-4 py-3 text-text-secondary">{t.transaction_date}</td>
                        <td className="px-4 py-3">
                          <span className={t.transaction_type === 'Income' ? 'text-emerald-500' : 'text-rose-500'}>
                            {t.transaction_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">{formatLKR(Number(t.amount))}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            t.status === 'Cash' ? 'bg-emerald-500/10 text-emerald-500' :
                            t.status === 'Voided' ? 'bg-rose-500/10 text-rose-500' :
                            'bg-amber-500/10 text-amber-500'
                          }`}>
                            {t.status === 'Receivable' ? (t.transaction_type === 'Income' ? 'Receivable' : 'Payable') : t.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {t.programs?.program_name || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-text-secondary">No transactions found.</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-surface border-border-brand">
          <DialogHeader>
            <DialogTitle>Confirm Ledger Entry</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3 text-sm">
            <div className="flex justify-between border-b border-border-brand pb-2">
              <span className="text-text-secondary">Type</span>
              <span className="font-medium text-text-primary">{type}</span>
            </div>
            <div className="flex justify-between border-b border-border-brand pb-2">
              <span className="text-text-secondary">Amount</span>
              <span className="font-medium text-text-primary">{formatLKR(Number(amount))}</span>
            </div>
            <div className="flex justify-between border-b border-border-brand pb-2">
              <span className="text-text-secondary">Status</span>
              <span className="font-medium text-text-primary">{status === 'Cash' ? 'Settled (Cash)' : 'Pending'}</span>
            </div>
            {programId && programs?.find(p => p.id === Number(programId)) && (
              <div className="flex justify-between border-b border-border-brand pb-2">
                <span className="text-text-secondary">Program</span>
                <span className="font-medium text-text-primary">{programs.find(p => p.id === Number(programId))?.program_name}</span>
              </div>
            )}
            <div className="mt-4 p-3 bg-amber-500/10 text-amber-500 rounded text-xs border border-amber-500/20">
              Please ensure these details are correct. Editing a posted transaction requires administrator override.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending} className="bg-accent text-bg-brand hover:bg-accent/90">
              {isPending ? 'Posting...' : 'Confirm & Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
