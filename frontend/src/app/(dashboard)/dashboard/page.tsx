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

const chartData = [
  { name: 'Jan', cash: 4000, receivables: 2400 },
  { name: 'Feb', cash: 3000, receivables: 1398 },
  { name: 'Mar', cash: 2000, receivables: 9800 },
  { name: 'Apr', cash: 2780, receivables: 3908 },
  { name: 'May', cash: 1890, receivables: 4800 },
  { name: 'Jun', cash: 2390, receivables: 3800 },
];

export default function DashboardPage() {
  const { data: financeSummary } = useQuery({
    queryKey: ['financeSummary'],
    queryFn: FinanceService.getSummary
  });

  const { data: programs } = useQuery({
    queryKey: ['programs'],
    queryFn: FinanceService.getPrograms
  });

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: HRService.getEmployees
  });

  // Calculate total animals treated
  const totalAnimals = programs?.reduce((acc, p) => acc + p.total_animals_treated, 0) || 0;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">System Overview</h1>
        <p className="text-slate-400">Real-time financial and operational metrics across all modules.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard 
          title="Cash Available" 
          value={`$${financeSummary?.cash_available.toLocaleString() || '0.00'}`} 
          icon={Banknote} 
          trend={{ value: 12, isPositive: true }}
          description="Liquidity position"
          colorClass="text-emerald-400 bg-emerald-400/10"
        />
        <KPICard 
          title="Receivables" 
          value={`$${financeSummary?.receivables.toLocaleString() || '0.00'}`} 
          icon={TrendingUp} 
          trend={{ value: 5, isPositive: false }}
          description="Awaiting collection"
          colorClass="text-amber-400 bg-amber-400/10"
        />
        <KPICard 
          title="Monthly Burn" 
          value={`$${financeSummary?.monthly_expenses.toLocaleString() || '0.00'}`} 
          icon={Receipt} 
          description="Average overhead"
          colorClass="text-rose-400 bg-rose-400/10"
        />
        <KPICard 
          title="Animals Treated" 
          value={totalAnimals.toLocaleString()} 
          icon={Dog} 
          trend={{ value: 18, isPositive: true }}
          description="Across all programs"
          colorClass="text-blue-400 bg-blue-400/10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Cash vs Receivables</CardTitle>
            <CardDescription>Visualizing liquidity trends (Simulated Data).</CardDescription>
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
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
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
