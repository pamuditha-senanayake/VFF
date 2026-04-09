import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  colorClass?: string;
}

export function KPICard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  className,
  colorClass = "text-blue-400 bg-blue-400/10"
}: KPICardProps) {
  return (
    <Card className={cn("bg-slate-900 border-slate-800", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-xl", colorClass)}>
          <Icon size={20} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <span className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-emerald-400" : "text-rose-400"
              )}>
                {trend.isPositive ? "+" : "-"}{trend.value}%
              </span>
            )}
            {description && (
              <p className="text-xs text-slate-500">
                {description}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
