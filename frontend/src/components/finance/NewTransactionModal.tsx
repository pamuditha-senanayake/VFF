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
      <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Record Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Transaction Type Toggle */}
          <div className="space-y-1.5">
            <Label className="text-slate-400 text-xs uppercase tracking-wider">Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['Income', 'Expense'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setForm((f) => ({ ...f, transaction_type: type }))}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-md border text-sm font-medium transition-colors ${
                    form.transaction_type === type
                      ? type === 'Income'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                        : 'bg-rose-500/15 border-rose-500 text-rose-400'
                      : 'border-slate-700 text-slate-400 hover:border-slate-500'
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
            <Label className="text-slate-400 text-xs uppercase tracking-wider">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="pl-7 bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label className="text-slate-400 text-xs uppercase tracking-wider">Date</Label>
            <Input
              type="date"
              value={form.transaction_date}
              onChange={(e) => setForm((f) => ({ ...f, transaction_date: e.target.value }))}
              className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-slate-400 text-xs uppercase tracking-wider">Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm((f) => ({ ...f, status: v as 'Cash' | 'Receivable' }))}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-blue-500">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="Cash" className="text-white focus:bg-slate-700">Cash</SelectItem>
                <SelectItem value="Receivable" className="text-white focus:bg-slate-700">Receivable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Program (optional) */}
          <div className="space-y-1.5">
            <Label className="text-slate-400 text-xs uppercase tracking-wider">
              Program <span className="text-slate-600 normal-case">(optional)</span>
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
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-blue-500">
                <SelectValue placeholder="No program" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="none" className="text-slate-400 focus:bg-slate-700">No program</SelectItem>
                {programs?.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()} className="text-white focus:bg-slate-700">
                    {p.program_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Error */}
          {error && (
            <p className="text-rose-400 text-sm bg-rose-400/10 border border-rose-400/20 rounded-md px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
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