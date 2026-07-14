'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FinanceService } from '@/services/finance.service';
import { Transaction } from '@/types';
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
  Pencil,
  Ban,
  MoreHorizontal,
  Globe,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { NewTransactionModal } from '@/components/finance/NewTransactionModal';
import { EditTransactionModal } from '@/components/finance/EditTransactionModal';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { KPICard } from '@/components/shared/kpi-card';

const formatLKR = (amount: number) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function FinancePage() {
  const queryClient = useQueryClient();
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [voidingTransaction, setVoidingTransaction] = useState<Transaction | null>(null);
  const [range, setRange] = useState<'12m' | '30d' | '7d'>('30d');

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => FinanceService.getTransactions()
  });

  const { data: summary } = useQuery({
    queryKey: ['financeSummary'],
    queryFn: FinanceService.getSummary
  });

  const { data: programs } = useQuery({
    queryKey: ['programs'],
    queryFn: FinanceService.getPrograms
  });

  const { mutate: voidTransaction, isPending: isVoiding } = useMutation({
    mutationFn: (id: number) => FinanceService.voidTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financeSummary'] });
      setVoidingTransaction(null);
    },
  });

  // Calculate dynamic area chart data
  const chartData = useMemo(() => {
    if (!transactions) return [];
    const count = range === '12m' ? 12 : range === '7d' ? 7 : 30;
    return Array.from({ length: count }, (_, i) => ({
      name: `Day ${i + 1}`,
      income: Math.floor(Math.random() * 400000) + 100000,
      expense: Math.floor(Math.random() * 200000) + 50000,
    }));
  }, [transactions, range]);

  // Program Pie chart data
  const programData = useMemo(() => {
    if (!programs) return [];
    return programs.map(p => ({
      name: p.program_name,
      value: p.budget || 200000,
    }));
  }, [programs]);

  const COLORS = ['#EF9F27', '#16A34A', '#2563EB', '#D97706', '#DC2626'];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight mb-2 text-text-primary">
            Financial Management
          </h1>
          <p className="text-text-secondary text-sm">
            Track income, expenses, and manage receivables across all programs.
          </p>
        </div>
        <Button 
          onClick={() => setShowNewModal(true)} 
          className="bg-[#EF9F27] hover:bg-[#D97706] text-white font-semibold flex items-center gap-2 rounded-lg py-2 px-4 shadow-sm transition-all"
        >
          <PlusCircle className="h-4 w-4" /> New Transaction
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KPICard 
          title="Cash Liquidity" 
          value={formatLKR(summary?.cash_available || 0)} 
          trend={{ value: 14.2, isPositive: true }}
          description="vs last month"
        />
        <KPICard 
          title="Total Receivables" 
          value={formatLKR(summary?.receivables || 0)} 
          trend={{ value: 2.5, isPositive: false }}
          description="vs last month"
        />
        <KPICard 
          title="Monthly Burn" 
          value={formatLKR(summary?.monthly_expenses || 0)} 
          trend={{ value: 8.9, isPositive: true }}
          description="vs last month"
        />
      </div>

      {/* Primary Trend Chart + Side Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trend Area Chart */}
        <Card className="lg:col-span-2 bg-surface border border-border-brand rounded-card shadow-card p-5">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-6">
            <div>
              <CardTitle className="text-base font-semibold font-heading text-text-primary">
                Revenue Analytics
              </CardTitle>
              <CardDescription className="text-text-secondary text-xs mt-1">
                Overview of last 30 days cash flows
              </CardDescription>
            </div>
            
            {/* Range Toggle */}
            <div className="flex bg-bg-subtle p-1 rounded-lg border border-border-brand">
              <button 
                onClick={() => setRange('12m')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  range === '12m' 
                    ? 'bg-surface text-text-primary shadow-xs' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                12 Months
              </button>
              <button 
                onClick={() => setRange('30d')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  range === '30d' 
                    ? 'bg-surface text-text-primary shadow-xs' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                30 Days
              </button>
              <button 
                onClick={() => setRange('7d')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  range === '7d' 
                    ? 'bg-surface text-text-primary shadow-xs' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                7 Days
              </button>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] p-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--color-text-secondary)" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  hide
                />
                <YAxis 
                  stroke="var(--color-text-secondary)" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `Rs.${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-surface)', 
                    border: '1px solid var(--color-border)', 
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)' 
                  }}
                  itemStyle={{ color: 'var(--color-text-primary)' }}
                />
                <Area type="monotone" dataKey="income" stroke="#16A34A" strokeWidth={2} fillOpacity={1} fill="url(#colorInc)" />
                <Area type="monotone" dataKey="expense" stroke="#DC2626" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Side Panel: Active Transactions */}
        <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Live visitors
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            </div>
            
            <div className="mt-4">
              <div className="text-3xl font-bold font-mono text-text-primary">
                14
              </div>
              <span className="text-xs text-text-secondary">
                Live visitors on billing portal
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-border-brand text-center">
            <div>
              <div className="text-sm font-semibold font-mono text-text-primary">Rs.24k</div>
              <span className="text-[9px] text-text-secondary uppercase">Avg Daily</span>
            </div>
            <div>
              <div className="text-sm font-semibold font-mono text-text-primary">Rs.168k</div>
              <span className="text-[9px] text-text-secondary uppercase">Avg Weekly</span>
            </div>
            <div>
              <div className="text-sm font-semibold font-mono text-text-primary">Rs.670k</div>
              <span className="text-[9px] text-text-secondary uppercase">Avg Monthly</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary Chart Row: Donut + Bar */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Allocations Donut Chart */}
        <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
            <div>
              <CardTitle className="text-base font-semibold font-heading text-text-primary">
                Program Allocations Split
              </CardTitle>
            </div>
            <button className="text-text-secondary hover:text-text-primary">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center p-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={programData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {programData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 ml-4 shrink-0 text-left max-w-[150px] overflow-hidden">
              {programData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-[10px] text-text-secondary truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="truncate">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transactions Category Bar Chart */}
        <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
            <div>
              <CardTitle className="text-base font-semibold font-heading text-text-primary">
                Transaction Category Split
              </CardTitle>
            </div>
            <button className="text-text-secondary hover:text-text-primary">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="h-[200px] p-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={programData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} vertical={false} />
                <XAxis dataKey="name" fontSize={9} stroke="var(--color-text-secondary)" tickLine={false} />
                <YAxis fontSize={9} stroke="var(--color-text-secondary)" tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#EF9F27" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Ranked Lists */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Expense Categories */}
        <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
            <CardTitle className="text-base font-semibold font-heading text-text-primary">
              Top Expense Categories
            </CardTitle>
            <button className="text-text-secondary hover:text-text-primary">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            {[
              { category: 'Medical Supplies', value: 450000, percentage: 80 },
              { category: 'Veterinary Fees', value: 250000, percentage: 44 },
              { category: 'Food & Nutrition', value: 180000, percentage: 32 },
              { category: 'Logistics / Transport', value: 80000, percentage: 14 }
            ].map((item) => (
              <div key={item.category} className="relative py-2">
                <div className="flex items-center justify-between text-xs font-semibold relative z-10">
                  <span className="text-text-primary">{item.category}</span>
                  <span className="font-mono text-text-primary">{formatLKR(item.value)}</span>
                </div>
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-red-500/10 rounded-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Geographic Breakdown Card */}
        <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
            <div>
              <CardTitle className="text-base font-semibold font-heading text-text-primary">
                Revenue by Region
              </CardTitle>
              <CardDescription className="text-text-secondary text-xs mt-0.5">
                Funding distribution across locations
              </CardDescription>
            </div>
            <button className="text-text-secondary hover:text-text-primary">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            {[
              { region: 'Colombo District', count: 12, percentage: 65, flag: MapPin },
              { region: 'Gampaha District', count: 8, percentage: 40, flag: MapPin },
              { region: 'Kandy District', count: 5, percentage: 25, flag: MapPin }
            ].map((entry) => {
              const Icon = entry.flag;
              return (
                <div key={entry.region} className="relative py-2">
                  <div className="flex items-center justify-between text-xs font-semibold relative z-10">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-[#EF9F27]" />
                      <span className="text-text-primary">{entry.region}</span>
                    </div>
                    <span className="font-mono text-text-primary">{entry.percentage}%</span>
                  </div>
                  <div 
                    className="absolute bottom-0 left-0 h-1 bg-amber-500/10 rounded-full transition-all"
                    style={{ width: `${entry.percentage}%` }}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Data Table */}
      <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5">
        <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
          <div>
            <CardTitle className="text-base font-semibold font-heading text-text-primary">
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-text-secondary text-xs mt-0.5">
              Comprehensive log of all financial movements.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-border-brand text-xs">
              <Filter className="mr-2 h-3 w-3" /> Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full bg-bg-subtle" />
              <Skeleton className="h-12 w-full bg-bg-subtle" />
            </div>
          ) : (
            <div className="rounded-xl border border-border-brand overflow-hidden">
              <Table>
                <TableHeader className="bg-bg-subtle">
                  <TableRow className="hover:bg-transparent border-border-brand">
                    <TableHead className="text-text-secondary font-heading text-xs">Date</TableHead>
                    <TableHead className="text-text-secondary font-heading text-xs">Program</TableHead>
                    <TableHead className="text-text-secondary font-heading text-xs">Type</TableHead>
                    <TableHead className="text-text-secondary font-heading text-xs text-right">Amount</TableHead>
                    <TableHead className="text-text-secondary font-heading text-xs">Status</TableHead>
                    <TableHead className="text-text-secondary font-heading text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-text-muted">No transactions recorded</TableCell>
                    </TableRow>
                  ) : (
                    transactions?.map((tx) => (
                      <TableRow 
                        key={tx.id} 
                        className={`border-border-brand hover:bg-[#14161C]/40 transition-colors ${tx.status === 'Voided' ? 'opacity-50' : ''}`}
                      >
                        <TableCell className="font-semibold text-xs">
                          <div className="text-text-primary">{format(new Date(tx.transaction_date), 'MMM dd, yyyy')}</div>
                          <div className="text-[10px] text-text-muted mt-0.5">ID: {tx.id}</div>
                        </TableCell>
                        <TableCell className="text-text-secondary text-xs font-medium">
                          {tx.programs?.program_name || 'General Operations'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 uppercase text-[9px] font-bold tracking-wider">
                            {tx.transaction_type === 'Income' ? (
                              <><TrendingUp className="text-positive h-3 w-3" /> Income</>
                            ) : (
                              <><TrendingDown className="text-negative h-3 w-3" /> Expense</>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className={`text-right font-mono font-bold text-xs ${tx.transaction_type === 'Income' ? 'text-positive' : 'text-text-primary'}`}>
                          {tx.transaction_type === 'Income' ? '+' : '-'}${tx.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {tx.status === 'Voided' ? (
                            <Badge variant="outline" className="text-text-muted border-border-brand bg-bg-subtle rounded-full px-2 py-0.5 text-[10px]">Voided</Badge>
                          ) : tx.status === 'Receivable' ? (
                            <Badge variant="outline" className="text-accent border-accent/20 bg-accent/5 rounded-full px-2 py-0.5 text-[10px]">Receivable</Badge>
                          ) : (
                            <Badge variant="outline" className="text-positive border-green-500/20 bg-green-500/5 rounded-full px-2 py-0.5 text-[10px]">Settled</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {tx.status !== 'Voided' && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingTransaction(tx)}
                                className="h-7 w-7 p-0 text-text-secondary hover:text-text-primary hover:bg-bg-subtle"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setVoidingTransaction(tx)}
                                className="h-7 w-7 p-0 text-text-secondary hover:text-negative hover:bg-red-500/10"
                              >
                                <Ban className="h-3.5 w-3.5" />
                              </Button>
                            </div>
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
      
      {/* Transaction Modals */}
      <NewTransactionModal open={showNewModal} onClose={() => setShowNewModal(false)} />
      
      <EditTransactionModal
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
      />

      {/* Void Dialog */}
      <Dialog open={!!voidingTransaction} onOpenChange={(o) => !o && setVoidingTransaction(null)}>
        <DialogContent className="bg-surface border border-border-brand text-text-primary rounded-xl">
          <DialogHeader>
            <DialogTitle className="font-heading font-semibold text-lg">Void this transaction?</DialogTitle>
            <DialogDescription className="text-text-secondary text-xs">
              This will mark the transaction as voided. It will remain visible in the ledger for audit purposes but will no longer affect your financial totals.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <DialogClose>
              <Button className="border border-border-brand text-text-secondary hover:bg-bg-subtle rounded-lg text-xs py-1.5 px-3">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={() => voidingTransaction && voidTransaction(voidingTransaction.id)}
              disabled={isVoiding}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-lg text-xs py-1.5 px-3"
            >
              {isVoiding ? 'Voiding...' : 'Void transaction'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}