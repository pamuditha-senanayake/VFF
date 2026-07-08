'use client';

import { useInventoryItems, useInventoryTransactions, useCreateInventoryTransaction, useCreateInventoryItem } from '@/hooks/useInventory';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Package, ArrowUpRight, ArrowDownLeft, Filter, Plus } from 'lucide-react';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { FinanceService } from '@/services/finance.service';

export default function InventoryPage() {
  const { data: items, isLoading: loadingItems } = useInventoryItems();
  const { data: transactions, isLoading: loadingTransactions } = useInventoryTransactions();
  
  const createItem = useCreateInventoryItem();
  const createTransaction = useCreateInventoryTransaction();

  // Fetch programs for issue/return select list
  const { data: programs } = useQuery({
    queryKey: ['programs'],
    queryFn: FinanceService.getPrograms
  });

  const handleAddItem = () => {
    Swal.fire({
      title: 'Add Inventory Item',
      html: `
        <div style="display: flex; flex-direction: column; gap: 12px; text-align: left; font-family: sans-serif;">
          <div>
            <label style="font-size: 10px; font-weight: bold; color: #9CA3AF; uppercase; tracking-wider;">ITEM NAME</label>
            <input id="swal-iname" style="width: 100%; margin-top: 4px; box-sizing: border-box; font-size: 12px; height: 38px; background: #14161C; color: #F9FAFB; border: 1px solid #232730; border-radius: 8px; padding: 0 10px;" placeholder="e.g. Rabies Vaccine Vials">
          </div>
          <div>
            <label style="font-size: 10px; font-weight: bold; color: #9CA3AF; uppercase; tracking-wider;">INITIAL STOCK</label>
            <input id="swal-istock" type="number" style="width: 100%; margin-top: 4px; box-sizing: border-box; font-size: 12px; height: 38px; background: #14161C; color: #F9FAFB; border: 1px solid #232730; border-radius: 8px; padding: 0 10px;" placeholder="100">
          </div>
          <div>
            <label style="font-size: 10px; font-weight: bold; color: #9CA3AF; uppercase; tracking-wider;">UNIT COST (LKR)</label>
            <input id="swal-icost" type="number" style="width: 100%; margin-top: 4px; box-sizing: border-box; font-size: 12px; height: 38px; background: #14161C; color: #F9FAFB; border: 1px solid #232730; border-radius: 8px; padding: 0 10px;" placeholder="1500">
          </div>
        </div>
      `,
      background: '#0F1520',
      color: '#F9FAFB',
      showCancelButton: true,
      confirmButtonText: 'Add Item',
      confirmButtonColor: '#EF9F27',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#232730',
      preConfirm: () => {
        const name = (document.getElementById('swal-iname') as HTMLInputElement).value.trim();
        const stock = (document.getElementById('swal-istock') as HTMLInputElement).value.trim();
        const cost = (document.getElementById('swal-icost') as HTMLInputElement).value.trim();

        if (!name || !stock || !cost) {
          Swal.showValidationMessage('All item fields are required');
          return false;
        }

        const stockVal = parseInt(stock);
        const costVal = parseFloat(cost);

        if (isNaN(stockVal) || stockVal < 0) {
          Swal.showValidationMessage('Stock must be a non-negative integer');
          return false;
        }
        if (isNaN(costVal) || costVal <= 0) {
          Swal.showValidationMessage('Unit cost must be a positive number');
          return false;
        }

        return { item_name: name, current_stock: stockVal, unit_cost: costVal };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        createItem.mutate(result.value, {
          onSuccess: () => toast.success('Inventory item added successfully!')
        });
      }
    });
  };

  const handleIssueReturn = () => {
    if (!items || items.length === 0) {
      toast.error('No inventory items available to issue or return');
      return;
    }

    const itemsOptions = items.map(item => `<option value="${item.id}">${item.item_name} (Current: ${item.current_stock})</option>`).join('');
    const programsOptions = (programs || []).map(p => `<option value="${p.id}">${p.program_name}</option>`).join('');

    Swal.fire({
      title: 'Issue / Return Supplies',
      html: `
        <div style="display: flex; flex-direction: column; gap: 12px; text-align: left; font-family: sans-serif;">
          <div>
            <label style="font-size: 10px; font-weight: bold; color: #9CA3AF; uppercase; tracking-wider;">SELECT ITEM</label>
            <select id="swal-txitem" style="width: 100%; margin-top: 4px; box-sizing: border-box; font-size: 12px; height: 38px; background: #14161C; color: #F9FAFB; border: 1px solid #232730; border-radius: 8px; padding: 0 10px;">
              ${itemsOptions}
            </select>
          </div>
          <div>
            <label style="font-size: 10px; font-weight: bold; color: #9CA3AF; uppercase; tracking-wider;">TRANSACTION TYPE</label>
            <select id="swal-txtype" style="width: 100%; margin-top: 4px; box-sizing: border-box; font-size: 12px; height: 38px; background: #14161C; color: #F9FAFB; border: 1px solid #232730; border-radius: 8px; padding: 0 10px;">
              <option value="Issue">Issue (Decrement)</option>
              <option value="Return">Return (Increment)</option>
            </select>
          </div>
          <div>
            <label style="font-size: 10px; font-weight: bold; color: #9CA3AF; uppercase; tracking-wider;">QUANTITY</label>
            <input id="swal-txqty" type="number" style="width: 100%; margin-top: 4px; box-sizing: border-box; font-size: 12px; height: 38px; background: #14161C; color: #F9FAFB; border: 1px solid #232730; border-radius: 8px; padding: 0 10px;" placeholder="10">
          </div>
          <div>
            <label style="font-size: 10px; font-weight: bold; color: #9CA3AF; uppercase; tracking-wider;">PROGRAM / PROJECT</label>
            <select id="swal-txprogram" style="width: 100%; margin-top: 4px; box-sizing: border-box; font-size: 12px; height: 38px; background: #14161C; color: #F9FAFB; border: 1px solid #232730; border-radius: 8px; padding: 0 10px;">
              <option value="none">Stock Adjustment (No Program)</option>
              ${programsOptions}
            </select>
          </div>
        </div>
      `,
      background: '#0F1520',
      color: '#F9FAFB',
      showCancelButton: true,
      confirmButtonText: 'Record Log',
      confirmButtonColor: '#EF9F27',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#232730',
      preConfirm: () => {
        const itemIdStr = (document.getElementById('swal-txitem') as HTMLSelectElement).value;
        const txType = (document.getElementById('swal-txtype') as HTMLSelectElement).value;
        const qtyStr = (document.getElementById('swal-txqty') as HTMLInputElement).value.trim();
        const progIdStr = (document.getElementById('swal-txprogram') as HTMLSelectElement).value;

        if (!itemIdStr || !txType || !qtyStr) {
          Swal.showValidationMessage('Item type, type, and quantity are required');
          return false;
        }

        const qtyVal = parseInt(qtyStr);
        if (isNaN(qtyVal) || qtyVal <= 0) {
          Swal.showValidationMessage('Quantity must be a positive integer');
          return false;
        }

        const itemId = parseInt(itemIdStr);
        const selectedItem = items.find(i => i.id === itemId);
        if (txType === 'Issue' && selectedItem && selectedItem.current_stock < qtyVal) {
          Swal.showValidationMessage(`Insufficient stock. Current stock is ${selectedItem.current_stock}`);
          return false;
        }

        return {
          item_id: itemId,
          transaction_type: txType as 'Issue' | 'Return',
          quantity: qtyVal,
          program_id: progIdStr === 'none' ? null : parseInt(progIdStr),
          transaction_date: new Date().toISOString()
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        createTransaction.mutate(result.value, {
          onSuccess: () => toast.success('Inventory movement logged successfully!')
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight mb-2 text-text-primary">
            Inventory System
          </h1>
          <p className="text-text-secondary text-sm">
            Manage medical supplies, equipment, and resource allocations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleAddItem}
            variant="outline" 
            className="border-border-brand text-text-primary hover:bg-bg-subtle text-xs rounded-lg"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
          <Button 
            onClick={handleIssueReturn}
            className="bg-accent hover:bg-accent/80 text-white font-semibold text-xs rounded-lg shadow-sm"
          >
            <Package className="mr-2 h-4 w-4" /> Issue/Return
          </Button>
        </div>
      </div>

      {/* Overview KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loadingItems ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 bg-bg-subtle border border-border-brand rounded-card" />)
        ) : (
          items?.slice(0, 4).map(item => (
            <Card key={item.id} className="bg-surface border border-border-brand rounded-card shadow-card p-5">
              <CardHeader className="pb-2 p-0">
                <CardTitle className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{item.item_name}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-2">
                <div className="text-2xl font-bold font-mono text-text-primary">{item.current_stock}</div>
                <p className="text-xs text-text-muted mt-1 font-mono">Unit Cost: ${item.unit_cost}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Stock list & Movements */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Stock List Card */}
        <Card className="lg:col-span-2 bg-surface border border-border-brand rounded-card shadow-card p-5">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
            <div>
              <CardTitle className="text-base font-semibold font-heading text-text-primary">Detailed Stock List</CardTitle>
              <CardDescription className="text-text-secondary text-xs mt-1">Current availability and unit costs.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="text-text-secondary hover:text-text-primary hover:bg-bg-subtle">
              <Filter size={18} />
            </Button>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            {loadingItems ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full bg-bg-subtle" />
                <Skeleton className="h-10 w-full bg-bg-subtle" />
              </div>
            ) : (
              <div className="rounded-xl border border-border-brand overflow-hidden">
                <Table>
                  <TableHeader className="bg-bg-subtle">
                    <TableRow className="hover:bg-transparent border-border-brand">
                      <TableHead className="text-text-secondary font-heading text-xs">Item Name</TableHead>
                      <TableHead className="text-text-secondary font-heading text-xs">Stock</TableHead>
                      <TableHead className="text-text-secondary font-heading text-xs">Unit Cost</TableHead>
                      <TableHead className="text-text-secondary font-heading text-xs">Total Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items?.map((item) => (
                      <TableRow key={item.id} className="border-border-brand hover:bg-[#14161C]/40 transition-colors">
                        <TableCell className="font-semibold text-text-primary text-xs">{item.item_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            item.current_stock < 10 
                              ? 'text-negative border border-red-500/20 bg-red-500/5 rounded-full px-2 py-0.5 text-[10px]' 
                              : 'text-positive border border-green-500/20 bg-green-500/5 rounded-full px-2 py-0.5 text-[10px]'
                          }>
                            {item.current_stock}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-text-primary font-semibold">LKR {item.unit_cost}</TableCell>
                        <TableCell className="text-text-secondary font-mono text-xs">LKR {(item.current_stock * item.unit_cost).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Movements Card */}
        <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base font-semibold font-heading text-text-primary">Recent Movements</CardTitle>
            <CardDescription className="text-text-secondary text-xs mt-1">Last 10 issue/return logs.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            {loadingTransactions ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full bg-bg-subtle" />
                <Skeleton className="h-12 w-full bg-bg-subtle" />
              </div>
            ) : (
              <div className="space-y-4">
                {transactions?.slice(0, 10).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-bg-subtle border border-border-brand hover:border-accent/20 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${tx.transaction_type === 'Issue' ? 'bg-red-500/10 text-negative' : 'bg-green-500/10 text-positive'}`}>
                        {tx.transaction_type === 'Issue' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-primary">{tx.inventory_items?.item_name}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">{format(new Date(tx.transaction_date), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-xs font-bold font-mono ${tx.transaction_type === 'Issue' ? 'text-negative' : 'text-positive'}`}>
                         {tx.transaction_type === 'Issue' ? '-' : '+'}{tx.quantity}
                       </p>
                       <p className="text-[9px] text-text-secondary uppercase font-bold tracking-wider mt-0.5">{tx.programs?.program_name || 'Stock'}</p>
                    </div>
                  </div>
                ))}
                {transactions?.length === 0 && <p className="text-center py-8 text-text-muted text-xs italic">No recent movements</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
