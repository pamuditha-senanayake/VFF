'use client';

import { useInventoryItems, useInventoryTransactions } from '@/hooks/useInventory';
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

export default function InventoryPage() {
  const { data: items, isLoading: loadingItems } = useInventoryItems();
  const { data: transactions, isLoading: loadingTransactions } = useInventoryTransactions();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Inventory System</h1>
          <p className="text-slate-400">Manage medical supplies, equipment, and resource allocations.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="border-slate-800">
             <Plus className="mr-2 h-4 w-4" /> Add Item
           </Button>
           <Button className="bg-blue-600 hover:bg-blue-700">
             <Package className="mr-2 h-4 w-4" /> Issue/Return
           </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
          {loadingItems ? (
             Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 bg-slate-900 border border-slate-800 rounded-xl" />)
          ) : (
            items?.slice(0, 4).map(item => (
              <Card key={item.id} className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">{item.item_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{item.current_stock}</div>
                  <p className="text-xs text-slate-500 mt-1">Unit Cost: ${item.unit_cost}</p>
                </CardContent>
              </Card>
            ))
          )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Detailed Stock List</CardTitle>
              <CardDescription>Current availability and unit costs.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400">
              <Filter size={18} />
            </Button>
          </CardHeader>
          <CardContent>
            {loadingItems ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full bg-slate-800" />
                <Skeleton className="h-10 w-full bg-slate-800" />
              </div>
            ) : (
              <div className="rounded-md border border-slate-800 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-950">
                    <TableRow className="hover:bg-transparent border-slate-800">
                      <TableHead className="text-slate-300">Item Name</TableHead>
                      <TableHead className="text-slate-300">Stock</TableHead>
                      <TableHead className="text-slate-300">Unit Cost</TableHead>
                      <TableHead className="text-slate-300">Total Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items?.map((item) => (
                      <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/40">
                        <TableCell className="font-medium">{item.item_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={item.current_stock < 10 ? 'text-rose-400 border-rose-400/30 bg-rose-400/10' : 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'}>
                            {item.current_stock}
                          </Badge>
                        </TableCell>
                        <TableCell>${item.unit_cost}</TableCell>
                        <TableCell className="text-slate-400">${(item.current_stock * item.unit_cost).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Movements</CardTitle>
            <CardDescription>Last 10 issue/return logs.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingTransactions ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full bg-slate-800" />
                <Skeleton className="h-12 w-full bg-slate-800" />
              </div>
            ) : (
              <div className="space-y-4">
                {transactions?.slice(0, 10).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${tx.transaction_type === 'Issue' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {tx.transaction_type === 'Issue' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{tx.inventory_items?.item_name}</p>
                        <p className="text-xs text-slate-500">{format(new Date(tx.transaction_date), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-sm font-bold ${tx.transaction_type === 'Issue' ? 'text-rose-400' : 'text-emerald-400'}`}>
                         {tx.transaction_type === 'Issue' ? '-' : '+'}{tx.quantity}
                       </p>
                       <p className="text-[10px] text-slate-600 uppercase font-bold tracking-tighter">{tx.programs?.program_name || 'Stock'}</p>
                    </div>
                  </div>
                ))}
                {transactions?.length === 0 && <p className="text-center py-8 text-slate-600 text-sm">No recent movements</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
