'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FinanceService } from '@/services/finance.service';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

interface NewTransactionModalProps {
  open: boolean;
  onClose: () => void;
}

const EMPTY_FORM = {
  transaction_date: new Date().toISOString().split('T')[0],
  amount: '',
  transaction_type: '' as 'Income' | 'Expense' | '',
  status: '' as 'Cash' | 'Receivable' | '',
  program_id: null as number | null,
};

export function NewTransactionModal({ open, onClose }: NewTransactionModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const { data: programs } = useQuery({
    queryKey: ['programs'],
    queryFn: FinanceService.getPrograms,
  });

  const { mutate: createTransaction, isPending } = useMutation({
    mutationFn: FinanceService.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financeSummary'] });
      handleClose();
    },
    onError: (err: any) => {
      setError(err?.response?.data?.detail || 'Failed to record transaction. Please try again.');
    },
  });

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setError(null);
    onClose();
  };

  const handleSubmit = () => {
    setError(null);

    if (!form.transaction_date || !form.amount || !form.transaction_type || !form.status) {
      setError('All fields except Program are required.');
      return;
    }

    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    createTransaction({
      transaction_date: form.transaction_date,
      amount,
      transaction_type: form.transaction_type as 'Income' | 'Expense',
      status: form.status as 'Cash' | 'Receivable',
      program_id: form.program_id,
    } as any);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="bg-surface border border-border-brand text-text-primary sm:max-w-md rounded-card shadow-card p-6">
        <DialogHeader className="p-0 pb-4">
          <DialogTitle className="text-lg font-bold font-heading text-text-primary">Record Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Transaction Type Toggle */}
          <div className="space-y-1.5">
            <Label className="text-text-secondary text-xs uppercase tracking-wider font-semibold">Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['Income', 'Expense'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setForm((f) => ({ ...f, transaction_type: type }))}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-semibold transition-all ${
                    form.transaction_type === type
                      ? type === 'Income'
                        ? 'bg-green-500/10 border-green-500/30 text-positive shadow-[0_0_8px_rgba(34,197,94,0.15)]'
                        : 'bg-red-500/10 border-red-500/30 text-negative shadow-[0_0_8px_rgba(239,68,68,0.15)]'
                      : 'border-border-brand text-text-secondary hover:border-accent/40 bg-bg-subtle'
                  }`}
                >
                  {type === 'Income' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label className="text-text-secondary text-xs uppercase tracking-wider font-semibold">Amount (LKR)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">Rs.</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="pl-9 bg-bg-subtle border border-border-brand text-text-primary placeholder:text-text-muted focus:border-accent text-xs rounded-lg h-10"
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label className="text-text-secondary text-xs uppercase tracking-wider font-semibold">Date</Label>
            <Input
              type="date"
              value={form.transaction_date}
              onChange={(e) => setForm((f) => ({ ...f, transaction_date: e.target.value }))}
              className="bg-bg-subtle border border-border-brand text-text-primary focus:border-accent text-xs rounded-lg h-10"
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-text-secondary text-xs uppercase tracking-wider font-semibold">Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm((f) => ({ ...f, status: v as 'Cash' | 'Receivable' }))}
            >
              <SelectTrigger className="bg-bg-subtle border border-border-brand text-text-primary focus:border-accent text-xs rounded-lg h-10">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-surface border border-border-brand text-text-primary rounded-lg">
                <SelectItem value="Cash" className="text-text-primary focus:bg-bg-subtle focus:text-accent">Cash</SelectItem>
                <SelectItem value="Receivable" className="text-text-primary focus:bg-bg-subtle focus:text-accent">Receivable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Program (optional) */}
          <div className="space-y-1.5">
            <Label className="text-text-secondary text-xs uppercase tracking-wider font-semibold">
              Program <span className="text-text-muted normal-case font-normal">(optional)</span>
            </Label>
            <Select
              value={form.program_id?.toString() ?? 'none'}
              onValueChange={(v) =>
                setForm((f) => ({
                  ...f,
                  program_id: v === null || v === 'none' ? null : parseInt(v),
                }))
              }
            >
              <SelectTrigger className="bg-bg-subtle border border-border-brand text-text-primary focus:border-accent text-xs rounded-lg h-10">
                <SelectValue placeholder="No program" />
              </SelectTrigger>
              <SelectContent className="bg-surface border border-border-brand text-text-primary rounded-lg">
                <SelectItem value="none" className="text-text-muted focus:bg-bg-subtle">No program</SelectItem>
                {programs?.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()} className="text-text-primary focus:bg-bg-subtle focus:text-accent">
                    {p.program_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Error */}
          {error && (
            <p className="text-negative text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-border-brand text-text-primary hover:bg-bg-subtle text-xs rounded-lg h-10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-accent hover:bg-accent/80 text-white font-semibold text-xs rounded-lg h-10 min-w-[120px] shadow-sm"
          >
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              'Record transaction'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}