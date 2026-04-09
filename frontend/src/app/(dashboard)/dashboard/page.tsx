'use client';

import { KPICard } from '@/components/shared/kpi-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Banknote, 
  TrendingUp, 
  Receipt, 
  Dog, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { FinanceService } from '@/services/finance.service';
import { HRService } from '@/services/hr.service';
import { InventoryService } from '@/services/inventory.service';
import { useMemo } from 'react';
import { format, subMonths, startOfMonth, isWithinInterval } from 'date-fns';

const formatLKR = (amount: number) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
  }).format(amount);
};


export default function DashboardPage() {
  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => FinanceService.getTransactions()
  });

  const { data: financeSummary } = useQuery({
    queryKey: ['financeSummary'],
    queryFn: FinanceService.getSummary
  });

  const { data: programs } = useQuery({
    queryKey: ['programs'],
    queryFn: FinanceService.getPrograms
  });

  const { data: inventorySummary } = useQuery({
    queryKey: ['inventorySummary'],
    queryFn: InventoryService.getSummary
  });

  // Calculate total animals treated
  const totalAnimals = programs?.reduce((acc, p) => acc + p.total_animals_treated, 0) || 0;

  // Generate dynamic chart data for last 6 months
  const chartData = useMemo(() => {
    if (!transactions) return [];

    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i);
      return {
        name: format(date, 'MMM'),
        start: startOfMonth(date),
        end: startOfMonth(date === new Date() ? date : subMonths(date, -1)), // Approximation
        cash: 0,
        receivables: 0
      };
    }).map(month => {
      const monthStart = month.start;
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.transaction_date);
        return tDate >= monthStart && tDate <= monthEnd;
      });

      const cash = monthTransactions
        .filter(t => t.status === 'Cash')
        .reduce((acc, t) => acc + (t.transaction_type === 'Income' ? t.amount : -t.amount), 0);
      
      const receivables = monthTransactions
        .filter(t => t.status === 'Receivable')
        .reduce((acc, t) => acc + t.amount, 0);

      return {
        name: month.name,
        cash: Math.max(0, cash), // Simplified for visualization
        receivables: Math.max(0, receivables)
      };
    });

    return months;
  }, [transactions]);


  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">System Overview</h1>
        <p className="text-slate-400">Real-time financial and operational metrics across all modules.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard 
          title="Cash Available" 
          value={formatLKR(financeSummary?.cash_available || 0)} 
          icon={Banknote} 
          description="Liquidity position"
          colorClass="text-emerald-400 bg-emerald-400/10"
        />
        <KPICard 
          title="Receivables" 
          value={formatLKR(financeSummary?.receivables || 0)} 
          icon={TrendingUp} 
          description="Awaiting collection"
          colorClass="text-amber-400 bg-amber-400/10"
        />
        <KPICard 
          title="Inventory Value" 
          value={formatLKR(inventorySummary?.total_stock_value || 0)} 
          icon={Receipt} 
          description="Total asset value"
          colorClass="text-blue-400 bg-blue-400/10"
        />
        <KPICard 
          title="Animals Treated" 
          value={totalAnimals.toLocaleString()} 
          icon={Dog} 
          description="Across all programs"
          colorClass="text-rose-400 bg-rose-400/10"
        />
      </div>


      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Financial Trends</CardTitle>
            <CardDescription>Visualizing cash flows and receivables over time.</CardDescription>
          </CardHeader>

          <CardContent className="h-[350px] pl-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rs.${value/1000}k`} />

                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="cash" stroke="#10b981" fillOpacity={1} fill="url(#colorCash)" />
                <Area type="monotone" dataKey="receivables" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRec)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Program Performance</CardTitle>
            <CardDescription>Animals treated by active program.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={programs || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} hide />
                <YAxis dataKey="program_name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
                <Bar dataKey="total_animals_treated" name="Animals Treated" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
