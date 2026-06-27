'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FinanceService } from '@/services/finance.service';
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
import { 
  PlusCircle, 
  TrendingDown, 
  TrendingUp, 
  Filter, 
  PieChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { NewTransactionModal } from '@/components/finance/NewTransactionModal';

export default function FinancePage() {
  const [showModal, setShowModal] = useState(false);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => FinanceService.getTransactions()
  });

  const { data: summary } = useQuery({
    queryKey: ['financeSummary'],
    queryFn: FinanceService.getSummary
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Financial Management</h1>
          <p className="text-slate-400">Track income, expenses, and manage receivables across all programs.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" /> New Transaction
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Cash Liquidity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">${summary?.cash_available.toLocaleString() || '0'}</div>
            <p className="text-xs text-slate-500 mt-1">Settled & available</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Receivables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">${summary?.receivables.toLocaleString() || '0'}</div>
            <p className="text-xs text-slate-500 mt-1">Pending collection</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Monthly Burn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-400">${summary?.monthly_expenses.toLocaleString() || '0'}</div>
            <p className="text-xs text-slate-500 mt-1">Average overhead</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white text-xl">Recent Transactions</CardTitle>
            <CardDescription>Comprehensive log of all financial movements.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-slate-800 h-9">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" size="sm" className="border-slate-800 h-9">
              <PieChart className="mr-2 h-4 w-4" /> Analytics
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full bg-slate-800" />
              <Skeleton className="h-12 w-full bg-slate-800" />
              <Skeleton className="h-12 w-full bg-slate-800" />
            </div>
          ) : (
            <div className="rounded-md border border-slate-800 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-950">
                  <TableRow className="hover:bg-transparent border-slate-800">
                    <TableHead className="text-slate-300">Date</TableHead>
                    <TableHead className="text-slate-300">Program</TableHead>
                    <TableHead className="text-slate-300">Type</TableHead>
                    <TableHead className="text-slate-300 text-right">Amount</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">No transactions recorded</TableCell>
                    </TableRow>
                  ) : (
                    transactions?.map((tx) => (
                      <TableRow key={tx.id} className="border-slate-800 hover:bg-slate-800/40">
                        <TableCell className="font-medium">
                          <span className="text-slate-200">{format(new Date(tx.transaction_date), 'MMM dd, yyyy')}</span>
                        </TableCell>
                        <TableCell className="text-slate-400">{tx.programs?.program_name || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 uppercase text-[10px] font-bold tracking-wider">
                            {tx.transaction_type === 'Income' ? (
                              <><TrendingUp className="text-emerald-400 h-3 w-3" /> Income</>
                            ) : (
                              <><TrendingDown className="text-rose-400 h-3 w-3" /> Expense</>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className={tx.transaction_type === 'Income' ? 'text-emerald-400 text-right font-medium' : 'text-slate-100 text-right font-medium'}>
                          {tx.transaction_type === 'Income' ? '+' : '-'}${tx.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {tx.status === 'Receivable' ? (
                            <Badge variant="outline" className="text-amber-400 border-amber-400/30 bg-amber-400/10">Receivable</Badge>
                          ) : (
                            <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 bg-emerald-400/10">Settled</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Receivable Aging</CardTitle>
            <CardDescription>Breakdown of pending income by duration.</CardDescription>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center text-slate-600 italic">
            Chart placeholder: Aging breakdown
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Program Allocations</CardTitle>
            <CardDescription>Distribution of expenses across active programs.</CardDescription>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center text-slate-600 italic">
            Chart placeholder: Allocation distribution
          </CardContent>
        </Card>
      </div>

      <NewTransactionModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}