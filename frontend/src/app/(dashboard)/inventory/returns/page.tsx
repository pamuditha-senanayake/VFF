'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { hasPermission } from '@/lib/permissions';
import { useInventoryItems, useCreateInventoryTransaction } from '@/hooks/useInventory';
import { usePrograms } from '@/hooks/useFinance';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function ReturnInventoryPage() {
  const { user } = useAuthStore();
  const canWrite = hasPermission(user?.role as string, 'inventory:issue');
  
  const { data: items } = useInventoryItems();
  const { data: programs } = usePrograms();
  const { mutate: createTransaction, isPending } = useCreateInventoryTransaction();
  
  const [itemId, setItemId] = useState<string>('');
  const [programId, setProgramId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!itemId || !quantity) {
      setError('Please fill in item and quantity.');
      return;
    }
    
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError('Quantity must be a positive number.');
      return;
    }
    
    createTransaction({
      item_id: Number(itemId),
      program_id: programId ? Number(programId) : null,
      quantity: qty,
      transaction_type: 'Return',
      transaction_date: format(new Date(), 'yyyy-MM-dd')
    }, {
      onSuccess: () => {
        setSuccess('Items returned to stock successfully.');
        setItemId('');
        setProgramId('');
        setQuantity('');
      },
      onError: (e: any) => {
        setError(e.message || 'Failed to return items.');
      }
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading text-text-primary">Return Inventory</h1>
      </div>

      <Card className="bg-surface border-border-brand">
        <CardHeader>
          <CardTitle>New Return</CardTitle>
        </CardHeader>
        <CardContent>
          {!canWrite ? (
            <div className="text-sm text-amber-500 bg-amber-500/10 p-3 rounded border border-amber-500/20">
              You do not have permission to return inventory.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-sm text-rose-500 bg-rose-500/10 p-3 rounded border border-rose-500/20">{error}</div>}
              {success && <div className="text-sm text-emerald-500 bg-emerald-500/10 p-3 rounded border border-emerald-500/20">{success}</div>}
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Item to Return</label>
                <select 
                  value={itemId} 
                  onChange={e => setItemId(e.target.value)}
                  className="w-full bg-bg-subtle border border-border-brand rounded p-2 text-text-primary outline-none focus:border-accent transition-colors"
                >
                  <option value="">-- Select Item --</option>
                  {items?.map(i => (
                    <option key={i.id} value={i.id}>{i.item_name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Returned From Program (Optional)</label>
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

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Quantity</label>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  placeholder="0"
                  className="w-full bg-bg-subtle border border-border-brand rounded p-2 text-text-primary outline-none focus:border-accent transition-colors"
                />
              </div>

              <Button type="submit" disabled={isPending} className="w-full bg-accent text-bg-brand hover:bg-accent/90">
                {isPending ? 'Processing...' : 'Confirm Return'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
