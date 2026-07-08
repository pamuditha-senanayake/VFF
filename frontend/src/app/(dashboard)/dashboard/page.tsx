'use client';

import { KPICard } from '@/components/shared/kpi-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MoreHorizontal, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { FinanceService } from '@/services/finance.service';
import { InventoryService } from '@/services/inventory.service';
import { useMemo, useState } from 'react';
import { format, subMonths, startOfMonth } from 'date-fns';

const formatLKR = (amount: number) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function DashboardPage() {
  const [range, setRange] = useState<'12m' | '30d' | '7d'>('30d');

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

  const totalAnimals = programs?.reduce((acc, p) => acc + p.total_animals_treated, 0) || 0;

  // Dynamic area chart data
  const chartData = useMemo(() => {
    if (!transactions) return [];
    
    const count = range === '12m' ? 12 : range === '7d' ? 7 : 6;
    
    return Array.from({ length: count }, (_, i) => {
      const date = subMonths(new Date(), (count - 1) - i);
      const start = startOfMonth(date);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.transaction_date);
        return tDate >= start && tDate <= end;
      });

      const revenue = monthTransactions
        .filter(t => t.transaction_type === 'Income')
        .reduce((acc, t) => acc + t.amount, 0);

      return {
        name: format(date, range === '7d' ? 'EEE' : 'MMM'),
        revenue: Math.max(0, revenue),
      };
    });
  }, [transactions, range]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight mb-2 text-text-primary">
          System Overview
        </h1>
        <p className="text-text-secondary text-sm">
          Real-time financial and operational metrics across all modules.
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard 
          title="Cash Available" 
          value={formatLKR(financeSummary?.cash_available || 0)} 
          trend={{ value: 12.4, isPositive: true }}
          description="vs last month"
        />
        <KPICard 
          title="Receivables" 
          value={formatLKR(financeSummary?.receivables || 0)} 
          trend={{ value: 3.1, isPositive: false }}
          description="vs last month"
        />
        <KPICard 
          title="Inventory Value" 
          value={formatLKR(inventorySummary?.total_stock_value || 0)} 
          trend={{ value: 8.7, isPositive: true }}
          description="vs last month"
        />
        <KPICard 
          title="Animals Treated" 
          value={totalAnimals.toLocaleString()} 
          trend={{ value: 15.2, isPositive: true }}
          description="vs last month"
        />
      </div>

      {/* Primary Trend Chart + Side Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Trend Chart */}
        <Card className="lg:col-span-2 bg-surface border border-border-brand rounded-card shadow-card p-5">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-6">
            <div>
              <CardTitle className="text-base font-semibold font-heading text-text-primary">
                Revenue Analytics
              </CardTitle>
              <CardDescription className="text-text-secondary text-xs mt-1">
                Overview of incoming cash flows
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
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF9F27" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#EF9F27" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--color-text-secondary)" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
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
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#EF9F27" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right Side Panel */}
        <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Live Status
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            </div>
            
            <div className="mt-4">
              <div className="text-3xl font-bold font-mono text-text-primary">
                128
              </div>
              <span className="text-xs text-text-secondary">
                Active Staff logged in today
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-border-brand">
            <div className="text-center">
              <div className="text-sm font-semibold font-mono text-text-primary">8</div>
              <span className="text-[10px] text-text-secondary uppercase">Programs</span>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold font-mono text-text-primary">124k</div>
              <span className="text-[10px] text-text-secondary uppercase">Items</span>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold font-mono text-text-primary">99.9%</div>
              <span className="text-[10px] text-text-secondary uppercase">Runway</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Two Column Ranked Lists */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Programs */}
        <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
            <div>
              <CardTitle className="text-base font-semibold font-heading text-text-primary">
                Top Active Programs
              </CardTitle>
            </div>
            <button className="text-text-secondary hover:text-text-primary">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            {programs?.slice(0, 4).map((p, idx) => (
              <div key={p.id} className="relative py-2">
                <div className="flex items-center justify-between text-xs font-semibold relative z-10">
                  <span className="text-text-primary">{p.program_name}</span>
                  <span className="font-mono text-text-primary">{p.total_animals_treated} Treated</span>
                </div>
                <div 
                  className="absolute bottom-0 left-0 h-1.5 bg-amber-500/10 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (p.total_animals_treated / (totalAnimals || 1)) * 100)}%` }}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Actions List */}
        <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
            <div>
              <CardTitle className="text-base font-semibold font-heading text-text-primary">
                Recent Activities
              </CardTitle>
            </div>
            <button className="text-text-secondary hover:text-text-primary">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <div className="flex items-start gap-3 py-1">
              <CheckCircle2 className="w-4 h-4 text-positive shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-text-primary">Medical stock updated</p>
                <span className="text-[10px] text-text-secondary block">10 mins ago by Admin</span>
              </div>
            </div>
            <div className="flex items-start gap-3 py-1">
              <Users className="w-4 h-4 text-[#EF9F27] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-text-primary">New veterinarian registered</p>
                <span className="text-[10px] text-text-secondary block">2 hours ago by HR</span>
              </div>
            </div>
            <div className="flex items-start gap-3 py-1">
              <ShieldAlert className="w-4 h-4 text-negative shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-text-primary">Low stock alert: Penicillin</p>
                <span className="text-[10px] text-text-secondary block">5 hours ago in Pharmacy</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
